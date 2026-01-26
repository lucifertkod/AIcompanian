'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MoreVertical, Phone, Video, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useChatStore } from '@/store/chat-store';

export function ChatInterface() {
    const { messages, addMessage, personality } = useChatStore();
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim()) return;

        // Add user message
        addMessage({
            role: 'user',
            content: inputValue,
        });
        setInputValue('');

        // Simulate AI response (temporary)
        setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: `I'm a simulated ${personality} AI response to: "${inputValue}"`,
            });
        }, 1000);
    };

    const currentPersona = {
        name: 'Anya', // Default name
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anya', // Placeholder avatar
        status: 'online',
    };

    return (
        <div className="flex flex-col h-screen bg-[#0b141a] text-[#e9edef] max-w-md mx-auto md:max-w-full md:border-x border-gray-800 relative">
            {/* Header */}
            <header className="flex items-center justify-between px-4 py-3 bg-[#202c33] z-10 shadow-md">
                <div className="flex items-center gap-3">
                    <Link href="/" className="md:hidden text-gray-400 hover:text-white">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div className="relative">
                        {/* Avatar Placeholder */}
                        <div className="w-10 h-10 rounded-full bg-gray-600 overflow-hidden">
                            <img src={currentPersona.avatar} alt={currentPersona.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#202c33]" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-white leading-tight">{currentPersona.name}</h2>
                        <p className="text-xs text-gray-400">{currentPersona.status}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-[#aebac1]">
                    <button className="hover:text-white transition-colors"><Video className="w-6 h-6" /></button>
                    <button className="hover:text-white transition-colors"><Phone className="w-5 h-5" /></button>
                    <button className="hover:text-white transition-colors"><MoreVertical className="w-5 h-5" /></button>
                </div>
            </header>

            {/* Chat Area */}
            <div
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0b141a]"
                style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundRepeat: 'repeat', backgroundSize: '400px', backgroundBlendMode: 'soft-light' }}
            >
                <div className="bg-black/80 fixed inset-0 z-0 pointer-events-none" /> {/* Dim background image */}

                <div className="relative z-10 space-y-2">
                    {messages.length === 0 && (
                        <div className="flex justify-center my-8">
                            <div className="bg-[#182229] text-[#ffd279] text-xs px-4 py-2 rounded-lg shadow text-center max-w-[80%]">
                                🔒 Messages are end-to-end encrypted. No one outside of this chat, not even LonlyBot, can read or listen to them.
                            </div>
                        </div>
                    )}

                    <AnimatePresence initial={false}>
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                layout
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`
                    max-w-[85%] px-3 py-1.5 rounded-lg shadow-sm text-sm md:text-base relative group
                    ${msg.role === 'user'
                                            ? 'bg-[#005c4b] text-white rounded-tr-none'
                                            : 'bg-[#202c33] text-white rounded-tl-none'}
                    `}
                                >
                                    <p className="mr-8 whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                    <span className="text-[10px] text-white/50 absolute bottom-1 right-2 block">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        {msg.role === 'user' && <span className="ml-1 text-blue-400">✓✓</span>}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <footer className="p-2 bg-[#202c33] z-10">
                <form onSubmit={handleSendMessage} className="flex items-end gap-2 max-w-4xl mx-auto">
                    <div className="flex-1 bg-[#2a3942] rounded-2xl flex items-center min-h-[44px] px-4 py-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Message"
                            className="bg-transparent border-none outline-none text-white w-full placeholder-gray-400 text-sm md:text-base"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!inputValue.trim()}
                        className={`p-3 rounded-full flex items-center justify-center transition-all duration-200
              ${inputValue.trim()
                                ? 'bg-[#00a884] text-white hover:bg-[#008f6f] shadow-lg transform active:scale-95'
                                : 'bg-[#2a3942] text-gray-500 cursor-default'
                            }`}
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </footer>
        </div>
    );
}
