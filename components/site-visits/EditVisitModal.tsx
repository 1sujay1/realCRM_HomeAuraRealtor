import { X, Edit2, MapPin } from 'lucide-react';

interface EditVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  visit: any;
  leads: any[];
  onUpdate: (data: any) => void;
}

export default function EditVisitModal({ isOpen, onClose, visit, leads, onUpdate }: EditVisitModalProps) {
  if (!isOpen || !visit) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const updatedVisit = {
      ...visit,
      lead: formData.get('lead'),
      date: formData.get('date'),
      time: formData.get('time'),
      location: formData.get('location'),
      notes: formData.get('notes'),
      Agent: formData.get('agent'),
      status: formData.get('status')
    };
    onUpdate(updatedVisit);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-blue-50">
          <div className="flex items-center gap-2">
            <Edit2 size={20} className="text-blue-600" />
            <h3 className="font-bold text-lg text-slate-800">
              Edit Site Visit
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
              Lead Name
            </label>
            <select
              name="lead"
              defaultValue={visit.lead?._id}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              required
            >
              {leads.map(lead => (
                <option key={lead._id} value={lead._id}>{lead.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Status
            </label>
            <select
              name="status"
              defaultValue={visit.status}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="Scheduled">Scheduled</option>
              <option value="DONE">Done</option>
              <option value="Cancelled">Cancelled</option>
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
                defaultValue={new Date(visit.date).toISOString().split('T')[0]}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
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
                defaultValue={visit.time}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
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
                defaultValue={visit.location}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Agent
            </label>
            <input
              name="agent"
              defaultValue={visit.Agent || ''}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              defaultValue={visit.notes || ''}
              className="w-full h-20 px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-200"
          >
            Update Visit
          </button>
        </form>
      </div>
    </div>
  );
}