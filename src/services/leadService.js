const API_URL = 'https://ktt.everionai.com/api/v1/external/contacts/'
const EXTERNAL_CONTACTS_TOKEN = import.meta.env.VITE_EXTERNAL_CONTACTS_TOKEN || ''

export async function submitLead(payload) {
  if (!EXTERNAL_CONTACTS_TOKEN) {
    throw new Error('İletişim talebi gönderilemedi.')
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-External-Token': EXTERNAL_CONTACTS_TOKEN,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('İletişim talebi gönderilemedi.')
  }

  return response.json()
}
