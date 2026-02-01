'use client';
import { useState } from 'react';
import { X, MessageCircle, Send, TrendingUp } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSend?: (data: any) => void;
}

export default function WhatsAppBlastModal({ isOpen, onClose, onSend }: Props) {
    const [loading, setLoading] = useState(false);
    const [targetAudience, setTargetAudience] = useState('all');
    const [selectedTemplate, setSelectedTemplate] = useState('launch');
    const [customMessage, setCustomMessage] = useState('Hi {lead_name}, exciting news! We just launched a new premium tower at Andheri West. 3BHK starting at 2.5Cr. Reply "YES" for the e-brochure. - Alex, BrokerFlow');

    const templates = {
        launch: 'Hi {lead_name}, exciting news! We just launched a new premium tower at Andheri West. 3BHK starting at 2.5Cr. Reply "YES" for the e-brochure. - Alex, BrokerFlow',
        visit: 'Hi {lead_name}, just a quick reminder about your scheduled site visit on {visit_date} at {visit_time}. Please confirm your attendance. Thanks!',
        offer: 'Hi {lead_name}, 🎉 Special Festival Offer! Get up to 20% discount on selected properties. Limited time only! Reply to know more.',
        followup: 'Hi {lead_name}, just checking in! Are you still interested in properties at {location}? Happy to discuss further. Call us anytime!'
    };

    const audiences = [
        { id: 'all', label: 'All Leads (42)' },
        { id: 'hot', label: 'Hot Leads (5)' },
        { id: 'visit', label: 'Site Visit Scheduled (3)' },
        { id: 'new', label: 'New Leads (This Week) (12)' }
    ];

    const handleTemplateChange = (templateId: keyof typeof templates) => {
        setSelectedTemplate(templateId);
        setCustomMessage(templates[templateId]);
    };

    const handleSend = async () => {
        setLoading(true);
        try {
            const payload = {
                audience: targetAudience,
                template: selectedTemplate,
                message: customMessage,
                timestamp: new Date().toISOString()
            };

            const response = await fetch('/api/whatsapp-blast', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                onSend?.(payload);
                alert('WhatsApp campaign sent successfully!');
                onClose();
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to send campaign');
            }
        } catch (error) {
            console.error(error);
            alert('Error sending WhatsApp campaign');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-green-50 sticky top-0">
                    <div className="flex items-center gap-2">
                        <MessageCircle size={20} className="text-green-600" />
                        <h3 className="font-bold text-lg text-slate-800">WhatsApp Blast Campaign</h3>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {/* Target Audience */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Target Audience</label>
                        <select
                            value={targetAudience}
                            onChange={(e) => setTargetAudience(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white text-sm"
                        >
                            {audiences.map(aud => (
                                <option key={aud.id} value={aud.id}>{aud.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Template Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">Select Template</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => handleTemplateChange('launch')}
                                className={`p-3 border-2 rounded-lg text-xs font-medium text-left transition-all ${selectedTemplate === 'launch'
                                        ? 'border-green-500 bg-green-50 text-green-700'
                                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                                    }`}
                            >
                                🚀 New Launch Alert
                            </button>
                            <button
                                onClick={() => handleTemplateChange('visit')}
                                className={`p-3 border-2 rounded-lg text-xs font-medium text-left transition-all ${selectedTemplate === 'visit'
                                        ? 'border-green-500 bg-green-50 text-green-700'
                                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                                    }`}
                            >
                                📅 Visit Reminder
                            </button>
                            <button
                                onClick={() => handleTemplateChange('offer')}
                                className={`p-3 border-2 rounded-lg text-xs font-medium text-left transition-all ${selectedTemplate === 'offer'
                                        ? 'border-green-500 bg-green-50 text-green-700'
                                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                                    }`}
                            >
                                🎉 Festival Offer
                            </button>
                            <button
                                onClick={() => handleTemplateChange('followup')}
                                className={`p-3 border-2 rounded-lg text-xs font-medium text-left transition-all ${selectedTemplate === 'followup'
                                        ? 'border-green-500 bg-green-50 text-green-700'
                                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                                    }`}
                            >
                                👋 Follow-up
                            </button>
                        </div>
                    </div>

                    {/* Message Preview */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Message Preview</label>
                        <textarea
                            value={customMessage}
                            onChange={(e) => setCustomMessage(e.target.value)}
                            className="w-full h-28 p-4 rounded-lg border border-slate-300 bg-slate-50 text-sm focus:ring-2 focus:ring-green-500 outline-none resize-none"
                            placeholder="Customize your message..."
                        />
                        <p className="text-xs text-slate-400 mt-2 text-right">
                            0 credits required (Free Tier)
                        </p>
                    </div>

                    {/* Info Banner */}
                    <div className="bg-yellow-50 p-3 rounded-lg flex items-start gap-3">
                        <TrendingUp size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-yellow-700">
                            High delivery rate expected (98%). Messages will be queued and sent via WhatsApp Business API. Estimated send time: 2-5 minutes for bulk campaigns.
                        </p>
                    </div>

                    {/* Send Button */}
                    <button
                        onClick={handleSend}
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2"
                    >
                        <Send size={18} />
                        {loading ? 'Sending Campaign...' : 'Send Campaign'}
                    </button>
                </div>
            </div>
        </div>
    );
}
