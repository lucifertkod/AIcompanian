import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: number;
}

export interface ChatState {
    messages: Message[];
    apiKey: string;
    provider: 'openai' | 'anthropic' | 'gemini' | 'openrouter';
    personality: string;

    addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
    setApiKey: (key: string) => void;
    setProvider: (provider: ChatState['provider']) => void;
    setPersonality: (personality: string) => void;
    clearHistory: () => void;
}

export const useChatStore = create<ChatState>()(
    persist(
        (set) => ({
            messages: [],
            apiKey: '',
            provider: 'gemini', // Default provider
            personality: 'sweet',

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

            setApiKey: (key) => set({ apiKey: key }),
            setProvider: (provider) => set({ provider }),
            setPersonality: (personality) => set({ personality }),
            clearHistory: () => set({ messages: [] }),
        }),
        {
            name: 'lonlybot-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
