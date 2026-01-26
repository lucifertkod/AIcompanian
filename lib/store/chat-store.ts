import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

interface ChatStore {
    messages: Message[];
    isTyping: boolean;
    addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
    setTyping: (typing: boolean) => void;
    clearMessages: () => void;
    importMessages: (messages: Message[]) => void;
}

export const useChatStore = create<ChatStore>()(
    persist(
        (set) => ({
            messages: [],
            isTyping: false,

            addMessage: (message) =>
                set((state) => ({
                    messages: [
                        ...state.messages,
                        {
                            ...message,
                            id: crypto.randomUUID(),
                            timestamp: Date.now(),
                        },
                    ],
                })),

            setTyping: (typing) => set({ isTyping: typing }),

            clearMessages: () => set({ messages: [] }),

            importMessages: (messages) => set({ messages }),
        }),
        {
            name: 'lonlybot-chat',
        }
    )
);
