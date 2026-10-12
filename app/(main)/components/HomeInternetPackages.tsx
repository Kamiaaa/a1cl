"use client";

import { useState, type ReactNode } from "react";

/* -------------------------------------------------------------------------- */
/*  Types & data                                                              */
/* -------------------------------------------------------------------------- */

export type InternetPackage = {
  id: string;
  name: string;
  mbps: number;
  /** Monthly price in BDT (VAT included) */
  price: number;
  popular?: boolean;
  features: string[];
};

type HomeInternetPackagesProps = {
  /** Packages shown initially (video: 11 cards in rows of 4 / 4 / 3). */
  packages?: InternetPackage[];
  /** Packages revealed by the "More Packages" button. */
  morePackages?: InternetPackage[];
  onChoose?: (pkg: InternetPackage) => void;
  onAdvancedSearch?: () => void;
};

const gaming = (users: number) => `Popular Games at Optimal Latency for ${users}-users`;

const streaming = [
  "Bufferless Facebook, YouTube, Live Streaming, Zoom & Teams Meeting",
  "Bufferless QHD, FHD/4K Video",
  "Bufferless Netflix & Prime Video",
  "OTC Fee - 1000 TK",
  "High Speed BDIX",
  "24/7 Customer Service",
];

// Content read from the recording; replace with your real package data.
const DEFAULT_PACKAGES: InternetPackage[] = [
  {
    id: "smartshop",
    name: "SmartShop Pack",
    mbps: 50,
    price: 899,
    popular: true,
    features: [
      "Bufferless YouTube & Facebook",
      "High Speed BDIX",
      "24/7 Customer Service",
      "OTC Fee - 1000 TK",
      "Bufferless HD, FHD Video",
      "Stable & Secure Connectivity for Your Shop",
      "Reliable speed for POS, CCTV, and daily operations",
    ],
  },
  {
    id: "surfer-plus",
    name: "Surfer Plus",
    mbps: 80,
    price: 1050,
    popular: true,
    features: [
      "Bufferless YouTube & Facebook",
      "High Speed BDIX",
      "OTC Fee - 1000 TK",
      "24/7 Customer Service",
      "Bufferless HD, FHD/4K Video",
      gaming(2),
    ],
  },
  {
    id: "cheetah-prime",
    name: "Cheetah Prime",
    mbps: 100,
    price: 1275,
    popular: true,
    features: [
      "Bufferless Facebook, YouTube, Live Streaming",
      "High Speed BDIX",
      "OTC Fee - 1000 TK",
      "24/7 Customer Service",
      "Bufferless HD, FHD/4K Video",
      gaming(3),
    ],
  },
  {
    id: "group-student",
    name: "Group Student Pack",
    mbps: 110,
    price: 1375,
    popular: true,
    features: [
      "Bufferless Facebook, YouTube, Live Streaming",
      "Bufferless HD, FHD/4K Video",
      "OTC Fee - 1000 TK",
      "High Speed BDIX",
      "24/7 Customer Service",
      "Perfect for multiple users and connected devices",
      gaming(4),
    ],
  },
  {
    id: "gamers",
    name: "Gamers",
    mbps: 120,
    price: 1475,
    popular: true,
    features: [
      "Bufferless 4K Streaming",
      "Optimized Routing for Gaming",
      "OTC Fee - 1000 TK",
      "Stable Ping, Low Latency",
      "Lightning-Fast BDIX Connectivity",
      "Dedicated Gaming Cache Servers",
      "Quick Link Restore, IPV6 Ready",
      "24/7 Customer Service",
    ],
  },
  {
    id: "eagle-advance",
    name: "Eagle Advance",
    mbps: 130,
    price: 1700,
    popular: true,
    features: [...streaming, gaming(5)],
  },
  {
    id: "hawk-lite",
    name: "Hawk Lite",
    mbps: 135,
    price: 1800,
    popular: true,
    features: [...streaming, gaming(6)],
  },
  {
    id: "hawk-advance",
    name: "Hawk Advance",
    mbps: 140,
    price: 1900,
    popular: true,
    features: [...streaming, gaming(6)],
  },
  {
    id: "swift-prime",
    name: "Swift Prime",
    mbps: 150,
    price: 2525,
    popular: true,
    features: [...streaming, gaming(8)],
  },
  {
    id: "swift-advance",
    name: "Swift Advance",
    mbps: 160,
    price: 2800,
    popular: true,
    features: [...streaming, gaming(8)],
  },
  {
    id: "extreme-advance",
    name: "Extreme Advance",
    mbps: 210,
    price: 4625,
    popular: true,
    features: [...streaming, gaming(8)],
  },
];

// The recording only shows these collapsed ("Show Offer"), so the feature
// lists below are placeholders.
const DEFAULT_MORE: InternetPackage[] = [
  {
    id: "starter",
    name: "Starter",
    mbps: 20,
    price: 525,
    features: ["Bufferless YouTube & Facebook", "OTC Fee - 1000 TK", "24/7 Customer Service"],
  },
  {
    id: "simple",
    name: "Simple",
    mbps: 30,
    price: 650,
    features: ["Bufferless YouTube & Facebook", "High Speed BDIX", "OTC Fee - 1000 TK", "24/7 Customer Service"],
  },
  {
    id: "surfer-prime",
    name: "Surfer Prime",
    mbps: 40,
    price: 825,
    features: ["Bufferless YouTube & Facebook", "High Speed BDIX", "OTC Fee - 1000 TK", "24/7 Customer Service"],
  },
];

// Set --font-condensed (e.g. Open Sans with the `wdth` axis via next/font) in your layout.
const condensed =
  "font-(family-name:--font-condensed) font-stretch-condensed font-bold";

/* -------------------------------------------------------------------------- */
/*  Icons                                                                     */
/* -------------------------------------------------------------------------- */

const blue = "#0d4c9b";

function ChevronRight({ className = "size-3" }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" className={className} aria-hidden>
      <path d="m4 2 4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDown({ className = "size-3" }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" className={className} aria-hidden>
      <path d="m2 4 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LongArrow() {
  return (
    <svg viewBox="0 0 64 16" fill="none" className="hidden h-4 w-16 shrink-0 text-[#0d4c9b] sm:block" aria-hidden>
      <path d="M1 8h60M54 2l7 6-7 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CoverageIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="size-12" aria-hidden>
      <rect x="12" y="5" width="22" height="38" rx="3" stroke={blue} strokeWidth="1.8" />
      <path d="M12 11h22M12 37h22" stroke={blue} strokeWidth="1.4" />
      <path d="M23 15c-3.3 0-6 2.6-6 5.8 0 4.2 6 10.2 6 10.2s6-6 6-10.2c0-3.200-2.700-5.800-6-5.800Z" stroke="#e08a2e" strokeWidth="1.8" />
      <circle cx="23" cy="20.800" r="2" fill="#e08a2e" />
      <path d="M36 8c3 1.500 5 4.500 5 8M36 13c1.500.8 2.500 2.200 2.500 4" stroke={blue} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="size-12" aria-hidden>
      <circle cx="26" cy="14" r="8" stroke="#e08a2e" strokeWidth="1.8" />
      <path d="M23 11.500h6M23 14.500h6M25 11.500c3 0 3 3 0 3l3.500 3" stroke="#e08a2e" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M5 30c4-1 8-1 12 1l8 2c2 .5 2 3.200-.5 3H19M25 33l11-4c2-.7 4 .7 3 2.500l-9 9H16l-9-3" stroke={blue} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ConnectedIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="size-12" aria-hidden>
      <rect x="9" y="6" width="16" height="12" rx="1.500" stroke="#e08a2e" strokeWidth="1.800" />
      <path d="M9 12h16M17 6v12" stroke="#e08a2e" strokeWidth="1.2" />
      <circle cx="13" cy="37" r="5" stroke={blue} strokeWidth="1.800" />
      <circle cx="37" cy="37" r="5" stroke={blue} strokeWidth="1.800" />
      <path d="M13 37h8l5-12h8l3 12M26 25l-3-4h-5" stroke={blue} strokeWidth="1.800" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Package card                                                              */
/* -------------------------------------------------------------------------- */

function PackageCard({
  pkg,
  defaultOpen,
  onChoose,
}: {
  pkg: InternetPackage;
  defaultOpen: boolean;
  onChoose?: (pkg: InternetPackage) => void;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <article className="group relative overflow-hidden rounded-[4px] bg-white px-5 pt-5 pb-5 shadow-[0_1px_5px_rgba(0,0,0,0.12)]">
      {pkg.popular && (
        <div
          className="pointer-events-none absolute top-0 right-0 size-14"
          aria-hidden
        >
          <div className="size-full bg-[#0d4c9b] [clip-path:polygon(0_0,100%_0,100%_100%)]" />
          <span className="absolute top-[11px] right-[-6px] rotate-45 text-[10px] font-bold tracking-wide text-white">
            Popular
          </span>
        </div>
      )}

      <h3
        className={`${condensed} pr-10 text-[17px] leading-6 text-[#1b1b1b] transition-colors duration-200 group-hover:text-[#0d4c9b]`}
      >
        {pkg.name}
        {pkg.popular && <span className="sr-only"> (Popular)</span>}
      </h3>

      {/* speed | price */}
      <div className="mt-4 flex items-stretch justify-center gap-5">
        <div className="relative pr-1">
          <span className="absolute -top-0.5 left-0 text-[7px] text-[#6a6d75]">
            Upto
          </span>
          <p className={`${condensed} flex items-end gap-1 pt-2 text-[40px] leading-none text-[#2a2420]`}>
            {pkg.mbps}
            <span className="pb-0.5 text-[17px] font-semibold text-[#8a6a4a]">
              Mbps
            </span>
          </p>
        </div>

        <div className="w-[1.5px] bg-[#555]" aria-hidden />

        <div className="text-center">
          <p className={`${condensed} flex items-baseline justify-center gap-1 text-[#2a2420]`}>
            <span className="text-[13px] text-[#8a6a4a]">BDT</span>
            <span className="text-[30px] leading-8">{pkg.price}</span>
          </p>
          <p className={`${condensed} text-[16px] leading-4 text-[#8a6a4a]`}>
            Per Month
          </p>
          <p className="mt-0.5 text-[7px] text-[#6a6d75] italic">*Including VAT</p>
        </div>
      </div>

      {/* Hide / Show offer */}
      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#f0f1f5] px-4 py-1 text-[11px] font-semibold text-[#4a4d55] outline-none transition-colors hover:bg-[#e4e6ec] focus-visible:ring-2 focus-visible:ring-[#0d4c9b]"
        >
          {open ? "Hide Offer" : "Show Offer"}
          <ChevronDown
            className={`size-3 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Offer details (grid-rows trick animates height) */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden" aria-hidden={!open}>
          <h4 className="mt-4 text-[20px] leading-6 font-(family-name:--font-condensed) font-stretch-condensed font-medium text-[#3b3f46]">
            Exclusive Privileges
          </h4>
          <ul className="mt-2 flex flex-col gap-1">
            {pkg.features.map((f) => (
              <li
                key={f}
                className="relative pl-3 text-[11px] leading-[14px] text-[#3b3f46] before:absolute before:top-[5px] before:left-0 before:size-[3px] before:rounded-full before:bg-[#e08a2e]"
              >
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-4 flex justify-center">
            <ChooseButton onClick={() => onChoose?.(pkg)} />
          </div>
        </div>
      </div>
    </article>
  );
}

function ChooseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full bg-[#0d4c9b] px-5 py-2 text-[11px] font-bold text-white outline-none transition-[background-color,transform] duration-200 hover:bg-[#0a3d7e] focus-visible:ring-2 focus-visible:ring-[#0d4c9b] focus-visible:ring-offset-2 active:scale-[0.97]"
    >
      Choose this package
      <ChevronRight className="size-2.5" />
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Layout helpers                                                            */
/* -------------------------------------------------------------------------- */

/**
 * 4 cards per row on desktop with a trailing short row centred (flex-wrap),
 * matching the 4 / 4 / 3 layout in the recording.
 */
function CardGrid({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-center gap-6 [&>*]:w-full sm:[&>*]:w-[calc(50%-12px)] lg:[&>*]:w-[calc(25%-18px)]">
      {children}
    </div>
  );
}

const STEPS = [
  { label: "Check Network Coverage", icon: <CoverageIcon /> },
  { label: "Choose Package", icon: <PackageIcon /> },
  { label: "Get Connected", icon: <ConnectedIcon /> },
];

/* -------------------------------------------------------------------------- */
/*  Main component                                                            */
/* -------------------------------------------------------------------------- */

export default function HomeInternetPackages({
  packages = DEFAULT_PACKAGES,
  morePackages = DEFAULT_MORE,
  onChoose,
  onAdvancedSearch,
}: HomeInternetPackagesProps) {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="w-full">
      {/* Steps */}
      <div className="bg-white px-4 py-6">
        <ol className="mx-auto flex max-w-[760px] items-start justify-center gap-4 sm:items-center sm:gap-8">
          {STEPS.map((s, i) => (
            <li key={s.label} className="flex items-center gap-4 sm:gap-8">
              <div className="flex w-24 flex-col items-center gap-2 text-center sm:w-36">
                {s.icon}
                <span className="text-[11px] font-bold text-[#1f3b63]">
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && <LongArrow />}
            </li>
          ))}
        </ol>
      </div>

      <section className="bg-[#f1f1f5] px-4 pt-10 pb-12">
        <div className="mx-auto max-w-[1120px]">
          <h2 className={`${condensed} text-center text-[32px] leading-tight text-[#2a2420]`}>
            Home Internet <span className="text-[#0d4c9b]">Packages</span>
          </h2>

          <div className="mt-5 flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={onAdvancedSearch}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#0d4c9b] px-5 py-2 text-[11px] font-bold text-white outline-none transition-[background-color,transform] duration-200 hover:bg-[#0a3d7e] focus-visible:ring-2 focus-visible:ring-[#0d4c9b] focus-visible:ring-offset-2 active:scale-[0.97]"
            >
              Advanced Search
              <ChevronRight className="size-2.5" />
            </button>

            <button
              type="button"
              className="rounded-full border-[1.5px] border-[#0d4c9b] bg-white px-4 py-1 text-[11px] font-medium text-[#1b2a41] outline-none transition-colors hover:bg-[#0d4c9b] hover:text-white focus-visible:ring-2 focus-visible:ring-[#0d4c9b] focus-visible:ring-offset-2"
            >
              Popular Packages
            </button>
          </div>

          <div className="mt-8">
            <CardGrid>
              {packages.map((p) => (
                <PackageCard key={p.id} pkg={p} defaultOpen onChoose={onChoose} />
              ))}
            </CardGrid>
          </div>

          {morePackages.length > 0 && (
            <>
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowMore((s) => !s)}
                  aria-expanded={showMore}
                  className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-[#0d4c9b] bg-white px-4 py-1 text-[11px] font-medium text-[#1b2a41] outline-none transition-colors hover:bg-[#0d4c9b] hover:text-white focus-visible:ring-2 focus-visible:ring-[#0d4c9b] focus-visible:ring-offset-2"
                >
                  More Packages
                  <ChevronDown
                    className={`size-3 transition-transform duration-300 ${showMore ? "rotate-180" : ""}`}
                  />
                </button>
              </div>

              <div
                className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
                  showMore ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden" aria-hidden={!showMore}>
                  <div className="pt-6">
                    <CardGrid>
                      {morePackages.map((p) => (
                        <PackageCard
                          key={p.id}
                          pkg={p}
                          defaultOpen={false}
                          onChoose={onChoose}
                        />
                      ))}
                    </CardGrid>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="mt-8 text-center">
            <h3 className="text-sm font-medium text-[#4a4d55]">Service Terms</h3>
            <p className="mt-1 text-[8px] leading-3 font-medium text-[#d11a1a] italic">
              *Link handover timelines may be affected due to unforeseen
              technical issues or equipment-related challenges. The authority
              will not be liable for such delays.
            </p>
            <p className="text-[8px] leading-3 font-medium text-[#d11a1a] italic">
              **Customers can downgrade their package by paying the applicable
              OTC charge for the selected package.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
