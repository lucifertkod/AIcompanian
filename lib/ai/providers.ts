import { AIProvider, useSettingsStore } from '../store/settings-store';
import { useGirlfriendStore } from '../store/girlfriend-store';
import { generateSystemPrompt } from '../prompts';

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

// Gemini API
async function callGemini(messages: ChatMessage[], apiKey: string, model: string): Promise<string> {
    const systemPrompt = messages.find(m => m.role === 'system')?.content || '';
    const chatMessages = messages.filter(m => m.role !== 'system');

    const contents = chatMessages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
    }));

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents,
                systemInstruction: { parts: [{ text: systemPrompt }] },
                generationConfig: {
                    temperature: useSettingsStore.getState().temperature,
                    maxOutputTokens: 1024,
                },
            }),
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Gemini API error');
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'I couldn\'t respond...';
}

// OpenAI API
async function callOpenAI(messages: ChatMessage[], apiKey: string, model: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model,
            messages: messages.map(m => ({ role: m.role, content: m.content })),
            temperature: useSettingsStore.getState().temperature,
            max_tokens: 1024,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'OpenAI API error');
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'I couldn\'t respond...';
}

// Anthropic API
async function callAnthropic(messages: ChatMessage[], apiKey: string, model: string): Promise<string> {
    const systemPrompt = messages.find(m => m.role === 'system')?.content || '';
    const chatMessages = messages.filter(m => m.role !== 'system');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
            model,
            max_tokens: 1024,
            system: systemPrompt,
            messages: chatMessages.map(m => ({ role: m.role, content: m.content })),
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Anthropic API error');
    }

    const data = await response.json();
    return data.content?.[0]?.text || 'I couldn\'t respond...';
}

// OpenRouter API
async function callOpenRouter(messages: ChatMessage[], apiKey: string, model: string): Promise<string> {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
        },
        body: JSON.stringify({
            model,
            messages: messages.map(m => ({ role: m.role, content: m.content })),
            temperature: useSettingsStore.getState().temperature,
            max_tokens: 1024,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'OpenRouter API error');
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'I couldn\'t respond...';
}

// Main function to send messages
export async function sendMessage(
    userMessage: string,
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<string> {
    const settings = useSettingsStore.getState();
    const girlfriend = useGirlfriendStore.getState();

    if (!settings.apiKey) {
        throw new Error('Please add your API key in settings first! 💕');
    }

    // Generate system prompt
    const systemPrompt = generateSystemPrompt({
        name: girlfriend.name,
        preset: girlfriend.preset,
        playfulness: girlfriend.playfulness,
        affection: girlfriend.affection,
        boldness: girlfriend.boldness,
        dominance: girlfriend.dominance,
        emojiUsage: girlfriend.emojiUsage,
        responseLength: girlfriend.responseLength,
    });

    // Build messages array
    const messages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMessage },
    ];

    // Call appropriate API
    switch (settings.apiProvider) {
        case 'gemini':
            return callGemini(messages, settings.apiKey, settings.model);
        case 'openai':
            return callOpenAI(messages, settings.apiKey, settings.model);
        case 'anthropic':
            return callAnthropic(messages, settings.apiKey, settings.model);
        case 'openrouter':
            return callOpenRouter(messages, settings.apiKey, settings.model);
        default:
            throw new Error('Unknown AI provider');
    }
}
