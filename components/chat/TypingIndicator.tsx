"use client";

import { motion } from "framer-motion";

export function TypingIndicator() {
    return (
        <div className="flex items-center gap-2 px-4 py-3 message-gf max-w-[80px] ml-2">
            <motion.div
                className="typing-dot"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.4, repeat: Infinity }}
            />
            <motion.div
                className="typing-dot"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
                className="typing-dot"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: 0.4 }}
            />
        </div>
    );
}
