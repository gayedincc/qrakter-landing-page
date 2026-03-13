import { delay } from '../utils/helpers'

export async function submitLead(payload) {
  const endpoint = import.meta.env.VITE_FORM_ENDPOINT

  if (endpoint) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error('İletişim talebi gönderilemedi.')
    }

    return response.json().catch(() => ({ success: true }))
  }

  // Gelecekte API bağlantısı yapılırken bu alan doğrudan endpoint üzerinden çalışacak.
  await delay(900)

  if (import.meta.env.DEV) {
    console.log('QRAKTER lead:', payload)
  }

  return { success: true }
}
