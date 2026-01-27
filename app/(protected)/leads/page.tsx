'use client';
import { useState, useEffect } from 'react';
import { Search, Download, Filter, Plus, FileText, Pencil, Trash, Eye, ChevronDown, Upload, MoreVertical } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Drawer from '@/components/ui/Drawer';
import Spinner from '@/components/ui/Spinner';
import DataTable from '@/components/ui/DataTable';
import LeadDetailsSidebar from '@/components/leads/LeadDetailsSidebar';
import { cn } from '@/lib/utils';

export default function LeadsPage() {
  const [user, setUser] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState<'filter' | 'edit'>('filter');
  const [selectedLead, setSelectedLead] = useState<any>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarLead, setSidebarLead] = useState<any>(null);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    secondaryPhone: '',
    status: 'New / Fresh Lead',
    source: 'CRM',
    // message: '',
    project: '',
    requirement: {
      budget: '',
      propertyType: '',
      preferredLocation: '',
      readiness: 'Warm Interest'
    },
    notes: '',
    visitDate: ''
  });

  const fetchLeads = () => {
    setLoading(true);
    fetch('/api/leads').then(res => res.json()).then(data => { setLeads(data); setLoading(false); });
  };

  useEffect(() => {
    fetchLeads();
    fetch('/api/auth/me').then(res => res.json()).then(data => setUser(data.user));
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdownId(null);
    };
    if (openDropdownId) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdownId]);

  const openDrawer = (type: 'filter' | 'edit', lead?: any) => {
    setDrawerType(type);
    setSelectedLead(lead);
    if (lead) setFormData({
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      secondaryPhone: lead.secondaryPhone || '',
      status: lead.status,
      source: lead.source,
      // message: lead.message || '',
      project: lead.project || '',
      requirement: lead.requirement || {
        budget: '',
        propertyType: '',
        preferredLocation: '',
        readiness: 'Warm Interest'
      },
      notes: lead.notes || '',
      visitDate: lead.visitDate ? new Date(lead.visitDate).toISOString().split('T')[0] : ''
    });
    setIsDrawerOpen(true);
  };

  const openSidebar = (lead: any) => {
    setSidebarLead(lead);
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setSidebarLead(null);
  };

  const handleScheduleVisit = (lead: any) => {
    // Placeholder for scheduling visit
    alert(`Schedule visit for ${lead.name}`);
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
    if (status.includes('New') || status.includes('Fresh')) return 'bg-blue-100 text-blue-800';
    if (status.includes('Contacted') || status.includes('Attempted')) return 'bg-yellow-100 text-yellow-800';
    if (status.includes('Interested') || status.includes('Warm')) return 'bg-amber-100 text-amber-800';
    if (status.includes('Not Interested')) return 'bg-red-100 text-red-800';
    if (status.includes('No Response')) return 'bg-gray-100 text-gray-800';
    if (status.includes('Follow-Up') || status.includes('Scheduled')) return 'bg-purple-100 text-purple-800';
    if (status.includes('Booking') || status.includes('Progress')) return 'bg-orange-100 text-orange-800';
    if (status.includes('Success') || status.includes('Won')) return 'bg-green-100 text-green-800';
    if (status.includes('Lost')) return 'bg-red-100 text-red-800';
    if (status.includes('Other')) return 'bg-slate-100 text-slate-800';
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
    { key: 'source', header: 'Source' },
    { key: 'project', header: 'Project', render: (row: any) => <span className="text-sm text-slate-600">{row.project || '-'}</span> }
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
            <button onClick={() => { setSelectedLead(null); setFormData({ name: '', phone: '', email: '', secondaryPhone: '', status: 'New / Fresh Lead', source: 'CRM', project: '', requirement: { budget: '', propertyType: '', preferredLocation: '', readiness: 'Warm Interest' }, notes: '', visitDate: '' }); openDrawer('edit'); }} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm"><Plus size={18} /> <span className="hidden sm:inline">New Lead</span></button>
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
          onRowClick={(row) => openSidebar(row)}
          actionBuilder={(row) => (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdownId(openDropdownId === row._id ? null : row._id);
                }}
                className="p-2 hover:bg-slate-100 text-slate-600 rounded-md border border-transparent hover:border-slate-200 transition-colors"
              >
                <MoreVertical size={16} />
              </button>
              {openDropdownId === row._id && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-2xl border border-slate-200 z-[100] py-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdownId(null);
                      openSidebar(row);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-3 text-slate-700"
                  >
                    <Eye size={16} />
                    View Details
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdownId(null);
                      openDrawer('edit', row);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-3 text-slate-700"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>
                  {user?.permissions?.canDeleteLeads && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdownId(null);
                        setItemToDelete(row._id);
                        setDeleteConfirmOpen(true);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center gap-3 text-red-600"
                    >
                      <Trash size={16} />
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        />

      </div>

      <Modal isOpen={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)} title="Confirm Deletion" type="danger">
        <p className="text-slate-600 mb-6">Are you sure you want to delete {itemToDelete ? 'this lead' : `${selectedIds.size} leads`}? This action cannot be undone.</p>
        <div className="flex justify-end gap-3"><button onClick={() => setDeleteConfirmOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg">Cancel</button><button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 flex items-center gap-2">{loading && <Spinner className="text-white" size={16} />} Delete</button></div>
      </Modal>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title={drawerType === 'filter' ? 'Filters' : selectedLead ? 'Edit Lead' : 'New Lead'}>
        {drawerType === 'filter' && (
          <div className="space-y-6">
            <div className="space-y-2"><label className="text-sm font-medium">Status</label><select className="w-full p-2 border rounded-lg" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}><option value="All">All Statuses</option><option value="New / Fresh Lead">New / Fresh Lead</option><option value="Contacted / Attempted to Contact">Contacted / Attempted to Contact</option><option value="Interested / Warm Lead">Interested / Warm Lead</option><option value="Not Interested">Not Interested</option><option value="No Response">No Response</option><option value="Follow-Up Scheduled">Follow-Up Scheduled</option><option value="Site Visit Scheduled">Site Visit Scheduled</option><option value="Booking in Progress">Booking in Progress</option><option value="Deal Success">Deal Success</option><option value="Deal Lost">Deal Lost</option><option value="Other">Other</option></select></div>
            <div className="space-y-2"><label className="text-sm font-medium">Source</label><select className="w-full p-2 border rounded-lg" value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}><option value="All">All Sources</option><option value="CRM">CRM</option><option value="FACEBOOK">Facebook</option><option value="INSTAGRAM">Instagram</option><option value="WHATSAPP">WhatsApp</option><option value="OTHER">Other</option></select></div>
            <button onClick={() => { setStatusFilter('All'); setSourceFilter('All'); }} className="w-full py-2 text-sm text-slate-500 hover:text-slate-700 underline">Reset Filters</button>
          </div>
        )}
        {drawerType === 'edit' && (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1"><label className="text-sm font-medium">Full Name</label><input className="w-full p-2.5 border rounded-lg" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required /></div>
            <div className="space-y-1"><label className="text-sm font-medium">Phone</label><input className="w-full p-2.5 border rounded-lg" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} required /></div>
            <div className="space-y-1"><label className="text-sm font-medium">Secondary Phone</label><input className="w-full p-2.5 border rounded-lg" value={formData.secondaryPhone} onChange={e => setFormData({ ...formData, secondaryPhone: e.target.value })} /></div>
            <div className="space-y-1"><label className="text-sm font-medium">Email</label><input type="email" className="w-full p-2.5 border rounded-lg" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} /></div>
            <div className="space-y-1"><label className="text-sm font-medium">Status</label><select className="w-full p-2.5 border rounded-lg" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}><option value="New / Fresh Lead">New / Fresh Lead</option><option value="Contacted / Attempted to Contact">Contacted / Attempted to Contact</option><option value="Interested / Warm Lead">Interested / Warm Lead</option><option value="Not Interested">Not Interested</option><option value="No Response">No Response</option><option value="Follow-Up Scheduled">Follow-Up Scheduled</option><option value="Site Visit Scheduled">Site Visit Scheduled</option><option value="Booking in Progress">Booking in Progress</option><option value="Deal Success">Deal Success</option><option value="Deal Lost">Deal Lost</option><option value="Other">Other</option></select></div>
            <div className="space-y-1"><label className="text-sm font-medium">Source</label><select className="w-full p-2.5 border rounded-lg" value={formData.source} onChange={e => setFormData({ ...formData, source: e.target.value })}><option value="CRM">CRM</option><option value="FACEBOOK">Facebook</option><option value="INSTAGRAM">Instagram</option><option value="WHATSAPP">WhatsApp</option><option value="OTHER">Other</option></select></div>
            {/* <div className="space-y-1"><label className="text-sm font-medium">Message</label><textarea className="w-full p-2.5 border rounded-lg h-20" value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} /></div> */}
            <div className="space-y-1"><label className="text-sm font-medium">Project</label><input className="w-full p-2.5 border rounded-lg" value={formData.project} onChange={e => setFormData({ ...formData, project: e.target.value })} /></div>
            <div className="space-y-1"><label className="text-sm font-medium">Budget</label><input className="w-full p-2.5 border rounded-lg" value={formData.requirement.budget} onChange={e => setFormData({ ...formData, requirement: { ...formData.requirement, budget: e.target.value } })} /></div>
            <div className="space-y-1"><label className="text-sm font-medium">Property Type</label><select className="w-full p-2.5 border rounded-lg" value={formData.requirement.propertyType} onChange={e => setFormData({ ...formData, requirement: { ...formData.requirement, propertyType: e.target.value } })}><option value="">Select Property Type</option><option value="1BHK">1BHK</option><option value="2BHK">2BHK</option><option value="3BHK">3BHK</option><option value="4BHK">4BHK</option><option value="Villa">Villa</option><option value="Plot">Plot</option><option value="Commercial">Commercial</option></select></div>
            <div className="space-y-1"><label className="text-sm font-medium">Preferred Location</label><input className="w-full p-2.5 border rounded-lg" value={formData.requirement.preferredLocation} onChange={e => setFormData({ ...formData, requirement: { ...formData.requirement, preferredLocation: e.target.value } })} /></div>
            <div className="space-y-1"><label className="text-sm font-medium">Readiness</label><select className="w-full p-2.5 border rounded-lg" value={formData.requirement.readiness} onChange={e => setFormData({ ...formData, requirement: { ...formData.requirement, readiness: e.target.value } })}><option value="Hot Interest">Hot Interest</option><option value="Warm Interest">Warm Interest</option><option value="Cold Interest">Cold Interest</option></select></div>
            <div className="space-y-1"><label className="text-sm font-medium">Visit Date</label><input type="date" className="w-full p-2.5 border rounded-lg" value={formData.visitDate} onChange={e => setFormData({ ...formData, visitDate: e.target.value })} /></div>
            <div className="space-y-1"><label className="text-sm font-medium">Notes</label><textarea className="w-full p-2.5 border rounded-lg h-24" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} /></div>
            <div className="pt-4"><button disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 flex justify-center">{loading ? <Spinner className="text-white" /> : 'Save Changes'}</button></div>
          </form>
        )}
      </Drawer>

      {isSidebarOpen && (
        <LeadDetailsSidebar
          lead={sidebarLead}
          onClose={closeSidebar}
          onScheduleVisit={handleScheduleVisit}
        />
      )}
    </>
  );
}