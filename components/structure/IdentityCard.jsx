'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Seal, QRBlock, EASE } from './registry';

/* ------------------------------------------------------------------
   THE SIGNATURE ARTIFACT — the ZePaw Identity

   ZePaw does NOT issue a certificate. It issues a permanent digital
   identity number and the record attached to it, so this object is an
   ID, not a certificate, and the wording has to stay honest about that:
   "ZePaw Identity", never "Certificate of Identity". Terminology is
   taken from zepaw.in, where the product is called a ZePaw Identity and
   "certificate" refers only to adoption certificates stored in the
   vault. Paper-document signals (a tear-off perforation) were removed
   for the same reason — the thing is digital.
   ------------------------------------------------------------------ */

const FIELDS = [
  ['Species', 'Dog'],
  ['Breed', 'Pug'],
  ['Sex', 'Male · neutered'],
  ['Born', '04 Jan 2022'],
  ['Microchip', '900 1082 4471 883'],
  ['Guardian', 'P. Sharma, Bengaluru'],
];

export function IdentityCard({ className = '' }) {
  const still = useReducedMotion();
  return (
    <article
      className={`notch-tr relative w-[19.5rem] bg-stock text-ink sm:w-[21.5rem] ${className}`}
      aria-label="Example ZePaw Identity for Shiro, a pug"
    >
      {/* Printed border, inset so the notch never crops it */}
      <div className="pointer-events-none absolute inset-[7px] border border-ink/25" />
      <div className="pointer-events-none absolute inset-[10px] border border-ink/10" />

      <div className="relative px-6 pb-6 pt-5">
        {/* Masthead — padded clear of the corner notch */}
        <header className="clears-notch flex items-baseline justify-between border-b border-ink/20 pb-3">
          <p className="data text-[9.5px] uppercase tracking-[0.22em] text-ink/75">ZePaw</p>
          <p className="data text-[9.5px] text-ink-soft">Digital ID</p>
        </header>

        <p className="mt-4 font-display text-[0.94rem] italic leading-none text-ink-soft">
          ZePaw Identity
        </p>

        {/* Portrait + name */}
        <div className="mt-4 flex gap-4">
          <div className="relative shrink-0">
            <img
              src="/assets/pet-portrait.jpg"
              alt="Shiro, a fawn pug, photographed for his identity record"
              width={880}
              height={1100}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="h-[7.2rem] w-[5.75rem] border border-ink/30 object-cover"
            />
            <span className="data absolute -bottom-px left-0 bg-ink px-1 py-px text-[7px] tracking-[0.14em] text-stock">
              ID PHOTO
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <p className="data text-[9px] uppercase tracking-[0.2em] text-ink-soft">Name</p>
            <h3 className="mt-0.5 font-display text-[2.1rem] leading-[0.92] tracking-tight">
              Shiro
            </h3>
            <div className="mt-3 border-t border-ink/15 pt-2">
              <p className="data text-[9px] uppercase tracking-[0.2em] text-ink-soft">
                Identity No.
              </p>
              <p className="data mt-1 text-[1.06rem] font-medium leading-none tracking-[0.1em]">
                ZP-8471-B92
              </p>
            </div>
          </div>
        </div>

        {/* Record fields */}
        <dl className="mt-5 border-t border-ink/15">
          {FIELDS.map(([k, v]) => (
            <div
              key={k}
              className="flex items-baseline justify-between gap-3 border-b border-ink/10 py-[0.42rem]"
            >
              <dt className="data text-[9px] uppercase tracking-[0.18em] text-ink-soft">{k}</dt>
              <dd className="data truncate text-[10.5px] text-ink/90">{v}</dd>
            </div>
          ))}
        </dl>

        {/* Verification block */}
        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <QRBlock size={78} className="text-ink" />
            <p className="data mt-1.5 text-[8px] uppercase tracking-[0.16em] text-ink-soft">
              zepaw.in/v/8471
            </p>
          </div>
          {/* The seal is struck onto the document when it comes into view.
              It renders at its resting size by default and only animates
              *to* that state, so if motion never runs the seal is simply
              there, whole and legible. */}
          <div className="relative pb-1 text-center">
            <motion.div
              whileInView={still ? undefined : { scale: [1.18, 0.95, 1] }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.62, ease: EASE, times: [0, 0.55, 1] }}
            >
              <Seal size={92} className="text-seal" id="cert-seal" />
            </motion.div>
            {!still && (
              <motion.span
                aria-hidden="true"
                initial={{ scale: 0.75, opacity: 0.55 }}
                whileInView={{ scale: 1.55, opacity: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.85, ease: 'easeOut', delay: 0.24 }}
                className="pointer-events-none absolute inset-x-0 bottom-1 top-0 m-auto rounded-full border border-seal"
              />
            )}
          </div>
        </div>
      </div>

    </article>
  );
}
