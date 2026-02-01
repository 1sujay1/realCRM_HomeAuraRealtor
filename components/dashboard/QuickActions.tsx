'use client';
import { useEffect, useState } from 'react';
import { Plus, MessageCircle, Calendar } from 'lucide-react';
import AddLeadModal from '@/components/leads/AddLeadModal';
import ScheduleVisitModal from '@/components/site-visits/ScheduleVisitModal';
import WhatsAppBlastModal from '@/components/dashboard/WhatsAppBlastModal';

const QuickActions = () => {
    const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
    const [isScheduleVisitOpen, setIsScheduleVisitOpen] = useState(false);
    const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
    const [leads, setLeads] = useState<any[]>([]);

    const handleWhatsAppBlast = async () => {
        setIsWhatsAppOpen(true);
    };

    useEffect(() => {
        let mounted = true;
        fetch('/api/leads')
            .then(res => res.ok ? res.json() : [])
            .then(data => { if (mounted) setLeads(data); })
            .catch(() => { /* ignore */ });
        return () => { mounted = false; };
    }, []);

    const handleSchedule = async (data: any) => {
        try {
            const res = await fetch('/api/site-visits', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                alert('Site visit scheduled');
            } else {
                const d = await res.json();
                alert(d.error || 'Failed to schedule visit');
            }
        } catch (err) {
            console.error(err);
            alert('Error scheduling visit');
        }
    };

    const ActionButton = ({ icon: Icon, title, subtitle, onClick, color }: any) => (
        <button
            onClick={onClick}
            className="w-full text-left p-3 hover:bg-slate-50 rounded-lg flex items-center space-x-3 transition-colors"
        >
            <div className={`${color} p-2 rounded-lg`}>
                <Icon size={18} />
            </div>
            <div>
                <span className="block font-bold text-slate-700 text-sm">{title}</span>
                <span className="block text-xs text-slate-400">{subtitle}</span>
            </div>
        </button>
    );

    return (
        <>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h2>

                <div className="space-y-1">
                    <ActionButton
                        icon={Plus}
                        title="Add New Lead"
                        subtitle="Capture details instantly"
                        onClick={() => setIsAddLeadOpen(true)}
                        color="bg-indigo-100 text-indigo-600"
                    />
                    <div className="h-px bg-slate-50 mx-3"></div>

                    <ActionButton
                        icon={MessageCircle}
                        title="WhatsApp Blast"
                        subtitle="Send bulk updates"
                        onClick={handleWhatsAppBlast}
                        color="bg-green-100 text-green-600"
                    />
                    <div className="h-px bg-slate-50 mx-3"></div>

                    <ActionButton
                        icon={Calendar}
                        title="Schedule Visit"
                        subtitle="Book property viewing"
                        onClick={() => setIsScheduleVisitOpen(true)}
                        color="bg-purple-100 text-purple-600"
                    />
                </div>

                {/* Pro Tip */}
                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-4 text-white shadow-lg mt-4">
                    <h3 className="font-bold mb-1">Pro Tip</h3>
                    <p className="text-sm opacity-90">
                        Leads contacted within 5 mins convert 9x better.
                    </p>
                </div>
            </div>

            {/* Modals */}
            {isAddLeadOpen && (
                <AddLeadModal isOpen={isAddLeadOpen} onClose={() => setIsAddLeadOpen(false)} />
            )}
            {isScheduleVisitOpen && (
                <ScheduleVisitModal
                    isOpen={isScheduleVisitOpen}
                    onClose={() => setIsScheduleVisitOpen(false)}
                    leads={leads}
                    onSchedule={(data: any) => handleSchedule(data)}
                />
            )}
            {isWhatsAppOpen && (
                <WhatsAppBlastModal
                    isOpen={isWhatsAppOpen}
                    onClose={() => setIsWhatsAppOpen(false)}
                />
            )}
        </>
    );
};

export default QuickActions;
