'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export function LandingNavbar() {
    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
        >
            <div className="max-w-7xl mx-auto glass-nav rounded-full px-6 py-3 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-lg shadow-[0_0_15px_rgba(244,44,139,0.5)] group-hover:shadow-[0_0_25px_rgba(244,44,139,0.8)] transition-all duration-300">
                        💕
                    </div>
                    <span className="font-bold text-xl tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[var(--accent-primary)] group-hover:to-[var(--accent-secondary)] transition-all">
                        LonlyBot
                    </span>
                </Link>

                {/* Actions */}
                <div className="flex items-center gap-6">
                    <Link href="/about" className="hidden md:block text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-colors">
                        Our Story
                    </Link>
                    <Link href="/login" className="hidden md:block text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-colors">
                        Sign In
                    </Link>

                    <Link
                        href="/chat"
                        className="px-6 py-2 rounded-full bg-white text-[var(--bg-primary)] text-sm font-bold hover:bg-[var(--accent-primary)] hover:text-white transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(244,44,139,0.4)]"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </motion.nav>
    );
}
