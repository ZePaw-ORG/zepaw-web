'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  PawPrint,
  ShieldCheck,
  QrCode,
  Syringe,
  FileText,
  FlaskConical,
  Receipt,
  Shield,
  Award,
  Bell,
  Calendar,
  Scissors,
  Heart,
  Stethoscope,
  Activity,
  Cake,
  Dog,
  Cat,
  Bird,
  Rabbit,
  Turtle,
  Sparkles,
  Check,
  X,
  ChevronDown,
  Menu,
  Lock,
  Cloud,
  Building2,
  Landmark,
  Microscope,
  Store,
  Siren,
  Brain,
  ArrowRight,
  Loader2,
  // Instagram,
  // Linkedin,
  Mail,
  MapPin,
  Phone,
  User,
  ScanLine,
  BadgeCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { toast } from 'sonner';

const NAV = [
  { label: 'Home', href: '#home' },
  { label: 'Features', href: '#features' },
  { label: 'Roadmap', href: '#roadmap' },
  { label: 'FAQ', href: '#faq' },
];

const HERO_DOG = '/assets/cute-pug-landscape.png';
const CARD_DOG = '/assets/cute-pug.png';
const VERIFY_DOG =
  'https://images.pexels.com/photos/11106504/pexels-photo-11106504.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940';
const CAT_IMG =
  'https://images.unsplash.com/photo-1573865526739-10659fec78a5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwzfHxjdXRlJTIwY2F0fGVufDB8fHx8MTc4NDQ4MjA5OXww&ixlib=rb-4.1.0&q=85&w=500';

// ---------- QR (pure SVG, no deps) ----------
function QRPattern({ size = 120, className = '' }) {
  // A stylised static QR-like pattern (decorative). Deterministic layout.
  const cells = 21;
  const cellSize = size / cells;
  const grid = [];
  // Seeded pseudo pattern
  let seed = 42;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      // Reserve finder patterns corners
      const inFinder = (x < 7 && y < 7) || (x >= cells - 7 && y < 7) || (x < 7 && y >= cells - 7);
      if (inFinder) continue;
      if (rnd() > 0.55) {
        grid.push(
          <rect
            key={`${x}-${y}`}
            x={x * cellSize}
            y={y * cellSize}
            width={cellSize}
            height={cellSize}
            rx={cellSize * 0.15}
            fill="#111827"
          />
        );
      }
    }
  }
  const Finder = ({ cx, cy }) => (
    <g transform={`translate(${cx * cellSize}, ${cy * cellSize})`}>
      <rect width={cellSize * 7} height={cellSize * 7} rx={cellSize} fill="#111827" />
      <rect
        x={cellSize}
        y={cellSize}
        width={cellSize * 5}
        height={cellSize * 5}
        rx={cellSize * 0.6}
        fill="#fff"
      />
      <rect
        x={cellSize * 2}
        y={cellSize * 2}
        width={cellSize * 3}
        height={cellSize * 3}
        rx={cellSize * 0.4}
        fill="#153E75"
      />
    </g>
  );
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className}>
      <rect width={size} height={size} rx={size * 0.08} fill="#fff" />
      {grid}
      <Finder cx={0} cy={0} />
      <Finder cx={cells - 7} cy={0} />
      <Finder cx={0} cy={cells - 7} />
    </svg>
  );
}

// ---------- NAV ----------
function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-2' : 'py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div
          className={`glass rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between transition-all ${
            scrolled ? 'shadow-lg shadow-[#153E75]/5' : ''
          }`}
        >
          <a href="#home" className="flex items-center gap-2 group" aria-label="ZePaw home">
            <img
              src="/assets/icon-transparent.png"
              alt="ZePaw"
              className="h-[60px] w-auto object-contain transition-transform group-hover:scale-105"
            />
          </a>
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="px-4 py-2 text-sm font-medium text-[#6B7280] hover:text-[#153E75] transition-colors rounded-lg hover:bg-white/60"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="#beta"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#153E75] to-[#14B8A6] shadow-lg shadow-[#14B8A6]/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Join Beta
              <ArrowRight className="w-4 h-4" />
            </a>
            <button
              className="md:hidden p-2 rounded-lg hover:bg-white/60"
              onClick={() => setOpen(!open)}
              aria-label="menu"
            >
              <Menu className="w-5 h-5 text-[#153E75]" />
            </button>
          </div>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="md:hidden mt-2 glass rounded-2xl p-2 flex flex-col"
            >
              {NAV.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-[#111827] hover:bg-white/70 rounded-xl"
                >
                  {n.label}
                </a>
              ))}
              <a
                href="#beta"
                onClick={() => setOpen(false)}
                className="mt-1 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#153E75] to-[#14B8A6] rounded-xl text-center"
              >
                Join Beta
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

// ---------- HERO MOCKUP (phone) ----------
function PhoneMockup() {
  return (
    <div
      initial={{ opacity: 0, y: 30, rotateY: -8 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="relative w-[280px] sm:w-[320px] mx-auto"
      style={{ perspective: 1200 }}
    >
      {/* Floating cards */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-16 sm:-left-24 top-16 z-20 glass rounded-2xl p-3 shadow-xl shadow-[#153E75]/10 hidden sm:block"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#EAFBF8] flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-[#14B8A6]" />
          </div>
          <div>
            <p className="text-[10px] text-[#6B7280] font-medium">Verified</p>
            <p className="text-xs font-bold text-[#111827]">Vaccinations ✓</p>
          </div>
        </div>
      </motion.div>
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -right-10 sm:-right-20 top-40 z-20 glass rounded-2xl p-3 shadow-xl shadow-[#153E75]/10 hidden sm:block"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#EAFBF8] flex items-center justify-center">
            <QrCode className="w-4 h-4 text-[#14B8A6]" />
          </div>
          <div>
            <p className="text-[10px] text-[#6B7280] font-medium">Scan</p>
            <p className="text-xs font-bold text-[#111827]">ZP-8471-B92</p>
          </div>
        </div>
      </motion.div>
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute -right-8 sm:-right-16 -bottom-2 z-20 glass rounded-2xl p-3 shadow-xl shadow-[#153E75]/10 hidden sm:block"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#EAFBF8] flex items-center justify-center">
            <Heart className="w-4 h-4 text-[#14B8A6]" />
          </div>
          <div>
            <p className="text-[10px] text-[#6B7280] font-medium">Health</p>
            <p className="text-xs font-bold text-[#111827]">Excellent</p>
          </div>
        </div>
      </motion.div>

      {/* Phone frame */}
      <div className="relative rounded-[3rem] bg-[#111827] p-3 shadow-2xl shadow-[#153E75]/30">
        <div className="rounded-[2.4rem] overflow-hidden bg-gradient-to-b from-[#EAFBF8] via-white to-white">
          {/* Notch */}
          <div className="relative pt-3 pb-2 flex justify-center">
            <div className="w-24 h-6 rounded-full bg-[#111827]" />
          </div>
          {/* Status bar */}
          <div className="flex justify-between items-center px-6 pb-3 text-[10px] font-semibold text-[#111827]">
            <span>9:41</span>
            <span className="flex gap-1 items-center">
              <span className="w-3 h-2 rounded-sm bg-[#111827]" />
              <span className="w-3 h-2 rounded-sm bg-[#111827]" />
              <span className="w-4 h-2 rounded bg-[#111827]" />
            </span>
          </div>
          <div className="px-4 pb-6">
            <p className="text-[11px] text-[#6B7280] font-medium">Welcome back</p>
            <h3 className="text-lg font-bold text-[#111827]">Shiro's Card</h3>
            {/* Photo card */}
            <div className="mt-3 rounded-2xl overflow-hidden relative shadow-lg">
              <img src={HERO_DOG} alt="Shiro" className="w-full h-40 object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#153E75]/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="text-[10px] font-medium opacity-80">ZePaw Identity</p>
                <p className="text-sm font-bold tracking-wider">ZP-8471-B92</p>
              </div>
              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur rounded-full px-2 py-1 flex items-center gap-1">
                <BadgeCheck className="w-3 h-3 text-[#14B8A6]" />
                <span className="text-[10px] font-bold text-[#153E75]">Verified</span>
              </div>
            </div>
            {/* Vax status */}
            <div className="mt-3 flex gap-2">
              <div className="flex-1 bg-[#EAFBF8] rounded-xl p-2.5">
                <div className="flex items-center gap-1.5">
                  <Syringe className="w-3 h-3 text-[#14B8A6]" />
                  <span className="text-[9px] font-semibold text-[#153E75]">VAX</span>
                </div>
                <p className="text-xs font-bold text-[#111827] mt-1">Up to date</p>
              </div>
              <div className="flex-1 bg-[#F8FAFC] rounded-xl p-2.5">
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3 h-3 text-[#153E75]" />
                  <span className="text-[9px] font-semibold text-[#153E75]">HEALTH</span>
                </div>
                <p className="text-xs font-bold text-[#111827] mt-1">Excellent</p>
              </div>
            </div>
            {/* QR */}
            <div className="mt-3 rounded-2xl bg-white border border-[#F8FAFC] p-3 flex items-center gap-3 shadow-sm">
              <QRPattern size={64} />
              <div>
                <p className="text-[10px] text-[#6B7280] font-medium">Tap to share</p>
                <p className="text-sm font-bold text-[#111827]">Verify Shiro</p>
                <p className="text-[10px] text-[#14B8A6] font-semibold mt-0.5">zepaw.io/v/8471</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- HERO ----------
function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden pt-32 pb-20 mb-20 sm:pt-40 sm:pb-28 sm:mb-28"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-mesh" />
      <motion.div
        animate={{ scale: [1, 1.1, 1], rotate: [0, 30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#14B8A6]/10 blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, -20, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#153E75]/10 blur-3xl"
      />
      <div className="relative container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-white/60 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#14B8A6] animate-pulse" />
              <span className="text-xs font-semibold text-[#153E75]">Coming soon</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] text-[#111827]">
              The <span className="text-gradient">Smarter</span> Way to Care for Your Pet.
            </h1>
            <p className="mt-6 text-lg text-[#6B7280] max-w-xl leading-relaxed">
              ZePaw gives every pet a permanent digital identity where pet parents can securely
              manage lifelong health records, vaccinations, documents, and important information.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#beta"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-white font-semibold bg-gradient-to-r from-[#153E75] to-[#14B8A6] shadow-xl shadow-[#14B8A6]/30 hover:shadow-2xl hover:-translate-y-0.5 transition-all"
              >
                Join Beta
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#features"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-[#153E75] font-semibold bg-white border border-[#153E75]/10 hover:border-[#153E75]/30 hover:bg-[#F8FAFC] transition-all"
              >
                Learn More
              </a>
            </div>
            <div className="mt-10 flex items-center gap-6 text-[#6B7280] text-xs">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#14B8A6]" />
                <span>Encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#14B8A6]" />
                <span>Owner-controlled</span>
              </div>
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-[#14B8A6]" />
                <span>Cloud secure</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Section wrapper ----------
function Section({ id, eyebrow, title, subtitle, children, className = '' }) {
  return (
    <section id={id} className={`relative pb-20 sm:pb-28 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-14">
          {eyebrow && (
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#EAFBF8] text-[#14B8A6] mb-4">
              {eyebrow}
            </span>
          )}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#111827] leading-[1.1]">
            {title}
          </h2>
          {subtitle && <p className="mt-5 text-lg text-[#6B7280] leading-relaxed">{subtitle}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

// ---------- Identity Card (section 2) ----------
function IdentityCard() {
  return (
    <div className="max-w-md mx-auto">
      <div className="relative rounded-[2rem] bg-gradient-to-br from-[#153E75] via-[#1E4F8A] to-[#14B8A6] p-[2px] shadow-2xl shadow-[#153E75]/25">
        <div className="rounded-[calc(2rem-2px)] bg-white overflow-hidden">
          {/* Header */}
          <div className="relative p-6 bg-gradient-to-br from-[#153E75] to-[#1E4F8A] text-white">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute -top-4 -right-4 w-32 h-32 rounded-full bg-[#14B8A6] blur-2xl" />
            </div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
                  <PawPrint className="w-4 h-4" />
                </div>
                <span className="font-bold tracking-tight">ZePaw ID</span>
              </div>
              <BadgeCheck className="w-6 h-6" />
            </div>
            <div className="relative mt-6 flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/40 shadow-lg">
                <img src={CARD_DOG} alt="Shiro" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-xs opacity-70 font-medium">Pet Name</p>
                <h3 className="text-2xl font-bold">Shiro</h3>
                <p className="text-xs opacity-80 mt-0.5">Pug</p>
              </div>
            </div>
            <div className="relative mt-5 pt-5 border-t border-white/15">
              <p className="text-[10px] opacity-70 font-medium tracking-widest">ZEPAW IDENTITY</p>
              <p className="font-bold text-xl tracking-[0.2em] mt-1">ZP-8471-B92</p>
            </div>
          </div>
          {/* Body */}
          <div className="p-6 grid grid-cols-2 gap-4">
            <Info label="Species" value="Dog" />
            <Info label="Breed" value="Pug" />
            <Info label="Age" value="3 years" />
            <Info
              label="Vaccination"
              value="Up to date"
              accent
              icon={<Check className="w-3 h-3" />}
            />
            <div className="col-span-2 mt-2 rounded-xl bg-[#F8FAFC] p-4 flex items-center gap-4">
              <QRPattern size={72} />
              <div className="flex-1">
                <p className="text-[10px] text-[#6B7280] font-semibold tracking-widest">
                  EMERGENCY CONTACT
                </p>
                <p className="text-sm font-bold text-[#111827] mt-1">+91 98••••2170</p>
                <p className="text-[11px] text-[#6B7280] mt-0.5">Scan to verify identity</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="text-center text-sm text-[#6B7280] mt-5">
        This identity stays with your pet for their entire life.
      </p>
    </div>
  );
}
function Info({ label, value, accent, icon }) {
  return (
    <div>
      <p className="text-[10px] text-[#6B7280] font-semibold tracking-widest">
        {label.toUpperCase()}
      </p>
      <p
        className={`text-sm font-bold mt-1 flex items-center gap-1.5 ${
          accent ? 'text-[#14B8A6]' : 'text-[#111827]'
        }`}
      >
        {icon}
        {value}
      </p>
    </div>
  );
}

// ---------- Vault (section 4) ----------
const VAULT_ITEMS = [
  { icon: FileText, title: 'Prescriptions', desc: 'All vet prescriptions in one place.' },
  { icon: Syringe, title: 'Vaccination Cards', desc: 'Complete immunisation history.' },
  { icon: FlaskConical, title: 'Lab Reports', desc: 'Blood work, urinalysis and more.' },
  { icon: Receipt, title: 'Medical Bills', desc: 'Track expenses effortlessly.' },
  { icon: Shield, title: 'Insurance Documents', desc: 'Policies, claims and coverage.' },
  { icon: Award, title: 'Adoption Certificates', desc: 'Ownership and pedigree docs.' },
];
function Vault() {
  return (
    <Section
      id="features"
      eyebrow="Digital Health Vault"
      title="Every document. Securely stored. Instantly available."
      subtitle="ZePaw keeps every important document about your pet organised, encrypted and always within reach."
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
        {VAULT_ITEMS.map((v, i) => (
          <div
            key={v.title}
            className="flex flex-col items-center group relative rounded-2xl bg-white p-6 border border-[#F8FAFC] hover:border-[#14B8A6]/30 hover:shadow-xl hover:shadow-[#14B8A6]/5 hover:-translate-y-1 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#EAFBF8] to-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <v.icon className="w-6 h-6 text-[#14B8A6]" />
            </div>
            <h3 className="mt-4 font-bold text-[#111827] text-lg">{v.title}</h3>
            <p className="text-sm text-[#6B7280] mt-1">{v.desc}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 flex items-center justify-center gap-2 text-sm text-[#6B7280]">
        <Cloud className="w-4 h-4 text-[#14B8A6]" />
        Encrypted and backed up to the cloud, forever.
      </div>
    </Section>
  );
}

// ---------- Timeline ----------
const TIMELINE = [
  { icon: Syringe, title: 'Puppy Vaccinations', date: 'March 2022', desc: 'DHPP, Rabies' },
  { icon: Activity, title: 'First Blood Test', date: 'Aug 2022', desc: 'All values normal' },
  { icon: Stethoscope, title: 'Annual Vet Visit', date: 'Feb 2023', desc: 'Healthy checkup' },
  { icon: FlaskConical, title: 'Deworming Cycle', date: 'May 2023', desc: 'Broad spectrum' },
  { icon: Heart, title: 'Neutering Surgery', date: 'Oct 2023', desc: 'Recovery complete' },
  { icon: Activity, title: 'Health Report', date: 'Mar 2024', desc: 'Excellent condition' },
];
function Timeline() {
  return (
    <Section
      eyebrow="Lifetime Health Timeline"
      title="Every record. Seamlessly documented."
      subtitle="Follow your pet's health story from the very first visit to every checkup that follows."
    >
      <div className="relative max-w-3xl mx-auto">
        <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#14B8A6]/0 via-[#14B8A6]/40 to-[#14B8A6]/0" />
        {TIMELINE.map((t, i) => (
          <div
            key={t.title}
            className={`relative flex sm:items-center mb-8 sm:mb-6 ${
              i % 2 === 0 ? 'sm:justify-start' : 'sm:justify-end'
            }`}
          >
            <div
              className={`sm:w-[45%] pl-16 sm:pl-0 ${
                i % 2 === 0 ? 'sm:pr-8 sm:text-right' : 'sm:pl-8'
              }`}
            >
              <div className="rounded-2xl bg-white border border-[#F8FAFC] p-5 shadow-sm hover:shadow-lg hover:border-[#14B8A6]/30 transition-all">
                <p className="text-xs font-semibold text-[#14B8A6]">{t.date}</p>
                <h4 className="font-bold text-[#111827] mt-1">{t.title}</h4>
                <p className="text-sm text-[#6B7280] mt-1">{t.desc}</p>
              </div>
            </div>
            <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white border-2 border-[#14B8A6] flex items-center justify-center shadow-lg z-10">
              <t.icon className="w-5 h-5 text-[#14B8A6]" />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ---------- Reminders ----------
const REMINDERS = [
  { icon: Syringe, title: 'Vaccinations', color: 'from-[#14B8A6] to-[#0F9488]' },
  { icon: FlaskConical, title: 'Deworming', color: 'from-[#153E75] to-[#1E4F8A]' },
  { icon: Shield, title: 'Flea & Tick', color: 'from-[#14B8A6] to-[#153E75]' },
  { icon: Scissors, title: 'Grooming', color: 'from-[#153E75] to-[#14B8A6]' },
  { icon: Stethoscope, title: 'Annual Checkup', color: 'from-[#14B8A6] to-[#0D9488]' },
  { icon: Cake, title: 'Birthday', color: 'from-[#F472B6] to-[#14B8A6]' },
];
function Reminders() {
  return (
    <Section
      eyebrow="Smart Care Reminders"
      title="Never miss what matters most."
      subtitle="Timely, gentle reminders for every part of your pet's care routine."
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {REMINDERS.map((r, i) => (
          <div
            key={r.title}
            className="group relative rounded-2xl overflow-hidden bg-white border border-[#F8FAFC] p-5 hover:shadow-xl transition-all flex flex-col items-center"
          >
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center shadow-md`}
            >
              <r.icon className="w-6 h-6 text-white" />
            </div>
            <h4 className="mt-4 font-bold text-[#111827]">{r.title}</h4>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-[#6B7280]">
              <Bell className="w-3 h-3" />
              <span>Auto reminders</span>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ---------- Pet Parents ----------
const PETS = [
  { icon: Dog, label: 'Dogs' },
  { icon: Cat, label: 'Cats' },
  { icon: Bird, label: 'Birds' },
  { icon: Rabbit, label: 'Rabbits' },
  { icon: PawPrint, label: 'Hamsters' },
  { icon: Turtle, label: 'Turtles' },
  { icon: Sparkles, label: 'Exotic Pets' },
];
function PetParents() {
  return (
    <Section
      eyebrow="For Every Family"
      title="Built for every pet parent."
      subtitle="Whatever kind of companion shares your home, ZePaw is for them."
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 max-w-5xl mx-auto">
        {PETS.map((p, i) => (
          <div
            key={p.label}
            className="rounded-2xl bg-white border border-[#F8FAFC] p-5 flex flex-col items-center hover:border-[#14B8A6]/40 hover:bg-[#EAFBF8]/30 hover:-translate-y-1 transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#EAFBF8] to-white flex items-center justify-center">
              <p.icon className="w-7 h-7 text-[#14B8A6]" />
            </div>
            <span className="mt-3 font-semibold text-sm text-[#111827]">{p.label}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ---------- Comparison ----------
function Comparison() {
  const without = [
    'Lost Medical Records',
    'Paper Documents',
    'Forgotten Vaccinations',
    'Difficult Record Sharing',
  ];
  const withZ = [
    'Permanent Digital Identity',
    'Secure Cloud Storage',
    'QR Verification',
    'Smart Reminders',
    'Organized Health Timeline',
  ];
  return (
    <Section
      eyebrow="Why ZePaw"
      title="A better way to care for your pet."
      subtitle="See the difference an identity can make."
    >
      <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
        <div className="rounded-3xl bg-[#F8FAFC] border border-[#F8FAFC] p-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
              <X className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-black">Without ZePaw</h3>
          </div>
          <ul className="mt-6 space-y-3">
            {without.map((w) => (
              <li key={w} className="flex items-center gap-3 text-[#6B7280]">
                <span className="w-1.5 h-1.5 rounded-full bg-red-300" />
                <span className="line-through decoration-red-600">{w}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl bg-gradient-to-br from-[#153E75] to-[#14B8A6] p-8 text-white shadow-xl shadow-[#14B8A6]/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
              <Check className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold">With ZePaw</h3>
          </div>
          <ul className="mt-6 space-y-3">
            {withZ.map((w) => (
              <li key={w} className="flex items-center gap-3">
                <BadgeCheck className="w-4 h-4 shrink-0" />
                <span className="font-medium">{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

// ---------- Roadmap ----------
function Roadmap() {
  const launch = [
    { icon: BadgeCheck, label: 'ZePaw Identity' },
    { icon: User, label: 'Pet Profiles' },
    { icon: Cloud, label: 'Digital Health Vault' },
    { icon: Activity, label: 'Health Timeline' },
    { icon: Bell, label: 'Smart Reminders' },
    { icon: QrCode, label: 'QR Verification' },
  ];
  const soon = [
    { icon: Building2, label: 'Veterinary Clinics' },
    { icon: Landmark, label: 'Insurance Integration' },
    { icon: Microscope, label: 'Diagnostic Labs' },
    { icon: Store, label: 'Marketplace' },
    { icon: Siren, label: 'Emergency Sharing' },
    { icon: Brain, label: 'AI Health Insights' },
  ];
  return (
    <Section
      id="roadmap"
      eyebrow="Product Roadmap"
      title="What's here today. What's next."
      subtitle="We're building ZePaw with pet parents, vets, and animal lovers."
    >
      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <div className="rounded-3xl bg-white border border-[#F8FAFC] p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#111827]">Available at Launch</h3>
            <span className="text-xs font-bold px-2 py-1 rounded-full bg-[#EAFBF8] text-[#14B8A6]">
              LIVE SOON
            </span>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {launch.map((l) => (
              <div key={l.label} className="flex items-center gap-3 p-3 rounded-xl bg-[#F8FAFC]">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                  <l.icon className="w-4 h-4 text-[#14B8A6]" />
                </div>
                <span className="text-sm font-semibold text-[#111827]">{l.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl bg-gradient-to-br from-[#153E75] to-[#1E4F8A] p-8 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Coming Soon</h3>
            <span className="text-xs font-bold px-2 py-1 rounded-full bg-white/20 backdrop-blur">
              PLANNED
            </span>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {soon.map((l) => (
              <div
                key={l.label}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur"
              >
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <l.icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold">{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

// ---------- Privacy ----------
function Privacy() {
  const items = [
    { icon: User, title: 'Owner-first', text: 'Pet data belongs to the owner. Always.' },
    {
      icon: Lock,
      title: 'End-to-end encryption',
      text: 'All information is encrypted at rest and in transit.',
    },
    {
      icon: ShieldCheck,
      title: 'Owner-controlled sharing',
      text: 'You choose what to share, with whom, and for how long.',
    },
    {
      icon: Shield,
      title: 'Private medical records',
      text: 'Sensitive records are never publicly visible.',
    },
    {
      icon: BadgeCheck,
      title: 'Public verification',
      text: 'Only what you approve appears on public verification.',
    },
  ];
  return (
    <Section
      eyebrow="Privacy & Security"
      title="Built on trust. Secured for life."
      subtitle="Your pet's data is precious. We treat it that way."
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {items.map((it, i) => (
          <div
            key={it.title}
            className="rounded-2xl bg-white border border-[#F8FAFC] p-6 hover:border-[#14B8A6]/30 transition-all flex flex-col items-center"
          >
            <div className="w-11 h-11 rounded-xl bg-[#EAFBF8] flex items-center justify-center">
              <it.icon className="w-5 h-5 text-[#14B8A6]" />
            </div>
            <h4 className="mt-4 font-bold text-[#111827]">{it.title}</h4>
            <p className="text-sm text-[#6B7280] mt-1 text-center">{it.text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ---------- Beta Form ----------
function BetaForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    petType: '',
    city: '',
    website: '', // honeypot
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.petType || !form.city) {
      toast.error('Please fill in all required fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error('Please enter a valid email.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/beta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Submission failed');
      }
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setForm({ name: '', email: '', phone: '', petType: '', city: '', website: '' });
      }, 10000);
    } catch (err) {
      toast.error(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="beta" className="relative py-20 mb-20 sm:py-28 sm:mb-28 overflow-hidden">
      <div className="absolute inset-0 bg-mesh" />
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#14B8A6]/10 to-[#153E75]/10 blur-3xl"
      />
      <div className="relative container mx-auto px-4">
        <div className="max-w-xl mx-auto text-center mb-10">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#EAFBF8] text-[#14B8A6] mb-4">
            Join the Beta
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#111827] leading-[50px] sm:leading-[50px] lg:leading-[50px]">
            Be first to give your pet an <span className="text-gradient">identity.</span>
          </h2>
          <p className="mt-4 text-[#6B7280]">
            Get early access to ZePaw and help shape the future of pet healthcare.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          <div className="relative rounded-3xl bg-gradient-to-br from-[#153E75] to-[#14B8A6] p-[2px] shadow-2xl shadow-[#153E75]/20">
            <div className="rounded-[calc(1.5rem-2px)] bg-white p-6 sm:p-8">
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-8 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', duration: 0.6, delay: 0.1 }}
                      className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#14B8A6] to-[#0D9488] flex items-center justify-center shadow-xl shadow-[#14B8A6]/40"
                    >
                      <motion.svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <motion.path
                          d="M10 20 L18 28 L32 12"
                          stroke="white"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.6, delay: 0.4 }}
                        />
                      </motion.svg>
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="mt-6 text-2xl font-extrabold text-[#111827]"
                    >
                      🎉 Thank you for enrolling!
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.1 }}
                      className="mt-4 font-semibold text-gradient"
                    >
                      Welcome to the future of pet healthcare.
                    </motion.p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="mt-6 text-sm font-semibold text-[#14B8A6] hover:underline"
                    >
                      Submit another response
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={submit}
                    className="space-y-4"
                  >
                    {/* Honeypot */}
                    <input
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.website}
                      onChange={(e) => setForm({ ...form, website: e.target.value })}
                      className="absolute -left-[9999px] w-px h-px opacity-0"
                      aria-hidden
                    />
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs font-semibold text-[#153E75]">Name *</Label>
                        <Input
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Priya Sharma"
                          className="mt-1.5 h-11 rounded-xl border-[#E5E7EB]"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-semibold text-[#153E75]">Email *</Label>
                        <Input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="you@example.com"
                          className="mt-1.5 h-11 rounded-xl border-[#E5E7EB]"
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs font-semibold text-[#153E75]">
                          Phone (optional)
                        </Label>
                        <Input
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="98••• 12345"
                          className="mt-1.5 h-11 rounded-xl border-[#E5E7EB]"
                          type="tel"
                          maxLength={10}
                          inputMode="numeric"
                          autoComplete="tel"
                          pattern="[6-9][0-9]{9}"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-semibold text-[#153E75]">City *</Label>
                        <Input
                          value={form.city}
                          onChange={(e) => setForm({ ...form, city: e.target.value })}
                          placeholder="Bangalore"
                          className="mt-1.5 h-11 rounded-xl border-[#E5E7EB]"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-[#153E75]">Pet Type *</Label>
                      <Select
                        value={form.petType}
                        onValueChange={(v) => setForm({ ...form, petType: v })}
                      >
                        <SelectTrigger className="mt-1.5 h-11 rounded-xl border-[#E5E7EB]">
                          <SelectValue placeholder="Choose your pet" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Dog">Dog</SelectItem>
                          <SelectItem value="Cat">Cat</SelectItem>
                          <SelectItem value="Bird">Bird</SelectItem>
                          <SelectItem value="Rabbit">Rabbit</SelectItem>
                          <SelectItem value="Hamster">Hamster</SelectItem>
                          <SelectItem value="Turtle">Turtle</SelectItem>
                          <SelectItem value="Exotic">Exotic Pet</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-[#153E75] to-[#14B8A6] hover:opacity-90 text-white font-semibold text-base shadow-lg shadow-[#14B8A6]/25"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting…
                        </>
                      ) : (
                        <>
                          Join Beta Testing
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                    <p className="text-[11px] text-center text-[#6B7280]">
                      By joining, you agree to receive beta updates. No spam, ever.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- FAQ ----------
const FAQS = [
  {
    q: 'What is a ZePaw Identity?',
    a: 'A permanent, secure digital identity assigned to every pet like a passport for your companion. It stays with them for life and can be verified anywhere.',
  },
  {
    q: 'How does verification work?',
    a: 'Anyone can enter a ZePaw Identity or scan the QR code to verify a pet. Only the information the owner chooses to share is shown publicly.',
  },
  {
    q: 'Is my pet\u2019s data secure?',
    a: 'Yes. All data is encrypted at rest and in transit. Sensitive medical records are never publicly visible. Owners control every sharing decision.',
  },
  {
    q: 'When will the beta launch?',
    a: 'We\u2019re rolling out invites in waves. Join the beta list and we\u2019ll email you as soon as your access is ready.',
  },
  {
    q: 'Is ZePaw only for dogs and cats?',
    a: 'No. ZePaw is built for every pet dogs, cats, birds, rabbits, hamsters, turtles, and exotic pets.',
  },
];
function FAQ() {
  return (
    <Section
      id="faq"
      eyebrow="FAQ"
      title="Answers, before you ask."
      subtitle="Everything you need to know about ZePaw."
    >
      <div className="max-w-2xl mx-auto">
        <Accordion type="single" collapsible className="space-y-3">
          {FAQS.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="border border-[#F8FAFC] rounded-2xl px-5 bg-white data-[state=open]:shadow-lg data-[state=open]:border-[#14B8A6]/30 transition-all"
            >
              <AccordionTrigger className="text-left font-semibold text-[#111827] hover:no-underline py-4">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-[#6B7280] pb-4 leading-relaxed">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}

// ---------- Footer ----------
function Footer() {
  return (
    <footer className="relative bg-[#111827] text-white pt-16 pb-8 overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#14B8A6]/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#153E75]/30 blur-3xl" />
      </div>
      <div className="relative container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <img
                src="/assets/icon-transparent.png"
                alt="ZePaw"
                className="h-[60px] w-auto object-contain bg-white rounded-xl "
              />
            </div>
            <p className="mt-4 text-sm text-white/60 max-w-sm leading-relaxed">
              Creating the digital identity standard for pets. Every pet gets a permanent identity
              verifiable anywhere, secured for life.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="https://www.instagram.com/zepaw.official"
                aria-label="Instagram"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors text-xl"
                target="_blank"
              >
                {/* <Instagram className="w-4 h-4" /> */}
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a
                href="mailto:hello@zepaw.in"
                aria-label="Email"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors text-xl"
              >
                <i className="fa-regular fa-envelope"></i>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white/50">Company</h4>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="mailto:support@zepaw.in" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#roadmap" className="hover:text-white transition-colors">
                  Roadmap
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© {new Date().getFullYear()} ZePaw. All rights reserved.</p>
          <p>Made with ♥ for pets everywhere.</p>
        </div>
      </div>
    </footer>
  );
}

function LandingPage() {
  return (
    <>
      <Nav />
      <Hero />
      <Section
        eyebrow="One Identity"
        title={
          <>
            One Pet. <span className="text-gradient">One Identity.</span> Anywhere.
          </>
        }
        subtitle="Every pet receives a permanent ZePaw Identity a passport for their entire life. Verify anywhere. Recognised everywhere."
      >
        <IdentityCard />
      </Section>
      <Vault />
      <Timeline />
      <Reminders />
      <PetParents />
      <Comparison />
      <Roadmap />
      <Privacy />
      <BetaForm />
      <FAQ />
      <Footer />
    </>
  );
}

export default LandingPage;
