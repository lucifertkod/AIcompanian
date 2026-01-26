'use client';

import { X, Trash2, Key, Users, BookMarked } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/store/chat-store';

interface SettingsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SettingsDrawer({ isOpen, onClose }: SettingsDrawerProps) {
    const { apiKey, setApiKey, provider, setProvider, personality, setPersonality, clearHistory } = useChatStore();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-[#111b21] z-50 border-l border-gray-800 shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-[#202c33]">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Users className="w-5 h-5 text-green-500" />
                                Settings
                            </h2>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">

                            {/* API Key */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-green-400 uppercase tracking-wider flex items-center gap-2">
                                    <Key className="w-4 h-4" /> API Configuration
                                </label>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-400 mb-1 block">Provider</label>
                                        <select
                                            value={provider}
                                            onChange={(e) => setProvider(e.target.value as any)}
                                            className="w-full bg-[#2a3942] text-white rounded-lg p-3 border border-gray-700 focus:border-green-500 outline-none transition-colors"
                                        >
                                            <option value="gemini">Google Gemini</option>
                                            <option value="openai">OpenAI (GPT-4)</option>
                                            <option value="anthropic">Anthropic (Claude)</option>
                                            <option value="openrouter">OpenRouter</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400 mb-1 block">API Key</label>
                                        <input
                                            type="password"
                                            value={apiKey}
                                            onChange={(e) => setApiKey(e.target.value)}
                                            placeholder="sk-..."
                                            className="w-full bg-[#2a3942] text-white rounded-lg p-3 border border-gray-700 focus:border-green-500 outline-none transition-colors font-mono text-sm"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Stored locally in your browser.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Personality */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-green-400 uppercase tracking-wider flex items-center gap-2">
                                    <BookMarked className="w-4 h-4" /> Personality
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Sweet', 'Playful', 'Bold', 'Shy', 'Dominant', 'Submissive'].map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => setPersonality(p.toLowerCase())}
                                            className={`
                        p-3 rounded-lg border text-sm font-medium transition-all
                        ${personality === p.toLowerCase()
                                                    ? 'bg-[#005c4b] border-transparent text-white shadow-lg scale-105'
                                                    : 'bg-[#2a3942] border-transparent text-gray-300 hover:bg-[#374248]'}
                      `}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Data Management */}
                            <div className="pt-4 border-t border-gray-800">
                                <button
                                    onClick={() => {
                                        if (confirm('Are you sure you want to delete all messages?')) {
                                            clearHistory();
                                            onClose();
                                        }
                                    }}
                                    className="w-full flex items-center justify-center gap-2 p-3 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors border border-red-500/30 hover:border-red-500"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Clear Chat History
                                </button>
                            </div>

                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
