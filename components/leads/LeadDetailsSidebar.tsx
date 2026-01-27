'use client';
import { useState, useEffect } from 'react';
import { X, MessageCircle, Phone, Calendar, Activity, Clock, Plus } from 'lucide-react';
import Badge from './Badge';

interface LeadDetailsSidebarProps {
    lead: any;
    onClose: () => void;
    onScheduleVisit: (lead: any) => void;
}

export default function LeadDetailsSidebar({ lead, onClose, onScheduleVisit }: LeadDetailsSidebarProps) {
    const [activities, setActivities] = useState<any[]>([]);
    const [newActivity, setNewActivity] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (lead) {
            fetchActivities();
        }
    }, [lead]);

    const fetchActivities = async () => {
        try {
            const res = await fetch(`/api/lead-activities?leadId=${lead._id}`);
            const data = await res.json();
            setActivities(data);
        } catch (error) {
            console.error('Failed to fetch activities:', error);
        }
    };

    const logActivity = async () => {
        if (!newActivity.trim()) return;
        setLoading(true);
        try {
            await fetch('/api/lead-activities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leadId: lead._id, message: newActivity }),
            });
            setNewActivity('');
            fetchActivities();
        } catch (error) {
            console.error('Failed to log activity:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!lead) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300 flex flex-col">
                {/* Header */}
                <div className="sticky top-0 bg-white/95 backdrop-blur z-10 border-b border-slate-100 p-4 flex items-center justify-between shadow-sm">
                    <h2 className="text-lg font-bold text-slate-800">Lead Details</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full"
                    >
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Profile Section */}
                    <div className="text-center">
                        <div className="h-24 w-24 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-4xl shadow-lg mb-4">
                            {lead.name.charAt(0)}
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800">{lead.name}</h3>
                        <p className="text-slate-500 font-medium">{lead.phone}</p>
                        <div className="flex justify-center mt-3 gap-2 flex-wrap">
                            <Badge status={lead.status} />
                            {lead.source && (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                    {lead.source}
                                </span>
                            )}
                        </div>
                        <div className="mt-2 text-xs text-slate-400">
                            Created by:{" "}
                            <span className="font-medium text-slate-600">
                                {lead.createdByName || 'System'}
                            </span>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-3 gap-3 mt-6">
                            <button className="flex flex-col items-center justify-center p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors text-green-700 border border-green-100">
                                <MessageCircle size={24} className="mb-1" />
                                <span className="text-xs font-semibold">WhatsApp</span>
                            </button>
                            <button className="flex flex-col items-center justify-center p-3 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors text-indigo-700 border border-indigo-100">
                                <Phone size={24} className="mb-1" />
                                <span className="text-xs font-semibold">Call</span>
                            </button>
                            <button
                                onClick={() => onScheduleVisit(lead)}
                                className="flex flex-col items-center justify-center p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors text-purple-700 border border-purple-100"
                            >
                                <Calendar size={24} className="mb-1" />
                                <span className="text-xs font-semibold">Visit</span>
                            </button>
                        </div>
                    </div>

                    {/* Analysis & Requirements */}
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Activity size={16} className="text-indigo-600" /> Lead Analysis
                        </h4>
                        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 shadow-sm">
                            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                <div>
                                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wide block mb-1">
                                        Budget
                                    </span>
                                    <span className="font-bold text-slate-800 text-lg">
                                        {lead.requirement?.budget || 'N/A'}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wide block mb-1">
                                        Requirement
                                    </span>
                                    <span className="font-bold text-slate-800 text-lg">
                                        {lead.requirement?.propertyType || 'N/A'}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wide block mb-1">
                                        Location
                                    </span>
                                    <span className="font-bold text-slate-800">
                                        {lead.requirement?.preferredLocation || 'N/A'}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wide block mb-1">
                                        Readiness
                                    </span>
                                    <span
                                        className={`font-bold ${lead.requirement?.readiness === "Hot Interest" ? "text-red-600" : lead.requirement?.readiness === "Warm Interest" ? "text-orange-500" : "text-blue-500"}`}
                                    >
                                        {lead.requirement?.readiness || 'N/A'}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-200">
                                <span className="text-xs text-slate-500 font-medium uppercase tracking-wide block mb-2">
                                     Notes
                                </span>
                                <div className="bg-white p-3 rounded-lg border border-slate-200 text-sm text-slate-600 italic">
                                    "{lead.notes || 'No notes available.'}"
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Follow-up / Activity Timeline */}
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Clock size={16} className="text-indigo-600" /> Follow-up Activity
                        </h4>
                        <div className="space-y-6 border-l-2 border-indigo-100 ml-3 pl-6 relative">
                            {activities.map((item, idx) => (
                                <div key={item._id} className="relative group">
                                    <span className="absolute -left-[31px] top-0 h-6 w-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center transition-transform group-hover:scale-110 bg-indigo-500">
                                        <Activity size={10} className="text-white" />
                                    </span>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">
                                            {item.message}
                                        </p>
                                        <span className="text-xs text-slate-400 mt-1 block">
                                            {new Date(item.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {/* Add Interaction Box */}
                            <div className="relative mt-8">
                                <span className="absolute -left-[31px] top-2 h-6 w-6 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center shadow-sm">
                                    <Plus size={12} className="text-slate-500" />
                                </span>
                                <textarea
                                    value={newActivity}
                                    onChange={(e) => setNewActivity(e.target.value)}
                                    placeholder="Log a new call, note, or meeting..."
                                    className="w-full text-sm p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none h-24 bg-slate-50/50 transition-all"
                                ></textarea>
                                <button
                                    onClick={logActivity}
                                    disabled={loading || !newActivity.trim()}
                                    className="mt-2 w-full text-sm bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-lg"
                                >
                                    {loading ? 'Logging...' : 'Log Activity'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}