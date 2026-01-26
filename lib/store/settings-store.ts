import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AIProvider = 'gemini' | 'openai' | 'anthropic' | 'openrouter';

interface SettingsStore {
    apiProvider: AIProvider;
    apiKey: string;
    model: string;
    temperature: number;
    setApiProvider: (provider: AIProvider) => void;
    setApiKey: (key: string) => void;
    setModel: (model: string) => void;
    setTemperature: (temp: number) => void;
    importSettings: (settings: Partial<SettingsStore>) => void;
}

export const PROVIDER_MODELS: Record<AIProvider, string[]> = {
    gemini: [
        'gemini-3-flash-preview',
        'gemini-2.0-flash-exp',
        'gemini-2.0-flash',
        'gemini-exp-1206',
        'gemini-1.5-pro',
        'gemini-1.5-flash',
        'gemini-1.5-flash-8b',
        'gemini-1.0-pro'
    ],
    openai: [
        'gpt-4o',
        'gpt-4o-mini',
        'gpt-4-turbo',
        'gpt-4',
        'gpt-3.5-turbo',
        'o1-preview',
        'o1-mini'
    ],
    anthropic: [
        'claude-3-5-sonnet-20241022',
        'claude-3-5-haiku-20241022',
        'claude-3-opus-20240229',
        'claude-3-sonnet-20240229',
        'claude-3-haiku-20240307'
    ],
    openrouter: [
        'deepseek/deepseek-chat',
        'meta-llama/llama-3.1-405b-instruct',
        'meta-llama/llama-3.1-70b-instruct',
        'meta-llama/llama-3.1-8b-instruct',
        'mistralai/mistral-large',
        'google/gemini-2.0-flash-exp:free',
        'anthropic/claude-3.5-sonnet',
        'openai/gpt-4o-mini',
        'qwen/qwen-2.5-72b-instruct'
    ],
};

export const useSettingsStore = create<SettingsStore>()(
    persist(
        (set) => ({
            apiProvider: 'gemini',
            apiKey: '',
            model: 'gemini-1.5-flash',
            temperature: 0.8,

            setApiProvider: (provider) =>
                set({
                    apiProvider: provider,
                    model: PROVIDER_MODELS[provider][0],
                }),

            setApiKey: (key) => set({ apiKey: key }),

            setModel: (model) => set({ model }),

            setTemperature: (temp) => set({ temperature: temp }),

            importSettings: (settings) => set((state) => ({ ...state, ...settings })),
        }),
        {
            name: 'lonlybot-settings',
        }
    )
);
