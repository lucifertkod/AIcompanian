"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PhoneOff, Video, Mic, MicOff, Camera, CameraOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useGirlfriendStore } from "@/lib/store/girlfriend-store";

interface CallModalProps {
    isOpen: boolean;
    type: "video" | "audio" | null;
    onClose: () => void;
}

export function CallModal({ isOpen, type, onClose }: CallModalProps) {
    const [status, setStatus] = useState("Connecting...");
    const [micOn, setMicOn] = useState(true);
    const [camOn, setCamOn] = useState(true);
    const { name } = useGirlfriendStore();

    useEffect(() => {
        if (isOpen) {
            setStatus("Calling...");
            const timer = setTimeout(() => {
                setStatus("Ringing...");
                const timer2 = setTimeout(() => setStatus("Unavailable"), 8000);
                return () => clearTimeout(timer2);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, y: 100 }}
                    className="fixed inset-0 z-50 bg-[var(--bg-primary)] flex flex-col items-center justify-between py-20"
                >
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[var(--accent-primary)]/20 blur-[100px] rounded-full animate-pulse" />
                    </div>

                    <div className="relative z-10 flex flex-col items-center gap-6">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[var(--accent-primary)] to-[var(--accent-secondary)] p-[3px] shadow-[0_0_40px_rgba(244,44,139,0.3)]">
                                <div className="w-full h-full rounded-full bg-[var(--bg-secondary)] flex items-center justify-center overflow-hidden relative">
                                    <img
                                        src={`/avatars/${useGirlfriendStore.getState().avatar || 'sweet'}.png`}
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            <div className="absolute inset-0 rounded-full border border-white/10 animate-[ping_2s_ease-in-out_infinite]" />
                        </div>

                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-bold text-white tracking-tight">{name}</h2>
                            <p className="text-[var(--accent-primary)] font-medium text-lg animate-pulse">{status}</p>
                        </div>
                    </div>

                    <div className="relative z-10 w-full max-w-sm px-8 grid grid-cols-3 gap-6 place-items-center">
                        <button
                            onClick={() => setCamOn(!camOn)}
                            className={`p-4 rounded-full backdrop-blur-md transition-all ${camOn ? 'bg-white/10 text-white' : 'bg-white text-black'}`}
                            disabled={type === 'audio'}
                        >
                            {camOn ? <CameraOff className="w-6 h-6" /> : <Camera className="w-6 h-6" />}
                        </button>

                        <button
                            onClick={() => setMicOn(!micOn)}
                            className={`p-4 rounded-full backdrop-blur-md transition-all ${micOn ? 'bg-white/10 text-white' : 'bg-white text-black'}`}
                        >
                            {micOn ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                        </button>

                        <button className="p-4 rounded-full bg-white/10 text-white backdrop-blur-md">
                            <Video className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="relative z-10 pb-8">
                        <button
                            onClick={onClose}
                            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-transform hover:scale-110 shadow-lg shadow-red-500/30"
                        >
                            <PhoneOff className="w-8 h-8 text-white fill-current" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
