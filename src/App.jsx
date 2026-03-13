import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import Benefits from './components/Benefits'
import QRCodeAccess from './components/QRCodeAccess'
import ContactForm from './components/ContactForm'
import Footer from './components/Footer'
import ScrollToTopButton from './components/ScrollToTopButton'
import './styles/landing.css'

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Benefits />
        <QRCodeAccess />
        <ContactForm />
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  )
}

export default App
