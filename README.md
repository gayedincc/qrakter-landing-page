# QRAKTER Landing Page

QRAKTER uygulamasını tanıtan, React + Vite + JavaScript ile geliştirilmiş modern ve responsive bir landing page projesidir.

## Teknoloji

- React
- Vite
- JavaScript (TypeScript kullanılmadı)
- Custom CSS

## Proje Yapısı

```text
src/
	components/
		Navbar.jsx
		Hero.jsx
		Features.jsx
		HowItWorks.jsx
		Benefits.jsx
		CTASection.jsx
		ContactForm.jsx
		Footer.jsx
	services/
		leadService.js
	styles/
		landing.css
	utils/
		helpers.js
		validators.js
	App.jsx
	index.css
	main.jsx
```

## Kurulum

```bash
npm install
```

## Geliştirme Ortamı

```bash
npm run dev
```

## Production Build

```bash
npm run build
```

## Build Önizleme

```bash
npm run preview
```

## Form Entegrasyonu Notu

Form gönderimi şu an mock submit ile çalışır. Gelecekte API entegrasyonu için `.env` dosyasında aşağıdaki değişken tanımlanabilir:

```bash
VITE_FORM_ENDPOINT=https://ornek-endpoint.com/lead
```

Tanımlandığında form verisi bu endpoint'e `POST` edilir.
