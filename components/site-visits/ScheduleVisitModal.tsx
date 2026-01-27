import { X, Calendar, MapPin } from 'lucide-react';

interface ScheduleVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedLead?: any;
  leads: any[];
  onSchedule: (data: any) => void;
}

export default function ScheduleVisitModal({ isOpen, onClose, preselectedLead, leads, onSchedule }: ScheduleVisitModalProps) {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      lead: formData.get('lead'),
      date: formData.get('date'),
      time: formData.get('time'),
      location: formData.get('location'),
      notes: formData.get('notes'),
      Agent: formData.get('agent'),
      status: 'Scheduled'
    };
    onSchedule(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-purple-50">
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-purple-600" />
            <h3 className="font-bold text-lg text-slate-800">
              Schedule Site Visit
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-200 rounded-full"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Select Lead
            </label>
            <select
              name="lead"
              defaultValue={preselectedLead?._id || ""}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none"
              required
            >
              <option value="">Choose a lead...</option>
              {leads.map(lead => (
                <option key={lead._id} value={lead._id}>{lead.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Date
              </label>
              <input
                name="date"
                type="date"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Time
              </label>
              <input
                name="time"
                type="time"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Property / Location
            </label>
            <div className="relative">
              <MapPin
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                name="location"
                placeholder="e.g. Oberoi Springs, Andheri"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Agent (Optional)
            </label>
            <input
              name="agent"
              placeholder="Assign an agent for this visit"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Notes for Visit
            </label>
            <textarea
              name="notes"
              className="w-full h-20 px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none resize-none"
              placeholder="Gate pass required? Client preferences?"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-purple-200"
          >
            Confirm Schedule
          </button>
        </form>
      </div>
    </div>
  );
}