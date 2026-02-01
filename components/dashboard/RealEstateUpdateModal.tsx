'use client';
import { X, Newspaper } from 'lucide-react';
import { useState } from 'react';
import type { RealEstateUpdate } from '@/types';

interface RealEstateUpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: RealEstateUpdate) => Promise<void>;
    editingUpdate?: RealEstateUpdate | null;
}

export default function RealEstateUpdateModal({
    isOpen,
    onClose,
    onSave,
    editingUpdate,
}: RealEstateUpdateModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const formData = new FormData(e.currentTarget);
            const data: RealEstateUpdate = {
                ...(editingUpdate?._id && { _id: editingUpdate._id }),
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                location: formData.get('location') as any,
                tag: formData.get('tag') as any,
            };

            await onSave(data);
            (e.target as HTMLFormElement).reset();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save update');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-orange-50">
                    <div className="flex items-center gap-2">
                        <Newspaper size={20} className="text-orange-600" />
                        <h3 className="font-bold text-lg text-slate-800">
                            {editingUpdate ? 'Edit Real Estate Update' : 'Post Real Estate Update'}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="p-1 hover:bg-slate-200 rounded-full disabled:opacity-50"
                    >
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Headline <span className="text-red-600">*</span>
                        </label>
                        <input
                            name="title"
                            required
                            defaultValue={editingUpdate?.title || ''}
                            disabled={loading}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-none disabled:bg-slate-50"
                            placeholder="e.g. New Project Launch - Marina Luxury Towers"
                        />
                    </div>

                    {/* Location and Tag Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Location <span className="text-red-600">*</span>
                            </label>
                            <select
                                name="location"
                                required
                                defaultValue={editingUpdate?.location || 'West'}
                                disabled={loading}
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-none bg-white disabled:bg-slate-50"
                            >
                                <option value="West">West</option>
                                <option value="Central">Central</option>
                                <option value="South">South</option>
                                <option value="East">East</option>
                                <option value="North">North</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Category <span className="text-red-600">*</span>
                            </label>
                            <select
                                name="tag"
                                required
                                defaultValue={editingUpdate?.tag || 'News'}
                                disabled={loading}
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-none bg-white disabled:bg-slate-50"
                            >
                                <option value="Launch">Launch</option>
                                <option value="Price Update">Price Update</option>
                                <option value="Possession">Possession</option>
                                <option value="Offer">Offer</option>
                                <option value="News">News</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Details <span className="text-red-600">*</span>
                        </label>
                        <textarea
                            name="description"
                            required
                            defaultValue={editingUpdate?.description || ''}
                            disabled={loading}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-none resize-none h-24 disabled:bg-slate-50"
                            placeholder="Describe the update in detail..."
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-orange-200 disabled:shadow-none"
                        >
                            {loading
                                ? 'Saving...'
                                : editingUpdate
                                    ? 'Update'
                                    : 'Post Update'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
