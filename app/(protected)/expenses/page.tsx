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
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Office',
    expenseType: 'Rent',
    paymentMode: 'Other',
    paymentMadeBy: 'Other',
    notes: '',
    status: 'Pending',
    date: ''
  });

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [expenseTypeFilter, setExpenseTypeFilter] = useState('All');
  const [paymentModeFilter, setPaymentModeFilter] = useState('All');
  const [paymentMadeByFilter, setPaymentMadeByFilter] = useState('All');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [appliedFilters, setAppliedFilters] = useState({
    category: '',
    status: 'All',
    expenseType: 'All',
    paymentMode: 'All',
    paymentMadeBy: 'All',
    fromDate: '',
    toDate: '',
  });
  const [showExportMenu, setShowExportMenu] = useState(false);

  const fetchExpenses = () => {
    setLoading(true);
    fetch('/api/expenses')
      .then(res => res.json())
      .then(d => {
        setExpenses(Array.isArray(d) ? d : []);
        setLoading(false);
      });
  };

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
      if (ex) setFormData({
        description: ex.description,
        amount: ex.amount,
        category: ex.category,
        expenseType: ex.expenseType,
        paymentMode: ex.paymentMode || 'Other',
        paymentMadeBy: ex.paymentMadeBy || 'Other',
        notes: ex.notes || '',
        status: ex.status,
        date: ex.date ? new Date(ex.date).toISOString().split('T')[0] : ''
      });
      else setFormData({ description: '', amount: '', category: 'Office', expenseType: 'Rent', paymentMode: 'Other', paymentMadeBy: 'Other', notes: '', status: 'Pending', date: '' });
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
                  <th>Category</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Payment Mode</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${filtered.map(ex => `
                  <tr>
                    <td>${ex.category || '-'}</td>
                    <td>${ex.description || '-'}</td>
                    <td>₹${ex.amount || 0}</td>
                    <td>${ex.date ? new Date(ex.date).toLocaleDateString() : '-'}</td>
                    <td>${ex.paymentMode || '-'}</td>
                    <td><span class="status ${String(ex.status || 'Pending').toLowerCase()}">${ex.status || 'Pending'}</span></td>
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
    const headers = ['Category,Description,Amount,Date,Payment Mode,Status'];
    const rows = filtered.map(ex => `"${ex.category || ''}","${ex.description || ''}","₹${ex.amount || 0}","${ex.date ? new Date(ex.date).toLocaleDateString() : ''}","${ex.paymentMode || ''}","${ex.status || 'Pending'}"`);
    const csvContent = headers.concat(rows).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expenses.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filtered = (Array.isArray(expenses) ? expenses : []).filter(ex => {
    const description = ex.description?.toLowerCase() || '';
    const matchSearch = description.includes(filter.toLowerCase());
    const categorySearch = appliedFilters.category.toLowerCase();
    const matchCat = !categorySearch || (ex.category || '').toLowerCase().includes(categorySearch);
    const matchStatus = appliedFilters.status === 'All' || ex.status === appliedFilters.status;
    const matchExpenseType = appliedFilters.expenseType === 'All' || ex.expenseType === appliedFilters.expenseType;
    const matchPaymentMode = appliedFilters.paymentMode === 'All' || ex.paymentMode === appliedFilters.paymentMode;
    const matchPaymentMadeBy = appliedFilters.paymentMadeBy === 'All' || ex.paymentMadeBy === appliedFilters.paymentMadeBy;

    if (!appliedFilters.fromDate || !appliedFilters.toDate) {
      return matchSearch && matchCat && matchStatus && matchExpenseType && matchPaymentMode && matchPaymentMadeBy;
    }

    const start = new Date(appliedFilters.fromDate);
    const end = new Date(appliedFilters.toDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    const expenseDate = ex.date ? new Date(ex.date) : null;
    const matchDate = expenseDate ? expenseDate >= start && expenseDate <= end : false;

    return matchSearch && matchCat && matchStatus && matchExpenseType && matchPaymentMode && matchPaymentMadeBy && matchDate;
  });

  const getStatusColor = (status: string) => {
    if (status === 'Completed') return 'bg-green-100 text-green-700';
    if (status === 'Pending') return 'bg-amber-100 text-amber-700';
    if (status === 'Cancelled') return 'bg-red-100 text-red-700';
    return 'bg-slate-100 text-slate-700';
  };

  const columns = [
    { key: 'category', header: 'Category', render: (row: any) => <span className="text-sm text-slate-700">{row.category || '-'}</span> },
    { key: 'description', header: 'Description', render: (row: any) => <span className="font-medium">{row.description || '-'}</span> },
    { key: 'amount', header: 'Amount', render: (row: any) => <span className="font-bold text-slate-700">₹{row.amount || 0}</span> },
    { key: 'date', header: 'Date', render: (row: any) => <span className="text-sm text-slate-600">{row.date ? new Date(row.date).toLocaleDateString() : '-'}</span> },
    { key: 'paymentMode', header: 'Payment Mode', render: (row: any) => <span className="text-sm text-slate-600">{row.paymentMode || '-'}</span> },
    { key: 'status', header: 'Status', render: (row: any) => <span className={cn("text-xs px-2 py-1 rounded-full font-medium", getStatusColor(row.status))}>{row.status || 'Pending'}</span> },
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
            <div className="space-y-2"><label className="text-sm font-medium">Category</label><input className="w-full p-2 border rounded-lg" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} placeholder="Search category" /></div>
            <div className="space-y-2"><label className="text-sm font-medium">Status</label><select className="w-full p-2 border rounded-lg" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}><option value="All">All Statuses</option><option value="Pending">Pending</option><option value="Completed">Completed</option><option value="Cancelled">Cancelled</option></select></div>
            <div className="space-y-2"><label className="text-sm font-medium">Expense Type</label><select className="w-full p-2 border rounded-lg" value={expenseTypeFilter} onChange={e => setExpenseTypeFilter(e.target.value)}><option value="All">All Types</option><option value="Rent">Rent</option><option value="Travel">Travel</option><option value="Food">Food</option><option value="Salary">Salary</option><option value="Ads">Ads</option><option value="Other">Other</option></select></div>
            <div className="space-y-2"><label className="text-sm font-medium">Payment Mode</label><select className="w-full p-2 border rounded-lg" value={paymentModeFilter} onChange={e => setPaymentModeFilter(e.target.value)}><option value="All">All Modes</option><option value="Bank">Bank</option><option value="Cash">Cash</option><option value="Credit Card">Credit Card</option><option value="Debit Card">Debit Card</option><option value="UPI">UPI</option><option value="Other">Other</option></select></div>
            <div className="space-y-2"><label className="text-sm font-medium">Payment Made By</label><select className="w-full p-2 border rounded-lg" value={paymentMadeByFilter} onChange={e => setPaymentMadeByFilter(e.target.value)}><option value="All">All</option><option value="Mangal">Mangal</option><option value="Raja Pandian">Raja Pandian</option><option value="Ajit">Ajit</option><option value="Other">Other</option></select></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><label className="text-sm font-medium">From Date</label><input type="date" className="w-full p-2 border rounded-lg" value={fromDate} onChange={e => setFromDate(e.target.value)} required /></div>
              <div className="space-y-2"><label className="text-sm font-medium">To Date</label><input type="date" className="w-full p-2 border rounded-lg" value={toDate} onChange={e => setToDate(e.target.value)} required /></div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setAppliedFilters({
                    category: categoryFilter,
                    status: statusFilter,
                    expenseType: expenseTypeFilter,
                    paymentMode: paymentModeFilter,
                    paymentMadeBy: paymentMadeByFilter,
                    fromDate,
                    toDate,
                  });
                  setIsDrawerOpen(false);
                }}
                className="flex-1 py-2 text-sm bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
              >
                Apply Filters
              </button>
              <button
                onClick={() => {
                  setStatusFilter('All');
                  setCategoryFilter('');
                  setExpenseTypeFilter('All');
                  setPaymentModeFilter('All');
                  setPaymentMadeByFilter('All');
                  setFromDate('');
                  setToDate('');
                  setAppliedFilters({
                    category: '',
                    status: 'All',
                    expenseType: 'All',
                    paymentMode: 'All',
                    paymentMadeBy: 'All',
                    fromDate: '',
                    toDate: '',
                  });
                }}
                className="flex-1 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                Reset
              </button>
            </div>
          </div>
        )}
        {drawerType === 'view' && selectedExpense && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg"><p className="text-xs font-bold text-slate-400 uppercase">Amount</p><p className="text-3xl font-bold text-slate-800">₹{selectedExpense.amount || 0}</p></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><p className="text-xs uppercase text-slate-400 font-bold">Category</p><p>{selectedExpense.category || '-'}</p></div>
              <div className="space-y-1"><p className="text-xs uppercase text-slate-400 font-bold">Expense Type</p><p>{selectedExpense.expenseType || '-'}</p></div>
              <div className="space-y-1"><p className="text-xs uppercase text-slate-400 font-bold">Payment Mode</p><p>{selectedExpense.paymentMode || '-'}</p></div>
              <div className="space-y-1"><p className="text-xs uppercase text-slate-400 font-bold">Payment Made By</p><p>{selectedExpense.paymentMadeBy || '-'}</p></div>
              <div className="space-y-1"><p className="text-xs uppercase text-slate-400 font-bold">Date</p><p>{selectedExpense.date ? new Date(selectedExpense.date).toLocaleDateString() : '-'}</p></div>
              <div className="space-y-1"><p className="text-xs uppercase text-slate-400 font-bold">Status</p><span className={cn("inline-block px-2 py-1 rounded text-sm font-medium", getStatusColor(selectedExpense.status))}>{selectedExpense.status || 'Pending'}</span></div>
            </div>
            <div className="space-y-1"><p className="text-xs uppercase text-slate-400 font-bold">Description</p><p>{selectedExpense.description || '-'}</p></div>
            <div className="space-y-1"><p className="text-xs uppercase text-slate-400 font-bold">Notes</p><p>{selectedExpense.notes || '-'}</p></div>
          </div>
        )}
        {drawerType === 'edit' && (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1"><label className="text-sm font-medium">Description</label><input className="w-full p-2.5 border rounded-lg" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required /></div>
            <div className="space-y-1"><label className="text-sm font-medium">Amount</label><input className="w-full p-2.5 border rounded-lg" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} required /></div>
            <div className="space-y-1"><label className="text-sm font-medium">Category</label><select className="w-full p-2.5 border rounded-lg" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}><option value="Office">Office</option><option value="Travel">Travel</option><option value="Food">Food</option></select></div>
            <div className="space-y-1"><label className="text-sm font-medium">Expense Type</label><select className="w-full p-2.5 border rounded-lg" value={formData.expenseType} onChange={e => setFormData({ ...formData, expenseType: e.target.value })}><option value="Rent">Rent</option><option value="Travel">Travel</option><option value="Food">Food</option><option value="Salary">Salary</option><option value="Ads">Ads</option><option value="Other">Other</option></select></div>
            <div className="space-y-1"><label className="text-sm font-medium">Payment Mode</label><select className="w-full p-2.5 border rounded-lg" value={formData.paymentMode} onChange={e => setFormData({ ...formData, paymentMode: e.target.value })}><option value="Bank">Bank</option><option value="Cash">Cash</option><option value="Credit Card">Credit Card</option><option value="Debit Card">Debit Card</option><option value="UPI">UPI</option><option value="Other">Other</option></select></div>
            <div className="space-y-1"><label className="text-sm font-medium">Payment Made By</label><select className="w-full p-2.5 border rounded-lg" value={formData.paymentMadeBy} onChange={e => setFormData({ ...formData, paymentMadeBy: e.target.value })}><option value="Mangal">Mangal</option><option value="Raja Pandian">Raja Pandian</option><option value="Ajit">Ajit</option><option value="Other">Other</option></select></div>
            <div className="space-y-1"><label className="text-sm font-medium">Status</label><select className="w-full p-2.5 border rounded-lg" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}><option value="Pending">Pending</option><option value="Completed">Completed</option><option value="Cancelled">Cancelled</option></select></div>
            <div className="space-y-1"><label className="text-sm font-medium">Date</label><input type="date" className="w-full p-2.5 border rounded-lg" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required /></div>
            <div className="space-y-1"><label className="text-sm font-medium">Notes</label><textarea className="w-full p-2.5 border rounded-lg" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} rows={3} /></div>
            <div className="pt-4"><button disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 flex justify-center">{loading ? <Spinner className="text-white" /> : 'Save Changes'}</button></div>
          </form>
        )}
      </Drawer>
    </>
  );
}