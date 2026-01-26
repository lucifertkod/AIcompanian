'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Image as ImageIcon, Smile } from 'lucide-react';
import { useGirlfriendStore } from '@/lib/store/girlfriend-store';
import { useSettingsStore } from '@/lib/store/settings-store';
import { generateSystemPrompt } from '@/lib/prompts';

export function ChatContainer() {
    const girlfriend = useGirlfriendStore();
    const settings = useSettingsStore(); // Get API settings
    const { messages, addMessage, name, setStatus } = girlfriend;

    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const calculateTypingDelay = (text: string) => {
        // Average typing speed: 30-50ms per character
        // Plus a "reading" delay (1-2s)
        const baseDelay = 1500;
        const typingTime = Math.min(5000, Math.max(1000, text.length * 30));
        return baseDelay + typingTime;
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim()) return;

        const userText = inputValue;
        setInputValue('');

        // 1. Add User Message
        addMessage({
            role: 'user',
            content: userText,
        });

        // 2. Prepare Context
        const systemPrompt = generateSystemPrompt({
            name: girlfriend.name,
            preset: girlfriend.preset,
            playfulness: girlfriend.playfulness,
            affection: girlfriend.affection,
            boldness: girlfriend.boldness,
            dominance: girlfriend.dominance,
            emojiUsage: girlfriend.emojiUsage,
            responseLength: girlfriend.responseLength
        });

        const recentHistory = messages.slice(-10).map(m => ({
            role: m.role,
            content: m.content
        }));

        // Add current message to history for the API call
        const apiMessages = [...recentHistory, { role: 'user', content: userText }];

        try {
            // 3. Set status to "seen" or "thinking"
            // Wait a random short moment before "typing" starts (reaction time)
            setTimeout(() => setStatus('typing...'), 800);

            // 4. Call API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: apiMessages,
                    apiKey: settings.apiKey,
                    provider: settings.apiProvider,
                    model: settings.model,
                    systemPrompt: systemPrompt
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const aiText = data.content || "...";

            // 5. Realistic Typing Delay
            // We got the text fast, but we simulate typing it out
            const delay = calculateTypingDelay(aiText);

            setTimeout(() => {
                addMessage({
                    role: 'assistant',
                    content: aiText,
                });
                setStatus('online');
            }, delay);

        } catch (error: any) {
            console.error(error);
            setStatus('offline');

            let errorMessage = "I'm having trouble connecting right now... check your connection? 💔";

            // Check for Rate Limit / Quota errors
            if (error.message?.includes('429') || error.message?.includes('Quota') || error.message?.includes('RESOURCE_EXHAUSTED')) {
                errorMessage = "Baby, we're going too fast! 🥵 (Google's Free Tier rate limit reached. Please wait ~1 min or switch models in Settings)";
            }
            // Check for API Key errors
            else if (error.message?.includes('API key') || error.message?.includes('401') || error.message?.includes('403')) {
                errorMessage = "I can't see you properly... please check your API Key in Settings! 🗝️";
            }
            // General or other specific errors
            else if (error.message) {
                // Clean up the error message if it's a JSON dump
                const cleanMsg = error.message.replace(/Gemini API Error: \{.*\}/, 'External API Error');
                errorMessage = `Connection error: ${cleanMsg.substring(0, 100)}... 😥`;
            }

            setTimeout(() => {
                addMessage({
                    role: 'system',
                    content: errorMessage
                });
                setStatus('online');
            }, 1000);
        }
    };

    return (
        <div className="flex flex-col h-full relative">
            {/* Background patterned overlay */}
            <div
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                }}
            />

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
                <div className="h-4" /> {/* Spacer */}

                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4 opacity-0 animate-[fadeIn_1s_ease-out_forwards]">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center shadow-[0_0_30px_rgba(244,44,139,0.4)] animate-float">
                            <span className="text-4xl">👋</span>
                        </div>
                        <div className="glass px-6 py-4 rounded-2xl max-w-xs">
                            <p className="text-[var(--text-secondary)]">
                                Say hello to <span className="text-gradient font-bold">{name}</span>.
                                She's waiting for you.
                            </p>
                        </div>
                    </div>
                )}

                <AnimatePresence initial={false}>
                    {messages.map((msg, index) => {
                        const isUser = msg.role === 'user';
                        const isRecent = index === messages.length - 1;

                        return (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                layout
                                className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`
                    max-w-[85%] sm:max-w-[70%] px-5 py-3 shadow-lg text-[15px] leading-relaxed relative
                    ${isUser
                                            ? 'message-user text-white rounded-tr-sm'
                                            : 'message-gf text-[var(--text-primary)] rounded-tl-sm'}
                  `}
                                >
                                    <p>{msg.content}</p>

                                    {/* Timestamp & Status */}
                                    <div className={`text-[10px] mt-1 flex items-center gap-1 opacity-60 ${isUser ? 'justify-end' : 'justify-start'}`}>
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        {isUser && <span className="text-[#34b7f1]">✓✓</span>}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-[var(--bg-input)]/80 backdrop-blur-md border-t border-[var(--border-glass)]">
                <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-end gap-2">
                    <button type="button" className="p-3 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors rounded-full hover:bg-white/5">
                        <Smile className="w-6 h-6" />
                    </button>

                    <div className="flex-1 bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-glass)] focus-within:border-[var(--accent-primary)] transition-colors flex items-center min-h-[48px] px-4 py-2">
                        <textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            placeholder={`Message ${name}...`}
                            className="bg-transparent border-none outline-none text-[var(--text-primary)] w-full placeholder-gray-500 resize-none max-h-32 py-1 scrollbar-hide"
                            rows={1}
                        />
                    </div>

                    {inputValue.trim() ? (
                        <button
                            type="submit"
                            className="p-3 rounded-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white shadow-lg shadow-purple-900/30 transform transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
                        >
                            <Send className="w-5 h-5 ml-0.5" />
                        </button>
                    ) : (
                        <button type="button" className="p-3 text-[var(--text-secondary)] hover:text-white transition-colors rounded-full hover:bg-white/5">
                            <Mic className="w-6 h-6" />
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
}
