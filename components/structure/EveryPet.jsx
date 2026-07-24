'use client';

import { useState, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Seal, Mark, Rise, SceneNum, EASE } from './registry';

/* ==================================================================
   FOR EVERY FAMILY — zepaw.in's pet-types and care-reminders
   sections, merged into one interactive artifact.

   Their site lists seven pet types as an icon grid and six reminder
   categories as another. Here you pick the companion and watch their
   identity be issued on the spot: name, breed and number change, the
   verification mark re-strikes, and the card carries that species'
   own care schedule (their reminder categories, with dates).

   Only Shiro has a photograph — the others show the empty photo slot
   a real registration would fill, which is honest and doubles as the
   invitation.
   ================================================================== */

const PETS = [
  {
    type: 'Dog',
    name: 'Shiro',
    breed: 'Pug',
    id: 'ZP-8471-B92',
    born: '04 Jan 2022',
    photo: true,
    care: [
      ['reminder', 'Rabies booster', 'Mar 2025', true],
      ['vaccination', 'Deworming', 'Every 3 months'],
      ['checkup', 'Annual checkup', 'Feb 2025'],
    ],
  },
  {
    type: 'Cat',
    name: 'Mishka',
    breed: 'Indie',
    id: 'ZP-2214-C07',
    born: '19 Aug 2023',
    care: [
      ['reminder', 'Tricat booster', 'Sep 2025', true],
      ['insurance', 'Flea & tick', 'Monthly'],
      ['checkup', 'Grooming', 'Every 6 weeks'],
    ],
  },
  {
    type: 'Bird',
    name: 'Kiwi',
    breed: 'Cockatiel',
    id: 'ZP-9038-K11',
    born: '02 May 2024',
    care: [
      ['checkup', 'Wing & nail trim', 'Nov 2025', true],
      ['lab', 'Crop check', 'Yearly'],
      ['reminder', 'Hatch day', '02 May'],
    ],
  },
  {
    type: 'Rabbit',
    name: 'Clover',
    breed: 'Holland Lop',
    id: 'ZP-5521-R44',
    born: '11 Mar 2023',
    care: [
      ['vaccination', 'RHDV vaccine', 'Apr 2025', true],
      ['checkup', 'Dental check', 'Every 6 months'],
      ['reminder', 'Nail trim', 'Monthly'],
    ],
  },
  {
    type: 'Hamster',
    name: 'Biscuit',
    breed: 'Syrian',
    id: 'ZP-7710-H23',
    born: '27 Dec 2024',
    care: [
      ['checkup', 'Vet check', 'Every 6 months', true],
      ['document', 'Weight log', 'Weekly'],
      ['reminder', 'Birthday', '27 Dec'],
    ],
  },
  {
    type: 'Turtle',
    name: 'Sheldon',
    breed: 'Red-eared slider',
    id: 'ZP-1189-T65',
    born: '15 Jun 2019',
    care: [
      ['lab', 'Shell & scute check', 'Jan 2026', true],
      ['checkup', 'UVB bulb change', 'Every 6 months'],
      ['reminder', 'Tank clean', 'Weekly'],
    ],
  },
  {
    type: 'Exotic',
    name: 'Zuko',
    breed: 'Bearded dragon',
    id: 'ZP-6402-X09',
    born: '08 Sep 2022',
    care: [
      ['lab', 'Parasite screen', 'Dec 2025', true],
      ['checkup', 'Exotic vet visit', 'Yearly'],
      ['reminder', 'UVB bulb change', 'Every 6 months'],
    ],
  },
];

function SwapText({ children, k, className = '' }) {
  const still = useReducedMotion();
  return (
    <motion.span
      key={k}
      initial={still ? false : { y: 9 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
      className={`block ${className}`}
    >
      {children}
    </motion.span>
  );
}

export function EveryPet() {
  const [idx, setIdx] = useState(0);
  const pet = PETS[idx];
  const still = useReducedMotion();
  const cardRef = useRef(null);

  const issue = (i) => {
    setIdx(i);
    // Below lg the buttons sit above the card, so issuing a new identity
    // would otherwise happen off-screen. Bring the card into view.
    if (window.innerWidth < 1024 && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'center' });
    }
  };

  return (
    <section id="family" className="relative border-t border-ink/12 py-24 sm:py-32">
      <SceneNum n="05" />
      <div className="relative mx-auto grid max-w-[78rem] items-center gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16">
        {/* The card sits LEFT this time — the mirror of the hero, so the
            two identity artifacts do not read as the same composition. */}
        <div className="order-2 lg:order-1 lg:col-span-5">
          <article
            ref={cardRef}
            className="notch-tr lifted relative mx-auto w-full max-w-[22rem] bg-stock text-ink"
            aria-live="polite"
            aria-label={`Example identity for ${pet.name}, a ${pet.breed.toLowerCase()}`}
          >
            <div className="pointer-events-none absolute inset-[7px] border border-ink/25" />
            <div className="relative px-6 pb-6 pt-5">
              <header className="clears-notch flex items-baseline justify-between border-b border-ink/20 pb-3">
                <p className="data text-[9.5px] uppercase tracking-[0.22em] text-ink/75">ZePaw</p>
                <p className="data text-[9.5px] text-ink-soft">Digital ID</p>
              </header>

              <div className="mt-4 flex gap-4">
                {/* Photo slot: filled for Shiro, open for everyone else */}
                <div className="relative h-[6.4rem] w-[5.1rem] shrink-0 border border-ink/30">
                  {pet.photo ? (
                    <img
                      src="/assets/pet-portrait.jpg"
                      alt={`${pet.name}, a fawn pug`}
                      width={880}
                      height={1100}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-stone">
                      <Seal size={40} className="text-ink/20" id={`slot-${pet.id}`} />
                      <p className="data px-2 text-center text-[6.5px] uppercase tracking-[0.14em] text-ink-soft">
                        Photo at registration
                      </p>
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1 overflow-hidden">
                  <p className="data text-[9px] uppercase tracking-[0.2em] text-ink-soft">Name</p>
                  <h3 className="mt-0.5 font-display text-[1.9rem] leading-[0.95] tracking-tight">
                    <SwapText k={`n-${pet.id}`}>{pet.name}</SwapText>
                  </h3>
                  <p className="mt-1 text-[0.82rem] text-ink-soft">
                    <SwapText k={`b-${pet.id}`}>
                      {pet.type} · {pet.breed}
                    </SwapText>
                  </p>
                  <div className="mt-2.5 border-t border-ink/15 pt-2">
                    <p className="data text-[9px] uppercase tracking-[0.2em] text-ink-soft">
                      Identity No.
                    </p>
                    <p className="data mt-0.5 text-[1rem] font-medium leading-none tracking-[0.08em]">
                      <SwapText k={`i-${pet.id}`}>{pet.id}</SwapText>
                    </p>
                  </div>
                </div>
              </div>

              {/* Care schedule — the Smart Care Reminders feature, shown as
                  the card's own upcoming entries */}
              <div className="mt-5 border-t border-ink/15 pt-3">
                <p className="data text-[9px] uppercase tracking-[0.18em] text-ink-soft">
                  Care schedule
                </p>
                <ul className="mt-1.5">
                  {pet.care.map(([mark, label, when, due]) => (
                    <li
                      key={label}
                      className="flex items-center gap-2.5 border-b border-ink/10 py-[0.45rem] last:border-b-0"
                    >
                      <Mark name={mark} size={15} className="shrink-0 text-seal" />
                      <span className="min-w-0 flex-1 truncate text-[0.82rem]">
                        <SwapText k={`${pet.id}-${label}`}>{label}</SwapText>
                      </span>
                      <span
                        className={`data shrink-0 text-[0.68rem] ${
                          due ? 'text-amber-deep' : 'text-ink-soft'
                        }`}
                      >
                        {due && (
                          <span
                            className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-amber align-middle"
                            aria-hidden="true"
                          />
                        )}
                        {when}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 flex items-end justify-between">
                <p className="data text-[8px] uppercase tracking-[0.16em] text-ink-soft">
                  Born {pet.born}
                </p>
                {/* Re-struck on every issue */}
                <div className="relative">
                  <motion.div
                    key={still ? 'seal' : pet.id}
                    animate={still ? undefined : { scale: [1.14, 0.94, 1] }}
                    transition={{ duration: 0.5, ease: EASE }}
                  >
                    <Seal size={64} className="text-seal" id="family-seal" />
                  </motion.div>
                  {!still && (
                    <motion.span
                      key={`ring-${pet.id}`}
                      aria-hidden="true"
                      initial={{ scale: 0.72, opacity: 0.5 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                      className="pointer-events-none absolute inset-0 rounded-full border border-seal"
                    />
                  )}
                </div>
              </div>
            </div>
          </article>
        </div>

        {/* Controls */}
        <div className="order-1 lg:order-2 lg:col-span-7">
          <Rise>
            <h2 className="max-w-[16ch] font-display text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.02] tracking-[-0.015em]">
              Built for every <span className="italic">family.</span>
            </h2>
          </Rise>
          <Rise delay={0.06}>
            <p className="mt-6 max-w-[46ch] text-ink-soft">
              Whatever kind of companion shares your home, ZePaw issues them an
              identity and keeps their care on schedule. Try one.
            </p>
          </Rise>
          <Rise delay={0.1}>
            <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Choose a pet type">
              {PETS.map((p, i) => {
                const on = i === idx;
                return (
                  <button
                    key={p.type}
                    type="button"
                    aria-pressed={on}
                    onClick={() => issue(i)}
                    className={`border px-4 py-2 text-[0.88rem] transition-colors duration-300 ${
                      on
                        ? 'border-ink bg-ink text-stock'
                        : 'border-ink/25 text-ink-soft hover:border-ink hover:text-ink'
                    }`}
                  >
                    {p.type}
                  </button>
                );
              })}
            </div>
          </Rise>
          <Rise delay={0.14}>
            <p className="mt-8 max-w-[44ch] text-[0.9rem] text-ink-soft">
              Reminders cover vaccinations, deworming, flea &amp; tick, grooming, annual
              checkups and birthdays, tuned to the species and delivered before they
              are due.
            </p>
          </Rise>
        </div>
      </div>
    </section>
  );
}
