"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass-nav py-3" : "bg-transparent py-6"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative w-8 h-8 flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full blur-md opacity-60 group-hover:opacity-100 transition-opacity" />
                        <Heart className="w-5 h-5 text-white relative z-10 fill-white/20" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-[var(--accent-primary)] transition-all">
                        LonlyBot
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {["Features", "How it Works", "Privacy"].map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
                            className="text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-colors"
                        >
                            {item}
                        </a>
                    ))}
                    <Link href="/login">
                        <button className="px-5 py-2 rounded-full border border-[var(--border-glass)] bg-white/5 hover:bg-white/10 text-sm font-medium transition-all hover:border-[var(--accent-primary)]/50">
                            Sign In
                        </button>
                    </Link>
                    <Link href="/chat">
                        <button className="px-5 py-2 rounded-full bg-[var(--accent-primary)] text-white text-sm font-medium hover:bg-[var(--accent-secondary)] transition-colors">
                            Launch App
                        </button>
                    </Link>
                </nav>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 right-0 glass-nav border-t border-[var(--border-glass)] p-6 md:hidden flex flex-col gap-4"
                    >
                        {["Features", "How it Works", "Privacy"].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
                                className="text-lg font-medium text-[var(--text-secondary)] block py-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item}
                            </a>
                        ))}
                        <Link href="/chat" onClick={() => setMobileMenuOpen(false)}>
                            <button className="w-full btn-primary mt-4">Launch App</button>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
