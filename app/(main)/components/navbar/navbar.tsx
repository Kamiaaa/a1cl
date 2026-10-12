"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";

type NavLink = { label: string; href: string };

const LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Packages", href: "/packages" },
  { label: "Business", href: "/business" },
  { label: "About Us", href: "/about-us" },
  { label: "Pay Bill", href: "/pay-bill" },
  { label: "Career", href: "/career" },
  { label: "Contact Us", href: "/contact-us" },
];

const ACTIONS: NavLink[] = [
  { label: "Self Care", href: "/self-care" },
  { label: "Referral", href: "/referral" },
];

function Logo({ priority = false }: { priority?: boolean }) {
  return (
    <Link href="/" aria-label="Link3 home" className={styles.logoLink}>
      <Image
        src="/img/logo.png"
        alt="Link3 – The Service Company"
        width={144}
        height={150}
        priority={priority}
        className={styles.logo}
      />
    </Link>
  );
}

/** Three thin right-aligned bars; the bottom bar is shorter. */
function HamburgerIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path
        d="M5 9h18M5 14h18M11 19h12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="butt"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 4l16 16M20 4L4 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Lock page scroll and close on Escape while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className={styles.header}>
      <nav aria-label="Main" className={styles.nav}>
        <Logo priority />

        <ul className={styles.links}>
          {LINKS.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className={styles.link}
                aria-current={isActive(href) ? "page" : undefined}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          {ACTIONS.map(({ label, href }) => (
            <Link key={href} href={href} className={styles.pill}>
              {label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          className={styles.toggle}
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <HamburgerIcon />
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={`${styles.menu} ${open ? styles.menuOpen : ""}`}
        inert={!open}
      >
        <button
          type="button"
          className={styles.overlay}
          onClick={close}
          tabIndex={-1}
          aria-label="Close menu"
        />

        <aside className={styles.drawer} role="dialog" aria-modal="true" aria-label="Menu">
          <div className={styles.drawerHead}>
            <Logo />
            <button type="button" className={styles.close} onClick={close} aria-label="Close menu">
              <CloseIcon />
            </button>
          </div>

          <ul className={styles.drawerLinks}>
            {LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={styles.drawerLink}
                  onClick={close}
                  aria-current={isActive(href) ? "page" : undefined}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className={styles.drawerActions}>
              {ACTIONS.map(({ label, href }) => (
              <Link key={href} href={href} className={styles.pill} onClick={close}>
                {label}
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </header>
  );
}
