const API_URL = 'https://ktt.everionai.com/api/v1/external/contacts/'
const API_TOKEN = 'hx1w8aZhvq6WOgfWmCZleF9WUULwIay5f7LQ8JVI'

export async function submitLead(payload) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-External-Token': API_TOKEN,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('İletişim talebi gönderilemedi.')
  }

  return response.json()
}
