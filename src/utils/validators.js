import { normalizePhoneNumber, sanitizeOptionalText } from './helpers'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(value) {
  return EMAIL_REGEX.test(value)
}

export function validateLeadForm(formData) {
  const errors = {}

  const firstName = sanitizeOptionalText(formData.firstName)
  const lastName = sanitizeOptionalText(formData.lastName)
  const email = sanitizeOptionalText(formData.email)
  const phone = sanitizeOptionalText(formData.phone)
  const normalizedPhone = normalizePhoneNumber(phone)

  if (!email || !isValidEmail(email)) {
    errors.email = 'Geçerli bir e-posta adresi giriniz.'
  }

  if (!phone || !normalizedPhone) {
    errors.phone = 'Geçerli bir telefon numarası giriniz.'
  }

  if (firstName && firstName.length < 2) {
    errors.firstName = 'Ad alanı en az 2 karakter olmalıdır.'
  }

  if (lastName && lastName.length < 2) {
    errors.lastName = 'Soyad alanı en az 2 karakter olmalıdır.'
  }

  return {
    errors,
    normalizedPhone,
    payload: {
      firstName,
      lastName,
      email,
      phone: normalizedPhone,
    },
  }
}
