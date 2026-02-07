'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Search, Plus, Pencil, Trash, Eye, Upload, Filter, ChevronDown, Download, FileText } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Drawer from '@/components/ui/Drawer';
import Spinner from '@/components/ui/Spinner';
import DataTable from '@/components/ui/DataTable';
import { cn } from '@/lib/utils';

export default function ExpensesPage() {
  const { data: session } = useSession();
  const permissions = session?.user?.permissions;
  const canViewExpenses = permissions?.canViewExpenses;
  const canCreateExpenses = permissions?.canCreateExpenses;
  const canEditExpenses = permissions?.canEditExpenses;
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState<'filter' | 'view' | 'edit'>('filter');
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const [formData, setFormData] = useState({ description: '', amount: '', category: 'Office', expenseType: 'Rent', status: 'Pending' });

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const fetchExpenses = () => { setLoading(true); fetch('/api/expenses').then(res => res.json()).then(d => { setExpenses(d); setLoading(false); }); };

  useEffect(() => {
    if (canViewExpenses) {
      fetchExpenses();
      return;
    }
    setLoading(false);
  }, [canViewExpenses]);

  const openDrawer = (type: 'filter' | 'view' | 'edit', ex?: any) => {
    setDrawerType(type); setSelectedExpense(ex);
    if (type === 'edit') {
      if (ex) setFormData({ description: ex.description, amount: ex.amount, category: ex.category, expenseType: ex.expenseType, status: ex.status });
      else setFormData({ description: '', amount: '', category: 'Office', expenseType: 'Rent', status: 'Pending' });
    }
    setIsDrawerOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const method = selectedExpense ? 'PUT' : 'POST';
    const body = selectedExpense ? { ...formData, _id: selectedExpense._id } : formData;
    await fetch('/api/expenses', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setIsDrawerOpen(false); fetchExpenses();
  };

  const handleDelete = async () => {
    setLoading(true);
    const ids = itemToDelete ? [itemToDelete] : Array.from(selectedIds);
    await fetch(`/api/expenses?ids=${ids.join(',')}`, { method: 'DELETE' });
    setDeleteConfirmOpen(false); setItemToDelete(null); setSelectedIds(new Set()); fetchExpenses();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) fetchExpenses(); // Mock refresh
  };

  const exportData = (type: 'csv' | 'pdf') => {
    setShowExportMenu(false);
    if (type === 'pdf') {
      // For PDF, we'll use a simple approach - could be enhanced with jsPDF
      const printContent = `
        <html>
          <head>
            <title>Expenses Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #1f2937; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
              th { background-color: #f9fafb; font-weight: bold; }
              .status { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: medium; }
              .completed { background-color: #dcfce7; color: #166534; }
              .pending { background-color: #fef3c7; color: #92400e; }
              .cancelled { background-color: #fee2e2; color: #991b1b; }
            </style>
          </head>
          <body>
            <h1>Expenses Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${filtered.map(ex => `
                  <tr>
                    <td>${ex.description}</td>
                    <td>₹${ex.amount}</td>
                    <td>${ex.category}</td>
                    <td><span class="status ${ex.status.toLowerCase()}">${ex.status}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `;
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
      }
      return;
    }
    // CSV export
    const headers = ['Description,Amount,Category,Status'];
    const rows = filtered.map(ex => `"${ex.description}","₹${ex.amount}","${ex.category}","${ex.status}"`);
    const csvContent = headers.concat(rows).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expenses.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filtered = expenses.filter(ex => {
    const matchSearch = ex.description.toLowerCase().includes(filter.toLowerCase());
    const matchCat = categoryFilter === 'All' || ex.category === categoryFilter;
    const matchStatus = statusFilter === 'All' || ex.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  const getStatusColor = (status: string) => {
    if (status === 'Completed') return 'bg-green-100 text-green-700';
    if (status === 'Pending') return 'bg-amber-100 text-amber-700';
    if (status === 'Cancelled') return 'bg-red-100 text-red-700';
    return 'bg-slate-100 text-slate-700';
  };

  const columns = [
    { key: 'description', header: 'Description', render: (row: any) => <div><p className="font-medium">{row.description}</p><p className="text-xs text-slate-500">{row.category}</p></div> },
    { key: 'amount', header: 'Amount', render: (row: any) => <span className="font-bold text-slate-700">₹{row.amount}</span> },
    { key: 'status', header: 'Status', render: (row: any) => <span className={cn("text-xs px-2 py-1 rounded-full font-medium", getStatusColor(row.status))}>{row.status}</span> },
  ];

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div><h1 className="text-2xl font-bold text-slate-800">Expenses</h1><p className="text-slate-500">Track spending</p></div>
          <div className="flex gap-2 no-print">
            {canEditExpenses && (
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
            {canCreateExpenses && (
              <button onClick={() => openDrawer('edit')} className="flex gap-2 items-center bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-indigo-700"><Plus size={18} /> <span className="hidden sm:inline">New Expense</span></button>
            )}
          </div>
        </div>
        {canViewExpenses ? (
          <>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-4 no-print items-center">
              <div className="flex-1 relative"><Search className="absolute left-3 top-3 text-slate-400" size={20} /><input className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Search expenses..." value={filter} onChange={e => setFilter(e.target.value)} /></div>
              <button onClick={() => openDrawer('filter')} className={cn("flex items-center gap-2 px-4 py-2.5 border rounded-lg hover:bg-slate-50 font-medium text-slate-600", (statusFilter !== 'All' || categoryFilter !== 'All') && "bg-indigo-50 border-indigo-200 text-indigo-700")}><Filter size={18} /> Filters</button>
            </div>

            <DataTable
              columns={columns}
              data={filtered}
              isLoading={loading}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              onRowClick={(row) => openDrawer('view', row)}
              actionBuilder={(row) => (
                <div className="flex justify-end gap-2">
                  <button onClick={(e) => { e.stopPropagation(); openDrawer('view', row); }} className="p-1.5 hover:bg-slate-100 text-slate-500 rounded"><Eye size={16} /></button>
                  {canEditExpenses && (
                    <button onClick={(e) => { e.stopPropagation(); openDrawer('edit', row); }} className="p-1.5 hover:bg-blue-50 text-blue-600 rounded"><Pencil size={16} /></button>
                  )}
                  {canEditExpenses && <button onClick={(e) => { e.stopPropagation(); setItemToDelete(row._id); setDeleteConfirmOpen(true); }} className="p-1.5 hover:bg-red-50 text-red-600 rounded"><Trash size={16} /></button>}
                </div>
              )}
            />
          </>
        ) : (
          <div className="bg-white p-6 rounded-xl border border-slate-200 text-slate-600">
            You do not have permission to view expenses.
          </div>
        )}
      </div>

      <Modal isOpen={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)} title="Confirm Deletion" type="danger">
        <p className="text-slate-600 mb-6">Are you sure you want to delete this expense?</p>
        <div className="flex justify-end gap-3"><button onClick={() => setDeleteConfirmOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg">Cancel</button><button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 flex items-center gap-2">{loading && <Spinner className="text-white" size={16} />} Delete</button></div>
      </Modal>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title={drawerType === 'filter' ? 'Filter Expenses' : drawerType === 'view' ? 'Expense Details' : selectedExpense ? 'Edit Expense' : 'New Expense'}>
        {drawerType === 'filter' && (
          <div className="space-y-6">
            <div className="space-y-2"><label className="text-sm font-medium">Category</label><select className="w-full p-2 border rounded-lg" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}><option value="All">All Categories</option><option value="Office">Office</option><option value="Travel">Travel</option><option value="Food">Food</option></select></div>
            <div className="space-y-2"><label className="text-sm font-medium">Status</label><select className="w-full p-2 border rounded-lg" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}><option value="All">All Statuses</option><option value="Pending">Pending</option><option value="Completed">Completed</option><option value="Cancelled">Cancelled</option></select></div>
            <button onClick={() => { setStatusFilter('All'); setCategoryFilter('All'); }} className="w-full py-2 text-sm text-slate-500 hover:text-slate-700 underline">Reset Filters</button>
          </div>
        )}
        {drawerType === 'view' && selectedExpense && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg"><p className="text-xs font-bold text-slate-400 uppercase">Amount</p><p className="text-3xl font-bold text-slate-800">₹{selectedExpense.amount}</p></div>
            <div className="space-y-1"><p className="text-xs uppercase text-slate-400 font-bold">Category</p><p>{selectedExpense.category}</p></div>
            <div className="space-y-1"><p className="text-xs uppercase text-slate-400 font-bold">Status</p><span className={cn("inline-block px-2 py-1 rounded text-sm font-medium", getStatusColor(selectedExpense.status))}>{selectedExpense.status}</span></div>
            <div className="space-y-1"><p className="text-xs uppercase text-slate-400 font-bold">Description</p><p>{selectedExpense.description}</p></div>
          </div>
        )}
        {drawerType === 'edit' && (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1"><label className="text-sm font-medium">Description</label><input className="w-full p-2.5 border rounded-lg" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required /></div>
            <div className="space-y-1"><label className="text-sm font-medium">Amount</label><input className="w-full p-2.5 border rounded-lg" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} required /></div>
            <div className="space-y-1"><label className="text-sm font-medium">Category</label><select className="w-full p-2.5 border rounded-lg" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}><option value="Office">Office</option><option value="Travel">Travel</option><option value="Food">Food</option></select></div>
            <div className="space-y-1"><label className="text-sm font-medium">Status</label><select className="w-full p-2.5 border rounded-lg" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}><option value="Pending">Pending</option><option value="Completed">Completed</option><option value="Cancelled">Cancelled</option></select></div>
            <div className="pt-4"><button disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 flex justify-center">{loading ? <Spinner className="text-white" /> : 'Save Changes'}</button></div>
          </form>
        )}
      </Drawer>
    </>
  );
}