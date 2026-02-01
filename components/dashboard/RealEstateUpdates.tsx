'use client';
import { useState, useEffect } from 'react';
import { Newspaper, Plus, Filter, Edit, Trash2 } from 'lucide-react';
import RealEstateUpdateDetail from './RealEstateUpdateDetail';
import RealEstateUpdateModal from './RealEstateUpdateModal';
import type { RealEstateUpdate } from '@/types';

const RealEstateUpdates = () => {
    const [updates, setUpdates] = useState<RealEstateUpdate[]>([]);
    const [loading, setLoading] = useState(true);
    const [locationFilter, setLocationFilter] = useState('All');
    const [selectedUpdate, setSelectedUpdate] = useState<RealEstateUpdate | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUpdate, setEditingUpdate] = useState<RealEstateUpdate | null>(null);
    const [error, setError] = useState('');

    // Fetch updates on mount
    useEffect(() => {
        fetchUpdates();
    }, []);

    const fetchUpdates = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/real-estate-updates');
            if (!response.ok) throw new Error('Failed to fetch updates');
            const data = await response.json();
            setUpdates(data);
            setError('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load updates');
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveUpdate = async (data: RealEstateUpdate) => {
        const method = data._id ? 'PUT' : 'POST';
        const url = data._id ? `/api/real-estate-updates/${data._id}` : '/api/real-estate-updates';

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const msg = (errorData && (errorData.error || errorData.message)) || 'Failed to save';
            setError(msg);
            throw new Error(msg);
        }

        // Success: refresh list and reset modal/editing state
        const result = await response.json().catch(() => null);
        setEditingUpdate(null);
        setIsModalOpen(false);
        await fetchUpdates();
        return result;
    };

    const handleDeleteUpdate = async (id: string) => {
        if (!confirm('Are you sure you want to delete this update?')) return;

        try {
            const response = await fetch(`/api/real-estate-updates/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete');
            }

            setUpdates((prev) => prev.filter((u) => u._id !== id));
            setError('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete update');
        }
    };

    const handleEditClick = (update: RealEstateUpdate) => {
        setEditingUpdate(update);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUpdate(null);
    };

    const filteredUpdates = updates.filter(
        (update) => locationFilter === 'All' || update.location === locationFilter
    );

    return (
        <>
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                        <Newspaper size={28} className="text-orange-600" />
                        Real Estate Updates
                    </h2>
                    <div className="flex items-center gap-3">
                        <select
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                            className="text-base border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-orange-500 font-medium"
                        >
                            <option value="All">All Zones</option>
                            <option value="West">West</option>
                            <option value="Central">Central</option>
                            <option value="South">South</option>
                            <option value="East">East</option>
                            <option value="North">North</option>
                        </select>
                        <button
                            onClick={() => {
                                setEditingUpdate(null);
                                setIsModalOpen(true);
                            }}
                            className="p-2.5 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors"
                            title="Add new update"
                        >
                            <Plus size={22} />
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin">
                            <Newspaper size={32} className="text-orange-600 opacity-50" />
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredUpdates.length === 0 && (
                    <div className="text-center py-12">
                        <Newspaper size={40} className="mx-auto text-slate-300 mb-3" />
                        <p className="text-base text-slate-400">
                            {locationFilter === 'All'
                                ? 'No updates yet. Click the plus button to create one!'
                                : `No updates for this zone. Try another zone or create a new one.`}
                        </p>
                    </div>
                )}

                {/* Updates List */}
                {!loading && (
                    <div className="space-y-4 max-h-80 overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-slate-50 hover:scrollbar-thumb-orange-500">
                        {filteredUpdates.map((update) => (
                            <div
                                key={update._id}
                                className="flex gap-4 items-start pb-4 border-b border-slate-100 last:border-0 last:pb-0 hover:bg-gradient-to-r hover:from-orange-50 hover:to-transparent p-3 rounded-lg transition-all duration-200 group"
                            >
                                {/* Dot Indicator */}
                                <div className="mt-2 h-3 w-3 rounded-full bg-orange-500 flex-shrink-0 group-hover:scale-125 transition-transform" />

                                {/* Content */}
                                <div
                                    className="flex-1 cursor-pointer"
                                    onClick={() => setSelectedUpdate(update)}
                                >
                                    <p className="text-base font-semibold text-slate-800 group-hover:text-orange-600 transition-colors">
                                        {update.title}
                                    </p>
                                    <p className="text-sm text-slate-600 mt-1">{update.description}</p>
                                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                                        <span className="text-xs text-slate-400">
                                            {update.time || 'Recently'}
                                        </span>
                                        <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded font-medium">
                                            {update.location}
                                        </span>
                                        <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded font-medium">
                                            {update.tag}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditClick(update);
                                        }}
                                        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                        title="Edit update"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteUpdate(update._id || '');
                                        }}
                                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                        title="Delete update"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Detail Sidebar */}
            <RealEstateUpdateDetail
                update={selectedUpdate}
                onClose={() => setSelectedUpdate(null)}
            />

            {/* Add/Edit Modal */}
            <RealEstateUpdateModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveUpdate}
                editingUpdate={editingUpdate}
            />
        </>
    );
};

export default RealEstateUpdates;
