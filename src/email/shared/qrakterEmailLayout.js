const DEFAULT_BRAND_NAME = 'QRAKTER'
const DEFAULT_HEADING_FONT = "'Poppins', 'Outfit', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
const DEFAULT_BODY_FONT = "'Outfit', 'Poppins', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"

const COLORS = {
  background: '#f4faef',
  cardBackground: '#ffffff',
  heading: '#1f6b4b',
  body: '#2e7d5b',
  border: '#cce5bc',
  primary: '#2e9e68',
  primaryDark: '#237c51',
  accent: '#a1d95c',
  mutedBackground: '#f7fdf1',
  footerBackground: '#0f3d2b',
  footerText: '#dff4df',
  footerSubtle: '#d2efd8',
  footerLink: '#ecf9e8',
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function normalizeOptionalText(value) {
  if (typeof value !== 'string') {
    return ''
  }

  return value.trim()
}

function buildLogoMarkup({ logoAlt, logoUrl }) {
  const normalizedLogoUrl = normalizeOptionalText(logoUrl)

  if (!normalizedLogoUrl) {
    return `<div style="font-family:${DEFAULT_HEADING_FONT};font-size:28px;line-height:1.1;font-weight:800;letter-spacing:0.08em;color:${COLORS.heading};text-transform:uppercase;text-align:center;">${DEFAULT_BRAND_NAME}</div>`
  }

  return `<img src="${escapeHtml(normalizedLogoUrl)}" alt="${escapeHtml(logoAlt)}" width="168" style="display:block;width:100%;max-width:168px;height:auto;border:0;margin:0 auto;" />`
}

function buildFooter({ currentYear }) {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background:${COLORS.footerBackground};border-collapse:separate;border-radius:0 0 24px 24px;">
      <tr>
        <td class="email-footer-stack" width="50%" valign="top" style="padding:28px 32px 18px;font-family:${DEFAULT_BODY_FONT};color:${COLORS.footerText};">
          <div style="font-family:${DEFAULT_HEADING_FONT};font-size:18px;line-height:1.2;font-weight:700;color:#ffffff;">QRAKTER</div>
          <div style="margin-top:10px;font-size:14px;line-height:1.7;color:${COLORS.footerSubtle};">
            Trafik kazası anında yönlendirme, bilgi toplama ve dijital süreç yönetimini kolaylaştıran akıllı yardım uygulaması.
          </div>
        </td>
        <td class="email-footer-stack" width="50%" valign="top" style="padding:28px 32px 18px;font-family:${DEFAULT_BODY_FONT};color:${COLORS.footerText};">
          <div style="font-family:${DEFAULT_HEADING_FONT};font-size:16px;line-height:1.2;font-weight:700;color:#ffffff;">İletişim</div>
          <div style="margin-top:10px;font-size:14px;line-height:1.75;color:${COLORS.footerSubtle};">
            <div>Telefon: 0 (216) 906 20 66</div>
            <div>Adresimiz: Soğanlık Yeni Mah. Aliağa Sok. No:8 K:24 D:159 Bumerang Towers Kartal/İstanbul</div>
            <div>Resmi E-posta: bilgi@zayfix.com</div>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="2" style="padding:0 32px 12px;text-align:center;font-family:${DEFAULT_BODY_FONT};font-size:14px;line-height:1.6;color:${COLORS.footerText};">
          <a href="https://app.zayfix.com/gizlilik-politikasi.html" style="color:${COLORS.footerLink};text-decoration:underline;text-underline-offset:3px;font-weight:600;">Gizlilik Politikası</a>
        </td>
      </tr>
      <tr>
        <td colspan="2" style="padding:0 32px 28px;text-align:center;font-family:${DEFAULT_BODY_FONT};font-size:13px;line-height:1.6;color:${COLORS.footerSubtle};">
          © ${escapeHtml(currentYear)} QRAKTER. Tüm hakları saklıdır.
        </td>
      </tr>
    </table>
  `
}

export function renderQrakterEmailLayout({
  bodyHtml,
  currentYear = new Date().getFullYear(),
  logoAlt = 'QRakter logosu',
  logoUrl,
  preheader,
  title,
}) {
  return `<!doctype html>
<html lang="tr" xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light only" />
    <meta name="supported-color-schemes" content="light only" />
    <title>${escapeHtml(title)}</title>
    <style>
      body, table, td, a {
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }

      table, td {
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
      }

      img {
        -ms-interpolation-mode: bicubic;
      }

      a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: none !important;
      }

      @media screen and (max-width: 640px) {
        .email-shell {
          width: 100% !important;
        }

        .email-card-body,
        .email-header,
        .email-footer-stack {
          padding-left: 20px !important;
          padding-right: 20px !important;
        }

        .email-card-body {
          padding-top: 24px !important;
          padding-bottom: 24px !important;
        }

        .email-footer-stack {
          display: block !important;
          width: 100% !important;
          padding-top: 20px !important;
          padding-bottom: 8px !important;
        }

        .email-cta-link {
          display: block !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }

        .email-hero-copy {
          display: block !important;
          width: 100% !important;
        }

        .email-hero-mascot {
          display: block !important;
          width: 100% !important;
          text-align: center !important;
          padding-bottom: 16px !important;
        }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background:${COLORS.background};word-break:break-word;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;visibility:hidden;font-size:1px;line-height:1px;color:${COLORS.background};">
      ${escapeHtml(preheader)}
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background:${COLORS.background};border-collapse:collapse;">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="email-shell" style="width:100%;max-width:600px;border-collapse:separate;">
            <tr>
              <td style="border:1px solid ${COLORS.border};border-radius:24px;background:${COLORS.cardBackground};overflow:hidden;box-shadow:0 8px 28px rgba(46, 158, 104, 0.12);">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:separate;">
                  <tr>
                    <td class="email-header" style="padding:32px 32px 22px;background:linear-gradient(180deg, #ffffff 0%, ${COLORS.mutedBackground} 100%);border-bottom:1px solid ${COLORS.border};text-align:center;">
                      ${buildLogoMarkup({ logoAlt, logoUrl })}
                    </td>
                  </tr>
                  <tr>
                    <td class="email-card-body" style="padding:32px 32px 28px;font-family:${DEFAULT_BODY_FONT};color:${COLORS.body};font-size:16px;line-height:1.75;">
                      ${bodyHtml}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0;">
                      ${buildFooter({ currentYear })}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

export function escapeEmailHtml(value) {
  return escapeHtml(value)
}

export function normalizeEmailText(value) {
  return normalizeOptionalText(value)
}

export const qrakterEmailPalette = COLORS