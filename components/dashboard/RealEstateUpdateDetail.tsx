'use client';
import { X, Share2, Copy, MessageCircle, Clock, MapPin, Tag } from 'lucide-react';
import type { RealEstateUpdate } from '@/types';

interface RealEstateUpdateDetailProps {
    update: RealEstateUpdate | null;
    onClose: () => void;
}

const RealEstateUpdateDetail = ({ update, onClose }: RealEstateUpdateDetailProps) => {
    if (!update) return null;

    const handleShare = (platform: 'whatsapp' | 'copy') => {
        const text = `${update.title}\n\n${update.description}\n\nLocation: ${update.location}\nTag: ${update.tag}`;

        if (platform === 'copy') {
            navigator.clipboard.writeText(text);
            alert('Copied to clipboard!');
        } else if (platform === 'whatsapp') {
            const encodedText = encodeURIComponent(text);
            window.open(`https://wa.me/?text=${encodedText}`, '_blank');
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${update ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 right-0 bg-white shadow-2xl z-50 w-full max-w-md transition-all duration-300 ease-in-out transform ${update ? 'translate-x-0 animate-in slide-in-from-right' : 'translate-x-full'
                    } overflow-hidden flex flex-col`}
            >
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-orange-50 to-orange-100/50 border-b border-orange-100 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-orange-600 flex items-center justify-center text-white">
                            <span className="font-bold text-lg">{update.tag.charAt(0)}</span>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                                {update.tag}
                            </h3>
                            <p className="text-xs text-slate-400">Real Estate Update</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-orange-200 text-slate-600 hover:text-orange-700 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                    {/* Title */}
                    <div className="p-6 border-b border-slate-100">
                        <h2 className="text-2xl font-bold text-slate-800 leading-tight">{update.title}</h2>
                    </div>

                    {/* Metadata */}
                    <div className="p-6 space-y-4 border-b border-slate-100">
                        <div className="flex items-center gap-3 text-slate-600">
                            <Clock size={18} className="text-orange-600 flex-shrink-0" />
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase">Updated</p>
                                <p className="text-sm font-medium">{update.time}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-slate-600">
                            <MapPin size={18} className="text-orange-600 flex-shrink-0" />
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase">Location</p>
                                <p className="text-sm font-medium">{update.location}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-slate-600">
                            <Tag size={18} className="text-orange-600 flex-shrink-0" />
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase">Category</p>
                                <p className="text-sm font-medium">{update.tag}</p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="p-6">
                        <h4 className="text-sm font-bold text-slate-800 uppercase mb-3 tracking-wider">Details</h4>
                        <p className="text-base text-slate-700 leading-relaxed whitespace-pre-wrap">
                            {update.description}
                        </p>
                    </div>

                    {/* Additional Info */}
                    <div className="p-6 bg-gradient-to-b from-slate-50 to-transparent border-t border-slate-100">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white rounded-lg border border-slate-100">
                                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Status</p>
                                <p className="text-sm font-semibold text-green-600">Active</p>
                            </div>
                            <div className="p-4 bg-white rounded-lg border border-slate-100">
                                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Priority</p>
                                <p className="text-sm font-semibold text-orange-600">High</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer - Share Actions */}
                <div className="sticky bottom-0 bg-white border-t border-slate-100 p-6 space-y-3 shadow-2xl">
                    <button
                        onClick={() => handleShare('whatsapp')}
                        className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl duration-200"
                    >
                        <MessageCircle size={20} />
                        Share on WhatsApp
                    </button>
                    <button
                        onClick={() => handleShare('copy')}
                        className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-lg font-semibold transition-colors duration-200"
                    >
                        <Copy size={20} />
                        Copy to Clipboard
                    </button>
                </div>
            </div>
        </>
    );
};

export default RealEstateUpdateDetail;
