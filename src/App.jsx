import { useState, useRef, useEffect } from 'react'
import './index.css'
import { useIsTurkeyVisitor } from './useIsTurkeyVisitor'
import { useLang, LANG_LIST } from './i18n'

const B = import.meta.env.BASE_URL
const LOGO = 'https://imeclinic.com/assets/img/logo.svg'
const WA = 'https://wa.me/905465248334'
const PHONE = 'tel:+905465248334'

/* ─────────── SVG ICON MAP ─────────── */
const ICONS = {
  diamond: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z"/></svg>,
  tooth: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5.5c-1.5-2-4-2.5-5.5-1S4.5 8 6 10c1 1.5 2 3.5 2 6 0 2 1 4 2 4s1.5-1 2-3c.5 2 1 3 2 3s2-2 2-4c0-2.5 1-4.5 2-6 1.5-2 1-4-.5-5.5S13.5 3.5 12 5.5z"/></svg>,
  sparkles: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>,
  layers: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 12.5-8.97 4.08a2 2 0 0 1-1.66 0L2 12.5"/><path d="m22 17.5-8.97 4.08a2 2 0 0 1-1.66 0L2 17.5"/></svg>,
  wrench: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z"/></svg>,
  sun: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>,
  hospital: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6v4"/><path d="M14 14h-4"/><path d="M14 18h-4"/><path d="M14 8h-4"/><path d="M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2"/><path d="M18 22V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v18"/></svg>,
  wallet: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>,
  plane: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2Z"/></svg>,
  globe: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>,
  shield: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>,
  camera: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z"/><circle cx="12" cy="13" r="3"/></svg>,
  clipboard: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>,
  smile: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>,
  star: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"/></svg>,
  trophy: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>,
  award: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/></svg>,
  film: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg>,
  hotel: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z"/><path d="m9 16 .348-.24c1.465-1.013 3.84-1.013 5.304 0L15 16"/><path d="M8 7h.01"/><path d="M16 7h.01"/><path d="M12 7h.01"/><path d="M12 11h.01"/><path d="M16 11h.01"/><path d="M8 11h.01"/><path d="M10 22v-6.5m4 0V22"/></svg>,
  mapPin: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>,
}

/* ─────────── BEFORE / AFTER DATA ─────────── */
const BA_ITEMS = [
  { image: `${B}before-after/1.webp`, text: 'Hollywood Smile' },
  { image: `${B}before-after/2.webp`, text: 'Dental Implants' },
  { image: `${B}before-after/3.webp`, text: 'Zirconium Crowns' },
  { image: `${B}before-after/4.webp`, text: 'Smile Makeover' },
  { image: `${B}before-after/5.webp`, text: 'Laminate Veneers' },
  { image: `${B}before-after/6.webp`, text: 'Full Mouth Rehab' },
  { image: `${B}before-after/7.webp`, text: 'Hollywood Smile' },
  { image: `${B}before-after/8.webp`, text: 'Dental Implants' },
  { image: `${B}before-after/9.webp`, text: 'Smile Makeover' },
  { image: `${B}before-after/10.webp`, text: 'Zirconium Crowns' },
]

/* ─────────── PRICES ─────────── */
const TREATMENTS = [
  { icon: 'diamond', name: 'Hollywood Smile (20 Zirconia)', price: '€2,550', oldPrice: '€7,500', tag: 'Most Popular', image: `${B}treatments-dental/hollywood-smile.png` },
  { icon: 'tooth', name: 'Dental Implant (Straumann)', price: 'from €490', oldPrice: '€1,800', tag: '', image: `${B}treatments-dental/dental-implant.png` },
  { icon: 'sparkles', name: 'Zirconium Crown', price: '€99', oldPrice: '€450', tag: 'Best Value', image: `${B}treatments-dental/zirconium-crown.png` },
  { icon: 'layers', name: 'E.max Laminate Veneer', price: '€165', oldPrice: '€600', tag: '', image: `${B}treatments-dental/laminate-veneer.png` },
  { icon: 'wrench', name: 'All-on-4 Full Arch', price: 'from €3,200', oldPrice: '€12,000', tag: '', image: `${B}treatments-dental/all-on-four.png` },
  { icon: 'sun', name: 'Teeth Whitening', price: '€150', oldPrice: '€400', tag: '', image: `${B}treatments-dental/teeth-whitening.png` },
]

/* ─────────── REEL VIDEOS ─────────── */
const REEL_VIDEOS = [
  'https://www.imeclinic.com/dental-hospital-videos/Klinik-BHT-kisa-dis-1-web.mp4',
  'https://www.imeclinic.com/dental-hospital-videos/Klinik-BHT-kisa-dis-2-web.mp4',
  'https://www.imeclinic.com/dental-hospital-videos/Klinik-BHT-kisa-dis-3-web.mp4',
  'https://www.imeclinic.com/dental-hospital-videos/Klinik-BHT-kisa-dis-4-web.mp4',
]

/* ─────────── CERTIFICATES ─────────── */
const CERTS = [
  { name: 'JCI Accreditation', desc: 'Global gold standard — 1,000+ quality standards', logo: `${B}logos/logo-jci.png`, cert: `${B}logos/jci.jpg`, color: '#1a6fb5' },
  { name: 'TEMOS International', desc: 'Europe\'s leading medical tourism certification', logo: `${B}logos/hero_temos.png`, cert: `${B}logos/temos.jpg`, color: '#F97316' },
  { name: 'ISO 9001:2015', desc: 'International quality management system', logo: `${B}logos/iso.svg`, cert: `${B}logos/iso.jpg`, color: '#DC5A1E' },
  { name: 'Diplomatic Council', desc: 'Preferred partner hospital for 180+ countries', logo: `${B}logos/dc.webp`, cert: `${B}logos/dc.jpg`, color: '#2B6CB0' },
  { name: 'LEED Gold', desc: 'U.S. Green Building Council certified', logo: `${B}logos/leedgold.webp`, cert: `${B}logos/leedgold.jpg`, color: '#16A34A' },
  { name: 'EFQM Excellence', desc: 'European organizational excellence model', logo: `${B}logos/efqm.webp`, cert: `${B}logos/efgm.jpg`, color: '#B45309' },
  { name: 'Turquality', desc: 'Turkish Ministry of Trade brand support', logo: `${B}logos/turquality-LOGO-01.webp`, cert: null, color: '#F59E0B' },
  { name: 'Health Tourism License', desc: 'Official Turkish Ministry of Health authorization', logo: `${B}logos/saglikturizmi.png`, cert: `${B}logos/ushas.jpg`, color: '#059669' },
]

/* ─────────── GALLERY ─────────── */
const GALLERY = [
  { src: `${B}gallery/lobby-reception.webp`, label: 'Main Lobby & Reception' },
  { src: `${B}gallery/surgery-room.webp`, label: 'Operating Room' },
  { src: `${B}gallery/dental-unit.webp`, label: 'Dental Unit' },
  { src: `${B}gallery/waiting-lounge.webp`, label: 'Polyclinic Floor' },
  { src: `${B}gallery/lobby-lounge.webp`, label: 'Lobby Lounge' },
  { src: `${B}gallery/dental-consultation.webp`, label: 'Consultation Room' },
  { src: `${B}gallery/dental-unit-green.webp`, label: 'Dental Clinic' },
  { src: `${B}gallery/restaurant-cafe.webp`, label: 'Restaurant & Café' },
]

/* ─────────── HOTELS ─────────── */
const HOTELS = [
  { name: 'Marriott Executive Apartments', stars: 5, km: '2 km', images: Array.from({ length: 4 }, (_, i) => `${B}hotels/marriot/${i + 1}.jpeg`), booking: 'https://www.marriott.com' },
  { name: 'Elite World Grand', stars: 5, km: '3 km', images: Array.from({ length: 4 }, (_, i) => `${B}hotels/elite_world_basin_ekspress/${i + 1}.webp`), booking: 'https://www.eliteworldhotels.com.tr' },
  { name: 'Rotta Hotel', stars: 5, km: '4 km', images: Array.from({ length: 4 }, (_, i) => `${B}hotels/rotta/${i + 1}.webp`), booking: 'https://www.rottahotel.com.tr' },
  { name: 'Hilton Mall of Istanbul', stars: 5, km: '12 km', images: Array.from({ length: 4 }, (_, i) => `${B}hotels/hilton_mall_of/${i + 1}.webp`), booking: 'https://www.hilton.com' },
]

/* ─────────── WHY US ─────────── */
const WHY_US = [
  { icon: 'hospital', title: 'JCI Accredited Hospital', desc: 'All treatments performed in a globally accredited, world-class hospital facility.' },
  { icon: 'wallet', title: 'Save Up To 70%', desc: 'Same quality treatments at a fraction of UK & EU prices with transparent pricing.' },
  { icon: 'plane', title: 'All-Inclusive Packages', desc: 'VIP transfer, luxury hotel, personal coordinator — everything arranged for you.' },
  { icon: 'tooth', title: 'German Implants', desc: 'We use only premium materials: Straumann, Ivoclar E.max, and CAD/CAM technology.' },
  { icon: 'globe', title: '40+ Countries Served', desc: 'Thousands of happy patients from across Europe, Middle East, and beyond.' },
  { icon: 'shield', title: 'Lifetime Guarantee', desc: 'All our implant and veneer treatments come with a written lifetime guarantee.' },
]

/* ─────────── PROCESS STEPS ─────────── */
const STEPS = [
  { n: '01', icon: 'camera', title: 'Send Your Photos', desc: 'Share your dental photos via WhatsApp for a free assessment and personalized treatment plan.', image: `${B}steps/step-1.png` },
  { n: '02', icon: 'clipboard', title: 'Get Your Plan & Price', desc: 'Receive a detailed treatment plan with transparent pricing — no hidden fees, ever.', image: `${B}steps/step-2.png` },
  { n: '03', icon: 'plane', title: 'Fly to Istanbul', desc: 'We arrange your VIP airport transfer, luxury hotel stay, and all appointments.', image: `${B}steps/step-3.png` },
  { n: '04', icon: 'tooth', title: 'Get Treatment', desc: 'Your treatment is performed by specialist dentists in our JCI-accredited hospital.', image: `${B}steps/step-4.png` },
  { n: '05', icon: 'smile', title: 'Fly Home Smiling', desc: 'Leave Istanbul with your perfect smile and enjoy lifetime follow-up support.', image: `${B}steps/step-5.png` },
]


/* ══════════════════════════════════════════════════════
   COMPONENTS
   ══════════════════════════════════════════════════════ */

/* ── TOP BANNER ── */
function TopBanner({ onGetQuote, isTR, t }) {
  return (
    <div className="top-banner">
      <div className="top-banner-inner">
        <div className="top-banner-text">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" />
          </svg>
          <span>{isTR ? t.topBanner.textTR : t.topBanner.text}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
        <button onClick={onGetQuote} className="top-banner-btn">
          {t.topBanner.btn}
        </button>
      </div>
    </div>
  )
}

/* ── FLOATING CTA ── */
function FloatingCTA({ onGetQuote, t }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  if (!visible) return null
  return (
    <div className="floating-cta">
      <a href={WA} target="_blank" rel="noopener noreferrer" className="btn-wa">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        <span>Free Consultation</span>
      </a>
      <a href={PHONE} className="btn-phone">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
      </a>
    </div>
  )
}

/* ── NAVBAR ── */
function Navbar({ t }) {
  const { lang, setLang } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const links = [
    ['#treatments', t.nav.treatments],
    ['#before-after', t.ba?.label || 'Results'],
    ['#why-us', t.why?.label || 'Why Us'],
    ['#hospital', t.gallery?.label || 'Hospital'],
    ['#certificates', t.nav.certificates],
    ['#hotels', t.nav.hotels],
  ]

  const currentLang = LANG_LIST.find(l => l.code === lang) || LANG_LIST[0]

  return (
    <>
      <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-inner">
          <a href="#" className="nav-logo">
            <img src={LOGO} alt="IME Clinic" />
          </a>
          <nav className="nav-links">
            {links.map(([h, l]) => <a key={h} href={h}>{l}</a>)}
          </nav>
          <div className="nav-right">
            {/* Language Selector */}
            <div className="lang-selector" onMouseLeave={() => setLangOpen(false)}>
              <button className="lang-btn" onClick={() => setLangOpen(!langOpen)}>
                <span>{currentLang.flag}</span>
                <span className="lang-code">{lang.toUpperCase()}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              {langOpen && (
                <div className="lang-dropdown">
                  {LANG_LIST.map(l => (
                    <button key={l.code} className={`lang-option ${l.code === lang ? 'active' : ''}`} onClick={() => { setLang(l.code); setLangOpen(false) }}>
                      <span>{l.flag}</span> {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <a href={WA} target="_blank" rel="noopener noreferrer" className="nav-cta">
              {t.hero.cta}
            </a>
            <button className="hamburger" onClick={() => setMenuOpen(true)} aria-label="Menu">
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <div className="mm-header">
          <img src={LOGO} alt="IME Clinic" style={{ height: 32 }} />
          <button className="mm-close" onClick={() => setMenuOpen(false)} aria-label="Close">
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        <nav className="mm-nav">
          {links.map(([h, l], i) => (
            <a key={h} href={h} className="mm-link" onClick={() => setMenuOpen(false)} style={{ animationDelay: `${i * 0.04}s` }}>
              <span className="mm-label">{l}</span>
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
            </a>
          ))}
          {/* Mobile language selector */}
          <div className="mm-lang">
            {LANG_LIST.map(l => (
              <button key={l.code} className={`mm-lang-btn ${l.code === lang ? 'active' : ''}`} onClick={() => { setLang(l.code); setMenuOpen(false) }}>
                {l.flag}
              </button>
            ))}
          </div>
        </nav>
        <div className="mm-footer">
          <a href={WA} target="_blank" rel="noopener noreferrer" className="btn-wa mm-wa">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            {t.hero.cta}
          </a>
        </div>
      </div>
    </>
  )
}


/* ── HERO ── */
function Hero({ onGetQuote, t }) {
  const BG_IMAGES = [
    `${B}banners/banner-3_new.jpg`,
    `${B}banners/banner-1_new.jpg`,
    `${B}banners/banner-2_new.jpg`,
    `${B}banners/banner-4_new.jpg`,
  ]
  const [bgIdx, setBgIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setBgIdx(i => (i + 1) % BG_IMAGES.length), 5000)
    return () => clearInterval(t)
  }, [])

  const STATS = [
    { value: '40+', label: 'Countries', icon: 'globe' },
    { value: '5,000+', label: 'Happy Patients', icon: 'smile' },
    { value: '70%', label: 'Cost Savings', icon: 'wallet' },
    { value: '15+', label: 'Years Experience', icon: 'star' },
  ]

  const TRUST_LOGOS = [
    { src: `${B}hero-logos/hero_jci.png`, alt: 'JCI' },
    { src: `${B}hero-logos/hero_temos.png`, alt: 'TEMOS' },
    { src: `${B}hero-logos/organization-iso-9000-iso-9001-2015-certification-iso-9001-text-trademark-logo-thumbnail-Co_n4v9T.webp`, alt: 'ISO' },
    { src: `${B}hero-logos/hero_leed.png`, alt: 'LEED Gold' },
    { src: `${B}hero-logos/hero_efqm.png`, alt: 'EFQM' },
    { src: `${B}hero-logos/turquality-LOGO-01-CXu78bha.webp`, alt: 'Turquality' },
  ]

  return (
    <section className="hero">
      {BG_IMAGES.map((src, i) => (
        <div key={i} className={`hero-bg ${bgIdx === i ? 'active' : ''}`}>
          <img src={src} alt="" />
        </div>
      ))}
      <div className="hero-overlay" />

      {/* Decorative orbs */}
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />
      <div className="hero-orb hero-orb-3" />

      <div className="hero-content">
        {/* Left — main content — NO container */}
        <div className="hero-left">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            {t.hero.badge}
          </div>
          <h1 className="hero-title">
            {t.hero.title1}<br />
            {t.hero.title2Split ? t.hero.title2Split : <>{t.hero.title2Pre || ''} <span className="hero-gradient-text">{t.hero.title2HL || 'Istanbul'}</span></>}
          </h1>
          <p className="hero-desc" dangerouslySetInnerHTML={{ __html: t.hero.desc }} />
          <div className="hero-ctas">
            <button onClick={onGetQuote} className="btn-primary">
              {t.hero.cta}
            </button>
            <a href="#treatments" className="btn-secondary">
              <span>{t.hero.viewPrices || 'View Prices'}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
            </a>
          </div>
        </div>
      </div>

      {/* Trust logos strip — frosted glass */}
      <div className="hero-trust-strip">
        <div className="hero-trust-inner">
          <span className="hero-trust-label">{t.hero.trustLabel || 'Internationally Accredited'}</span>
          <div className="hero-trust-logos">
            {TRUST_LOGOS.map((logo, i) => (
              <div key={i} className="hero-trust-logo">
                <img src={logo.src} alt={logo.alt} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="hero-dots">
        {BG_IMAGES.map((_, i) => (
          <button key={i} className={`hero-dot ${bgIdx === i ? 'active' : ''}`} onClick={() => setBgIdx(i)} />
        ))}
      </div>
    </section>
  )
}


/* ── TRUST MARQUEE ── */
function TrustStripe({ t }) {
  const items = ['Save Up To 70%', 'JCI Accredited Hospital', 'Lifetime Guarantee', 'German Implants', '5-Star Hotels', 'VIP Airport Transfer', 'Free Consultation', '40+ Countries Served', 'CAD/CAM Technology', 'No Hidden Fees']
  const d = [...items, ...items, ...items]
  return (
    <div className="trust-stripe">
      <div className="trust-track">
        {d.map((t, i) => (
          <div key={i} className="trust-item">
            <span className="trust-dot" />
            <span>{t}</span>
          </div>
        ))}
      </div>
    </div>
  )
}


/* ── TREATMENT PRICES ── */
function TreatmentPrices({ t }) {
  return (
    <section id="treatments" className="section treatments-section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">{ICONS.diamond} Transparent Pricing</span>
          <h2>Treatment <span className="gold">Prices</span></h2>
          <p>Premium dental care at unbeatable prices. All treatments include personal coordinator, hotel assistance, and VIP transfers.</p>
        </div>
        <div className="price-grid">
          {TREATMENTS.map((t, i) => (
            <div key={i} className={`price-card ${t.tag ? 'price-card--featured' : ''}`}>
              <div className="price-card-img">
                <img src={t.image} alt={t.name} loading="lazy" />
                {t.tag && <span className="price-tag">{t.tag}</span>}
              </div>
              <div className="price-card-body">
                <h3>{t.name}</h3>
                <div className="price-row">
                  <span className="price-old">{t.oldPrice}</span>
                  <span className="price-new">{t.price}</span>
                </div>
                <a href={WA} target="_blank" rel="noopener noreferrer" className="price-btn">
                  Get Quote →
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="price-note">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          <span>Prices are indicative. Final pricing is determined after clinical examination. No hidden fees — guaranteed.</span>
        </div>
      </div>
    </section>
  )
}


/* ── BEFORE / AFTER GALLERY ── */
function BeforeAfterGallery({ onGetQuote, t }) {
  const trackRef = useRef(null)
  const [activeIdx, setActiveIdx] = useState(0)

  const scroll = (dir) => {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector('.ba-slide')
    if (!card) return
    const w = card.offsetWidth + 16
    track.scrollBy({ left: dir * w, behavior: 'smooth' })
  }

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const onScroll = () => {
      const card = track.querySelector('.ba-slide')
      if (!card) return
      const w = card.offsetWidth + 16
      setActiveIdx(Math.round(track.scrollLeft / w))
    }
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => track.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section id="before-after" className="section ba-section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">{ICONS.sparkles} Real Patient Results</span>
          <h2>Before & <span className="gold">After</span></h2>
          <p>See the stunning smile transformations from our patients.</p>
        </div>
      </div>

      <div className="ba-slider-wrap">
        <button className="ba-arrow ba-arrow--left" onClick={() => scroll(-1)} aria-label="Previous">
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>

        <div className="ba-track" ref={trackRef}>
          {BA_ITEMS.map((item, i) => (
            <div key={i} className="ba-slide">
              <img src={item.image} alt={item.text} loading="lazy" />
              <div className="ba-slide-info">
                <span className="ba-slide-badge">Before → After</span>
                <span className="ba-slide-title">{item.text}</span>
              </div>
            </div>
          ))}
        </div>

        <button className="ba-arrow ba-arrow--right" onClick={() => scroll(1)} aria-label="Next">
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      </div>

      <div className="ba-dots">
        {BA_ITEMS.map((_, i) => (
          <button
            key={i}
            className={`ba-dot ${activeIdx === i ? 'active' : ''}`}
            onClick={() => {
              const track = trackRef.current
              const card = track?.querySelector('.ba-slide')
              if (track && card) track.scrollTo({ left: i * (card.offsetWidth + 16), behavior: 'smooth' })
            }}
          />
        ))}
      </div>

      <div className="container">
        <div className="ba-cta-row">
          <button onClick={onGetQuote} className="btn-primary">
            Send Your Photos for Free Assessment →
          </button>
        </div>
      </div>
    </section>
  )
}


/* ── WHY CHOOSE US ── */
function WhyUs({ t }) {
  return (
    <section id="why-us" className="section why-section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">{ICONS.trophy} Why IME Clinic</span>
          <h2>Why Choose <span className="gold">Us</span></h2>
        </div>
        <div className="why-grid">
          {WHY_US.map((item, i) => (
            <div key={i} className="why-card">
              <div className="why-icon">{ICONS[item.icon]}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


/* ── PROCESS STEPS ── */
function Process({ onGetQuote, t }) {
  return (
    <section className="section process-section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">{ICONS.clipboard} {t.process.label}</span>
          <h2>{t.process.title} <span className="gold">{t.process.titleHL}</span></h2>
          <p>{t.process.desc}</p>
        </div>
        <div className="process-grid">
          {STEPS.map((s, i) => (
            <div key={i} className="process-card">
              <div className="process-img-wrap">
                <img src={s.image} alt={s.title} className="process-img" />
                <span className="process-badge">{s.n}</span>
              </div>
              <div className="process-body">
                <h3>{t.process.steps[i]?.title || s.title}</h3>
                <p>{t.process.steps[i]?.desc || s.desc}</p>
              </div>
              {i < STEPS.length - 1 && (
                <div className="process-connector">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--teal-500)" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="process-cta">
          <button onClick={onGetQuote} className="btn-primary btn-lg">
            {t.process.cta}
          </button>
        </div>
      </div>
    </section>
  )
}


/* ── HOSPITAL TOUR ── */
function VideoReels({ t }) {
  const [lightbox, setLightbox] = useState(null)
  const trackRef = useRef(null)

  const scrollGallery = (dir) => {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector('.hosp-slide')
    if (!card) return
    track.scrollBy({ left: dir * (card.offsetWidth + 14), behavior: 'smooth' })
  }

  // Close lightbox on Escape
  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowRight') setLightbox(i => (i + 1) % GALLERY.length)
      if (e.key === 'ArrowLeft') setLightbox(i => (i - 1 + GALLERY.length) % GALLERY.length)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightbox])

  return (
    <section id="hospital" className="section video-section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">{ICONS.film} Hospital Tour</span>
          <h2>Explore Our <span className="gold">Hospital</span></h2>
          <p>Take a virtual tour of our JCI-accredited hospital and dental clinic in Istanbul.</p>
        </div>
      </div>

      {/* Gallery Slider */}
      <div className="hosp-slider-wrap">
        <button className="hosp-arrow hosp-arrow--left" onClick={() => scrollGallery(-1)} aria-label="Previous">
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>

        <div className="hosp-track" ref={trackRef}>
          {GALLERY.map((g, i) => (
            <div key={i} className="hosp-slide" onClick={() => setLightbox(i)}>
              <img src={g.src} alt={g.label} loading="lazy" />
              <div className="hosp-slide-info">
                <span className="hosp-slide-title">{g.label}</span>
                <span className="hosp-slide-zoom">
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                </span>
              </div>
            </div>
          ))}
        </div>

        <button className="hosp-arrow hosp-arrow--right" onClick={() => scrollGallery(1)} aria-label="Next">
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      </div>

      {/* Video Reels Row — same container width */}
      <div className="hosp-slider-wrap" style={{padding: '0 56px', marginTop: '16px'}}>
        <div className="reels-row">
          {REEL_VIDEOS.map((src, i) => (
            <div key={i} className="reel-card">
              <video src={src} autoPlay muted playsInline loop preload="metadata" />
              <div className="reel-play-badge">
                <svg width={14} height={14} viewBox="0 0 24 24" fill="#fff"><polygon points="5 3 19 12 5 21" /></svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightbox !== null && (
        <div className="lightbox-overlay" onClick={() => setLightbox(null)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightbox(null)}>
              <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <button className="lightbox-nav lightbox-prev" onClick={() => setLightbox(i => (i - 1 + GALLERY.length) % GALLERY.length)}>
              <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <img src={GALLERY[lightbox].src} alt={GALLERY[lightbox].label} />
            <button className="lightbox-nav lightbox-next" onClick={() => setLightbox(i => (i + 1) % GALLERY.length)}>
              <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
            <div className="lightbox-info">
              <span className="lightbox-title">{GALLERY[lightbox].label}</span>
              <span className="lightbox-counter">{lightbox + 1} / {GALLERY.length}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}


/* ── CERTIFICATES ── */
function Certificates({ t }) {
  const [popup, setPopup] = useState(null)
  return (
    <section id="certificates" className="section certs-section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">{ICONS.award} Trust & Quality</span>
          <h2>Accreditations & <span className="gold">Certificates</span></h2>
          <p>Our partner hospital holds the highest international healthcare accreditations, ensuring world-class treatment standards.</p>
        </div>
        <div className="certs-grid">
          {CERTS.map((c, i) => (
            <div key={i} className="cert-card" onClick={() => c.cert && setPopup(c)}>
              <div className="cert-card-inner">
                <img src={c.logo} alt={c.name} className="cert-logo" />
                <h3>{c.name}</h3>
                <p>{c.desc}</p>
                {c.cert && <span className="cert-view">View Certificate →</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cert popup */}
      {popup && (
        <div className="lightbox" onClick={() => setPopup(null)}>
          <div className="lightbox-inner" onClick={e => e.stopPropagation()}>
            <img src={popup.cert} alt={popup.name} />
            <div className="lightbox-title">{popup.name}</div>
            <button className="lightbox-close" onClick={() => setPopup(null)}>✕</button>
          </div>
        </div>
      )}
    </section>
  )
}


/* ── HOTELS ── */
function Hotels({ t }) {
  return (
    <section id="hotels" className="section hotels-section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">{ICONS.hotel} Accommodation</span>
          <h2>Partner <span className="gold">Hotels</span></h2>
          <p>Stay in luxury during your treatment. All hotels are near the hospital with VIP transfer service.</p>
        </div>
        <div className="hotels-grid">
          {HOTELS.map((h, i) => (
            <HotelCard key={i} hotel={h} />
          ))}
        </div>
      </div>
    </section>
  )
}

function HotelCard({ hotel }) {
  const [imgIdx, setImgIdx] = useState(0)
  return (
    <div className="hotel-card">
      <div className="hotel-img-wrap">
        <img src={hotel.images[imgIdx]} alt={hotel.name} loading="lazy" />
        <div className="hotel-img-nav">
          <button onClick={() => setImgIdx(i => (i - 1 + hotel.images.length) % hotel.images.length)}>‹</button>
          <span>{imgIdx + 1}/{hotel.images.length}</span>
          <button onClick={() => setImgIdx(i => (i + 1) % hotel.images.length)}>›</button>
        </div>
        <div className="hotel-stars">{'★'.repeat(hotel.stars)}</div>
      </div>
      <div className="hotel-info">
        <h3>{hotel.name}</h3>
        <div className="hotel-dist">{ICONS.mapPin} {hotel.km} from hospital</div>
        <a href={hotel.booking} target="_blank" rel="noopener noreferrer" className="hotel-book">View on Booking →</a>
      </div>
    </div>
  )
}


/* ── BRAND LOGOS ── */
function BrandLogos({ t }) {
  return (
    <div className="brand-logos">
      <div className="container">
        <div className="brand-logos-inner">
          <span className="brand-label">Premium Materials</span>
          <div className="brand-imgs">
            <img src={`${B}logos/logo-straumann-white.png`} alt="Straumann" />
            <img src={`${B}logos/logo-ivoclar-white.png`} alt="Ivoclar" />
            <img src={`${B}logos/logo-emax-white.png`} alt="E.max" />
            <img src={`${B}logos/logo-medigma-white.png`} alt="Medigma" />
          </div>
        </div>
      </div>
    </div>
  )
}


/* ── FOOTER ── */
function Footer({ onGetQuote, t }) {
  return (
    <footer className="footer">
      {/* CTA strip */}
      <div className="footer-cta">
        <div className="container footer-cta-inner">
          <div>
            <h3>Ready to Transform Your Smile?</h3>
            <p>Get a free treatment plan and quote — no commitment, no hidden fees.</p>
          </div>
          <button onClick={onGetQuote} className="btn-primary">
            Get Free Consultation
          </button>
        </div>
      </div>

      {/* Main footer content */}
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand">
            <img src={LOGO} alt="IME Clinic" className="footer-logo" />
            <p>Operating under IME Hayat Sağlık Turizmi A.Ş., we provide expert dental treatment coordination in internationally accredited hospitals.</p>
          </div>
          <div className="footer-cols">
            <div className="footer-col">
              <h4>Quick Links</h4>
              <a href="#treatments">Treatment Prices</a>
              <a href="#before-after">Before & After</a>
              <a href="#hospital">Hospital Tour</a>
              <a href="#hotels">Hotels</a>
              <a href="#certificates">Certificates</a>
            </div>
            <div className="footer-col">
              <h4>Contact</h4>
              <a href="tel:+905465248334">+90 546 524 83 34</a>
              <a href="mailto:info@imeclinic.com">info@imeclinic.com</a>
              <a href="https://imeclinic.com" target="_blank" rel="noopener noreferrer">imeclinic.com</a>
            </div>
            <div className="footer-col">
              <h4>Certifications</h4>
              <span>Health Tourism License: AK-1346</span>
              <span>TURSAB: 13098</span>
              <span>Registered Trademark: IME Clinic</span>
            </div>
          </div>
        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <span>© 2026 IME Hayat Sağlık Turizmi A.Ş. All rights reserved.</span>
          <div className="footer-social">
            <a href="https://www.instagram.com/imeclinic" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
            </a>
            <a href={WA} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
            <a href="https://imeclinic.com" target="_blank" rel="noopener noreferrer" aria-label="Website">
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}


/* ── QUOTE MODAL ── */
const COUNTRY_CODES = [
  { code: '+44', flag: '🇬🇧', name: 'UK' },
  { code: '+49', flag: '🇩🇪', name: 'Germany' },
  { code: '+33', flag: '🇫🇷', name: 'France' },
  { code: '+39', flag: '🇮🇹', name: 'Italy' },
  { code: '+34', flag: '🇪🇸', name: 'Spain' },
  { code: '+31', flag: '🇳🇱', name: 'Netherlands' },
  { code: '+46', flag: '🇸🇪', name: 'Sweden' },
  { code: '+47', flag: '🇳🇴', name: 'Norway' },
  { code: '+45', flag: '🇩🇰', name: 'Denmark' },
  { code: '+32', flag: '🇧🇪', name: 'Belgium' },
  { code: '+41', flag: '🇨🇭', name: 'Switzerland' },
  { code: '+43', flag: '🇦🇹', name: 'Austria' },
  { code: '+353', flag: '🇮🇪', name: 'Ireland' },
  { code: '+1', flag: '🇺🇸', name: 'USA' },
  { code: '+1', flag: '🇨🇦', name: 'Canada' },
  { code: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: '+7', flag: '🇷🇺', name: 'Russia' },
  { code: '+90', flag: '🇹🇷', name: 'Turkey' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
]

function QuoteModal({ open, onClose, t }) {
  const [name, setName] = useState('')
  const [country, setCountry] = useState('+44')
  const [phone, setPhone] = useState('')
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open) { setSent(false); return }
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', onKey) }
  }, [open, onClose])

  if (!open) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim() || submitting) return
    setSubmitting(true)

    try {
      const API_URL = window.location.hostname === 'localhost'
        ? 'http://localhost:3000/api/leads'
        : `${window.location.origin}/best-dental-clinic-istanbul/api/leads`

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, countryCode: country, phone })
      })
      const data = await res.json()

      if (data.success) {
        setSent(true)
        setName(''); setPhone('')
      } else {
        throw new Error(data.error || 'Failed')
      }
    } catch (err) {
      console.error('Lead submit error:', err)
      // Fallback: WhatsApp'a yönlendir
      const msg = `Hi, I'd like a free treatment plan.\n\nName: ${name}\nPhone: ${country} ${phone}`
      window.open(`https://wa.me/905465248334?text=${encodeURIComponent(msg)}`, '_blank')
      setSent(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="quote-overlay" onClick={onClose}>
      <div className="quote-modal" onClick={e => e.stopPropagation()}>
        <button className="quote-close" onClick={onClose}>
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        <div className="quote-header">
          <h3>Get Your Free Quote</h3>
          <p>We'll contact you within 24 hours</p>
        </div>

        {sent ? (
          <div className="quote-success">
            <svg width={48} height={48} viewBox="0 0 24 24" fill="none" stroke="var(--teal-500)" strokeWidth={2} strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <h4>Request Sent!</h4>
            <p>Our team will reach out to you shortly.</p>
          </div>
        ) : (
          <form className="quote-form" onSubmit={handleSubmit}>
            <div className="quote-field">
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <input type="text" placeholder="Your Full Name *" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="quote-field">
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
              <select value={country} onChange={e => setCountry(e.target.value)}>
                {COUNTRY_CODES.map((c, i) => <option key={i} value={c.code}>{c.flag} {c.name} ({c.code})</option>)}
              </select>
            </div>
            <div className="quote-field">
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.12.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0122 16.92z"/></svg>
              <input type="tel" placeholder="Phone Number *" value={phone} onChange={e => setPhone(e.target.value)} required />
            </div>
            <button type="submit" className="quote-submit" disabled={submitting}>
              {submitting ? 'Sending...' : 'Get Free Quote Now 🎁'}
            </button>
            <p className="quote-trust">🛡️ 100% Secure • GDPR Compliant</p>
          </form>
        )}
      </div>
    </div>
  )
}


/* ══════════════════════════════════════════════════════
   MAIN APP
   ══════════════════════════════════════════════════════ */
export default function App() {
  const [quoteOpen, setQuoteOpen] = useState(false)
  const openQuote = () => setQuoteOpen(true)
  const isTR = useIsTurkeyVisitor()
  const { t } = useLang()
  return (
    <>
      <TopBanner onGetQuote={openQuote} isTR={isTR} t={t} />
      <Navbar t={t} />
      <Hero onGetQuote={openQuote} t={t} />
      <TrustStripe t={t} />
      {isTR && (
        <div style={{background:'#fff',padding:'16px 20px',textAlign:'center'}}>
          <p style={{color:'#9ca3af',fontSize:'14px',maxWidth:'900px',margin:'0 auto',lineHeight:'1.6'}}>
            {t.disclaimer}
          </p>
        </div>
      )}
      {!isTR && <TreatmentPrices t={t} />}
      {!isTR && <BeforeAfterGallery onGetQuote={openQuote} t={t} />}
      {!isTR && <WhyUs t={t} />}
      <Process onGetQuote={openQuote} t={t} />
      {!isTR && <VideoReels t={t} />}
      <BrandLogos t={t} />
      <Certificates t={t} />
      {!isTR && <Hotels t={t} />}
      <Footer onGetQuote={openQuote} t={t} />
      <FloatingCTA onGetQuote={openQuote} t={t} />
      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} t={t} />
    </>
  )
}
