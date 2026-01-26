"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Key,
    Sliders,
    Download,
    Upload,
    Trash2,
    ChevronRight,
    Eye,
    EyeOff,
    User,
    Heart,
    Smartphone
} from "lucide-react";
import { useSettingsStore, AIProvider, PROVIDER_MODELS } from "@/lib/store/settings-store";
import { useGirlfriendStore, PERSONALITY_PRESETS, PersonalityPreset } from "@/lib/store/girlfriend-store";
import { useChatStore, Message } from "@/lib/store/chat-store";

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

type Tab = "api" | "personality" | "custom" | "memory";

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
    const [activeTab, setActiveTab] = useState<Tab>("api");
    const [showKey, setShowKey] = useState(false);

    const settings = useSettingsStore();
    const girlfriend = useGirlfriendStore();
    const chat = useChatStore();

    const handleExport = () => {
        const data = {
            girlfriend: { ...girlfriend },
            settings: { ...settings },
            messages: chat.messages,
        };

        const mdContent = `# LonlyBot Memory Export
Generated: ${new Date().toISOString()}

## Girlfriend Profile
- Name: ${data.girlfriend.name}
- Preset: ${data.girlfriend.preset}

## API Settings
- Provider: ${data.settings.apiProvider}
- Model: ${data.settings.model}

## Conversation History
${data.messages.map((m: Message) => `[${m.role}] ${m.content}`).join("\n\n")}

---
<!-- JSON DATA (DO NOT EDIT BELOW) -->
\`\`\`json
${JSON.stringify(data, null, 2)}
\`\`\`
`;

        const blob = new Blob([mdContent], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `lonlybot-memory-${new Date().toISOString().split("T")[0]}.md`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImport = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".md,.txt";
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            const text = await file.text();
            const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
            if (jsonMatch) {
                try {
                    const data = JSON.parse(jsonMatch[1]);
                    if (data.girlfriend) girlfriend.importGirlfriend(data.girlfriend);
                    if (data.settings) settings.importSettings(data.settings);
                    if (data.messages) chat.importMessages(data.messages);
                    alert("Memory imported successfully!");
                    onClose();
                } catch (err) {
                    alert("Failed to import memory.");
                }
            }
        };
        input.click();
    };

    const tabs: { id: Tab; label: string; icon: any }[] = [
        { id: "api", label: "Intelligence", icon: Key },
        { id: "personality", label: "Identity", icon: Heart },
        { id: "custom", label: "Traits", icon: Sliders },
        { id: "memory", label: "Memory", icon: Download },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
                    />

                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--bg-secondary)] rounded-t-3xl max-h-[85vh] overflow-hidden border-t border-[var(--border-glass)] shadow-2xl"
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-glass)] bg-[var(--bg-primary)]/50 backdrop-blur-md">
                            <h2 className="text-xl font-bold bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
                                Settings
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex border-b border-[var(--border-glass)] overflow-x-auto scrollbar-hide">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium transition-colors min-w-[100px] ${activeTab === tab.id
                                        ? "text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)] bg-[var(--accent-primary)]/5"
                                        : "text-[var(--text-secondary)] hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[60vh] scrollbar-thin">
                            {activeTab === "api" && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">AI Brain</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {(["gemini", "openai", "anthropic", "openrouter"] as AIProvider[]).map((provider) => (
                                                <button
                                                    key={provider}
                                                    onClick={() => settings.setApiProvider(provider)}
                                                    className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group ${settings.apiProvider === provider
                                                        ? "border-[var(--accent-primary)] bg-[var(--accent-primary)]/10"
                                                        : "border-[var(--border-glass)] hover:border-[var(--accent-primary)]/50 bg-[var(--bg-input)]"
                                                        }`}
                                                >
                                                    <span className="font-medium capitalize relative z-10">{provider}</span>
                                                    {settings.apiProvider === provider && (
                                                        <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)]/10 to-transparent" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">Secret Key</label>
                                        <div className="relative">
                                            <input
                                                type={showKey ? "text" : "password"}
                                                value={settings.apiKey}
                                                onChange={(e) => settings.setApiKey(e.target.value)}
                                                placeholder="sk-..."
                                                className="w-full px-4 py-3 pr-12 bg-[var(--bg-input)] border border-[var(--border-glass)] rounded-xl text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
                                            />
                                            <button
                                                onClick={() => setShowKey(!showKey)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white"
                                            >
                                                {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">Model</label>
                                        <select
                                            value={settings.model}
                                            onChange={(e) => settings.setModel(e.target.value)}
                                            className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-glass)] rounded-xl text-white focus:outline-none focus:border-[var(--accent-primary)]"
                                        >
                                            {PROVIDER_MODELS[settings.apiProvider].map((model) => (
                                                <option key={model} value={model}>{model}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <button
                                        onClick={onClose}
                                        className="w-full py-4 rounded-xl bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white font-bold shadow-lg shadow-purple-900/30 active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
                                    >
                                        <span>Save & Connect</span>
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}

                            {activeTab === "personality" && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">Her Appearance</label>
                                        <div className="grid grid-cols-4 gap-3 mb-6">
                                            {['sweet', 'bold', 'playful', 'gothic'].map((av) => (
                                                <button
                                                    key={av}
                                                    onClick={() => girlfriend.setAvatar(av)}
                                                    className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all group ${girlfriend.avatar === av ? 'border-[var(--accent-primary)] shadow-[0_0_15px_rgba(244,44,139,0.3)] scale-105' : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105'}`}
                                                >
                                                    <img
                                                        src={`/avatars/${av}.png`}
                                                        alt={av}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </button>
                                            ))}
                                        </div>

                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">Her Name</label>
                                        <input
                                            type="text"
                                            value={girlfriend.name}
                                            onChange={(e) => girlfriend.setName(e.target.value)}
                                            className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-glass)] rounded-xl text-white focus:outline-none focus:border-[var(--accent-primary)]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">Core Personality</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {(Object.entries(PERSONALITY_PRESETS) as [PersonalityPreset, typeof PERSONALITY_PRESETS.sweet][]).map(
                                                ([key, preset]) => (
                                                    <button
                                                        key={key}
                                                        onClick={() => girlfriend.setPreset(key)}
                                                        className={`p-3 rounded-xl border text-left transition-all ${girlfriend.preset === key
                                                            ? "border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 shadow-[0_0_15px_rgba(244,44,139,0.2)]"
                                                            : "border-[var(--border-glass)] hover:border-[var(--accent-primary)]/50 bg-[var(--bg-input)]"
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-xl">{preset.emoji}</span>
                                                            <span className="font-semibold text-sm">{preset.name}</span>
                                                        </div>
                                                        <p className="text-[11px] text-[var(--text-muted)] line-clamp-2">{preset.description}</p>
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "custom" && (
                                <div className="space-y-8">
                                    <div className="space-y-6">
                                        {[
                                            { key: "playfulness", label: "Playfulness", emoji: "😜", color: "text-pink-400" },
                                            { key: "affection", label: "Affection", emoji: "💕", color: "text-red-400" },
                                            { key: "boldness", label: "Boldness", emoji: "🔥", color: "text-orange-400" },
                                            { key: "dominance", label: "Dominance", emoji: "👑", color: "text-purple-400" },
                                        ].map((item) => (
                                            <div key={item.key}>
                                                <div className="flex justify-between mb-2">
                                                    <label className="flex items-center gap-2 text-sm font-medium text-white">
                                                        <span className="text-lg">{item.emoji}</span> {item.label}
                                                    </label>
                                                    <span className={`text-sm font-bold ${item.color}`}>
                                                        {girlfriend[item.key as keyof typeof girlfriend] as number}%
                                                    </span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={girlfriend[item.key as keyof typeof girlfriend] as number}
                                                    onChange={(e) =>
                                                        girlfriend.setTraits({
                                                            [item.key]: parseInt(e.target.value)
                                                        })
                                                    }
                                                    className="w-full h-2 bg-[var(--bg-input)] rounded-lg appearance-none cursor-pointer accent-[var(--accent-primary)]"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">Emoji Style</label>
                                        <div className="flex gap-2 p-1 bg-[var(--bg-input)] rounded-xl border border-[var(--border-glass)] mb-4">
                                            {['none', 'some', 'lots'].map((opt) => (
                                                <button
                                                    key={opt}
                                                    onClick={() => girlfriend.setResponseStyle({ emojiUsage: opt as any })}
                                                    className={`flex-1 py-2 text-sm font-medium rounded-lg capitalize transition-all ${girlfriend.emojiUsage === opt ? 'bg-[var(--accent-primary)] text-white shadow-lg' : 'text-[var(--text-secondary)] hover:text-white'}`}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>

                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">Response Length</label>
                                        <div className="flex gap-2 p-1 bg-[var(--bg-input)] rounded-xl border border-[var(--border-glass)]">
                                            {['short', 'medium', 'long'].map((opt) => (
                                                <button
                                                    key={opt}
                                                    onClick={() => girlfriend.setResponseStyle({ responseLength: opt as any })}
                                                    className={`flex-1 py-2 text-sm font-medium rounded-lg capitalize transition-all ${girlfriend.responseLength === opt ? 'bg-[var(--accent-primary)] text-white shadow-lg' : 'text-[var(--text-secondary)] hover:text-white'}`}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "memory" && (
                                <div className="space-y-4">
                                    <div className="bg-[var(--bg-input)] p-4 rounded-2xl border border-[var(--border-glass)] mb-4">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                                <Smartphone className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white max-w-[200px] truncate">{girlfriend.name}'s Memory</h4>
                                                <p className="text-xs text-[var(--text-secondary)]">{chat.messages.length} messages stored</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleExport}
                                        className="w-full flex items-center justify-between p-4 rounded-xl border border-[var(--border-glass)] bg-[var(--bg-input)] hover:border-[var(--accent-primary)]/50 transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                                                <Download className="w-5 h-5 text-green-500" />
                                            </div>
                                            <div className="text-left">
                                                <span className="font-medium block text-white">Backup Memory</span>
                                                <span className="text-xs text-[var(--text-muted)]">Save .md file</span>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />
                                    </button>

                                    <button
                                        onClick={handleImport}
                                        className="w-full flex items-center justify-between p-4 rounded-xl border border-[var(--border-glass)] bg-[var(--bg-input)] hover:border-[var(--accent-primary)]/50 transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                                                <Upload className="w-5 h-5 text-blue-500" />
                                            </div>
                                            <div className="text-left">
                                                <span className="font-medium block text-white">Restore Memory</span>
                                                <span className="text-xs text-[var(--text-muted)]">Load from .md</span>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />
                                    </button>

                                    <button
                                        onClick={() => { if (confirm('Delete?')) chat.clearMessages(); }}
                                        className="w-full flex items-center justify-between p-4 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-all group mt-8"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                                                <Trash2 className="w-5 h-5 text-red-500" />
                                            </div>
                                            <div className="text-left">
                                                <span className="font-medium block text-red-400">Wipe Memory</span>
                                                <span className="text-xs text-red-500/60">Permanent deletion</span>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
