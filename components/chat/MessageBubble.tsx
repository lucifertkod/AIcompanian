"use client";

import { motion } from "framer-motion";
import { Check, CheckCheck } from "lucide-react";
import { Message } from "@/lib/store/chat-store";

interface MessageBubbleProps {
    message: Message;
    girlfriendName: string;
}

export function MessageBubble({ message, girlfriendName }: MessageBubbleProps) {
    const isUser = message.role === "user";
    const time = new Date(message.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2 px-3`}
        >
            <div
                className={`relative max-w-[80%] md:max-w-[65%] px-4 py-2 ${isUser ? "message-user" : "message-gf"
                    }`}
            >
                {/* Girlfriend name label */}
                {!isUser && (
                    <span className="text-xs text-[var(--accent-pink)] font-medium block mb-1">
                        {girlfriendName}
                    </span>
                )}

                {/* Message content */}
                <p className="text-[var(--text-primary)] whitespace-pre-wrap break-words text-[15px] leading-relaxed">
                    {message.content}
                </p>

                {/* Timestamp and read receipts */}
                <div className={`flex items-center gap-1 mt-1 ${isUser ? "justify-end" : "justify-start"}`}>
                    <span className="text-[11px] text-[var(--text-muted)]">{time}</span>
                    {isUser && (
                        <CheckCheck className="w-4 h-4 text-[#53bdeb]" />
                    )}
                </div>

                {/* Message tail */}
                <div
                    className={`absolute top-0 ${isUser
                            ? "right-0 translate-x-[6px] border-l-[8px] border-l-[var(--bubble-user)]"
                            : "left-0 -translate-x-[6px] border-r-[8px] border-r-[var(--bubble-gf)]"
                        } border-t-[8px] border-t-transparent`}
                />
            </div>
        </motion.div>
    );
}
