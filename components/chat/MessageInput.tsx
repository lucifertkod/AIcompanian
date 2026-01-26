"use client";

import { useState, FormEvent, KeyboardEvent } from "react";
import { Send, Smile } from "lucide-react";
import { motion } from "framer-motion";

interface MessageInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
    const [message, setMessage] = useState("");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (message.trim() && !disabled) {
            onSend(message.trim());
            setMessage("");
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex items-end gap-2 p-3 bg-[var(--bg-input)] border-t border-[var(--border-color)]"
        >
            {/* Emoji button (placeholder) */}
            <button
                type="button"
                className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
                <Smile className="w-6 h-6" />
            </button>

            {/* Input field */}
            <div className="flex-1 relative">
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    disabled={disabled}
                    rows={1}
                    className="w-full px-4 py-3 bg-[var(--bg-secondary)] rounded-3xl text-[var(--text-primary)] placeholder-[var(--text-muted)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 text-[15px] max-h-32 overflow-y-auto disabled:opacity-50"
                    style={{
                        minHeight: "46px",
                    }}
                />
            </div>

            {/* Send button */}
            <motion.button
                type="submit"
                disabled={!message.trim() || disabled}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-full bg-[var(--accent)] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                <Send className="w-5 h-5" />
            </motion.button>
        </form>
    );
}
