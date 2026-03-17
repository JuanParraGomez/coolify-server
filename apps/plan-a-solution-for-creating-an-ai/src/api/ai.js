import { AI_PROVIDERS, getStoredKeys } from '../utils/providers.js'

/**
 * Sends a prompt to the active AI provider.
 * @param {string} providerId - 'openai' | 'claude' | 'gemini' | 'deepseek'
 * @param {string} systemPrompt
 * @param {string} userMessage
 * @returns {Promise<string>} AI reply text
 */
export async function generateReply(providerId, systemPrompt, userMessage) {
  const provider = AI_PROVIDERS[providerId]
  const keys = getStoredKeys()
  const key = keys[providerId]

  if (!key) throw new Error(`No hay API key configurada para ${provider.name}`)

  if (providerId === 'claude') {
    return callClaude(provider, key, systemPrompt, userMessage)
  } else if (providerId === 'gemini') {
    return callGemini(provider, key, systemPrompt, userMessage)
  } else {
    // OpenAI-compatible: openai, deepseek
    return callOpenAICompatible(provider, key, systemPrompt, userMessage)
  }
}

async function callOpenAICompatible(provider, key, systemPrompt, userMessage) {
  const res = await fetch(provider.endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: provider.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
    }),
  })
  if (!res.ok) throw new Error(`${provider.name} error ${res.status}`)
  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? ''
}

async function callClaude(provider, key, systemPrompt, userMessage) {
  const res = await fetch(provider.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: provider.model,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  })
  if (!res.ok) throw new Error(`Claude error ${res.status}`)
  const data = await res.json()
  return data.content?.[0]?.text ?? ''
}

async function callGemini(provider, key, systemPrompt, userMessage) {
  const url = `${provider.endpoint}/${provider.model}:generateContent?key=${key}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `${systemPrompt}\n\n${userMessage}` }] }],
    }),
  })
  if (!res.ok) throw new Error(`Gemini error ${res.status}`)
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
}
