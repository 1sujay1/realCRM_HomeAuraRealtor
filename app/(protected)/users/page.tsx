'use client';
import { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash, Upload } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';
import Drawer from '@/components/ui/Drawer';
import DataTable from '@/components/ui/DataTable';

export default function UsersPage() {
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'agent' });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const fetchUsers = () => { setLoading(true); fetch('/api/users').then(res => res.json()).then(d => { setUsers(d); setLoading(false); }); };
  useEffect(() => { 
    fetchUsers(); 
    fetch('/api/auth/me').then(res => res.json()).then(data => setUser(data.user));
  }, []);

  const openDrawer = (user?: any) => {
    setEditingUser(user);
    if(user) setFormData({ name: user.name, email: user.email, password: '', role: user.role });
    else setFormData({ name: '', email: '', password: '', role: 'agent' });
    setIsDrawerOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const method = editingUser ? 'PUT' : 'POST';
    const body = editingUser ? { _id: editingUser._id, name: formData.name, role: formData.role } : formData;
    await fetch('/api/users', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setIsDrawerOpen(false); fetchUsers();
  };

  const handleDelete = async () => {
    setLoading(true); 
    const ids = itemToDelete ? [itemToDelete] : Array.from(selectedIds);
    await fetch(`/api/users?ids=${ids.join(',')}`, { method: 'DELETE' });
    setDeleteConfirmOpen(false); setItemToDelete(null); setSelectedIds(new Set()); fetchUsers();
  };

  const columns = [
    { key: 'name', header: 'Name', className: 'font-medium' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role', render: (r: any) => <span className="bg-slate-100 text-xs px-2 py-1 rounded capitalize">{r.role}</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-slate-800">Users</h1><p className="text-slate-500">Manage access</p></div>
        <div className="flex gap-2">
            {user?.role === 'admin' && (
              <button onClick={() => { setItemToDelete(null); setDeleteConfirmOpen(true); }} disabled={selectedIds.size === 0} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                <Trash size={18} /> Delete ({selectedIds.size})
              </button>
            )}
            <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors font-medium cursor-pointer">
             <Upload size={18} /> <span className="hidden sm:inline">Import</span> <input type="file" accept=".csv" className="hidden" />
            </label>
            <button onClick={() => openDrawer()} className="flex gap-2 items-center bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-indigo-700"><Plus size={18} /> <span className="hidden sm:inline">New User</span></button>
        </div>
      </div>
      
      <DataTable 
        columns={columns} 
        data={users} 
        isLoading={loading}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onRowClick={(row) => openDrawer(row)}
        actionBuilder={(row) => (
            <div className="flex justify-end gap-2">
                <button onClick={(e) => { e.stopPropagation(); openDrawer(row); }} className="p-1.5 hover:bg-blue-50 text-blue-600 rounded"><Pencil size={16} /></button>
                {user?.role === 'admin' && <button onClick={(e) => { e.stopPropagation(); setItemToDelete(row._id); setDeleteConfirmOpen(true); }} className="p-1.5 hover:bg-red-50 text-red-600 rounded"><Trash size={16} /></button>}
            </div>
        )}
      />

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title={editingUser ? 'Edit User' : 'New User'}>
         <form onSubmit={handleSave} className="space-y-4">
             <div className="space-y-1"><label className="text-sm font-medium">Name</label><input className="w-full p-2.5 border rounded-lg" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required /></div>
             {!editingUser && (<><div className="space-y-1"><label className="text-sm font-medium">Email</label><input className="w-full p-2.5 border rounded-lg" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required /></div><div className="space-y-1"><label className="text-sm font-medium">Password</label><input className="w-full p-2.5 border rounded-lg" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required /></div></>)}
             <div className="space-y-1"><label className="text-sm font-medium">Role</label><select className="w-full p-2.5 border rounded-lg" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}><option value="agent">Agent</option><option value="admin">Admin</option></select></div>
             <div className="pt-4"><button disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 flex justify-center">{loading ? <Spinner className="text-white"/> : 'Save User'}</button></div>
         </form>
      </Drawer>
      <Modal isOpen={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)} title="Confirm Deletion" type="danger">
         <p className="text-slate-600 mb-6">Are you sure you want to delete this user?</p>
         <div className="flex justify-end gap-3"><button onClick={() => setDeleteConfirmOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg">Cancel</button><button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 flex items-center gap-2">{loading && <Spinner className="text-white" size={16} />} Delete</button></div>
      </Modal>
    </div>
  );
}