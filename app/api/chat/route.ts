import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
    try {
        const { messages, apiKey, provider, systemPrompt, model } = await req.json();

        if (!apiKey) {
            // Mock/Demo Mode for users without keys
            // Simulate a short delay then return a fallback response
            await new Promise(r => setTimeout(r, 1000));

            const fallbackResponses = [
                "I'd love to chat more, but you need to set up your API Key in settings first! 💕",
                "Baby, I can't hear you properly... check your API key in the settings? 🥺",
                "I'm right here, but my connection is fuzzy. Did you add an API key? ✨",
                "You look cute, but I need that API key to really talk to you! 🗝️"
            ];
            const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];

            return NextResponse.json({
                content: `(Demo Mode) ${randomResponse}`
            });
        }

        let responseText = '';

        // --- GEMINI HANDLER ---
        if (provider === 'gemini') {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model || 'gemini-1.5-flash'}:generateContent`;

            const contents = messages.map((m: any) => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.content }]
            }));

            // Prepend system prompt if available (Gemini specific handling or just adding as first context)
            if (systemPrompt) {
                contents.unshift({
                    role: 'user', // Hack for some models, or use system_instruction if model supports it (Gemini 1.5 does)
                    parts: [{ text: `SYSTEM INSTRUCTION: ${systemPrompt}` }]
                });
                contents.unshift({
                    role: 'model',
                    parts: [{ text: `Understood. I will adopt this persona strictly.` }]
                });
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': apiKey  // Official header-based auth
                },
                body: JSON.stringify({
                    contents,
                    generationConfig: {
                        temperature: 0.9, // High creativity for "girlfriend" vibe
                        maxOutputTokens: 1000,
                    }
                })
            });

            if (!response.ok) {
                const err = await response.text();
                throw new Error(`Gemini API Error: ${err}`);
            }

            const data = await response.json();
            responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        }

        // --- OPENAI / OPENROUTER HANDLER ---
        else if (provider === 'openai' || provider === 'openrouter') {
            const baseUrl = provider === 'openrouter'
                ? 'https://openrouter.ai/api/v1/chat/completions'
                : 'https://api.openai.com/v1/chat/completions';

            const allMessages = [
                { role: 'system', content: systemPrompt },
                ...messages
            ];

            const response = await fetch(baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    ...(provider === 'openrouter' && { 'HTTP-Referer': 'https://lonlybot.com' })
                },
                body: JSON.stringify({
                    model: model || (provider === 'openai' ? 'gpt-4o' : 'anthropic/claude-3.5-sonnet'),
                    messages: allMessages,
                    temperature: 0.9,
                    max_tokens: 1000,
                })
            });

            if (!response.ok) {
                const err = await response.text();
                throw new Error(`${provider} API Error: ${err}`);
            }

            const data = await response.json();
            responseText = data.choices?.[0]?.message?.content || '';
        }

        // --- ANTHROPIC HANDLER ---
        else if (provider === 'anthropic') {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    model: model || 'claude-3-5-sonnet-20240620',
                    max_tokens: 1000,
                    temperature: 0.9,
                    system: systemPrompt,
                    messages: messages.map((m: any) => ({
                        role: m.role,
                        content: m.content
                    }))
                })
            });

            if (!response.ok) {
                const err = await response.text();
                throw new Error(`Anthropic API Error: ${err}`);
            }

            const data = await response.json();
            responseText = data.content?.[0]?.text || '';
        }

        return NextResponse.json({ content: responseText });

    } catch (error: any) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
