'use client';
import { useState, useMemo } from 'react';
import { X, Calendar, MapPin, Search } from 'lucide-react';

interface ScheduleVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedLead?: any;
  leads: any[];
  onSchedule: (data: any) => void;
}

export default function ScheduleVisitModal({ isOpen, onClose, preselectedLead, leads, onSchedule }: ScheduleVisitModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<any>(preselectedLead || null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [formData, setFormData] = useState({ date: '', time: '', location: '', notes: '', agent: '' });

  const filteredLeads = useMemo(() => {
    if (!searchQuery) return leads;
    const query = searchQuery.toLowerCase();
    return leads.filter(lead => 
      lead.name?.toLowerCase().includes(query) || 
      lead.phone?.includes(query)
    );
  }, [leads, searchQuery]);

  const handleLeadSelect = (lead: any) => {
    setSelectedLead(lead);
    setSearchQuery('');
    setShowDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !formData.date || !formData.time || !formData.location) {
      alert('Please fill all required fields');
      return;
    }

    onSchedule({
      lead: selectedLead._id,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      notes: formData.notes,
      agent: formData.agent || 'Not Assigned',
      status: 'Scheduled'
    });

    // Reset form
    setSelectedLead(null);
    setFormData({ date: '', time: '', location: '', notes: '', agent: '' });
    setSearchQuery('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-purple-50 sticky top-0">
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-purple-600" />
            <h3 className="font-bold text-lg text-slate-800">Schedule Site Visit</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Lead Selection with Search */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Select Lead *</label>
            <div className="relative">
              {!selectedLead ? (
                <div>
                  <div className="relative flex items-center">
                    <Search size={16} className="absolute left-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by name or phone..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowDropdown(true);
                      }}
                      onFocus={() => setShowDropdown(true)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                    />
                  </div>
                  {showDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                      {filteredLeads.length > 0 ? (
                        filteredLeads.map(lead => (
                          <button
                            key={lead._id}
                            type="button"
                            onClick={() => handleLeadSelect(lead)}
                            className="w-full text-left px-4 py-2.5 hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors"
                          >
                            <div className="font-medium text-slate-800 text-sm">{lead.name}</div>
                            <div className="text-xs text-slate-500">{lead.phone || 'No phone'}</div>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-center text-sm text-slate-500">No leads found</div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-slate-800 text-sm">{selectedLead.name}</div>
                    <div className="text-xs text-slate-600 mt-0.5">{selectedLead.phone}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLead(null);
                      setSearchQuery('');
                    }}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Time *</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                required
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Property / Location *</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="e.g. Oberoi Springs, Andheri"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                required
              />
            </div>
          </div>

          {/* Agent */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Assigned Agent</label>
            <input
              type="text"
              placeholder="Agent name (optional)"
              value={formData.agent}
              onChange={(e) => setFormData({ ...formData, agent: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none text-sm"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
            <textarea
              placeholder="Gate pass required? Client preferences?"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none resize-none text-sm h-20"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm transition-colors"
            >
              Schedule Visit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
