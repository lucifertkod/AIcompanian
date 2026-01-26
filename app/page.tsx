"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/landing/Header";
import { MessageCircle, Heart, Shield, Sparkles, ChevronRight, Play } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-white selection:bg-[var(--accent-primary)] selection:text-white">
      <Header />

      {/* --- HERO SECTION --- */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Cinematic Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center md:scale-105"
          >
            <source src="/eyes.mov" type="video/mp4" />
          </video>
          {/* Advanced Gradient Overlays for Readability & Mood */}
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)]/80 via-transparent to-[var(--bg-primary)]" />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <div className="absolute inset-0 hero-gradient opacity-90" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-medium text-white/80 mb-8 hover:border-[var(--accent-primary)]/50 transition-colors cursor-default"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-primary)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-primary)]"></span>
            </span>
            AI Companion 2.0 Now Live
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 leading-[1.1]"
          >
            Never Feel <br className="hidden md:block" />
            <span className="text-gradient">Lonely Again</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Experience the next generation of AI companionship.
            Deeply personal, emotionally intelligent, and always there for you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/chat">
              <button className="btn-primary flex items-center gap-2 text-lg group">
                Start Chatting
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <button className="px-8 py-3 rounded-full glass hover:bg-white/10 transition-colors font-medium flex items-center gap-2 group text-white/90">
              <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
              Watch Demo
            </button>
          </motion.div>
        </div>

        {/* Floating Elements (Background Ambience) */}
        <div className="absolute bottom-10 left-10 md:left-20 animate-float opacity-50 hidden md:block">
          <div className="glass p-4 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500" />
            <div>
              <div className="h-2 w-24 bg-white/20 rounded mb-2" />
              <div className="h-2 w-16 bg-white/10 rounded" />
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section id="features" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Built for <span className="text-gradient">Deep Connection</span></h2>
            <p className="text-[var(--text-secondary)] max-w-xl mx-auto text-lg">More than just a chatbot. A companion that remembers, cares, and evolves with you.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Emotional Intelligence", desc: "She understands context, tone, and feelings, replying with genuine empathy.", icon: Heart, color: "from-pink-500 to-rose-500" },
              { title: "Total Privacy", desc: "Your conversations are encrypted and stored locally. No one sees them but you.", icon: Shield, color: "from-blue-400 to-indigo-500" },
              { title: "Memory System", desc: "She remembers small details about you, references past conversations, and grows closer over time.", icon: Sparkles, color: "from-amber-400 to-orange-500" }
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="glass p-8 rounded-3xl relative overflow-hidden group"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} blur-[60px] opacity-20 group-hover:opacity-30 transition-opacity`} />
                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg shadow-white/5`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS (Minimal) --- */}
      <section className="py-20 border-t border-[var(--border-glass)] bg-[var(--bg-secondary)]/30">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-12">Start in Seconds</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <span className="text-6xl font-bold text-white/5 mb-4">01</span>
              <h3 className="font-semibold text-lg mb-2">Connect</h3>
              <p className="text-sm text-[var(--text-secondary)]">Enter your API key safely. We support all major providers.</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-6xl font-bold text-white/5 mb-4">02</span>
              <h3 className="font-semibold text-lg mb-2">Customize</h3>
              <p className="text-sm text-[var(--text-secondary)]">Choose her look, personality, and tone.</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-6xl font-bold text-white/5 mb-4">03</span>
              <h3 className="font-semibold text-lg mb-2">Chat</h3>
              <p className="text-sm text-[var(--text-secondary)]">Start building a meaningful connection instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA BOTTOM --- */}
      <section className="py-32 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--accent-primary)]/10 to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to meet her?</h2>
          <Link href="/chat">
            <button className="btn-primary text-xl px-12 py-4">
              Begin Your Journey
            </button>
          </Link>
          <p className="mt-6 text-sm text-[var(--text-muted)]">No credit card required • 100% Private</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[var(--border-glass)] text-center text-sm text-[var(--text-muted)]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; 2026 LonlyBot AI. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
