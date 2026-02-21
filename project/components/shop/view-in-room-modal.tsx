'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ViewInRoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    image: string;
}

export function ViewInRoomModal({ isOpen, onClose, image }: ViewInRoomModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 transition-opacity"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-white hover:text-white/80 transition-colors bg-white/10 rounded-full p-2 z-50"
                        >
                            <X size={32} />
                        </button>

                        <div className="relative w-full max-w-6xl aspect-[16/9] bg-white rounded-xl shadow-2xl overflow-hidden flex items-center justify-center">
                            {/* Realistic Room Background */}
                            <div className="absolute inset-0 z-0">
                                <img
                                    src="/room-mockup.png"
                                    alt="Modern Living Room"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/5" /> {/* Subtle dim for art focus */}
                            </div>

                            {/* Artwork */}
                            <div className="relative z-10 shadow-[0_15px_50px_rgba(0,0,0,0.4)] border-[8px] border-white max-h-[50%] max-w-[35%] bg-white transform -translate-y-[8%]">
                                <img src={image} alt="Artwork on wall" className="w-full h-full object-cover" />
                            </div>

                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/90 text-sm font-medium bg-black/30 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 uppercase tracking-widest">
                                Wall Preview
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
