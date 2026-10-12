"use client";

import {
  useCallback,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";

/* -------------------------------------------------------------------------- */
/*  Config                                                                    */
/* -------------------------------------------------------------------------- */

// Price: 500 → 5000 BDT in steps of 500 (10 stops)
const PRICE_STOPS = Array.from({ length: 10 }, (_, i) => 500 + i * 500);
// Bandwidth: 80 → 100 Mbps in steps of 2 (11 stops)
const SPEED_STOPS = Array.from({ length: 11 }, (_, i) => 80 + i * 2);

const SPECIAL_NEEDS = ["Portable Game", "Videos and Movies", "Cyber Security"];

const RECONNECTION_REASONS = ["Relocation", "Other"];

export type PackageFilters = {
  priceMin: number;
  priceMax: number;
  speedMin: number;
  speedMax: number;
  specialNeed: string | null;
};

type PackageFinderProps = {
  /** Called when "View Result" is pressed. */
  onViewResult?: (filters: PackageFilters) => void;
  /** Called when the reconnection form is submitted. */
  onReconnectionSubmit?: (data: Record<string, FormDataEntryValue>) => void;
};

// Fonts: set --font-condensed (e.g. Open Sans with the `wdth` axis via next/font)
// in your layout. Without it everything falls back to the inherited font.
const condensed =
  "font-(family-name:--font-condensed) font-stretch-condensed font-bold";

/* -------------------------------------------------------------------------- */
/*  Icons                                                                     */
/* -------------------------------------------------------------------------- */

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path
        d="M3 6l5 5 5-5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Cross({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path
        d="M4 4l8 8M12 4l-8 8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Range slider (two thumbs, snaps to stops)                                 */
/* -------------------------------------------------------------------------- */

type RangeSliderProps = {
  count: number;
  low: number;
  high: number;
  onChange: (low: number, high: number) => void;
  label: string;
};

function RangeSlider({ count, low, high, onChange, label }: RangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const active = useRef<"low" | "high" | null>(null);
  const last = count - 1;

  const indexFromPointer = useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      return Math.round(ratio * last);
    },
    [last],
  );

  const move = (which: "low" | "high", idx: number) => {
    if (which === "low") onChange(Math.min(idx, high), high);
    else onChange(low, Math.max(idx, low));
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const idx = indexFromPointer(e.clientX);
    const dLow = Math.abs(idx - low);
    const dHigh = Math.abs(idx - high);
    // pick the closest thumb; on a tie, go towards the side the click is on
    active.current =
      dLow < dHigh ? "low" : dHigh < dLow ? "high" : idx <= low ? "low" : "high";
    e.currentTarget.setPointerCapture(e.pointerId);
    move(active.current, idx);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!active.current) return;
    move(active.current, indexFromPointer(e.clientX));
  };

  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    active.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const onKey = (which: "low" | "high") => (e: KeyboardEvent) => {
    const cur = which === "low" ? low : high;
    let next = cur;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") next = cur + 1;
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = cur - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else return;
    e.preventDefault();
    move(which, Math.min(last, Math.max(0, next)));
  };

  const pct = (i: number) => `${(i / last) * 100}%`;

  return (
    <div className="px-1.5 pt-1">
      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="relative mx-3 h-5 cursor-pointer touch-none select-none"
      >
        {/* thin white rail */}
        <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 bg-white" />

        {/* stop dots */}
        {Array.from({ length: count }, (_, i) => (
          <span
            key={i}
            className="absolute top-1/2 size-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0d4c9b]"
            style={{ left: pct(i) }}
          />
        ))}

        {/* selected pill */}
        <div
          className="absolute top-1/2 h-5 -translate-y-1/2 rounded-full bg-[#0d4c9b] transition-[left,right] duration-150 ease-out"
          style={{
            left: `calc(${pct(low)} - 11px)`,
            right: `calc(${100 - (high / last) * 100}% - 11px)`,
          }}
        />

        {/* thumbs */}
        {(
          [
            ["low", low],
            ["high", high],
          ] as const
        ).map(([which, idx]) => (
          <span
            key={which}
            role="slider"
            tabIndex={0}
            aria-label={`${label} ${which === "low" ? "minimum" : "maximum"}`}
            aria-valuemin={0}
            aria-valuemax={last}
            aria-valuenow={idx}
            onKeyDown={onKey(which)}
            className="absolute top-1/2 size-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full outline-none transition-[left] duration-150 ease-out after:absolute after:top-1/2 after:left-1/2 after:size-[6px] after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:bg-white after:content-[''] focus-visible:ring-2 focus-visible:ring-white"
            style={{ left: pct(idx) }}
          />
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Expanding filter card                                                     */
/* -------------------------------------------------------------------------- */

type FilterCardProps = {
  title: string;
  value: ReactNode;
  open: boolean;
  onToggle: () => void;
  /** Height of the card when expanded, in px. */
  openHeight: number;
  children: ReactNode;
};

function FilterCard({
  title,
  value,
  open,
  onToggle,
  openHeight,
  children,
}: FilterCardProps) {
  const panelId = useId();

  return (
    <div className="relative h-[120px]">
      <div
        className={[
          "absolute inset-x-0 top-0 z-10 overflow-hidden px-5 pt-[19px]",
          "transition-[height,background-color,border-radius,box-shadow] duration-300 ease-out",
          open
            ? "rounded-[26px] bg-[#fdeee1] shadow-[0_18px_40px_-8px_rgba(60,40,20,0.28)]"
            : "rounded-none bg-[#f0f1f5] shadow-none",
        ].join(" ")}
        style={{ height: open ? openHeight : 120 }}
      >
        <div className="flex items-start justify-between">
          <h3 className="font-bold text-base leading-6 text-[#0d4c9b]">
            {title}
          </h3>
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? `Close ${title}` : `Open ${title}`}
            className="-mt-1 -mr-0 grid size-8 shrink-0 place-items-center rounded-full bg-[#0d4c9b] text-white outline-none transition-colors hover:bg-[#0a3d7e] focus-visible:ring-2 focus-visible:ring-[#0d4c9b] focus-visible:ring-offset-2"
          >
            <span className="relative size-4">
              <Chevron
                className={`absolute inset-0 transition-all duration-300 ${
                  open ? "scale-50 rotate-90 opacity-0" : "opacity-100"
                }`}
              />
              <Cross
                className={`absolute inset-0 transition-all duration-300 ${
                  open ? "opacity-100" : "scale-50 -rotate-90 opacity-0"
                }`}
              />
            </span>
          </button>
        </div>

        <div className="mt-2 text-[#2a2420]">{value}</div>

        <div
          id={panelId}
          className={`transition-opacity duration-200 ${
            open ? "opacity-100 delay-100" : "pointer-events-none opacity-0"
          }`}
          aria-hidden={!open}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function RangeValue({
  from,
  to,
  unit,
}: {
  from: number;
  to: number;
  unit: string;
}) {
  return (
    <p className={`${condensed} flex items-baseline gap-1 text-[32px] leading-10`}>
      <span>
        {from}
        <span className="mx-1">-</span>
        {to}
      </span>
      <span className="text-xl">{unit}</span>
    </p>
  );
}

/* -------------------------------------------------------------------------- */
/*  Reconnection form                                                         */
/* -------------------------------------------------------------------------- */

const fieldBase =
  "w-full rounded-[3px] border border-[#cfd2d9] bg-[#f0f1f5] text-[13px] text-[#2a2420] outline-none placeholder:font-medium placeholder:text-[#b4b8c0] focus:border-[#0d4c9b] focus:ring-1 focus:ring-[#0d4c9b]";

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: ReactNode;
  children: (cls: string, id: string) => ReactNode;
}) {
  const id = useId();
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-bold text-[#5b5f68]"
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-[#5b5f68]">
            {icon}
          </span>
        )}
        {children(`${fieldBase} ${icon ? "pl-8 pr-2.5" : "px-2.5"}`, id)}
      </div>
    </div>
  );
}

const iconCls = "size-3.5";

const UserIcon = (
  <svg viewBox="0 0 16 16" className={iconCls} fill="currentColor" aria-hidden>
    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5 5.5C3 11.6 5.2 10 8 10s5 1.6 5 3.5V14H3v-.5Z" />
  </svg>
);
const IdIcon = (
  <svg viewBox="0 0 16 16" className={iconCls} fill="none" aria-hidden>
    <rect x="1.5" y="3" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M4 7h3M4 9.5h8M9 7h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
const PhoneIcon = (
  <svg viewBox="0 0 16 16" className={iconCls} fill="currentColor" aria-hidden>
    <path d="M3.6 1.5c.3 0 .6.2.7.5l1 2.4c.1.3 0 .6-.2.8l-.9.9a8 8 0 0 0 3.7 3.7l.9-.9c.2-.2.5-.3.8-.2l2.4 1c.3.1.5.4.5.7V13c0 .8-.7 1.5-1.5 1.5A11 11 0 0 1 1.5 3C1.5 2.2 2.2 1.5 3 1.5h.6Z" />
  </svg>
);
const AtIcon = (
  <span className="text-sm font-bold leading-none" aria-hidden>
    @
  </span>
);

function ReconnectionForm({
  onSubmit,
}: {
  onSubmit?: (data: Record<string, FormDataEntryValue>) => void;
}) {
  const [reason, setReason] = useState(RECONNECTION_REASONS[0]);
  const reasonId = useId();
  const isRelocation = reason === "Relocation";

  return (
    <form
      className="mx-auto w-full max-w-[456px] rounded-md bg-white px-7 py-6 shadow-[0_2px_14px_rgba(0,0,0,0.16)]"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(Object.fromEntries(new FormData(e.currentTarget)));
      }}
    >
      <div className="flex flex-col gap-5">
        <div>
          <label
            htmlFor={reasonId}
            className="mb-1.5 block text-xs font-bold text-[#5b5f68]"
          >
            Select reason of reconnection
          </label>
          <div className="relative">
            <select
              id={reasonId}
              name="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className={`${fieldBase} h-[30px] appearance-none px-2.5 pr-8`}
            >
              {RECONNECTION_REASONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
            <Chevron className="pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2 text-[#2a2420]" />
          </div>
        </div>

        <Field label="Name" icon={UserIcon}>
          {(cls, id) => (
            <input id={id} name="name" required placeholder="Your Name" className={`${cls} h-8`} />
          )}
        </Field>

        <Field label="Current A1C ID" icon={IdIcon}>
          {(cls, id) => (
            <input id={id} name="A1CId" required placeholder="A1C ID" className={`${cls} h-8`} />
          )}
        </Field>

        <Field label="Contact Number" icon={PhoneIcon}>
          {(cls, id) => (
            <input
              id={id}
              name="phone"
              type="tel"
              required
              inputMode="tel"
              placeholder="01XXXXXXXXX"
              className={`${cls} h-8`}
            />
          )}
        </Field>

        {isRelocation && (
          <>
            <Field label="Previous Address">
              {(cls, id) => (
                <textarea id={id} name="previousAddress" required rows={3} className={`${cls} resize-y py-2`} />
              )}
            </Field>

            <Field label="Current Address">
              {(cls, id) => (
                <textarea id={id} name="currentAddress" required rows={3} className={`${cls} resize-y py-2`} />
              )}
            </Field>

            <Field label="Date of Relocation">
              {(cls, id) => (
                <input
                  id={id}
                  name="relocationDate"
                  type="date"
                  required
                  className={`${cls} h-8 text-[#5b5f68]`}
                />
              )}
            </Field>
          </>
        )}

        <Field label="Email Address" icon={AtIcon}>
          {(cls, id) => (
            <input
              id={id}
              name="email"
              type="email"
              required
              placeholder="example@email.com"
              className={`${cls} h-8`}
            />
          )}
        </Field>

        <div className="flex justify-center pt-1">
          <button
            type="submit"
            className="rounded-full border border-[#0d4c9b] bg-white px-5 py-1.5 text-[13px] font-medium text-[#1b2a41] outline-none transition-colors hover:bg-[#0d4c9b] hover:text-white focus-visible:ring-2 focus-visible:ring-[#0d4c9b] focus-visible:ring-offset-2"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                            */
/* -------------------------------------------------------------------------- */

type Tab = "packages" | "reconnection";
type CardKey = "price" | "speed" | "need";

export default function PackageFinder({
  onViewResult,
  onReconnectionSubmit,
}: PackageFinderProps) {
  const [tab, setTab] = useState<Tab>("packages");
  const [openCards, setOpenCards] = useState<Record<CardKey, boolean>>({
    price: false,
    speed: false,
    need: false,
  });

  // price default 1000-2000, speed default 80-100
  const [price, setPrice] = useState<[number, number]>([1, 3]);
  const [speed, setSpeed] = useState<[number, number]>([0, SPEED_STOPS.length - 1]);
  const [need, setNeed] = useState<string | null>(null);

  const toggle = (key: CardKey) =>
    setOpenCards((s) => ({ ...s, [key]: !s[key] }));

  return (
    <section className="w-full bg-white px-4 py-12">
      <div className="mx-auto max-w-[940px]">
        <h2
          className={`${condensed} text-center text-[40px] leading-tight text-[#2a2420]`}
        >
          What are You Looking For ?
        </h2>

        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Search type"
          className="mx-auto mt-7 flex w-fit rounded-full bg-[#f0f1f5]"
        >
          {(
            [
              ["packages", "Packages"],
              ["reconnection", "Reconnection"],
            ] as const
          ).map(([key, text]) => (
            <button
              key={key}
              role="tab"
              type="button"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={`rounded-full px-8 py-2.5 text-sm font-bold outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-[#0d4c9b] focus-visible:ring-offset-2 ${
                tab === key
                  ? "bg-[#0d4c9b] text-white"
                  : "text-[#6a6d75] hover:text-[#0d4c9b]"
              }`}
            >
              {text}
            </button>
          ))}
        </div>

        {tab === "packages" ? (
          <div role="tabpanel" className="mt-7">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:px-0">
              <FilterCard
                title="Price Range"
                open={openCards.price}
                onToggle={() => toggle("price")}
                openHeight={160}
                value={
                  <RangeValue
                    from={PRICE_STOPS[price[0]]}
                    to={PRICE_STOPS[price[1]]}
                    unit="BDT"
                  />
                }
              >
                <div className="mt-3">
                  <RangeSlider
                    label="Price"
                    count={PRICE_STOPS.length}
                    low={price[0]}
                    high={price[1]}
                    onChange={(l, h) => setPrice([l, h])}
                  />
                </div>
              </FilterCard>

              <FilterCard
                title="Network Bandwidth"
                open={openCards.speed}
                onToggle={() => toggle("speed")}
                openHeight={160}
                value={
                  <RangeValue
                    from={SPEED_STOPS[speed[0]]}
                    to={SPEED_STOPS[speed[1]]}
                    unit="Mbps"
                  />
                }
              >
                <div className="mt-3">
                  <RangeSlider
                    label="Bandwidth"
                    count={SPEED_STOPS.length}
                    low={speed[0]}
                    high={speed[1]}
                    onChange={(l, h) => setSpeed([l, h])}
                  />
                </div>
              </FilterCard>

              <FilterCard
                title="Special Need"
                open={openCards.need}
                onToggle={() => toggle("need")}
                openHeight={216}
                value={
                  <p className={`${condensed} text-2xl leading-10`}>
                    {need ?? "Please Choose"}
                  </p>
                }
              >
                <fieldset className="mt-1 flex flex-col gap-2.5">
                  <legend className="sr-only">Special need</legend>
                  {SPECIAL_NEEDS.map((opt) => (
                    <label
                      key={opt}
                      className="group flex w-fit cursor-pointer items-center gap-2.5 text-[13px] text-[#1b2a41]"
                    >
                      <input
                        type="radio"
                        name="special-need"
                        value={opt}
                        checked={need === opt}
                        onChange={() => setNeed(opt)}
                        className="peer sr-only"
                      />
                      <span className="grid size-5 place-items-center rounded-full border-[1.5px] border-[#0d4c9b] bg-white transition-shadow after:size-2.5 after:scale-0 after:rounded-full after:bg-[#0d4c9b] after:transition-transform after:content-[''] peer-checked:after:scale-100 peer-focus-visible:ring-2 peer-focus-visible:ring-[#0d4c9b] peer-focus-visible:ring-offset-2 group-hover:shadow-[0_2px_6px_rgba(13,76,155,0.35)]" />
                      {opt}
                    </label>
                  ))}
                </fieldset>
              </FilterCard>
            </div>

            <div className="mt-8 flex justify-center md:mt-5">
              <button
                type="button"
                onClick={() =>
                  onViewResult?.({
                    priceMin: PRICE_STOPS[price[0]],
                    priceMax: PRICE_STOPS[price[1]],
                    speedMin: SPEED_STOPS[speed[0]],
                    speedMax: SPEED_STOPS[speed[1]],
                    specialNeed: need,
                  })
                }
                className="rounded-full border border-[#0d4c9b] bg-white px-4 py-1.5 text-[13px] font-medium text-[#1b2a41] outline-none transition-colors hover:bg-[#0d4c9b] hover:text-white focus-visible:ring-2 focus-visible:ring-[#0d4c9b] focus-visible:ring-offset-2"
              >
                View Result
              </button>
            </div>
          </div>
        ) : (
          <div role="tabpanel" className="mt-7">
            <ReconnectionForm onSubmit={onReconnectionSubmit} />
          </div>
        )}
      </div>
    </section>
  );
}
