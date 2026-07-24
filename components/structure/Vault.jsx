'use client';

import { useState, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Mark, Seal, Rise, SceneNum, EASE } from './registry';

/* ==================================================================
   THE VAULT — zepaw.in's "Digital Health Vault", made tangible.

   Their site lists six document types as an icon grid. Here they are
   the documents themselves: a stack of fully-populated papers for
   Shiro that you leaf through. Every date, clinic and doctor matches
   the register section, so the page reads as one coherent record.

   Interaction: the list on the left is a real tab control; the chosen
   document springs to the front of the pile. Every document is in the
   DOM and legible at all times — z-order is the only thing animated.
   ================================================================== */

const INR = '₹';

/* One shared shell so every paper matches the identity card's grammar */
function Doc({ title, date, children }) {
  return (
    <div className="flex h-full flex-col bg-stock px-5 py-4 text-ink sm:px-6 sm:py-5">
      <div className="pointer-events-none absolute inset-[6px] border border-ink/20" />
      <header className="clears-notch relative flex items-baseline justify-between border-b border-ink/20 pb-2.5">
        <p className="data text-[9px] uppercase tracking-[0.2em] text-ink/75">{title}</p>
        <p className="data text-[9px] text-ink-soft">{date}</p>
      </header>
      <div className="relative flex-1 pt-3">{children}</div>
    </div>
  );
}

function Row({ k, v, flag }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-ink/10 py-[0.4rem]">
      <span className="data text-[8.5px] uppercase tracking-[0.16em] text-ink-soft">{k}</span>
      <span
        className={`data inline-flex items-center gap-1.5 text-[10.5px] ${
          flag ? 'text-amber-deep' : 'text-ink/90'
        }`}
      >
        {flag && <span className="h-1.5 w-1.5 rounded-full bg-amber" aria-hidden="true" />}
        {v}
      </span>
    </div>
  );
}

/* The six documents, verbatim from zepaw.in's vault list. All data is
   Shiro's and agrees with the register timeline. */
export const VAULT_DOCS = [
  {
    id: 'prescription',
    mark: 'vaccination',
    label: 'Prescriptions',
    blurb: 'All vet prescriptions in one place',
    body: (
      <Doc title="Prescription" date="02 Feb 2024">
        <p className="font-display text-[1.3rem] leading-tight">
          Carprofen <span className="italic">25 mg</span>
        </p>
        <p className="mt-1 text-[0.8rem] text-ink-soft">Half tablet daily, five days, with food</p>
        <div className="mt-4">
          <Row k="Patient" v="Shiro · ZP-8471-B92" />
          <Row k="Prescriber" v="Dr. A. Menon" />
          <Row k="Clinic" v="Whitefield Vet Clinic" />
          <Row k="Refills" v="None" />
        </div>
        <p className="data mt-auto pt-3 text-[8px] uppercase tracking-[0.16em] text-ink-soft">
          Filed to vault · 02 Feb 2024
        </p>
      </Doc>
    ),
  },
  {
    id: 'vaccination',
    mark: 'insurance',
    label: 'Vaccination Cards',
    blurb: 'Complete immunisation history',
    body: (
      <Doc title="Vaccination Card" date="Updated 12 Mar 2024">
        <div>
          <Row k="DHPP · first dose" v="08 Mar 2022" />
          <Row k="DHPP · booster" v="21 Mar 2023" />
          <Row k="Rabies · Nobivac" v="12 Mar 2024" />
          <Row k="Rabies · next due" v="Mar 2025" flag />
        </div>
        <div className="mt-auto flex items-end justify-between pt-3">
          <p className="data text-[8px] uppercase tracking-[0.16em] text-ink-soft">
            3 of 3 current
          </p>
          <Seal size={54} className="text-seal" id="vax-seal" />
        </div>
      </Doc>
    ),
  },
  {
    id: 'lab',
    mark: 'lab',
    label: 'Lab Reports',
    blurb: 'Blood work, urinalysis and more',
    body: (
      <Doc title="Lab Report" date="18 Oct 2023">
        <p className="text-[0.8rem] text-ink-soft">Complete blood count · Cessna Diagnostics</p>
        <div className="mt-3">
          <Row k="Haemoglobin" v="15.2 g/dL (12–18)" />
          <Row k="WBC" v="9.8 K/µL (6–17)" />
          <Row k="Platelets" v="311 K/µL (200–500)" />
          <Row k="ALT" v="42 U/L (10–100)" />
        </div>
        <p className="mt-auto pt-3 font-display text-[1.05rem] italic text-seal-deep">
          All values in range.
        </p>
      </Doc>
    ),
  },
  {
    id: 'bill',
    mark: 'document',
    label: 'Medical Bills',
    blurb: 'Track expenses effortlessly',
    body: (
      <Doc title="Medical Bill" date="02 Feb 2024">
        <p className="text-[0.8rem] text-ink-soft">Whitefield Vet Clinic · annual visit</p>
        <div className="mt-3">
          <Row k="Consultation" v={`${INR}800`} />
          <Row k="Rabies vaccine" v={`${INR}1,450`} />
          <Row k="Nail trim" v={`${INR}300`} />
        </div>
        <div className="mt-auto flex items-baseline justify-between border-t-2 border-ink pt-3">
          <span className="data text-[9px] uppercase tracking-[0.18em]">Total</span>
          <span className="data text-[1.25rem] font-medium">{INR}2,550</span>
        </div>
      </Doc>
    ),
  },
  {
    id: 'insurance',
    mark: 'insurance',
    label: 'Insurance Documents',
    blurb: 'Policies, claims and coverage',
    body: (
      <Doc title="Insurance Policy" date="Renewed 09 Jun 2023">
        <p className="font-display text-[1.3rem] leading-tight">
          Policy <span className="data text-[1.05rem]">PP-2024-88121</span>
        </p>
        <div className="mt-3">
          <Row k="Insured" v="Shiro · ZP-8471-B92" />
          <Row k="Cover" v={`${INR}2,00,000 / year`} />
          <Row k="Term" v="12 months" />
          <Row k="Claims filed" v="0" />
        </div>
        <p className="data mt-auto pt-3 text-[8px] uppercase tracking-[0.16em] text-ink-soft">
          Uploaded by guardian
        </p>
      </Doc>
    ),
  },
  {
    id: 'adoption',
    mark: 'checkup',
    label: 'Adoption Certificates',
    blurb: 'Ownership and pedigree docs',
    body: (
      <Doc title="Adoption Certificate" date="04 Jan 2022">
        <p className="text-[0.8rem] leading-relaxed text-ink-soft">
          Certifies that <span className="font-display italic text-ink">Shiro</span>, fawn pug,
          litter of four, was adopted by P. Sharma of Bengaluru.
        </p>
        <div className="mt-3">
          <Row k="Litter" v="Four · fawn" />
          <Row k="Breeder reg." v="KCI 44-2021-BLR" />
        </div>
        <div className="mt-auto flex items-end justify-between pt-3">
          <p className="data text-[8px] uppercase tracking-[0.16em] text-ink-soft">
            Registered at issue
          </p>
          <Seal size={54} className="text-seal" id="adopt-seal" />
        </div>
      </Doc>
    ),
  },
];

export function Vault() {
  const [active, setActive] = useState(0);
  const still = useReducedMotion();
  const pileRef = useRef(null);
  const n = VAULT_DOCS.length;

  const select = (i) => {
    setActive(i);
    // Below lg the pile sits under the list, so a tap would otherwise
    // change something off-screen. Bring the document into view.
    if (window.innerWidth < 1024 && pileRef.current) {
      pileRef.current.scrollIntoView({
        behavior: still ? 'auto' : 'smooth',
        block: 'center',
      });
    }
  };

  return (
    <section id="vault" className="relative border-t border-ink/12 py-24 sm:py-32">
      <SceneNum n="02" />
      <div className="relative mx-auto max-w-[78rem] px-5 sm:px-8">
        <Rise>
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-b-2 border-ink pb-4">
            <h2 className="font-display text-[clamp(1.9rem,4.2vw,3rem)] leading-none tracking-[-0.015em]">
              The health vault
            </h2>
            <p className="max-w-[36ch] text-[0.9rem] text-ink-soft">
              Every document, securely stored, instantly available. Leaf through
              Shiro&apos;s.
            </p>
          </div>
        </Rise>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Document list — a real tab control */}
          <div className="lg:col-span-5" role="tablist" aria-label="Vault documents">
            {VAULT_DOCS.map((d, i) => {
              const selected = i === active;
              return (
                <button
                  key={d.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`vault-doc-${d.id}`}
                  id={`vault-tab-${d.id}`}
                  onClick={() => select(i)}
                  className={`group flex w-full items-center gap-4 border-b border-ink/10 py-4 text-left transition-colors duration-300 first:border-t first:border-ink/10 ${
                    selected ? 'text-ink' : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  <Mark
                    name={d.mark}
                    size={20}
                    className={`shrink-0 transition-colors duration-300 ${
                      selected ? 'text-seal' : 'text-ink-soft/60 group-hover:text-seal'
                    }`}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-[1.2rem] leading-tight sm:text-[1.35rem]">
                      {d.label}
                    </span>
                    <span className="mt-0.5 block text-[0.82rem] text-ink-soft">{d.blurb}</span>
                  </span>
                  {/* Filed indicator: fills when the document is fronted */}
                  <span
                    aria-hidden="true"
                    className={`h-2 w-2 shrink-0 border border-seal-deep transition-colors duration-300 ${
                      selected ? 'bg-seal-deep' : 'bg-transparent'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* The pile. All six papers are always mounted and readable;
              selection only reorders them. */}
          <div className="lg:col-span-7">
            <div ref={pileRef} className="relative mx-auto h-[24rem] w-full max-w-[26rem] sm:h-[25rem] lg:mt-2">
              {VAULT_DOCS.map((d, i) => {
                // Depth = distance behind the active card, wrapping so the
                // pile always keeps its fanned shape.
                const depth = (i - active + n) % n;
                const front = depth === 0;
                return (
                  <motion.div
                    key={d.id}
                    id={`vault-doc-${d.id}`}
                    role="tabpanel"
                    aria-labelledby={`vault-tab-${d.id}`}
                    initial={false}
                    animate={
                      still
                        ? { zIndex: n - depth }
                        : {
                            rotate: front ? 0 : depth % 2 ? 2.4 + depth : -(1.8 + depth),
                            x: front ? 0 : (depth % 2 ? 1 : -1) * (10 + depth * 6),
                            y: front ? 0 : -6 * depth,
                            scale: front ? 1 : 1 - depth * 0.035,
                            zIndex: n - depth,
                          }
                    }
                    transition={{ duration: 0.6, ease: EASE }}
                    className={`notch-tr absolute inset-0 ${front ? 'lifted' : 'edge'}`}
                    style={{ willChange: 'transform' }}
                  >
                    {d.body}
                  </motion.div>
                );
              })}
            </div>
            <p className="data mx-auto mt-6 max-w-[26rem] text-[9px] uppercase tracking-[0.18em] text-ink-soft">
              Vault of ZP-8471-B92 · encrypted · owner-controlled
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
