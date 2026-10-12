"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type TransitionEvent } from "react";
import styles from "./Carousel.module.css";

type Slide = { src: string; alt: string; href?: string };

// Put the banner images in /public/banners (file names below) and adjust the links as needed.
const SLIDES: Slide[] = [
  { src: "/img/slide-01.jpg", alt: "Get a Tk 200 cashback on a new Akash connection from the Link3 website", href: "/packages" },
  { src: "/img/slide-02.png", alt: "Pay your Link3 internet bill with bKash, no charge", href: "/pay-bill" },
  { src: "/img/slide-03.png", alt: "Everything in one app: the Link3 Selfcare App", href: "/self-care" },
  { src: "/img/slide-04.jpeg", alt: "Link3 IP Telephone Service: seamless communication, redefined", href: "/business" },
  { src: "/img/slide-02.png", alt: "Extra speed at the same price, with 100 free connections", href: "/packages" },
  { src: "/img/slide-01.jpg", alt: "Gamers: level up your gaming experience, 120 Mbps for Tk 1475", href: "/packages" },
  { src: "/img/slide-03.png", alt: "Free Super Premium Deco router with a new Link3 connection, 0% EMI", href: "/packages" },
];

const INTERVAL = 5000; // milliseconds each slide stays on screen

export default function Carousel() {
  const slides = SLIDES;
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const startX = useRef<number | null>(null);

  // A clone of the first slide sits at the end so autoplay can loop forward
  // without ever sliding back across the whole track.
  const items = count > 1 ? [...slides, slides[0]] : slides;
  const active = count ? index % count : 0;

  useEffect(() => {
    if (count < 2) return;
    const id = window.setTimeout(() => {
      setAnimate(true);
      setIndex((i) => Math.min(i + 1, count));
    }, INTERVAL);
    return () => window.clearTimeout(id);
  }, [index, count]);

  const goTo = (i: number) => {
    setAnimate(true);
    setIndex(((i % count) + count) % count);
  };

  // After sliding onto the clone, jump back to the real first slide with no animation.
  const handleTransitionEnd = (e: TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || index !== count) return;
    setAnimate(false);
    setIndex(0);
    requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
  };

  if (count === 0) return null;

  return (
    <section
      className={styles.root}
      aria-roledescription="carousel"
      aria-label="Promotions"
    >
      <div
        className={styles.viewport}
        onPointerDown={(e) => {
          startX.current = e.clientX;
        }}
        onPointerUp={(e) => {
          if (startX.current === null) return;
          const dx = e.clientX - startX.current;
          startX.current = null;
          if (Math.abs(dx) > 50) goTo(dx < 0 ? active + 1 : active - 1);
        }}
        onPointerCancel={() => {
          startX.current = null;
        }}
      >
        <div
          className={`${styles.track} ${animate ? styles.animated : ""}`}
          style={{ transform: `translateX(-${index * 100}%)` }}
          onTransitionEnd={handleTransitionEnd}
          aria-live="off"
        >
          {items.map((slide, i) => {
            const isClone = i >= count;
            const current = i === index;
            const picture = (
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="100vw"
                loading="eager"
                draggable={false}
                className={styles.image}
              />
            );
            return (
              <div
                key={isClone ? "clone" : `slide-${i}`}
                className={styles.slide}
                role="group"
                aria-roledescription="slide"
                aria-label={`${(i % count) + 1} of ${count}`}
                aria-hidden={!current || isClone}
                inert={!current}
              >
                {slide.href ? (
                  <Link href={slide.href} className={styles.slideLink}>
                    {picture}
                  </Link>
                ) : (
                  picture
                )}
              </div>
            );
          })}
        </div>
      </div>

      {count > 1 && (
        <div className={styles.dots} role="group" aria-label="Choose slide">
          {slides.map((slide, i) => (
            <button
              key={`dot-${i}`}
              type="button"
              className={`${styles.dot} ${i === active ? styles.dotActive : ""}`}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === active}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}
    </section>
  );
}