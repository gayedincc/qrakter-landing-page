export function normalizePhoneNumber(value) {
  if (!value) {
    return ''
  }

  const digitsOnly = value.replace(/[^\d]/g, '')
  let digits = digitsOnly

  if (digits.startsWith('90') && digits.length === 12) {
    digits = digits.slice(2)
  }

  if (digits.startsWith('0') && digits.length === 11) {
    digits = digits.slice(1)
  }

  if (digits.length === 10 && digits.startsWith('5')) {
    return `+90${digits}`
  }

  return ''
}

export function sanitizeOptionalText(value) {
  return value ? value.trim() : ''
}

export function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
