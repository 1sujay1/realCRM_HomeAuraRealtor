'use client';
import { useState, useEffect } from 'react';
import { Search, Download, Filter, Plus, FileText, Pencil, Trash, Eye, ChevronDown, Upload } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Drawer from '@/components/ui/Drawer';
import Spinner from '@/components/ui/Spinner';
import DataTable from '@/components/ui/DataTable';
import { cn } from '@/lib/utils';

export default function LeadsPage() {
  const [user, setUser] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState<'filter' | 'view' | 'edit'>('filter');
  const [selectedLead, setSelectedLead] = useState<any>(null);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const [formData, setFormData] = useState({ name: '', phone: '', email: '', status: 'New / Fresh Lead', source: 'CRM', notes: '' });

  const fetchLeads = () => {
    setLoading(true);
    fetch('/api/leads').then(res => res.json()).then(data => { setLeads(data); setLoading(false); });
  };

  useEffect(() => {
    fetchLeads();
    fetch('/api/auth/me').then(res => res.json()).then(data => setUser(data.user));
  }, []);

  const openDrawer = (type: 'filter' | 'view' | 'edit', lead?: any) => {
    setDrawerType(type);
    setSelectedLead(lead);
    if (lead) setFormData({ name: lead.name, phone: lead.phone, email: lead.email, status: lead.status, source: lead.source, notes: lead.notes || '' });
    setIsDrawerOpen(true);
  };

  const handleDelete = async () => {
    setLoading(true);
    const ids = itemToDelete ? [itemToDelete] : Array.from(selectedIds);
    await fetch(`/api/leads?ids=${ids.join(',')}`, { method: 'DELETE' });
    setDeleteConfirmOpen(false); setItemToDelete(null); setSelectedIds(new Set()); fetchLeads();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const method = selectedLead ? 'PUT' : 'POST';
    const body = selectedLead ? { ...formData, _id: selectedLead._id } : formData;
    await fetch('/api/leads', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setIsDrawerOpen(false); fetchLeads();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').slice(1);
      for (const line of lines) {
        const [name, phone, email, status, source] = line.split(',').map(s => s.replace(/"/g, '').trim());
        if (name && phone) await fetch('/api/leads', { method: 'POST', body: JSON.stringify({ name, phone, email, status, source }) });
      }
      fetchLeads();
    };
    reader.readAsText(file);
  };

  const exportData = (type: 'csv' | 'pdf') => {
    setShowExportMenu(false);
    if (type === 'pdf') { window.print(); return; }
    const headers = ['Name,Phone,Email,Status,Source'];
    const rows = leads.map(l => `"${l.name}","${l.phone}","${l.email || ''}","${l.status}","${l.source}"`);
    const blob = new Blob([headers.concat(rows).join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'leads.csv'; a.click();
  };

  const getLeadStatusColor = (status: string) => {
    if (status.includes('New')) return 'bg-blue-100 text-blue-800';
    if (status.includes('Warm')) return 'bg-amber-100 text-amber-800';
    if (status.includes('Won')) return 'bg-green-100 text-green-800';
    if (status.includes('Lost')) return 'bg-red-100 text-red-800';
    return 'bg-slate-100 text-slate-800';
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(filter.toLowerCase()) || lead.phone.includes(filter);
    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    const matchesSource = sourceFilter === 'All' || lead.source === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  const columns = [
    { key: 'name', header: 'Name', className: 'font-medium text-slate-900', render: (row: any) => <span className="hover:text-indigo-600 cursor-pointer font-semibold">{row.name}</span> },
    { key: 'contact', header: 'Contact', render: (row: any) => <div><p className="text-sm text-slate-900">{row.phone}</p><p className="text-xs text-slate-500">{row.email}</p></div> },
    { key: 'status', header: 'Status', render: (row: any) => <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", getLeadStatusColor(row.status))}>{row.status}</span> },
    { key: 'source', header: 'Source' }
  ];

  return (
    <>
      <div className="space-y-6 relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div><h1 className="text-2xl font-bold text-slate-800">Leads Management</h1><p className="text-slate-500">Track potential clients</p></div>
          <div className="flex gap-2 no-print">
            {user?.permissions?.canDeleteLeads && (
              <button onClick={() => { setItemToDelete(null); setDeleteConfirmOpen(true); }} disabled={selectedIds.size === 0} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                <Trash size={18} /> Delete ({selectedIds.size})
              </button>
            )}
            <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors font-medium cursor-pointer">
              <Upload size={18} /> <span className="hidden sm:inline">Import</span> <input type="file" accept=".csv" className="hidden" onChange={handleImport} />
            </label>
            <div className="relative">
              <button onClick={() => setShowExportMenu(!showExportMenu)} className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors font-medium"><Download size={18} /> <span className="hidden sm:inline">Export</span> <ChevronDown size={14} /></button>
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-20 py-1">
                  <button onClick={() => exportData('csv')} className="w-full text-left px-4 py-2 hover:bg-slate-50 flex gap-2"><FileText size={16} /> CSV</button>
                  <button onClick={() => exportData('pdf')} className="w-full text-left px-4 py-2 hover:bg-slate-50 flex gap-2"><FileText size={16} /> PDF</button>
                </div>
              )}
            </div>
            <button onClick={() => { setSelectedLead(null); setFormData({ name: '', phone: '', email: '', status: 'New / Fresh Lead', source: 'CRM', notes: '' }); openDrawer('edit'); }} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm"><Plus size={18} /> <span className="hidden sm:inline">New Lead</span></button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-4 no-print items-center">
          <div className="flex-1 relative"><Search className="absolute left-3 top-3 text-slate-400" size={20} /><input className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Search leads..." value={filter} onChange={e => setFilter(e.target.value)} /></div>
          <button onClick={() => openDrawer('filter')} className={cn("flex items-center gap-2 px-4 py-2.5 border rounded-lg hover:bg-slate-50 font-medium text-slate-600", (statusFilter !== 'All' || sourceFilter !== 'All') && "bg-indigo-50 border-indigo-200 text-indigo-700")}><Filter size={18} /> Filters</button>
        </div>

        <DataTable
          columns={columns}
          data={filteredLeads}
          isLoading={loading}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onRowClick={(row) => openDrawer('view', row)}
          actionBuilder={(row) => (
            <div className="flex justify-end gap-2">
              <button onClick={(e) => { e.stopPropagation(); openDrawer('view', row); }} className="p-1.5 hover:bg-slate-100 text-slate-500 rounded"><Eye size={16} /></button>
              <button onClick={(e) => { e.stopPropagation(); openDrawer('edit', row); }} className="p-1.5 hover:bg-blue-50 text-blue-600 rounded"><Pencil size={16} /></button>
              {user?.permissions?.canDeleteLeads && <button onClick={(e) => { e.stopPropagation(); setItemToDelete(row._id); setDeleteConfirmOpen(true); }} className="p-1.5 hover:bg-red-50 text-red-600 rounded"><Trash size={16} /></button>}
            </div>
          )}
        />

      </div>

      <Modal isOpen={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)} title="Confirm Deletion" type="danger">
        <p className="text-slate-600 mb-6">Are you sure you want to delete {itemToDelete ? 'this lead' : `${selectedIds.size} leads`}? This action cannot be undone.</p>
        <div className="flex justify-end gap-3"><button onClick={() => setDeleteConfirmOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg">Cancel</button><button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 flex items-center gap-2">{loading && <Spinner className="text-white" size={16} />} Delete</button></div>
      </Modal>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title={drawerType === 'filter' ? 'Filters' : drawerType === 'view' ? 'Lead Details' : selectedLead ? 'Edit Lead' : 'New Lead'}>
        {drawerType === 'filter' && (
          <div className="space-y-6">
            <div className="space-y-2"><label className="text-sm font-medium">Status</label><select className="w-full p-2 border rounded-lg" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}><option value="All">All Statuses</option><option value="New / Fresh Lead">New Lead</option><option value="Interested / Warm Lead">Warm Lead</option><option value="Closed - Won">Closed Won</option><option value="Closed - Lost">Closed Lost</option></select></div>
            <div className="space-y-2"><label className="text-sm font-medium">Source</label><select className="w-full p-2 border rounded-lg" value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}><option value="All">All Sources</option><option value="CRM">CRM</option><option value="Website">Website</option></select></div>
            <button onClick={() => { setStatusFilter('All'); setSourceFilter('All'); }} className="w-full py-2 text-sm text-slate-500 hover:text-slate-700 underline">Reset Filters</button>
          </div>
        )}
        {drawerType === 'view' && selectedLead && (
          <div className="space-y-6">
            <div className="space-y-1"><p className="text-xs uppercase text-slate-400 font-bold">Name</p><p className="text-lg font-medium">{selectedLead.name}</p></div>
            <div className="space-y-1"><p className="text-xs uppercase text-slate-400 font-bold">Contact</p><p>{selectedLead.phone}</p><p className="text-slate-500">{selectedLead.email}</p></div>
            <div className="space-y-1"><p className="text-xs uppercase text-slate-400 font-bold">Status</p><span className={cn("inline-block px-2 py-1 rounded text-sm", getLeadStatusColor(selectedLead.status))}>{selectedLead.status}</span></div>
            <div className="space-y-1"><p className="text-xs uppercase text-slate-400 font-bold">Notes</p><p className="bg-slate-50 p-3 rounded-lg text-sm">{selectedLead.notes || 'No notes.'}</p></div>
            <div className="pt-6 flex gap-2"><button onClick={() => openDrawer('edit', selectedLead)} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-medium">Edit Lead</button></div>
          </div>
        )}
        {drawerType === 'edit' && (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1"><label className="text-sm font-medium">Full Name</label><input className="w-full p-2.5 border rounded-lg" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required /></div>
            <div className="space-y-1"><label className="text-sm font-medium">Phone</label><input className="w-full p-2.5 border rounded-lg" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} required /></div>
            <div className="space-y-1"><label className="text-sm font-medium">Email</label><input className="w-full p-2.5 border rounded-lg" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} /></div>
            <div className="space-y-1"><label className="text-sm font-medium">Status</label><select className="w-full p-2.5 border rounded-lg" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}><option value="New / Fresh Lead">New / Fresh Lead</option><option value="Interested / Warm Lead">Warm Lead</option><option value="Closed - Won">Closed - Won</option><option value="Closed - Lost">Closed - Lost</option></select></div>
            <div className="space-y-1"><label className="text-sm font-medium">Source</label><select className="w-full p-2.5 border rounded-lg" value={formData.source} onChange={e => setFormData({ ...formData, source: e.target.value })}><option value="CRM">CRM</option><option value="Website">Website</option></select></div>
            <div className="space-y-1"><label className="text-sm font-medium">Notes</label><textarea className="w-full p-2.5 border rounded-lg h-24" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} /></div>
            <div className="pt-4"><button disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 flex justify-center">{loading ? <Spinner className="text-white" /> : 'Save Changes'}</button></div>
          </form>
        )}
      </Drawer>
    </>
  );
}