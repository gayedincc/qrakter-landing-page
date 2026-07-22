import {
  escapeEmailHtml,
  normalizeEmailText,
  qrakterEmailPalette,
  renderQrakterEmailLayout,
} from '../shared/qrakterEmailLayout.js'

const SUBJECT = 'Bugün Şans Çarkı’nı çevirdin mi?'
const PREHEADER = 'Günlük çark hakkını kullan, biletlerini kazanma fırsatını kaçırma.'

function buildGreeting(userName) {
  const normalizedName = normalizeEmailText(userName)

  if (!normalizedName) {
    return 'Merhaba,'
  }

  return `Merhaba ${escapeEmailHtml(normalizedName)},`
}

function buildTextVersion({ greeting, wheelUrl }) {
  return [
    greeting.replace(/<[^>]+>/g, ''),
    '',
    'Bugünkü çark hakkın seni bekliyor!',
    '',
    'Şans Çarkı’nı çevirerek günlük biletini kazanmayı unutma. Kazandığın biletler aktif hediyelerde şansını artırır.',
    '',
    'Şans Çarkı’nı Çevir:',
    wheelUrl,
    '',
    'Günlük çark hakkı her gün yenilenir. Hakkını kullandıysan bu e-postayı dikkate almayabilirsin.',
    '',
    'Bu e-postaları almak istemiyorsan QRakter’de Profilim ekranına giderek Bildirim Ayarları bölümünden e-posta bildirimlerini kapatabilirsin.',
  ].join('\n')
}

function buildHeroBlock({ greeting, heading, description, mascotUrl }) {
  const normalizedMascotUrl = normalizeEmailText(mascotUrl)
  const safeUrl = normalizedMascotUrl ? escapeEmailHtml(normalizedMascotUrl) : ''

  if (!safeUrl) {
    return `
      <p style="margin:0 0 18px;font-size:16px;line-height:1.75;color:${qrakterEmailPalette.body};">${greeting}</p>
      <h1 style="margin:0 0 14px;font-family:'Poppins', 'Outfit', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;font-size:30px;line-height:1.18;font-weight:700;letter-spacing:-0.02em;color:${qrakterEmailPalette.heading};">${heading}</h1>
      <p style="margin:0 0 26px;font-size:16px;line-height:1.8;color:${qrakterEmailPalette.body};">${description}</p>
    `
  }

  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 0;border-collapse:separate;">
      <tr>
        <td class="email-hero-copy" valign="top" style="padding-right:20px;">
          <p style="margin:0 0 14px;font-size:16px;line-height:1.75;color:${qrakterEmailPalette.body};">${greeting}</p>
          <h1 style="margin:0 0 14px;font-family:'Poppins', 'Outfit', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;font-size:26px;line-height:1.2;font-weight:700;letter-spacing:-0.02em;color:${qrakterEmailPalette.heading};">${heading}</h1>
          <p style="margin:0 0 26px;font-size:15px;line-height:1.8;color:${qrakterEmailPalette.body};">${description}</p>
        </td>
        <td class="email-hero-mascot" valign="bottom" width="170" style="width:170px;min-width:170px;text-align:center;padding-bottom:2px;">
          <img src="${safeUrl}" alt="" width="160" style="display:block;width:160px;height:auto;max-height:200px;border:0;margin:0 auto;object-fit:contain;" />
        </td>
      </tr>
    </table>
  `
}

export function createDailyWheelReminderEmail({ currentYear, logoUrl, mascotUrl, userName, wheelUrl }) {
  const normalizedWheelUrl = normalizeEmailText(wheelUrl)

  if (!normalizedWheelUrl) {
    throw new Error('Daily wheel reminder email requires a wheelUrl value.')
  }

  const greeting = buildGreeting(userName)
  const safeWheelUrl = escapeEmailHtml(normalizedWheelUrl)
  const heroHtml = buildHeroBlock({
    greeting,
    heading: 'Bugünkü çark hakkın seni bekliyor!',
    description: 'Şans Çarkı\'nı çevirerek günlük biletini kazanmayı unutma. Kazandığın biletler aktif hediyelerde şansını artırır.',
    mascotUrl,
  })
  const bodyHtml = `
    <div style="font-family:'Outfit', 'Poppins', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;font-size:16px;line-height:1.75;color:${qrakterEmailPalette.body};">
      ${heroHtml}
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 22px;border-collapse:separate;">
        <tr>
          <td align="center" bgcolor="${qrakterEmailPalette.primaryDark}" style="border-radius:14px;background:linear-gradient(90deg, ${qrakterEmailPalette.primaryDark} 0%, ${qrakterEmailPalette.primary} 100%);box-shadow:0 10px 24px rgba(46, 158, 104, 0.24);">
            <a href="${safeWheelUrl}" target="_blank" rel="noopener noreferrer" class="email-cta-link" style="display:inline-block;padding:16px 28px;font-family:'Poppins', 'Outfit', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;font-size:16px;line-height:1.2;font-weight:700;color:#ffffff;text-decoration:none;border-radius:14px;min-height:24px;">Şans Çarkı’nı Çevir</a>
          </td>
        </tr>
      </table>
      <p style="margin:0 0 8px;font-size:14px;line-height:1.7;color:${qrakterEmailPalette.body};">Buton çalışmıyorsa aşağıdaki bağlantıyı tarayıcında açabilirsin:</p>
      <p style="margin:0 0 24px;font-size:14px;line-height:1.7;"><a href="${safeWheelUrl}" target="_blank" rel="noopener noreferrer" style="color:${qrakterEmailPalette.primaryDark};text-decoration:underline;word-break:break-all;overflow-wrap:anywhere;">${safeWheelUrl}</a></p>
      <div style="margin:0 0 24px;padding:14px 16px;background:${qrakterEmailPalette.mutedBackground};border:1px solid ${qrakterEmailPalette.border};border-radius:14px;font-size:14px;line-height:1.7;color:${qrakterEmailPalette.body};">
        Günlük çark hakkı her gün yenilenir. Hakkını kullandıysan bu e-postayı dikkate almayabilirsin.
      </div>
      <p style="margin:0;font-size:14px;line-height:1.75;color:${qrakterEmailPalette.body};">Bu e-postaları almak istemiyorsan QRakter’de Profilim ekranına giderek Bildirim Ayarları bölümünden e-posta bildirimlerini kapatabilirsin.</p>
    </div>
  `

  return {
    html: renderQrakterEmailLayout({
      bodyHtml,
      currentYear,
      logoAlt: 'QRakter logosu',
      logoUrl,
      preheader: PREHEADER,
      title: SUBJECT,
    }),
    preheader: PREHEADER,
    subject: SUBJECT,
    text: buildTextVersion({ greeting, wheelUrl: normalizedWheelUrl }),
  }
}

export const dailyWheelReminderEmailMeta = {
  subject: SUBJECT,
  preheader: PREHEADER,
  requiredParams: ['wheelUrl'],
  optionalParams: ['userName', 'currentYear', 'logoUrl', 'mascotUrl'],
}