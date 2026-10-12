"use client";

import { useEffect, useState } from "react";

export type NavLink = { label: string; href: string };

type SiteNavbarProps = {
  /** Company logo, e.g. put it in /public and pass "/logo.png". */
  logoSrc?: string;
  logoAlt?: string;
  links?: NavLink[];
  /** Partner logo shown before the buttons, e.g. "/buybee.png". */
  partnerLogoSrc?: string;
  partnerHref?: string;
  partnerAlt?: string;
  selfCareHref?: string;
  referralHref?: string;
};

const DEFAULT_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Packages", href: "/packages" },
  { label: "Business", href: "/business" },
  { label: "About Us", href: "/about" },
  { label: "Pay Bill", href: "/pay-bill" },
  { label: "Career", href: "/career" },
  { label: "Contact Us", href: "/contact" },
];

const pillBtn =
  "inline-flex h-10 items-center justify-center rounded-full bg-[#0d4c9b] px-[22px] text-base font-bold text-white outline-none transition-[background-color,transform] duration-200 hover:bg-[#0a3d7e] focus-visible:ring-2 focus-visible:ring-[#0d4c9b] focus-visible:ring-offset-2 active:scale-[0.96]";

const linkCls =
  "text-base font-medium text-[#0d4c9b] outline-none transition-colors hover:text-[#082f63] focus-visible:underline";

function Logo({ src, alt }: { src: string; alt: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className="h-[66px] w-auto" />;
}

export default function SiteNavbar({
  logoSrc = "/logo.png",
  logoAlt = "Company logo",
  links = DEFAULT_LINKS,
  partnerLogoSrc = "/partner.png",
  partnerHref = "#",
  partnerAlt = "Partner",
  selfCareHref = "#",
  referralHref = "#",
}: SiteNavbarProps) {
  const [open, setOpen] = useState(false);

  // lock page scroll + close on Escape while the drawer is open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header className="w-full bg-white">
      <div className="mx-auto flex h-[76px] max-w-[1200px] items-center justify-between px-4 lg:px-0">
        <a href="/" aria-label="Home" className="shrink-0">
          <Logo src={logoSrc} alt={logoAlt} />
        </a>

        {/* Desktop */}
        <nav aria-label="Main" className="hidden items-center gap-[30px] lg:flex">
          {links.map((l) => (
            <a key={l.label} href={l.href} className={linkCls}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <a href={partnerHref} aria-label={partnerAlt} className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={partnerLogoSrc} alt={partnerAlt} className="h-8 w-auto" />
          </a>
          <a href={selfCareHref} className={pillBtn}>
            Self Care
          </a>
          <a href={referralHref} className={pillBtn}>
            Referral
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="grid size-9 place-items-center rounded-full bg-[#e6e6e6] text-[#222] outline-none focus-visible:ring-2 focus-visible:ring-[#0d4c9b] lg:hidden"
        >
          <svg viewBox="0 0 20 20" className="size-5" fill="none" aria-hidden>
            <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Mobile drawer: dark backdrop on the left, white panel slides in from the right */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <button
          type="button"
          tabIndex={open ? 0 : -1}
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/70 transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          className={`absolute inset-y-0 right-0 flex w-[min(85vw,340px)] flex-col overflow-y-auto bg-white shadow-xl transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-[76px] shrink-0 items-center justify-between px-4">
            <Logo src={logoSrc} alt={logoAlt} />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              tabIndex={open ? 0 : -1}
              className="grid size-9 place-items-center rounded-full bg-[#d9d9d9] text-[#222] outline-none focus-visible:ring-2 focus-visible:ring-[#0d4c9b]"
            >
              <svg viewBox="0 0 20 20" className="size-4" fill="none" aria-hidden>
                <path d="M4 4l12 12M16 4 4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <nav aria-label="Mobile" className="flex flex-col px-4 pt-2">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
                className={`${linkCls} border-b border-[#eee] py-3`}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="mt-6 flex flex-col items-start gap-4 px-4 pb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={partnerLogoSrc} alt={partnerAlt} className="h-8 w-auto" />
            <div className="flex gap-3">
              <a href={selfCareHref} className={pillBtn} tabIndex={open ? 0 : -1}>
                Self Care
              </a>
              <a href={referralHref} className={pillBtn} tabIndex={open ? 0 : -1}>
                Referral
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
