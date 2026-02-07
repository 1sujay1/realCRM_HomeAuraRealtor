'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Search, Download, Filter, Plus, FileText, Pencil, Trash, Eye, ChevronDown, Upload, Calendar, MapPin, Clock, MoreVertical, X, Edit2, MessageCircle, Phone } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Drawer from '@/components/ui/Drawer';
import Spinner from '@/components/ui/Spinner';
import DataTable from '@/components/ui/DataTable';
import Card from '@/components/ui/Card';
import ScheduleVisitModal from './ScheduleVisitModal';
import EditVisitModal from './EditVisitModal';
import { cn } from '@/lib/utils';

export default function SiteVisitsPage() {
  const { data: session } = useSession();
  const [siteVisits, setSiteVisits] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState<'filter' | 'edit'>('filter');
  const [selectedVisit, setSelectedVisit] = useState<any>(null);

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [preselectedLead, setPreselectedLead] = useState<any>(null);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState('All');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [visitFilter, setVisitFilter] = useState('today');


  const [formData, setFormData] = useState({
    lead: '',
    date: '',
    time: '',
    location: '',
    notes: '',
    Agent: '',
    status: 'Scheduled'
  });

  const fetchSiteVisits = () => {
    setLoading(true);
    fetch('/api/site-visits').then(res => res.json()).then(data => {
      setSiteVisits(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  };

  const fetchLeads = () => {
    fetch('/api/leads').then(res => res.json()).then(data => setLeads(Array.isArray(data) ? data : []));
  };

  useEffect(() => {
    fetchSiteVisits();
    fetchLeads();
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

  const openScheduleModal = (lead?: any) => {
    setPreselectedLead(lead);
    setIsScheduleModalOpen(true);
  };

  const openDrawer = (type: 'filter' | 'edit', visit: any = null) => {
    setDrawerType(type);
    if (visit) setSelectedVisit(visit);
    setIsDrawerOpen(true);
  };

  const openEditModal = (visit: any) => {
    setSelectedVisit(visit);
    setIsEditModalOpen(true);
  };

  const closeScheduleModal = () => {
    setIsScheduleModalOpen(false);
    setPreselectedLead(null);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedVisit(null);
  };

  const handleDelete = async () => {
    setLoading(true);
    const ids = itemToDelete ? [itemToDelete] : Array.from(selectedIds);
    await fetch(`/api/site-visits?ids=${ids.join(',')}`, { method: 'DELETE' });
    setDeleteConfirmOpen(false); setItemToDelete(null); setSelectedIds(new Set()); fetchSiteVisits();
  };

  const handleScheduleVisit = async (data: any) => {
    setLoading(true);
    await fetch('/api/site-visits', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    fetchSiteVisits();
  };

  const handleUpdateVisit = async (data: any) => {
    setLoading(true);
    const { _id, ...updateData } = data;
    await fetch('/api/site-visits', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _id, ...updateData }) });
    fetchSiteVisits();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const method = selectedVisit ? 'PUT' : 'POST';
    const body = selectedVisit ? { ...formData, _id: selectedVisit._id } : formData;
    await fetch('/api/site-visits', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setIsDrawerOpen(false); fetchSiteVisits();
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
        const [leadName, date, time, location] = line.split(',').map(s => s.replace(/"/g, '').trim());
        if (leadName && date) {
          const lead = leads.find(l => l.name === leadName);
          if (lead) await fetch('/api/site-visits', { method: 'POST', body: JSON.stringify({ lead: lead._id, date, time, location }) });
        }
      }
      fetchSiteVisits();
    };
    reader.readAsText(file);
  };

  const exportData = (type: 'csv' | 'pdf') => {
    setShowExportMenu(false);
    if (type === 'pdf') { window.print(); return; }
    const headers = ['Lead Name,Date,Time,Location,Status,Agent,Notes'];
    const rows = siteVisits.map(v => `"${v.lead?.name || ''}","${new Date(v.date).toLocaleDateString()}","${v.time}","${v.location}","${v.status}","${v.Agent || ''}","${v.notes || ''}"`);
    const blob = new Blob([headers.concat(rows).join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'site-visits.csv'; a.click();
  };

  const getStatusColor = (status: string) => {
    if (status === 'Scheduled') return 'bg-blue-100 text-blue-800';
    if (status === 'DONE') return 'bg-green-100 text-green-800';
    if (status === 'Cancelled') return 'bg-red-100 text-red-800';
    return 'bg-slate-100 text-slate-800';
  };

  // const filteredVisits = siteVisits.filter(visit => {
  //   const matchesSearch = visit.lead?.name.toLowerCase().includes(filter.toLowerCase()) ||
  //                        visit.location.toLowerCase().includes(filter.toLowerCase());
  //   const matchesStatus = statusFilter === 'All' || visit.status === statusFilter;
  //   return matchesSearch && matchesStatus;
  // });
  const filteredVisits = (Array.isArray(siteVisits) ? siteVisits : []).filter(visit => {
    const matchesSearch = visit.lead?.name?.toLowerCase().includes(filter.toLowerCase()) ||
      (visit.location?.toLowerCase().includes(filter.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || visit.status === statusFilter;

    // If "All Time" is selected, skip time filtering
    if (visitFilter === 'all') {
      return matchesSearch && matchesStatus;
    }

    // Time-based filtering for other options
    const today = new Date();
    const visitDate = visit.date ? new Date(visit.date) : new Date('');
    let matchesTimeFilter = true;

    if (visitFilter === 'today') {
      matchesTimeFilter = visitDate.toDateString() === today.toDateString();
    } else if (visitFilter === 'week') {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
      matchesTimeFilter = visitDate >= startOfWeek && visitDate <= endOfWeek;
    } else if (visitFilter === 'month') {
      matchesTimeFilter =
        visitDate.getMonth() === today.getMonth() &&
        visitDate.getFullYear() === today.getFullYear();
    }

    return matchesSearch && matchesStatus && matchesTimeFilter;
  });
  const columns = [
    { key: 'lead', header: 'Lead', className: 'font-medium text-slate-900', render: (row: any) => <span className="font-semibold">{row.lead?.name || 'Unknown'}</span> },
    { key: 'date', header: 'Date', render: (row: any) => <span className="text-sm text-slate-600">{new Date(row.date).toLocaleDateString()}</span> },
    { key: 'time', header: 'Time', render: (row: any) => <span className="text-sm text-slate-600">{row.time}</span> },
    { key: 'location', header: 'Location', render: (row: any) => <span className="text-sm text-slate-600">{row.location}</span> },
    { key: 'status', header: 'Status', render: (row: any) => <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", getStatusColor(row.status))}>{row.status}</span> },
    { key: 'agent', header: 'Agent', render: (row: any) => <span className="text-sm text-slate-600">{row.Agent || '-'}</span> }
  ];

  return (
    <>
      <div className="space-y-6 relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div><h1 className="text-2xl font-bold text-slate-800">Site Visits</h1><p className="text-slate-500">Manage scheduled property visits</p></div>
          <div className="flex gap-2 no-print">
            {session?.user?.permissions?.canDeleteSiteVisits && (
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
            <button onClick={() => openScheduleModal()} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-sm"><Plus size={18} /> <span className="hidden sm:inline">Schedule Visit</span></button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4 no-print">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-slate-400" size={20} />
              <input
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Search visits..."
                value={filter}
                onChange={e => setFilter(e.target.value)}
              />
            </div>
            <button
              onClick={() => openDrawer('filter')}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 border rounded-lg hover:bg-slate-50 font-medium text-slate-600",
                (statusFilter !== 'All') && "bg-purple-50 border-purple-200 text-purple-700"
              )}
            >
              <Filter size={18} /> Filters
            </button>
          </div>

          {/* Add this time filters section */}
          <div className="bg-white p-1 rounded-xl inline-flex border border-slate-200 shadow-sm">
            {["all", "today", "week", "month"].map((filter) => (
              <button
                key={filter}
                onClick={() => setVisitFilter(filter)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${visitFilter === filter
                  ? "bg-purple-100 text-purple-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
                  }`}
              >
                {filter === "today"
                  ? "Today"
                  : filter === "week"
                    ? "This Week"
                    : filter === "month"
                      ? "This Month"
                      : "All Time"}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          // Show loading spinner
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : filteredVisits.length === 0 ? (
          // Show empty state when no visits
          <div className="text-center py-12">
            <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500">No site visits found</p>
            <button
              onClick={() => openScheduleModal()}
              className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Schedule Your First Visit
            </button>
          </div>
        ) : (
          // Show the list of visits
          filteredVisits.map((visit) => (
            <Card key={visit._id} className="p-4 border-l-4 border-l-purple-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center bg-purple-50 px-3 py-2 rounded-lg border border-purple-100">
                    <span className="text-xs text-purple-600 font-bold uppercase">
                      {new Date(visit.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="text-lg font-bold text-slate-800">
                      {visit.time.split(':')[0]}
                    </span>
                    <span className="text-xs text-slate-500">
                      {visit.time.split(':')[1]} {parseInt(visit.time.split(':')[0]) >= 12 ? 'PM' : 'AM'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">
                      {visit.lead?.name || 'Unknown Lead'}
                    </h4>
                    <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                      <MapPin size={14} /> {visit.location}
                    </div>
                    {visit.Agent && (
                      <div className="text-xs text-slate-400 mt-1">
                        Agent: {visit.Agent}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(visit);
                      }}
                      className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit Visit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${visit.status === 'DONE'
                        ? 'bg-green-100 text-green-700'
                        : visit.status === 'Scheduled'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-red-100 text-red-700'
                        }`}
                    >
                      {visit.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="p-1.5 text-slate-400 hover:bg-slate-100 rounded hover:text-green-600"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MessageCircle size={18} />
                    </button>
                    <button
                      className="p-1.5 text-slate-400 hover:bg-slate-100 rounded hover:text-indigo-600"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Phone size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}

        {/* <div className="space-y-3"> */}
        {/* {filteredVisits.map((visit) => (
            <Card key={visit._id} className="p-4 border-l-4 border-l-purple-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center bg-purple-50 px-3 py-2 rounded-lg border border-purple-100">
                    <span className="text-xs text-purple-600 font-bold uppercase">
                      {new Date(visit.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="text-lg font-bold text-slate-800">
                      {visit.time.split(':')[0]}
                    </span>
                    <span className="text-xs text-slate-500">
                      {visit.time.split(':')[1]} {parseInt(visit.time.split(':')[0]) >= 12 ? 'PM' : 'AM'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">
                      {visit.lead?.name || 'Unknown Lead'}
                    </h4>
                    <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                      <MapPin size={14} /> {visit.location}
                    </div>
                    {visit.Agent && (
                      <div className="text-xs text-slate-400 mt-1">
                        Agent: {visit.Agent}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(visit);
                      }}
                      className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit Visit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        visit.status === 'DONE' 
                          ? 'bg-green-100 text-green-700' 
                          : visit.status === 'Scheduled' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {visit.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      className="p-1.5 text-slate-400 hover:bg-slate-100 rounded hover:text-green-600"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MessageCircle size={18} />
                    </button>
                    <button 
                      className="p-1.5 text-slate-400 hover:bg-slate-100 rounded hover:text-indigo-600"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Phone size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          {filteredVisits.length === 0 && (
            <div className="text-center py-12">
              <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500">No site visits scheduled</p>
              <button
                onClick={() => openScheduleModal()}
                className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Schedule Your First Visit
              </button>
            </div>
          )} */}
        {/* </div> */}

      </div>

      <Modal isOpen={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)} title="Confirm Deletion" type="danger">
        <p className="text-slate-600 mb-6">Are you sure you want to delete {itemToDelete ? 'this visit' : `${selectedIds.size} visits`}? This action cannot be undone.</p>
        <div className="flex justify-end gap-3"><button onClick={() => setDeleteConfirmOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg">Cancel</button><button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 flex items-center gap-2">{loading && <Spinner className="text-white" size={16} />} Delete</button></div>
      </Modal>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title={drawerType === 'filter' ? 'Filters' : selectedVisit ? 'Edit Site Visit' : 'Schedule Site Visit'}>
        {drawerType === 'filter' && (
          <div className="space-y-6">
            <div className="space-y-2"><label className="text-sm font-medium">Status</label><select className="w-full p-2 border rounded-lg" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}><option value="All">All Statuses</option><option value="Scheduled">Scheduled</option><option value="DONE">Done</option><option value="Cancelled">Cancelled</option></select></div>
            <button onClick={() => { setStatusFilter('All'); }} className="w-full py-2 text-sm text-slate-500 hover:text-slate-700 underline">Reset Filters</button>
          </div>
        )}
        {drawerType === 'edit' && (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1"><label className="text-sm font-medium">Select Lead</label><select className="w-full p-2.5 border rounded-lg" value={formData.lead} onChange={e => setFormData({ ...formData, lead: e.target.value })} required>{leads.map(lead => <option key={lead._id} value={lead._id}>{lead.name}</option>)}</select></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><label className="text-sm font-medium">Date</label><input type="date" className="w-full p-2.5 border rounded-lg" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required /></div>
              <div className="space-y-1"><label className="text-sm font-medium">Time</label><input type="time" className="w-full p-2.5 border rounded-lg" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} required /></div>
            </div>
            <div className="space-y-1"><label className="text-sm font-medium">Property / Location</label><div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input className="w-full pl-10 pr-4 py-2.5 border rounded-lg" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} required /></div></div>
            <div className="space-y-1"><label className="text-sm font-medium">Agent</label><input className="w-full p-2.5 border rounded-lg" value={formData.Agent} onChange={e => setFormData({ ...formData, Agent: e.target.value })} /></div>
            <div className="space-y-1"><label className="text-sm font-medium">Status</label><select className="w-full p-2.5 border rounded-lg" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}><option value="Scheduled">Scheduled</option><option value="DONE">Done</option><option value="Cancelled">Cancelled</option></select></div>
            <div className="space-y-1"><label className="text-sm font-medium">Notes</label><textarea className="w-full p-2.5 border rounded-lg h-24" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} /></div>
            <div className="pt-4"><button disabled={loading} className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 flex justify-center">{loading ? <Spinner className="text-white" /> : selectedVisit ? 'Update Visit' : 'Schedule Visit'}</button></div>
          </form>
        )}
      </Drawer>

      <ScheduleVisitModal
        isOpen={isScheduleModalOpen}
        onClose={closeScheduleModal}
        preselectedLead={preselectedLead}
        leads={leads}
        onSchedule={handleScheduleVisit}
      />

      <EditVisitModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        visit={selectedVisit}
        leads={leads}
        onUpdate={handleUpdateVisit}
      />
    </>
  );
}