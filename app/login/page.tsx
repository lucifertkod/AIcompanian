"use client";

import { motion } from "framer-motion";
import { ChevronLeft, Github } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function LoginPage() {
    const [loading, setLoading] = useState<string | null>(null);
    const supabase = createClient();

    const handleLogin = async (provider: 'google' | 'github') => {
        try {
            setLoading(provider);
            await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${location.origin}/auth/callback`,
                },
            });
        } catch (error) {
            console.error("Login failed:", error);
            setLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-white flex items-center justify-center p-4 overflow-hidden relative">
            {/* --- BACKGROUND --- */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover object-center opacity-40 blur-sm scale-110"
                >
                    <source src="/eyes.mov" type="video/mp4" />
                </video>
                {/* Gradients */}
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)]/80 via-transparent to-[var(--bg-primary)]" />
                <div className="absolute inset-0 bg-black/50" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="glass w-full max-w-md p-8 rounded-3xl relative z-10 border border-white/10 shadow-2xl"
            >
                <Link href="/" className="absolute top-6 left-6 text-white/50 hover:text-white transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </Link>

                <div className="text-center mb-10 mt-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] mb-6 shadow-lg shadow-[var(--accent-primary)]/20">
                        <span className="text-3xl">👋</span>
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
                    <p className="text-[var(--text-secondary)]">Sign in to continue your journey</p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={() => handleLogin('google')}
                        disabled={loading !== null}
                        className="w-full p-4 rounded-xl glass hover:bg-white/10 transition-all flex items-center justify-center gap-3 font-medium group border-white/5 hover:border-white/20"
                    >
                        {loading === 'google' ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                <span>Continue with Google</span>
                            </>
                        )}
                    </button>

                    <button
                        onClick={() => handleLogin('github')}
                        disabled={loading !== null}
                        className="w-full p-4 rounded-xl glass hover:bg-white/10 transition-all flex items-center justify-center gap-3 font-medium group border-white/5 hover:border-white/20"
                    >
                        {loading === 'github' ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Github className="w-5 h-5" />
                                <span>Continue with GitHub</span>
                            </>
                        )}
                    </button>
                </div>

                <div className="mt-8 text-center text-xs text-[var(--text-muted)]">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </div>
            </motion.div>
        </div>
    );
}
