'use client';
import { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function AddLeadModal({ isOpen, onClose, onSuccess }: Props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        source: 'CRM',
        project: '',
        budget: '',
        type: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.phone) {
            setError('Name and Phone are required');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            if (res.ok) {
                onSuccess?.();
                onClose();
                setForm({ name: '', email: '', phone: '', source: 'CRM', project: '', budget: '', type: '' });
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to add lead');
            }
        } catch (err) {
            setError('Error creating lead');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-indigo-50">
                    <div className="flex items-center gap-2">
                        <Plus size={20} className="text-indigo-600" />
                        <h3 className="font-bold text-lg text-slate-800">Add New Lead</h3>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                        <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none" required />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="email@example.com" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
                            <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Source</label>
                            <select name="source" value={form.source} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                                <option value="CRM">CRM</option>
                                <option value="FACEBOOK">Facebook</option>
                                <option value="INSTAGRAM">Instagram</option>
                                <option value="WHATSAPP">WhatsApp</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Property Type</label>
                            <input name="type" value={form.type} onChange={handleChange} placeholder="e.g. 2BHK" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Budget</label>
                        <input name="budget" value={form.budget} onChange={handleChange} placeholder="e.g. 1.5 Cr" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium">Cancel</button>
                        <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium disabled:opacity-50">{loading ? 'Saving...' : 'Add Lead'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
