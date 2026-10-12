"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import styles from "./HomeInternetPackages.module.css";

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
  /** Packages shown initially. */
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
/*  Icons & Images                                                            */
/* -------------------------------------------------------------------------- */

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
    <svg viewBox="0 0 64 16" fill="none" className="hidden h-5 w-28 shrink-0 text-[#0d4c9b] sm:block" aria-hidden>
      <path d="M1 8h60M54 2l7 6-7 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CoverageIcon() {
  return (
    <div className="relative size-[72px]">
      <Image
        src="/img/icon-step-1.svg" // Update with your actual image path
        alt="Coverage Icon"
        fill
        className="object-contain"
      />
    </div>
  );
}

function PackageIcon() {
  return (
    <div className="relative size-[72px]">
      <Image
        src="/img/icon-step-2.svg" // Update with your actual image path
        alt="Package Icon"
        fill
        className="object-contain"
      />
    </div>
  );
}

function ConnectedIcon() {
  return (
    <div className="relative size-[72px]">
      <Image
        src="/img/icon-step-3.svg" // Update with your actual image path
        alt="Connected Icon"
        fill
        className="object-contain"
      />
    </div>
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
  const stacked = String(pkg.mbps).length >= 3;

  return (
    <article className="group relative overflow-hidden rounded-[6px] bg-white px-[25px] pt-[22px] pb-[26px] shadow-[0_1px_4px_rgba(0,0,0,0.1)]">
      {pkg.popular && (
        <div
          className="pointer-events-none absolute top-0 right-0 size-[90px] overflow-hidden"
          aria-hidden
        >
          <div className="size-full bg-[#0d4c9b] [clip-path:polygon(0_0,100%_0,100%_100%)]" />
          <span className="absolute top-[22px] right-[-10px] w-[90px] text-center rotate-45 text-[14px] font-bold tracking-wider text-white">
            Popular
          </span>
        </div>
      )}

      <h3 className="pr-16 text-[24px] leading-9 font-bold text-black transition-colors duration-200 group-hover:text-[#0d4c9b]">
        {pkg.name}
        {pkg.popular && <span className="sr-only"> (Popular)</span>}
      </h3>

      <div className="mt-[18px] flex items-center justify-center">
        <div className="flex w-40 justify-center">
          <div className="relative">
            <span className="absolute -top-1 left-0 text-[11px] leading-none font-medium text-[#8a8a8a]">
              Upto
            </span>
            <p
              className={`${condensed} flex pt-4 leading-none text-[#444] ${stacked ? "flex-col items-center gap-1" : "items-end gap-2"
                }`}
            >
              <span className="text-[60px]">{pkg.mbps}</span>
              <span className="pb-1 text-[24px] font-semibold">Mbps</span>
            </p>
          </div>
        </div>

        <div className="h-[112px] w-[2px] shrink-0 bg-[#bdbdbd]" aria-hidden />

        <div className="flex w-40 flex-col items-center text-center text-[#444]">
          <p className={`${condensed} flex items-baseline gap-1.5`}>
            <span className="text-[26px]">BDT</span>
            <span className="text-[42px] leading-[48px]">{pkg.price}</span>
          </p>
          <p className="-mt-1 text-[21px] leading-6 font-medium font-(family-name:--font-condensed) font-stretch-condensed">
            Per Month
          </p>
          <p className="mt-1.5 text-[12px] leading-4 font-medium">*Including VAT</p>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="inline-flex h-[38px] items-center gap-2 rounded-full bg-[#f3f2f4] px-[14px] text-[16px] font-medium text-[#222] outline-none transition-colors hover:bg-[#e8e7ea] focus-visible:ring-2 focus-visible:ring-[#0d4c9b]"
        >
          {open ? "Hide Offer" : "Show Offer"}
          <ChevronDown
            className={`size-[18px] text-[#444] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
      >
        <div className="overflow-hidden" aria-hidden={!open}>
          <h4 className="mt-[26px] text-[28px] leading-9 font-light text-[#444]">
            Exclusive Privileges
          </h4>
          <ul className="mt-2.5 flex flex-col">
            {pkg.features.map((f) => (
              <li key={f} className="text-[14px] leading-6 text-[#4a4a4a]">
                * {f}
              </li>
            ))}
          </ul>

          <div className="mt-5 flex justify-center">
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
      className={`${styles.arrowBtn} inline-flex h-[34px] items-center gap-2 rounded-full bg-[#0d4c9b] px-[20px] text-[13px] font-bold text-white outline-none focus-visible:ring-2 focus-visible:ring-[#0d4c9b] focus-visible:ring-offset-2`}
    >
      Choose this package
      <span className={styles.arrow}>
        <ChevronRight className="size-3" />
      </span>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Layout helpers                                                            */
/* -------------------------------------------------------------------------- */

const CELL = "w-full md:w-[calc((100%_-_60px)/3)]";

function CardGrid({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-center gap-[30px]">
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

const pill =
  "inline-flex h-[40px] items-center gap-2 rounded-full border-2 border-[#0d4c9b] bg-white px-7 text-[15px] font-medium text-[#1b2a41] outline-none transition-colors hover:bg-[#0d4c9b] hover:text-white focus-visible:ring-2 focus-visible:ring-[#0d4c9b] focus-visible:ring-offset-2";

export default function HomeInternetPackages({
  packages = DEFAULT_PACKAGES,
  morePackages = DEFAULT_MORE,
  onChoose,
  onAdvancedSearch,
}: HomeInternetPackagesProps) {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="w-full">
      <div className="bg-white px-4 py-8">
        <ol className="mx-auto flex max-w-[900px] items-start justify-center gap-4 sm:items-center sm:gap-6">
          {STEPS.map((st, i) => (
            <li key={st.label} className="flex items-center gap-4 sm:gap-6">
              <div className="flex w-28 flex-col items-center gap-3 text-center sm:w-[220px]">
                {st.icon}
                <span className="text-[15px] font-bold text-[#1f3b63]">
                  {st.label}
                </span>
              </div>
              {i < STEPS.length - 1 && <LongArrow />}
            </li>
          ))}
        </ol>
      </div>

      <section className="bg-[#f1f1f5] px-4 pt-14 pb-16">
        <div className="mx-auto w-full max-w-[1170px]">
          <h2 className={`${condensed} text-center text-[44px] leading-tight text-[#2a2420]`}>
            Home Internet <span className="text-[#0d4c9b]">Packages</span>
          </h2>

          <div className="mt-7 flex flex-col items-center gap-5">
            <button
              type="button"
              onClick={onAdvancedSearch}
              className={`${styles.arrowBtn} inline-flex h-[40px] items-center gap-2 rounded-full bg-[#0d4c9b] px-8 text-[15px] font-bold text-white outline-none focus-visible:ring-2 focus-visible:ring-[#0d4c9b] focus-visible:ring-offset-2`}
            >
              Advanced Search
              <span className={styles.arrow}>
                <ChevronRight className="size-3.5" />
              </span>
            </button>

            <button type="button" className={pill}>
              Popular Packages
            </button>
          </div>

          <div className="mt-10">
            <CardGrid>
              {packages.map((p) => (
                <div key={p.id} className={CELL}>
                  <PackageCard pkg={p} defaultOpen onChoose={onChoose} />
                </div>
              ))}
            </CardGrid>
          </div>

          {morePackages.length > 0 && (
            <>
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowMore((v) => !v)}
                  aria-expanded={showMore}
                  className={pill}
                >
                  More Packages
                  <ChevronDown
                    className={`size-4 transition-transform duration-300 ${showMore ? "rotate-180" : ""}`}
                  />
                </button>
              </div>

              <div
                className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${showMore ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
              >
                <div className="overflow-hidden" aria-hidden={!showMore}>
                  <div className="pt-[30px]">
                    <CardGrid>
                      {morePackages.map((p) => (
                        <div key={p.id} className={CELL}>
                          <PackageCard
                            pkg={p}
                            defaultOpen={false}
                            onChoose={onChoose}
                          />
                        </div>
                      ))}
                    </CardGrid>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="mt-10 text-center">
            <h3 className="text-xl font-medium text-[#4a4d55]">Service Terms</h3>
            <p className="mt-2 text-[12px] leading-[18px] font-medium text-[#d11a1a]">
              *Link handover timelines may be affected due to unforeseen
              technical issues or equipment-related challenges. The authority
              will not be liable for such delays.
            </p>
            <p className="text-[12px] leading-[18px] font-medium text-[#d11a1a]">
              **Customers can downgrade their package by paying the applicable
              OTC charge for the selected package.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}