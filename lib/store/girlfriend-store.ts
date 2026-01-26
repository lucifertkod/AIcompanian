import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: number;
}

export type PersonalityPreset = 'sweet' | 'playful' | 'bold' | 'shy' | 'dominant' | 'submissive' | 'custom';

export const PERSONALITY_PRESETS: Record<PersonalityPreset, { name: string; emoji: string; description: string }> = {
    sweet: { name: 'Sweet', emoji: '💕', description: 'Gentle, nurturing, and caring' },
    playful: { name: 'Playful', emoji: '😘', description: 'Fun, teasing, and flirty' },
    bold: { name: 'Bold', emoji: '🔥', description: 'Confident, direct, and intense' },
    shy: { name: 'Shy', emoji: '🥺', description: 'Innocent, bashful, and sweet' },
    dominant: { name: 'Dominant', emoji: '👑', description: 'Assertive, guiding, and confident' },
    submissive: { name: 'Submissive', emoji: '🎀', description: 'Eager to please and follow' },
    custom: { name: 'Custom', emoji: '✨', description: 'Your own unique mix' }
};

export interface GirlfriendState {
    messages: Message[];
    name: string;
    status: 'online' | 'typing...' | 'offline';
    relationshipLevel: number; // 0-100
    apiKey: string;
    provider: 'openai' | 'anthropic' | 'gemini' | 'openrouter';
    preset: PersonalityPreset;
    avatar: string;

    // Personality Traits (0-100)
    playfulness: number;
    affection: number;
    boldness: number;
    dominance: number;

    // Response Style
    emojiUsage: 'none' | 'some' | 'lots';
    responseLength: 'short' | 'medium' | 'long';

    addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
    setName: (name: string) => void;
    setAvatar: (avatar: string) => void;
    setStatus: (status: GirlfriendState['status']) => void;
    setApiKey: (key: string) => void;
    setProvider: (provider: GirlfriendState['provider']) => void;

    // Setters for new traits
    setTraits: (traits: Partial<Pick<GirlfriendState, 'playfulness' | 'affection' | 'boldness' | 'dominance'>>) => void;
    setResponseStyle: (style: Partial<Pick<GirlfriendState, 'emojiUsage' | 'responseLength'>>) => void;

    setPreset: (preset: PersonalityPreset) => void;
    clearHistory: () => void;
    importGirlfriend: (data: Partial<GirlfriendState>) => void;
}

export const useGirlfriendStore = create<GirlfriendState>()(
    persist(
        (set) => ({
            messages: [],
            name: 'Anya',
            status: 'online',
            relationshipLevel: 10,
            apiKey: '',
            provider: 'gemini',
            preset: 'sweet',
            avatar: 'sweet',

            // Defaults
            playfulness: 50,
            affection: 70,
            boldness: 30,
            dominance: 10,
            emojiUsage: 'some',
            responseLength: 'medium',

            addMessage: (msg) => set((state) => ({
                messages: [
                    ...state.messages,
                    {
                        ...msg,
                        id: crypto.randomUUID(),
                        timestamp: Date.now(),
                    },
                ],
            })),

            setName: (name) => set({ name }),
            setAvatar: (avatar) => set({ avatar }),
            setStatus: (status) => set({ status }),
            setApiKey: (key) => set({ apiKey: key }),
            setProvider: (provider) => set({ provider }),

            setTraits: (traits) => set((state) => ({ ...state, ...traits })),
            setResponseStyle: (style) => set((state) => ({ ...state, ...style })),

            setPreset: (preset) => set({ preset }),
            clearHistory: () => set({ messages: [] }),
            importGirlfriend: (data) => set((state) => ({ ...state, ...data })),
        }),
        {
            name: 'girlfriend-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
