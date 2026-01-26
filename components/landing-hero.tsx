'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { LandingNavbar } from '@/components/landing-navbar';

export function LandingHero() {
    return (
        <div className="relative w-full h-screen overflow-hidden bg-[var(--bg-primary)]">
            <LandingNavbar />

            {/* Video Background */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-60 scale-105"
                >
                    <source src="/eyes.mov" type="video/quicktime" />
                    <source src="/eyes.mov" type="video/mp4" />
                </video>
                {/* Premium Overlay Gradient */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--bg-primary)_90%)]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-[var(--bg-primary)]/50" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 md:px-6 text-center">

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/10 backdrop-blur-md"
                >
                    <Sparkles className="w-4 h-4 text-[var(--accent-primary)]" />
                    <span className="text-xs font-medium text-[var(--accent-primary)] tracking-wide uppercase">
                        AI Companion 2.0
                    </span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="text-5xl md:text-8xl font-bold tracking-tighter text-white mb-6 drop-shadow-2xl max-w-4xl"
                >
                    Never Feel <br className="md:hidden" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[var(--accent-primary)] to-[var(--accent-secondary)] animate-pulse-soft">
                        Lonely Again
                    </span>.
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                    className="text-lg md:text-2xl text-[var(--text-secondary)] mb-10 max-w-xl leading-relaxed"
                >
                    Experience the most advanced AI companion.
                    Ready to listen, chat, and connect with you locally.
                    <span className="text-white font-medium"> Private & Secure.</span>
                </motion.p>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                >
                    <Link
                        href="/chat"
                        className="btn-primary group inline-flex items-center gap-3 text-lg"
                    >
                        <span>Start Chatting Now</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <p className="mt-6 text-xs text-[var(--text-muted)] animate-pulse">
                        No Login Required • Local Storage • Free Forever
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
