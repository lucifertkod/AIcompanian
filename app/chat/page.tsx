"use client";

import { useState } from "react";
import { ArrowLeft, Settings, Phone, Video } from "lucide-react";
import Link from "next/link";
import { useGirlfriendStore } from "@/lib/store/girlfriend-store";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { SettingsPanel } from "@/components/settings/SettingsPanel";
import { CallModal } from "@/components/chat/CallModal";

export default function ChatPage() {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [callType, setCallType] = useState<"video" | "audio" | null>(null);
    const { name: girlfriendName } = useGirlfriendStore();

    return (
        <div className="h-screen flex flex-col bg-[var(--bg-primary)]">
            <header className="flex items-center gap-3 px-4 py-3 glass-nav z-20 relative">
                <Link
                    href="/"
                    className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-[var(--text-secondary)]" />
                </Link>

                <div className="relative group cursor-pointer" onClick={() => setSettingsOpen(true)}>
                    <div className="p-[2px] rounded-full bg-gradient-to-tr from-[var(--accent-primary)] to-[var(--accent-secondary)]">
                        <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center overflow-hidden relative">
                            <img
                                src={`/avatars/${useGirlfriendStore.getState().avatar || 'sweet'}.png`}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                                onError={(e) => (e.currentTarget.src = "/avatars/sweet.png")}
                            />
                        </div>
                    </div>
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[var(--bg-primary)] shadow-sm" />
                </div>

                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setSettingsOpen(true)}>
                    <h1 className="font-semibold text-[var(--text-primary)] truncate text-lg leading-tight">
                        {girlfriendName}
                    </h1>
                    <p className="text-xs text-[var(--accent-primary)] font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse"></span>
                        Online
                    </p>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setCallType('video')}
                        className="p-2.5 rounded-full hover:bg-white/10 transition-colors text-[var(--text-secondary)] hover:text-[var(--accent-primary)]"
                    >
                        <Video className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setCallType('audio')}
                        className="p-2.5 rounded-full hover:bg-white/10 transition-colors text-[var(--text-secondary)] hover:text-[var(--accent-primary)]"
                    >
                        <Phone className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setSettingsOpen(true)}
                        className="p-2.5 rounded-full hover:bg-white/10 transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    >
                        <Settings className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <main className="flex-1 overflow-hidden relative z-10">
                <ChatContainer />
            </main>

            <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />

            <CallModal isOpen={!!callType} type={callType} onClose={() => setCallType(null)} />
        </div>
    );
}
