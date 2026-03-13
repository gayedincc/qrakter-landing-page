import { useState } from 'react'
import { submitLead } from '../services/leadService'
import { validateLeadForm } from '../utils/validators'

const initialFormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
}

function ContactForm() {
  const [formData, setFormData] = useState(initialFormState)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }))

    setSubmitError('')
    setIsSubmitted(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const validation = validateLeadForm(formData)
    const hasErrors = Object.keys(validation.errors).length > 0

    if (hasErrors) {
      setErrors(validation.errors)
      return
    }

    setErrors({})
    setIsSubmitting(true)

    try {
      await submitLead(validation.payload)
      setIsSubmitted(true)
      setFormData(initialFormState)
    } catch {
      setSubmitError('Talebiniz şu an iletilemedi. Lütfen daha sonra tekrar deneyiniz.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="iletisim" className="section contact-section">
      <div className="container contact-grid">
        <div className="contact-content">
          <p className="eyebrow">İletişim</p>
          <h2>QRAKTER’in offline akışını ve QR senaryolarını yakından inceleyin.</h2>
          <p>
            Bilgilerinizi bırakın, ekibimiz size en kısa sürede ulaşsın. Profil, evrak, tutanak ve
            rol bazlı QR akışlarının ürününüze veya kurumunuza nasıl uyarlanabileceğini birlikte değerlendirelim.
          </p>

          <div className="contact-info-list" aria-label="İletişim bilgileri">
            <div className="contact-info-item">
              <span>Telefon</span>
              <strong>0 (216) 906 20 66</strong>
            </div>
            <div className="contact-info-item">
              <span>Adresimiz</span>
              <strong>Soğanlık Yeni Mah. Aliağa Sok. No:8 K:24 D:159 Bumerang Towers Kartal/İstanbul</strong>
            </div>
            <div className="contact-info-item">
              <span>Resmi E-posta</span>
              <strong>bilgi@zayfix.com</strong>
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <label htmlFor="firstName">Ad *</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              placeholder="Örnek: Ahmet"
              value={formData.firstName}
              onChange={handleChange}
              aria-invalid={Boolean(errors.firstName)}
              aria-describedby={errors.firstName ? 'firstName-error' : undefined}
            />
            {errors.firstName ? (
              <p id="firstName-error" className="error-message" role="alert">
                {errors.firstName}
              </p>
            ) : null}
          </div>

          <div className="form-row">
            <label htmlFor="lastName">Soyad *</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              placeholder="Örnek: Demir"
              value={formData.lastName}
              onChange={handleChange}
              aria-invalid={Boolean(errors.lastName)}
              aria-describedby={errors.lastName ? 'lastName-error' : undefined}
            />
            {errors.lastName ? (
              <p id="lastName-error" className="error-message" role="alert">
                {errors.lastName}
              </p>
            ) : null}
          </div>

          <div className="form-row">
            <label htmlFor="email">E-posta *</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="ornek@firma.com"
              value={formData.email}
              onChange={handleChange}
              required
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email ? (
              <p id="email-error" className="error-message" role="alert">
                {errors.email}
              </p>
            ) : null}
          </div>

          <div className="form-row">
            <label htmlFor="phone">Telefon *</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="05XX XXX XX XX"
              value={formData.phone}
              onChange={handleChange}
              required
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
            />
            {errors.phone ? (
              <p id="phone-error" className="error-message" role="alert">
                {errors.phone}
              </p>
            ) : null}
          </div>

          <button className="btn btn-primary full-width" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Gönderiliyor...' : 'Bilgi Talebi Gönder'}
          </button>

          {submitError ? (
            <p className="error-message" role="alert">
              {submitError}
            </p>
          ) : null}

          {isSubmitted ? (
            <p className="success-message" role="status" aria-live="polite">
              Bilgileriniz başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.
            </p>
          ) : null}
        </form>
      </div>
    </section>
  )
}

export default ContactForm
