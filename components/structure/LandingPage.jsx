'use client';

import { useState, useRef, useId, useEffect } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
  MotionConfig,
} from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { toast } from 'sonner';
import { IdentityCard } from './IdentityCard';
import { Vault } from './Vault';
import { EveryPet } from './EveryPet';
import { Rise, Seal, Mark, SceneNum, EASE, useTilt } from './registry';

const NAV = [
  ['The record', '#record'],
  ['Vault', '#vault'],
  ['Timeline', '#ledger'],
  ['Verify', '#verify'],
  ['Questions', '#faq'],
];

/* ==================================================================
   NAV — contained, responds to scroll, no default flush bar
   ================================================================== */
function Nav() {
  const [open, setOpen] = useState(false);
  const [condensed, setCondensed] = useState(false);
  const { scrollY } = useScroll();
  const line = useTransform(scrollY, [60, 140], [0, 1]);

  // Threshold toggle rather than a per-frame padding animation: padding is a
  // layout property, so animating it on every scroll frame forces reflow.
  useMotionValueEvent(scrollY, 'change', (v) => setCondensed(v > 90));

  return (
    <>
      <header
        // Keep the header and its close button above the menu surface. The
        // menu itself sits above all page content, including sticky sections.
        className={`fixed inset-x-0 top-0 z-[70] transition-[padding] duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] ${
          open ? 'bg-transparent' : 'bg-paper/85 backdrop-blur-[6px]'
        } ${condensed ? 'py-3' : 'py-6'}`}
      >
        <motion.div
          style={{ scaleX: line }}
          className="absolute inset-x-0 bottom-0 h-px origin-left bg-ink/20"
        />
        <div className="mx-auto flex max-w-[78rem] items-center justify-between px-5 sm:px-8">
          <a href="#home" className="flex items-center gap-2.5" aria-label="ZePaw, home">
            <img
              src="/assets/mark.png"
              alt=""
              width={240}
              height={240}
              className="h-8 w-8 object-contain"
            />
            <span className="font-display text-[1.35rem] leading-none tracking-tight">ZePaw</span>
          </a>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {NAV.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="text-[0.84rem] text-ink-soft transition-colors duration-300 hover:text-ink"
              >
                {label}
              </a>
            ))}
            <a
              href="#beta"
              className="group relative inline-flex items-center gap-2 bg-ink px-4 py-2 text-[0.84rem] text-stock transition-colors duration-300 hover:bg-seal-deep"
            >
              Request an identity
              <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
                <path
                  d="M2.5 9.5 9.5 2.5M4.2 2.5h5.3v5.3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-300 ease-out group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
                />
              </svg>
            </a>
          </nav>

          {/* Hamburger that morphs to an X */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="relative z-[80] flex h-11 w-11 shrink-0 cursor-pointer touch-manipulation items-center justify-center md:hidden"
          >
            <span
              className={`absolute left-1/2 top-1/2 block h-px w-5 -translate-x-1/2 bg-ink transition-transform duration-500 ${
                open ? 'rotate-45' : '-translate-y-[4px]'
              }`}
              style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
            />
            <span
              className={`absolute left-1/2 top-1/2 block h-px w-5 -translate-x-1/2 bg-ink transition-transform duration-500 ${
                open ? '-rotate-45' : 'translate-y-[4px]'
              }`}
              style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
            />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="pointer-events-auto fixed inset-0 z-[60] bg-paper px-5 pt-28 md:hidden"
          >
            <nav aria-label="Mobile">
              {NAV.map(([label, href], i) => (
                <motion.a
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  initial={{ y: 26 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.05 + i * 0.05 }}
                  className="block border-b border-ink/12 py-5 font-display text-3xl"
                >
                  {label}
                </motion.a>
              ))}
              <motion.a
                href="#beta"
                onClick={() => setOpen(false)}
                initial={{ y: 26 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.25 }}
                className="mt-8 block bg-ink px-5 py-4 text-center text-stock"
              >
                Request an identity
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ==================================================================
   HERO — owns the fold. Three depth layers: paper, photograph,
   identity card. The card crosses over the photograph's edge.
   ================================================================== */
function Hero() {
  const ref = useRef(null);
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const certY = useTransform(scrollYProgress, [0, 1], [0, still ? 0 : -110]);
  const photoY = useTransform(scrollYProgress, [0, 1], [0, still ? 0 : 55]);
  const tilt = useTilt({ max: 7 });

  return (
    <section
      ref={ref}
      id="home"
      // Centred, not bottom-anchored. The extra top padding is the height
      // of the fixed nav (~84px) plus the bottom padding, so the block ends
      // up optically balanced in the space *below the nav* rather than
      // balanced in the raw viewport and reading as though it has sunk.
      className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden pb-14 pt-[8.5rem] sm:pb-20 sm:pt-[10.25rem] [@media(max-height:800px)]:pb-12 [@media(max-height:800px)]:pt-[7.5rem]"
    >
      {/* Midground: the photograph, feathered into the paper on every
          edge it meets so there is no hard image seam. */}
      <motion.div
        style={{ y: photoY }}
        className="pointer-events-none absolute inset-x-0 bottom-0 top-auto z-0 h-[46%] lg:bottom-auto lg:left-auto lg:right-0 lg:top-0 lg:h-[92%] lg:w-[50%]"
      >
        <img
          src="/assets/pet-landscape.jpg"
          alt=""
          width={1600}
          height={1066}
          fetchPriority="high"
          decoding="async"
          className="hero-photo h-full w-full object-cover object-[62%_30%]"
        />
      </motion.div>

      {/* Title, rule and caption are ONE group, not three things floating
          at arbitrary heights. The rule is anchored a fixed distance under
          the headline so it reads as structure rather than a stray hairline,
          and it runs past the container to pass behind the identity card.
          The group is then optically centred against the artifact. */}
      <div className="relative z-10 mx-auto grid w-full max-w-[78rem] grid-cols-1 gap-y-10 px-5 sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-y-0">
        <div className="lg:col-span-6 lg:col-start-1">
          {/* The break is forced so the emphasis always sits whole on its own
              line. Left to wrap freely it strands the accent on a third line
              and the italic reads as a stray word instead of a phrase. */}
          <h1 className="font-display text-[clamp(2.45rem,7.8vw,6rem)] font-normal leading-[0.93] tracking-[-0.02em]">
            A passport for <span className="block italic">every pet.</span>
          </h1>

          {/* Overshoots the column so it carries behind the identity card.
              The hero clips it, so it can never cause a scrollbar. */}
          <div
            aria-hidden="true"
            className="pointer-events-none mt-8 hidden h-px w-[200vw] bg-ink/20 lg:block"
          />

          <p className="mt-8 max-w-[44ch] text-[1.05rem] leading-relaxed text-ink-soft">
            ZePaw issues your pet one permanent record. Every vaccination, every
            document, every visit, in one place that any vet, shelter or boarding
            house can verify in seconds.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a
              href="#beta"
              className="group inline-flex items-center gap-3 bg-ink px-6 py-3.5 text-stock transition-colors duration-300 hover:bg-seal-deep active:scale-[0.99]"
              style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
            >
              Request an identity
              <svg width="13" height="13" viewBox="0 0 12 12" aria-hidden="true">
                <path
                  d="M2.5 9.5 9.5 2.5M4.2 2.5h5.3v5.3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-500 ease-out group-hover:translate-x-[3px] group-hover:-translate-y-[3px]"
                />
              </svg>
            </a>
            <p className="text-[0.92rem] text-ink-soft">Free for beta guardians, for life.</p>
          </div>
        </div>

        {/* The signature artifact, crossing both the rule and the photograph */}
        <motion.div
          style={{ y: certY }}
          className="relative z-20 flex justify-center lg:col-span-6 lg:col-start-7 lg:justify-end"
        >
          {/* The resting angle lives on the outer wrapper: motion writes an
              inline transform on the tilt layer, which would otherwise
              override a Tailwind rotate class and stand the card up straight. */}
          <div className="[perspective:1400px] lg:-mr-6 lg:rotate-[-2.5deg]">
            <motion.div
              ref={tilt.ref}
              style={tilt.style}
              {...tilt.handlers}
              className="lifted will-change-transform"
            >
              <IdentityCard />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ==================================================================
   THE RECORD — opens on a statement, not a kicker
   ================================================================== */
const ANATOMY = [
  ['01', 'Issued once', 'A number that is created with the pet and never reassigned.'],
  ['02', 'Kept current', 'Vaccinations, prescriptions and lab work land on the same record.'],
  ['03', 'Read anywhere', 'A vet scans the tag and sees exactly what you have published.'],
  ['04', 'Owned by you', 'Sharing is granted per person, per purpose, and revoked whenever.'],
];

function Record() {
  return (
    <section id="record" className="relative border-t border-ink/12 py-24 sm:py-32">
      <SceneNum n="01" />
      <div className="relative mx-auto max-w-[78rem] px-5 sm:px-8">
        <Rise>
          <h2 className="max-w-[13ch] font-display text-[clamp(2.6rem,6.4vw,5rem)] leading-[0.98] tracking-[-0.02em]">
            Paper is lost. A record <span className="italic">holds.</span>
          </h2>
        </Rise>
        <Rise delay={0.06}>
          <p className="mt-7 max-w-[52ch] text-ink-soft">
            Most pets have their life scattered across a folder of receipts, a WhatsApp
            thread and a clinic&apos;s filing cabinet. ZePaw replaces all of it with one
            record that outlives every one of them.
          </p>
        </Rise>

        <div className="mt-16 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {ANATOMY.map(([n, title, body], i) => (
            <Rise key={n} delay={i * 0.05}>
              <div className="border-t-2 border-ink pt-4">
                <span className="data text-[10px] tracking-[0.18em] text-seal-deep">{n}</span>
                <h3 className="mt-3 font-display text-[1.45rem] leading-tight">{title}</h3>
                <p className="mt-2 text-[0.92rem] leading-relaxed text-ink-soft">{body}</p>
              </div>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==================================================================
   THE REGISTER — the emotional core, and the page's one structural
   move. The record stays pinned while a life scrolls past it, and the
   document reacts: the entry count climbs, the latest entry changes,
   the seal re-strikes, and Shiro visibly ages from day one to two.
   Entries run oldest to newest so scrolling down is time moving
   forward and the record filling up.

   Nothing here is hidden behind the animation. Every entry is in the
   DOM and fully legible; scroll position only drives which one the
   pinned document is currently reporting.
   ================================================================== */
const ENTRIES = [
  {
    date: '04 Jan 2022',
    mark: 'document',
    title: 'Birth record',
    detail: 'Litter of four, fawn male',
    by: 'Registered at issue',
    age: 'Day one',
  },
  {
    date: '08 Mar 2022',
    mark: 'vaccination',
    title: 'DHPP, first dose',
    detail: 'Puppy series begun',
    by: 'Whitefield Vet Clinic',
    age: '9 weeks old',
  },
  {
    date: '21 Mar 2023',
    mark: 'vaccination',
    title: 'DHPP booster',
    detail: 'Series complete',
    by: 'Whitefield Vet Clinic',
    age: '1 year, 2 months',
  },
  {
    date: '18 Oct 2023',
    mark: 'lab',
    title: 'Blood panel',
    detail: 'All values in range',
    by: 'Cessna Diagnostics',
    age: '1 year, 9 months',
  },
  {
    date: '02 Feb 2024',
    mark: 'checkup',
    title: 'Annual examination',
    detail: 'Weight 8.2kg, healthy',
    by: 'Dr. A. Menon',
    age: '2 years, 1 month',
  },
  {
    date: '12 Mar 2024',
    mark: 'vaccination',
    title: 'Rabies booster',
    detail: 'Nobivac, next due Mar 2025',
    by: 'Whitefield Vet Clinic',
    age: '2 years, 2 months',
    due: 'Booster due',
  },
];

/* The pinned document. Re-strikes its seal whenever the entry changes. */
function RecordCard({ index }) {
  const entry = ENTRIES[index];
  const still = useReducedMotion();
  return (
    <article className="notch-tr relative bg-stock px-6 py-6 lifted sm:px-7">
      <div className="pointer-events-none absolute inset-[7px] border border-ink/25" />
      <div className="pointer-events-none absolute inset-[10px] border border-ink/10" />

      <div className="relative">
        <header className="clears-notch flex items-baseline justify-between border-b border-ink/20 pb-3">
          <p className="data text-[9.5px] uppercase tracking-[0.22em] text-ink/75">ZePaw</p>
          <p className="data text-[9.5px] text-ink-soft">Live record</p>
        </header>

        <div className="mt-4 flex items-center gap-4">
          <img
            src="/assets/pet-portrait.jpg"
            alt="Shiro, a fawn pug"
            width={880}
            height={1100}
            loading="lazy"
            decoding="async"
            className="h-[3.6rem] w-[2.9rem] shrink-0 border border-ink/30 object-cover"
          />
          <div className="min-w-0">
            <h3 className="font-display text-[1.6rem] leading-none">Shiro</h3>
            <p className="data mt-1.5 text-[0.82rem] tracking-[0.08em] text-ink-soft">ZP-8471-B92</p>
          </div>
        </div>

        {/* The readout that makes the record feel alive */}
        <dl className="mt-5 border-t border-ink/15 pt-4">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="data text-[9px] uppercase tracking-[0.18em] text-ink-soft">Entries</dt>
            <dd className="data text-[1.5rem] leading-none tabular-nums">
              {String(index + 1).padStart(2, '0')}
              <span className="text-ink-soft"> / {String(ENTRIES.length).padStart(2, '0')}</span>
            </dd>
          </div>

          <div className="mt-4">
            <dt className="data text-[9px] uppercase tracking-[0.18em] text-ink-soft">Latest entry</dt>
            <dd className="mt-1.5 flex items-start gap-2.5">
              <Mark name={entry.mark} size={18} className="mt-[3px] shrink-0 text-seal" />
              <span className="min-w-0">
                <span className="block font-display text-[1.15rem] leading-tight">
                  {entry.title}
                </span>
                <span className="data mt-1 block text-[0.72rem] text-ink-soft">{entry.date}</span>
              </span>
            </dd>
          </div>

          <div className="mt-4 border-t border-ink/15 pt-3">
            <dt className="data text-[9px] uppercase tracking-[0.18em] text-ink-soft">
              Shiro at this entry
            </dt>
            <dd className="mt-1 font-display text-[1.1rem] italic text-ink/85">{entry.age}</dd>
          </div>
        </dl>

        {/* Seal re-strikes on change. It is always rendered at full size
            and opacity; only a decorative impression ring animates, so a
            dead motion engine costs nothing but the flourish. */}
        <div className="relative mt-5 flex justify-end">
          <div className="relative">
            <motion.div
              key={still ? 'static' : index}
              animate={still ? undefined : { scale: [1, 0.92, 1] }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <Seal size={72} className="text-seal" id="ledger-seal" />
            </motion.div>
            {!still && (
              <motion.span
                key={`ring-${index}`}
                aria-hidden="true"
                initial={{ scale: 0.7, opacity: 0.5 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.75, ease: 'easeOut' }}
                className="pointer-events-none absolute inset-0 rounded-full border border-seal"
              />
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function Ledger() {
  const [active, setActive] = useState(0);
  const still = useReducedMotion();
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [travel, setTravel] = useState(0);
  const n = ENTRIES.length;

  /* Vertical scroll drives horizontal time. The section is a tall scroll
     runway; its viewport-high inner screen pins while progress pushes the
     entries left, so two years pass sideways in front of the record.
     Reduced motion opts out of the pin entirely and leaves a plain,
     natively swipeable horizontal strip. */
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0.06, 0.94], [0, -travel]);
  const fill = useTransform(scrollYProgress, [0.06, 0.94], [0, 1]);

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const t = Math.min(Math.max((p - 0.06) / 0.88, 0), 1);
    setActive(Math.min(n - 1, Math.round(t * (n - 1))));
  });

  useEffect(() => {
    if (still) return undefined;
    const measure = () => {
      if (trackRef.current && containerRef.current) {
        setTravel(
          Math.max(0, trackRef.current.scrollWidth - containerRef.current.clientWidth)
        );
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [still]);

  return (
    <section
      ref={sectionRef}
      id="ledger"
      className={`relative border-y border-ink/12 bg-stone ${
        still ? 'py-24 sm:py-32' : 'h-[340vh]'
      }`}
    >
      <SceneNum n="03" />
      <div
        className={
          still
            ? 'relative'
            : 'sticky top-0 flex h-[100dvh] flex-col justify-center overflow-hidden'
        }
      >
        <div className="mx-auto w-full max-w-[78rem] px-5 sm:px-8">
          <div className="relative flex flex-wrap items-end justify-between gap-x-8 gap-y-3 border-b-2 border-ink/20 pb-4">
            <h2 className="font-display text-[clamp(1.9rem,4.2vw,3rem)] leading-none tracking-[-0.015em]">
              One record, a whole life.
            </h2>
            <p className="max-w-[34ch] text-[0.9rem] text-ink-soft [@media(max-height:780px)]:hidden">
              Two years of Shiro. Keep scrolling, time moves sideways.
            </p>
            {/* The masthead rule doubles as the timeline's progress: it fills
                as the years pass. Square caps, so the fill never morphs. */}
            {!still && (
              <motion.span
                aria-hidden="true"
                style={{ scaleX: fill }}
                className="absolute -bottom-[2px] left-0 h-[2px] w-full origin-left bg-seal-deep"
              />
            )}
          </div>

          {/* Mobile: the record continues as a slim live readout.
              aria-hidden: it restates the entries beside it. */}
          <div
            aria-hidden="true"
            className="mt-5 flex items-center gap-3 border-b border-ink/15 pb-3 lg:hidden"
          >
            <span className="data shrink-0 text-[0.95rem] tabular-nums">
              {String(active + 1).padStart(2, '0')}
              <span className="text-ink-soft"> / 0{n}</span>
            </span>
            <span className="h-4 w-px shrink-0 bg-ink/20" />
            <span className="min-w-0 flex-1 truncate font-display text-[1rem]">
              {ENTRIES[active].title}
            </span>
            <span className="data shrink-0 text-[0.7rem] text-ink-soft">
              {ENTRIES[active].age}
            </span>
          </div>

          <div className="mt-6 grid items-center gap-8 sm:mt-10 lg:grid-cols-12 lg:gap-12 [@media(max-height:820px)]:mt-5">
            <div className="hidden lg:col-span-4 lg:block">
              <RecordCard index={still ? n - 1 : active} />
            </div>

            <div
              ref={containerRef}
              className={`lg:col-span-8 ${
                still ? 'no-scrollbar overflow-x-auto' : 'overflow-hidden'
              }`}
            >
              <motion.ol
                ref={trackRef}
                style={still ? undefined : { x }}
                className="flex w-max items-stretch gap-6 py-2"
              >
                {ENTRIES.map((e, i) => (
                  <li
                    key={e.date}
                    className="notch-tr edge relative flex w-[min(24rem,78vw)] shrink-0 flex-col bg-stock px-6 py-6"
                  >
                    <div className="clears-notch flex items-baseline justify-between gap-4 border-b border-ink/15 pb-3">
                      <time
                        dateTime={new Date(e.date).toISOString().slice(0, 10)}
                        className="data text-[0.78rem] text-ink-soft"
                      >
                        {e.date}
                      </time>
                      <span className="data text-[0.7rem] text-ink-soft">
                        {String(i + 1).padStart(2, '0')} / 0{n}
                      </span>
                    </div>
                    <div className="mt-4 flex items-start gap-4">
                      <Mark name={e.mark} size={24} className="mt-1 shrink-0 text-seal" />
                      <div className="min-w-0">
                        <h3 className="font-display text-[1.5rem] leading-tight sm:text-[1.65rem]">
                          {e.title}
                        </h3>
                        <p className="mt-1.5 text-[0.95rem] text-ink-soft">{e.detail}</p>
                        <p className="mt-1 text-[0.88rem] text-ink-soft">{e.by}</p>
                      </div>
                    </div>
                    <div className="mt-auto flex items-end justify-between pt-4">
                      <span className="data text-[0.72rem] uppercase tracking-[0.14em] text-ink-soft">
                        {e.age}
                      </span>
                      {e.due && (
                        <span className="data inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.14em] text-amber-deep">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber" />
                          {e.due}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </motion.ol>
            </div>
          </div>

          <p className="mt-6 max-w-[52ch] text-[0.95rem] text-ink-soft sm:mt-8 [@media(max-height:780px)]:hidden">
            Entries are appended, never overwritten. When Shiro changes vets, moves
            city or outlives a clinic&apos;s filing system, the record does not.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ==================================================================
   VERIFY — a control that genuinely works
   ================================================================== */
const DEMO_ID = 'ZP8471B92';
const PUBLIC_RECORD = [
  ['Name', 'Shiro'],
  ['Species', 'Dog · Pug'],
  ['Rabies', 'Current, expires 12 Mar 2025', true],
  ['Status', 'Active · not reported missing'],
];

function Verify() {
  const [value, setValue] = useState('');
  const [state, setState] = useState('idle'); // idle | checking | found | missing
  const inputId = useId();
  const still = useReducedMotion();

  const check = (e) => {
    e.preventDefault();
    const normalised = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!normalised) {
      setState('idle');
      return;
    }
    setState('checking');
    setTimeout(() => setState(normalised === DEMO_ID ? 'found' : 'missing'), 620);
  };

  return (
    <section id="verify" className="relative border-y border-ink/12 bg-stone py-24 sm:py-32">
      <SceneNum n="04" />
      <div className="relative mx-auto grid max-w-[78rem] gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        <div>
          <Rise>
            {/* Opens on a question — a different shape from every other section */}
            <h2 className="max-w-[16ch] font-display text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.02] tracking-[-0.015em]">
              Whose dog is this?
            </h2>
          </Rise>
          <Rise delay={0.06}>
            <p className="mt-6 max-w-[44ch] text-ink-soft">
              Anyone who finds a pet wearing a ZePaw tag can answer that in one scan,
              without ever seeing a medical file. Try the sample identity below.
            </p>
          </Rise>

          <Rise delay={0.1}>
            <form onSubmit={check} className="mt-9">
              <label
                htmlFor={inputId}
                className="data block text-[10px] uppercase tracking-[0.2em] text-ink-soft"
              >
                Identity number
              </label>
              <div className="mt-3 flex flex-wrap gap-3">
                <input
                  id={inputId}
                  value={value}
                  onChange={(e) => {
                    setValue(e.target.value);
                    if (state !== 'idle') setState('idle');
                  }}
                  placeholder="ZP-8471-B92"
                  autoComplete="off"
                  spellCheck="false"
                  aria-describedby={`${inputId}-status`}
                  className="data h-12 min-w-0 flex-1 border border-ink/25 bg-stock px-4 text-[0.95rem] tracking-[0.1em] placeholder:text-ink-soft focus:border-seal focus:outline-none"
                />
                <button
                  type="submit"
                  className="h-12 shrink-0 bg-ink px-7 text-stock transition-colors duration-300 hover:bg-seal-deep disabled:opacity-60"
                  disabled={state === 'checking'}
                >
                  {state === 'checking' ? 'Checking…' : 'Verify'}
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  setValue('ZP-8471-B92');
                  setState('idle');
                }}
                className="mt-3 text-[0.9rem] text-seal-deep underline decoration-seal-deep/40 underline-offset-4 transition-colors duration-300 hover:decoration-seal-deep"
              >
                Use the sample identity
              </button>
            </form>
          </Rise>
        </div>

        {/* Result — reserves its own height so nothing below it jumps */}
        <div className="lg:pt-6">
          <div
            id={`${inputId}-status`}
            aria-live="polite"
            className="notch-br relative min-h-[19rem] border border-ink/20 bg-stock px-6 py-7 sm:px-8"
          >
            <AnimatePresence mode="wait">
              {state === 'found' ? (
                <motion.div
                  key="found"
                  initial={still ? false : { y: 10 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {/* A stranger scanning the tag sees the pet, not a form */}
                      <img
                        src="/assets/pet-portrait.jpg"
                        alt="Shiro, a fawn pug"
                        width={880}
                        height={1100}
                        loading="lazy"
                        decoding="async"
                        className="h-[4.4rem] w-[3.5rem] border border-ink/25 object-cover"
                      />
                      <div>
                        <p className="data text-[9px] uppercase tracking-[0.2em] text-seal-deep">
                          Identity verified
                        </p>
                        <p className="data mt-2 text-[1.05rem] tracking-[0.1em]">ZP-8471-B92</p>
                      </div>
                    </div>
                    <Seal size={62} className="shrink-0 text-seal" id="verify-seal" />
                  </div>
                  <dl className="mt-5 border-t border-ink/15">
                    {PUBLIC_RECORD.map(([k, v, flagged]) => (
                      <div
                        key={k}
                        className="flex items-baseline justify-between gap-4 border-b border-ink/10 py-2.5"
                      >
                        <dt className="data text-[9px] uppercase tracking-[0.18em] text-ink-soft">
                          {k}
                        </dt>
                        <dd className="flex items-center gap-2 text-right text-[0.9rem]">
                          {flagged && (
                            <span
                              className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber"
                              aria-hidden="true"
                            />
                          )}
                          {v}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-4 text-[0.82rem] leading-relaxed text-ink-soft">
                    Medical history, documents and contact details stay private unless the
                    guardian grants access.
                  </p>
                </motion.div>
              ) : state === 'missing' ? (
                <motion.div
                  key="missing"
                  initial={still ? false : { y: 10 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <p className="data text-[9px] uppercase tracking-[0.2em] text-ink-soft">
                    No match on file
                  </p>
                  <p className="mt-4 max-w-[32ch] font-display text-[1.5rem] leading-tight">
                    That identity is not in the register.
                  </p>
                  <p className="mt-3 text-[0.9rem] leading-relaxed text-ink-soft">
                    Check the number on the tag, or try the sample identity{' '}
                    <span className="data">ZP-8471-B92</span>.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={still ? false : { y: 8 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="flex h-full min-h-[15rem] flex-col justify-center"
                >
                  <Seal
                    size={78}
                    className={`text-ink/20 ${state === 'checking' ? 'animate-pulse' : ''}`}
                    id="idle-seal"
                  />
                  <p className="mt-5 max-w-[30ch] text-[0.95rem] leading-relaxed text-ink-soft">
                    {state === 'checking'
                      ? 'Checking the register…'
                      : 'Enter an identity number to see what a stranger would see.'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==================================================================
   ISSUE — what ZePaw offers now, and next
   ================================================================== */
const NOW = [
  'Permanent ZePaw Identity',
  'Digital health vault',
  'Vaccination register',
  'QR verification tag',
  'Care reminders',
  'Owner-controlled sharing',
];
const NEXT = [
  'Direct clinic filing',
  'Insurance claim export',
  'Diagnostic lab intake',
  'Lost-pet broadcast',
  'Multi-guardian access',
  'Breed health insights',
];

function Issue() {
  return (
    <section className="relative border-t border-ink/12 py-24 sm:py-32">
      <div className="mx-auto max-w-[78rem] px-5 sm:px-8">
        <div className="grid gap-14 sm:grid-cols-2 sm:gap-16">
          {[
            ['Available at launch', NOW, true],
            ['Coming soon', NEXT, false],
          ].map(([heading, items, live], col) => (
            <Rise key={heading} delay={col * 0.06}>
              <div>
                <div className="flex items-baseline justify-between border-b-2 border-ink pb-3">
                  <h2 className="font-display text-[1.7rem] leading-none sm:text-[2rem]">
                    {heading}
                  </h2>
                  <span className="data text-[9px] uppercase tracking-[0.2em] text-ink-soft">
                    {live ? 'Live soon' : 'Planned'}
                  </span>
                </div>
                <ul>
                  {items.map((item, i) => (
                    <li
                      key={item}
                      className="flex items-baseline gap-4 border-b border-ink/10 py-3.5"
                    >
                      <span className="data text-[10px] text-ink-soft">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className={live ? 'text-ink' : 'text-ink-soft'}>{item}</span>
                      {live && (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          className="ml-auto shrink-0 self-center text-seal-deep"
                          aria-hidden="true"
                        >
                          <path
                            d="M2 6.4 4.7 9 10 3.2"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==================================================================
   TRUST — terse and typographic
   ================================================================== */
const TRUST = [
  ['The record belongs to the guardian.', 'Not to a clinic, and not to us.'],
  ['Encrypted in transit and at rest.', 'Including every uploaded document.'],
  ['Medical history is never public.', 'Verification shows only published fields.'],
  ['Access can be revoked at any time.', 'Granted per person, per purpose.'],
];

function Trust() {
  return (
    <section className="relative border-t border-ink/12 py-24 sm:py-32">
      <div className="mx-auto max-w-[78rem] px-5 sm:px-8">
        <Rise>
          <h2 className="max-w-[24ch] font-display text-[clamp(1.9rem,4.2vw,3rem)] leading-[1.05] tracking-[-0.015em]">
            A record this permanent has to be handled carefully.
          </h2>
        </Rise>
        <dl className="mt-14 max-w-[58rem]">
          {TRUST.map(([term, desc], i) => (
            <Rise key={term} delay={i * 0.04}>
              <div className="flex flex-col gap-1.5 border-t border-ink/15 py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-10">
                <dt className="font-display text-[1.4rem] leading-snug">{term}</dt>
                <dd className="shrink-0 text-[0.95rem] text-ink-soft sm:text-right">{desc}</dd>
              </div>
            </Rise>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ==================================================================
   BETA — request a ZePaw Identity
   ================================================================== */
const PET_TYPES = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Turtle', 'Exotic', 'Other'];

function Beta() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    petType: '',
    city: '',
    website: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const still = useReducedMotion();

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = 'Please enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email.';
    if (!form.petType) e.petType = 'Please choose a pet type.';
    if (form.city.trim().length < 2) e.city = 'Please enter your city.';
    if (form.phone && !/^[6-9]\d{9}$/.test(form.phone))
      e.phone = 'Enter a 10-digit number, or leave blank.';
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      document.getElementById(`beta-${Object.keys(e)[0]}`)?.focus();
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
      if (!res.ok || !data.success) throw new Error(data.error || 'Submission failed');
      setDone(true);
    } catch (err) {
      toast.error(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const field =
    'mt-2 h-12 w-full border bg-stock px-4 text-[0.95rem] focus:border-seal focus:outline-none';

  return (
    <section id="beta" className="relative overflow-hidden border-t border-ink/12 py-24 sm:py-32">
      {/* Atmosphere has to carry down the page, not stop at the fold. The
          closing section sits on a photographic field, feathered on every
          edge into the same paper so there is no seam and no hard band. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-0 w-full lg:w-[58%]"
      >
        <img
          src="/assets/pet-landscape.jpg"
          alt=""
          width={1600}
          height={1066}
          loading="lazy"
          decoding="async"
          className="hero-photo h-full w-full object-cover object-[45%_35%] opacity-70 lg:opacity-100"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[78rem] px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <Rise>
              <h2 className="max-w-[15ch] font-display text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.02] tracking-[-0.015em]">
                Be first to give your pet an <span className="italic">identity.</span>
              </h2>
            </Rise>
            <Rise delay={0.06}>
              <p className="mt-6 max-w-[42ch] text-ink-soft">
                We are issuing the first identities in Bengaluru and opening city by city.
                Beta guardians help shape what the record holds, and keep their identity
                free for life.
              </p>
            </Rise>
            <Rise delay={0.1}>
              <div className="mt-10 hidden lg:block">
                <Seal size={128} className="text-ink/15" id="beta-seal" />
              </div>
            </Rise>
          </div>

          <div className="lg:col-span-7">
            <div className="notch-tr relative bg-stock px-6 py-8 sm:px-10 sm:py-10">
              <div className="pointer-events-none absolute inset-[7px] border border-ink/20" />
              <div className="relative">
                <AnimatePresence mode="wait">
                  {done ? (
                    <motion.div
                      key="done"
                      initial={still ? false : { y: 12 }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.55, ease: EASE }}
                      className="py-6"
                      role="status"
                    >
                      <p className="data text-[9px] uppercase tracking-[0.22em] text-seal-deep">
                        Application received
                      </p>
                      <p className="mt-4 max-w-[24ch] font-display text-[2rem] leading-[1.05]">
                        You are on the register.
                      </p>
                      <p className="mt-4 max-w-[42ch] text-[0.95rem] leading-relaxed text-ink-soft">
                        We will email you when your pet&apos;s identity is ready to issue.
                        Nothing else: no newsletters, no partners.
                      </p>
                      <div className="mt-7 flex items-center gap-5">
                        <Seal size={64} className="text-seal" id="done-seal" />
                        <button
                          type="button"
                          onClick={() => {
                            setDone(false);
                            setForm({
                              name: '',
                              email: '',
                              phone: '',
                              petType: '',
                              city: '',
                              website: '',
                            });
                          }}
                          className="text-[0.9rem] text-ink-soft underline decoration-ink/30 underline-offset-4 transition-colors duration-300 hover:text-ink hover:decoration-ink"
                        >
                          Enrol another pet
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={submit}
                      noValidate
                      initial={false}
                      className="clears-notch"
                    >
                      <p className="data text-[9px] uppercase tracking-[0.22em] text-ink-soft">
                        Beta enrolment · Form ZP-01
                      </p>

                      {/* Honeypot */}
                      <input
                        type="text"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        value={form.website}
                        onChange={set('website')}
                        className="absolute -left-[9999px] h-px w-px opacity-0"
                      />

                      <div className="mt-6 grid gap-5 sm:grid-cols-2">
                        {[
                          ['name', 'Your name', 'text', 'Priya Sharma', 'name'],
                          ['email', 'Email', 'email', 'you@example.com', 'email'],
                          ['city', 'City', 'text', 'Bengaluru', 'address-level2'],
                          ['phone', 'Phone (optional)', 'tel', '98765 43210', 'tel'],
                        ].map(([key, label, type, placeholder, ac]) => (
                          <div key={key}>
                            <label
                              htmlFor={`beta-${key}`}
                              className="data text-[9px] uppercase tracking-[0.18em] text-ink-soft"
                            >
                              {label}
                            </label>
                            <input
                              id={`beta-${key}`}
                              type={type}
                              value={form[key]}
                              onChange={set(key)}
                              placeholder={placeholder}
                              autoComplete={ac}
                              inputMode={key === 'phone' ? 'numeric' : undefined}
                              maxLength={key === 'phone' ? 10 : undefined}
                              aria-invalid={errors[key] ? 'true' : undefined}
                              aria-describedby={errors[key] ? `beta-${key}-err` : undefined}
                              className={`${field} ${
                                errors[key] ? 'border-destructive' : 'border-ink/25'
                              }`}
                            />
                            {errors[key] && (
                              <p
                                id={`beta-${key}-err`}
                                className="mt-1.5 text-[0.78rem] text-destructive"
                              >
                                {errors[key]}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>

                      <fieldset className="mt-6">
                        <legend className="data text-[9px] uppercase tracking-[0.18em] text-ink-soft">
                          Pet type
                        </legend>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {PET_TYPES.map((t) => {
                            const active = form.petType === t;
                            return (
                              <button
                                key={t}
                                type="button"
                                aria-pressed={active}
                                onClick={() => {
                                  setForm((f) => ({ ...f, petType: t }));
                                  setErrors((x) => ({ ...x, petType: undefined }));
                                }}
                                className={`border px-4 py-2 text-[0.88rem] transition-colors duration-300 ${
                                  active
                                    ? 'border-ink bg-ink text-stock'
                                    : 'border-ink/25 text-ink-soft hover:border-ink hover:text-ink'
                                }`}
                              >
                                {t}
                              </button>
                            );
                          })}
                        </div>
                        <input
                          id="beta-petType"
                          className="sr-only"
                          tabIndex={-1}
                          value={form.petType}
                          onChange={() => {}}
                          aria-hidden="true"
                        />
                        {errors.petType && (
                          <p className="mt-2 text-[0.78rem] text-destructive">{errors.petType}</p>
                        )}
                      </fieldset>

                      <button
                        type="submit"
                        disabled={loading}
                        className="group mt-8 inline-flex w-full items-center justify-center gap-3 bg-ink px-6 py-4 text-stock transition-colors duration-300 hover:bg-seal-deep disabled:opacity-60 sm:w-auto"
                      >
                        {loading ? 'Filing your application…' : 'File my application'}
                        {!loading && (
                          <svg width="13" height="13" viewBox="0 0 12 12" aria-hidden="true">
                            <path
                              d="M2.5 9.5 9.5 2.5M4.2 2.5h5.3v5.3"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="transition-transform duration-500 ease-out group-hover:translate-x-[3px] group-hover:-translate-y-[3px]"
                            />
                          </svg>
                        )}
                      </button>
                      <p className="mt-4 text-[0.78rem] text-ink-soft">
                        We email you about your enrolment and nothing else.
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==================================================================
   FAQ
   ================================================================== */
const FAQS = [
  [
    'What is a ZePaw identity?',
    'A permanent digital identity issued to a pet, like a passport. It holds their health record for life and can be verified by anyone the owner allows.',
  ],
  [
    'How does verification work?',
    'Any vet, boarding facility or shelter can enter the identity number or scan the QR tag. Only the fields the owner has published are shown; medical records stay private.',
  ],
  [
    'Is my pet’s data secure?',
    'Yes. Records are encrypted in transit and at rest. Medical history is never public, and the owner controls every sharing decision and can revoke access at any time.',
  ],
  [
    'When does the beta open?',
    'Invitations go out in waves. Join the beta list and we will email you when your access is ready.',
  ],
  [
    'Is ZePaw only for dogs and cats?',
    'No. ZePaw issues identities for dogs, cats, birds, rabbits, hamsters, turtles and exotic pets.',
  ],
];

function Faq() {
  return (
    <section id="faq" className="relative border-t border-ink/12 py-24 sm:py-32">
      <div className="mx-auto grid max-w-[78rem] gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-4">
          <Rise>
            <h2 className="font-display text-[clamp(1.9rem,4.2vw,3rem)] leading-[1.02] tracking-[-0.015em]">
              Questions, <span className="italic">answered.</span>
            </h2>
          </Rise>
          <Rise delay={0.05}>
            <p className="mt-5 max-w-[32ch] text-[0.95rem] text-ink-soft">
              Anything else, write to{' '}
              <a
                href="mailto:hello@zepaw.in"
                className="text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-ink"
              >
                hello@zepaw.in
              </a>
              .
            </p>
          </Rise>
        </div>

        <div className="lg:col-span-8">
          <Accordion type="single" collapsible className="border-t border-ink/20">
            {FAQS.map(([q, a], i) => (
              <AccordionItem
                key={i}
                value={`q-${i}`}
                className="border-b border-ink/12 last:border-b"
              >
                <AccordionTrigger className="gap-6 py-6 text-left font-display text-[1.25rem] leading-snug hover:no-underline sm:text-[1.4rem]">
                  {q}
                </AccordionTrigger>
                <AccordionContent className="max-w-[58ch] pb-7 text-[0.97rem] leading-relaxed text-ink-soft">
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

/* ==================================================================
   FOOTER — its own darker floor, wordmark flush to the bottom edge
   ================================================================== */
function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink pt-20 text-stock">
      <div className="mx-auto max-w-[78rem] px-5 sm:px-8">
        <div className="grid gap-12 pb-16 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="max-w-[34ch] font-display text-[1.5rem] leading-snug">
              One record, issued once, carried for a whole life.
            </p>
            <div className="mt-7 flex items-center gap-6">
              {/* Real marks, bare — no tile behind them */}
              <a
                href="https://www.instagram.com/zepaw.official"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ZePaw on Instagram"
                className="text-stock/60 transition-colors duration-300 hover:text-stock"
              >
                <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 1.44c-3.14 0-3.51.01-4.75.07-1.15.05-1.77.24-2.18.4-.55.22-.94.47-1.35.88-.41.41-.66.8-.88 1.35-.16.41-.35 1.03-.4 2.18-.06 1.24-.07 1.61-.07 4.75s.01 3.51.07 4.75c.05 1.15.24 1.77.4 2.18.22.55.47.94.88 1.35.41.41.8.66 1.35.88.41.16 1.03.35 2.18.4 1.24.06 1.61.07 4.75.07s3.51-.01 4.75-.07c1.15-.05 1.77-.24 2.18-.4.55-.22.94-.47 1.35-.88.41-.41.66-.8.88-1.35.16-.41.35-1.03.4-2.18.06-1.24.07-1.61.07-4.75s-.01-3.51-.07-4.75c-.05-1.15-.24-1.77-.4-2.18a3.6 3.6 0 0 0-.88-1.35 3.6 3.6 0 0 0-1.35-.88c-.41-.16-1.03-.35-2.18-.4-1.24-.06-1.61-.07-4.75-.07zm0 2.45a5.95 5.95 0 1 1 0 11.9 5.95 5.95 0 0 1 0-11.9zm0 9.81a3.86 3.86 0 1 0 0-7.72 3.86 3.86 0 0 0 0 7.72zm7.58-10.05a1.39 1.39 0 1 1-2.78 0 1.39 1.39 0 0 1 2.78 0z" />
                </svg>
              </a>
              <a
                href="mailto:hello@zepaw.in"
                aria-label="Email ZePaw"
                className="text-stock/60 transition-colors duration-300 hover:text-stock"
              >
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="2.5" y="4.5" width="19" height="15" />
                  <path d="m2.5 6.5 9.5 7 9.5-7" />
                </svg>
              </a>
            </div>
          </div>

          <nav aria-label="Footer">
            <h2 className="font-display text-[1.05rem] text-stock/65">Explore</h2>
            <ul className="mt-4 space-y-2.5 text-[0.92rem] text-stock/75">
              {NAV.map(([label, href]) => (
                <li key={href}>
                  <a href={href} className="transition-colors duration-300 hover:text-stock">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-display text-[1.05rem] text-stock/65">Contact</h2>
            <ul className="mt-4 space-y-2.5 text-[0.92rem] text-stock/75">
              <li>
                <a
                  href="mailto:hello@zepaw.in"
                  className="transition-colors duration-300 hover:text-stock"
                >
                  hello@zepaw.in
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@zepaw.in"
                  className="transition-colors duration-300 hover:text-stock"
                >
                  support@zepaw.in
                </a>
              </li>
              <li className="text-stock/70">Bengaluru, India</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-stock/15 py-6 text-[0.78rem] text-stock/65 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ZePaw</p>
          <p>Issuing identities from Bengaluru.</p>
        </div>
      </div>

      {/* Signature wordmark. Drawn as SVG with textLength so it spans the
          full measure at every viewport — balanced rather than stranded on
          one side — and sits flush to the bottom edge with no gap beneath.
          The viewBox is cut below the baseline so the caps keep full room
          above while the word rests exactly on the page edge. */}
      <div className="relative select-none px-5 pt-8 sm:px-8" aria-hidden="true">
        <svg
          viewBox="0 0 1000 292"
          width="100%"
          className="block text-stock/[0.08]"
          role="presentation"
          focusable="false"
        >
          <text
            x="500"
            y="292"
            textAnchor="middle"
            textLength="1000"
            lengthAdjust="spacing"
            fill="currentColor"
            fontFamily="var(--font-display), Georgia, serif"
            fontSize="368"
            fontWeight="700"
          >
            ZePaw
          </text>
        </svg>
      </div>
    </footer>
  );
}

/* ================================================================== */
export default function LandingPage() {
  return (
    <MotionConfig reducedMotion="user">
      <Nav />
      <div id="main">
        <Hero />
        <Record />
        <Vault />
        <Ledger />
        <Verify />
        <EveryPet />
        <Issue />
        <Trust />
        <Beta />
        <Faq />
      </div>
      <Footer />
    </MotionConfig>
  );
}
