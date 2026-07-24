'use client';

/* ------------------------------------------------------------------
   The ZePaw registry kit — the signature artifact and its parts.

   Everything here is drawn for this one brand: the seal, the record
   marks, the QR block and the identity card itself. Nothing is an icon
   pulled from a pack.
   ------------------------------------------------------------------ */

import { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';

export const EASE = [0.22, 1, 0.36, 1];

/* ---------- Tilt --------------------------------------------------
   The identity card is meant to read as a physical thing lying on the
   page, so it answers the pointer the way a card on a desk would:
   it leans toward you. Springs give it mass. Transform only, so it
   never costs a layout pass, and it is off entirely for reduced
   motion and for coarse pointers (a finger has no hover to give). */
export function useTilt({ max = 7 } = {}) {
  const ref = useRef(null);
  const still = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 150, damping: 18, mass: 0.6 };
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-max, max]), spring);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [max, -max]), spring);

  if (still) return { ref: null, style: undefined, handlers: {} };

  const onPointerMove = (e) => {
    if (e.pointerType === 'touch') return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onPointerLeave = () => {
    px.set(0);
    py.set(0);
  };

  return {
    ref,
    style: { rotateX, rotateY, transformStyle: 'preserve-3d' },
    handlers: { onPointerMove, onPointerLeave },
  };
}

/* ---------- Scene number ------------------------------------------
   The page's product story runs as five numbered scenes. The numeral
   is a ghosted watermark set into the scene's own surface — structure,
   not a kicker label. It drifts against the scroll, so every scene
   carries a layer of depth; the element is always fully rendered, the
   parallax only moves it. */
export function SceneNum({ n, dark = false }) {
  const ref = useRef(null);
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [70, -70]);
  return (
    // Aligned to the same centred content gutter the text uses, so the
    // numeral's right edge meets the column edge instead of bleeding off
    // the raw viewport rim. No overflow clip: the parallax moves it
    // vertically and it must stay whole.
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-0 select-none"
    >
      <div className="mx-auto max-w-[78rem] px-5 sm:px-8">
        <motion.span
          style={still ? undefined : { y }}
          className={`block pt-2 text-right font-display italic leading-none text-[clamp(5rem,12vw,10rem)] ${
            dark ? 'text-stock/[0.06]' : 'text-ink/[0.05]'
          }`}
        >
          {n}
        </motion.span>
      </div>
    </div>
  );
}

/* Reveal that never gates content on the animation completing.
   Only `y` is animated, so if the observer never fires the content is
   still fully visible — just 18px from its resting position. */
export function Rise({ children, delay = 0, y = 18, className = '' }) {
  const still = useReducedMotion();
  if (still) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ y }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.75, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- The verification mark --------------------------------
   The one crafted mark of the site. A struck verification mark:
   text set on a circular path, a drawn paw at the centre, struck in
   seal ink. It is a VERIFICATION mark, not a certification seal:
   ZePaw verifies an identity, it does not certify anything. */
export function Seal({ size = 104, className = '', id = 'seal' }) {
  const r = 50;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label="ZePaw verified identity mark"
    >
      <defs>
        <path
          id={`${id}-arc`}
          d={`M 60,60 m -${r - 8},0 a ${r - 8},${r - 8} 0 1,1 ${(r - 8) * 2},0 a ${r - 8},${
            r - 8
          } 0 1,1 -${(r - 8) * 2},0`}
          fill="none"
        />
      </defs>
      <g fill="none" stroke="currentColor">
        <circle cx="60" cy="60" r={r} strokeWidth="1.5" />
        <circle cx="60" cy="60" r={r - 4.5} strokeWidth="0.75" opacity="0.6" />
        <circle cx="60" cy="60" r={r - 19} strokeWidth="0.75" opacity="0.6" />
        {/* Milled edge — the impressed rim of a physical stamp */}
        {Array.from({ length: 72 }).map((_, i) => {
          const a = (i / 72) * Math.PI * 2;
          // Rounded so Node and the browser serialise identical strings —
          // raw trig differs in the last float digit and breaks hydration.
          const at = (radius) => (60 + Math.cos(a) * radius).toFixed(3);
          const bt = (radius) => (60 + Math.sin(a) * radius).toFixed(3);
          return (
            <line
              key={i}
              x1={at(r + 0.5)}
              y1={bt(r + 0.5)}
              x2={at(r + 3.5)}
              y2={bt(r + 3.5)}
              strokeWidth="0.9"
              opacity="0.5"
            />
          );
        })}
      </g>
      <text
        fontSize="7.1"
        letterSpacing="2.1"
        fill="currentColor"
        fontFamily="ui-monospace, Menlo, monospace"
      >
        <textPath href={`#${id}-arc`} startOffset="50%" textAnchor="middle">
          ZEPAW · VERIFIED IDENTITY ·
        </textPath>
      </text>
      {/* Paw, drawn on the same grid as the record marks */}
      <g fill="currentColor" transform="translate(60 62)">
        <ellipse cx="0" cy="4.5" rx="8.5" ry="6.8" />
        <ellipse cx="-8.4" cy="-4.6" rx="3.5" ry="4.7" transform="rotate(-16 -8.4 -4.6)" />
        <ellipse cx="-2.9" cy="-8.4" rx="3.4" ry="4.8" transform="rotate(-6 -2.9 -8.4)" />
        <ellipse cx="2.9" cy="-8.4" rx="3.4" ry="4.8" transform="rotate(6 2.9 -8.4)" />
        <ellipse cx="8.4" cy="-4.6" rx="3.5" ry="4.7" transform="rotate(16 8.4 -4.6)" />
      </g>
    </svg>
  );
}

/* ---------- Record marks ------------------------------------------
   A bespoke set on one 24-unit grid. House rule that makes them ours:
   every mark carries a single filled 2×2 "punch" square, the way a
   ledger clerk perforates a processed entry. */
const P = { strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' };

export function Mark({ name, size = 22, className = '' }) {
  const paths = {
    vaccination: (
      <>
        <path d="M14.5 4.5 19.5 9.5" {...P} />
        <path d="M12.2 6.8 17.2 11.8 8.4 20.6H4.5v-3.9z" {...P} />
        <path d="M10 9 14 13" {...P} />
        <rect x="18.5" y="17.5" width="2" height="2" fill="currentColor" />
      </>
    ),
    document: (
      <>
        <path d="M6 3.5h8L18.5 8v12.5h-12.5z" {...P} />
        <path d="M13.8 3.7V8.2h4.5" {...P} />
        <path d="M8.6 12.5h7M8.6 15.8h4.6" {...P} />
        <rect x="15.6" y="15" width="2" height="2" fill="currentColor" />
      </>
    ),
    lab: (
      <>
        <path d="M10 3.5v6.2L5.2 18.4a1.8 1.8 0 0 0 1.6 2.7h10.4a1.8 1.8 0 0 0 1.6-2.7L14 9.7V3.5" {...P} />
        <path d="M8.6 3.5h6.8" {...P} />
        <path d="M7.4 14.6h9.2" {...P} />
        <rect x="11" y="16.8" width="2" height="2" fill="currentColor" />
      </>
    ),
    checkup: (
      <>
        <path d="M4.6 3.6v5.6a5.2 5.2 0 0 0 10.4 0V3.6" {...P} />
        <path d="M3 3.6h3.2M13.4 3.6h3.2" {...P} />
        <path d="M9.8 14.4v1.4a4.4 4.4 0 0 0 8.8 0v-1.2" {...P} />
        <circle cx="18.6" cy="12.4" r="2.1" {...P} />
        <rect x="4" y="18.5" width="2" height="2" fill="currentColor" />
      </>
    ),
    reminder: (
      <>
        <path d="M6 10a6 6 0 0 1 12 0c0 4.2 1.4 5.6 1.4 5.6H4.6S6 14.2 6 10z" {...P} />
        <path d="M10.2 18.6a2 2 0 0 0 3.6 0" {...P} />
        <rect x="17.6" y="3.4" width="2" height="2" fill="currentColor" />
      </>
    ),
    insurance: (
      <>
        <path d="M12 3.4 19.4 6v6.1c0 4.4-3.1 7.3-7.4 8.5-4.3-1.2-7.4-4.1-7.4-8.5V6z" {...P} />
        <path d="M8.8 11.9 11.2 14.3 15.6 9.9" {...P} />
        <rect x="17.4" y="16.4" width="2" height="2" fill="currentColor" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      stroke="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}

/* ---------- QR block ----------------------------------------------
   A REAL, scannable QR encoding https://zepaw.in/v/8471 (version 2,
   error correction M). The product's whole promise is "scan the tag",
   so a decorative fake would be a lie the moment anyone points a phone
   at it. The matrix was generated at author-time and inlined, so there
   is no QR dependency in the bundle. Drawn in ink on stock. */
const QR_SIZE = 25;
const QR_ROWS = [
  '1111111011101111101111111',
  '1000001001000010001000001',
  '1011101001110010101011101',
  '1011101010010001101011101',
  '1011101010001111101011101',
  '1000001010000101101000001',
  '1111111010101010101111111',
  '0000000011100101000000000',
  '1110101010111000011111001',
  '1100000101001000011000000',
  '1111001001100010110111001',
  '1110000011010011011000000',
  '0101111001011010010110101',
  '1011110110001100010110001',
  '0001111000101000000000101',
  '0001000101100111000011010',
  '0101011110111110111110001',
  '0000000010000100100011110',
  '1111111000111011101011011',
  '1000001001000001100010010',
  '1011101011010110111110110',
  '1011101001110011000000101',
  '1011101011010011110000110',
  '1000001011010110110101110',
  '1111111010111011001011111',
];

export function QRBlock({ size = 96, className = '' }) {
  const c = size / QR_SIZE;
  const dots = [];
  QR_ROWS.forEach((row, y) => {
    let run = 0;
    for (let x = 0; x <= QR_SIZE; x++) {
      if (row[x] === '1') {
        run++;
      } else if (run) {
        // Merge horizontal runs into single rects: fewer nodes, and no
        // hairline seams between adjacent modules when the SVG scales.
        dots.push(
          <rect
            key={`${x}-${y}`}
            x={((x - run) * c).toFixed(3)}
            y={(y * c).toFixed(3)}
            width={(run * c).toFixed(3)}
            height={c.toFixed(3)}
          />
        );
        run = 0;
      }
    }
  });
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      fill="currentColor"
      shapeRendering="crispEdges"
      role="img"
      aria-label="QR code linking to zepaw.in/v/8471, the public record for identity ZP-8471-B92"
    >
      {dots}
    </svg>
  );
}
