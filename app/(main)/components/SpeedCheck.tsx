"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

type SpeedCheckProps = {
  /**
   * Optional: URL of your own embeddable speed test page. When set, "Check Here"
   * shows it in an iframe. When omitted, the built-in test below runs instead.
   */
  speedTestUrl?: string;
  /**
   * Base URL of the server used by the built-in test. It must expose the
   * Cloudflare-style endpoints `GET /__down?bytes=N` and `POST /__up` with CORS
   * enabled. Defaults to Cloudflare's public speed test.
   */
  endpoint?: string;
  /** Server name shown at the bottom right, e.g. "Link3 Technologies Ltd.". */
  serverName?: string;
  /** Server location shown under the name, e.g. "Dhaka". */
  serverLocation?: string;
  /**
   * JSON endpoint returning the visitor's IP / ISP. Defaults to
   * `${endpoint}/meta` (Cloudflare: { clientIp, asOrganization, colo, ... }).
   */
  clientInfoUrl?: string;
  onCheck?: () => void;
  getLinkHref?: string;
  concernsHref?: string;
};

// Set --font-condensed (e.g. Open Sans with the `wdth` axis via next/font) in your layout.
const condensed =
  "font-(family-name:--font-condensed) font-stretch-condensed font-bold";

/* -------------------------------------------------------------------------- */
/*  Gauge illustration (thick black arc, 5 ticks each side, blue needle)       */
/* -------------------------------------------------------------------------- */

function Gauge() {
  // Geometry: centre (158,157), outer radius 157, inner radius 135, cut flat at y=225
  const cx = 158;
  const cy = 157;
  const R = 157;
  const r = 135;
  const cut = 225;
  const dyc = cut - cy;
  const xo = Math.sqrt(R * R - dyc * dyc);
  const xi = Math.sqrt(r * r - dyc * dyc);

  const arc = `M ${cx - xo} ${cut} A ${R} ${R} 0 1 1 ${cx + xo} ${cut} L ${cx + xi} ${cut} A ${r} ${r} 0 1 0 ${cx - xi} ${cut} Z`;

  const ticks = [-90, -60, -30, 0, 30, 60, 90].map((deg) => {
    const a = (deg * Math.PI) / 180;
    const x1 = cx + Math.sin(a) * (r + 1);
    const y1 = cy - Math.cos(a) * (r + 1);
    const x2 = cx + Math.sin(a) * (r - 23);
    const y2 = cy - Math.cos(a) * (r - 23);
    return { deg, x1, y1, x2, y2 };
  });

  return (
    <svg
      viewBox="0 0 316 226"
      className="h-auto w-[316px] max-w-full"
      role="img"
      aria-label="Speedometer"
    >
      <path d={arc} fill="#000" />
      {ticks.map((t) => (
        <line
          key={t.deg}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke="#000"
          strokeWidth="9"
        />
      ))}
      {/* needle */}
      <g fill="#1565c0">
        <circle cx="133" cy="180" r="22" />
        <polygon points="117.7,164.2 197.1,108 206.9,118 148.3,195.8" />
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Card icons                                                                */
/* -------------------------------------------------------------------------- */

function PhoneHandIcon() {
  return (
    <svg viewBox="0 0 56 64" fill="none" className="h-16 w-14" aria-hidden>
      <rect x="14" y="3" width="30" height="48" rx="4" stroke="#1565c0" strokeWidth="2" />
      <path d="M14 10h30M25 6h8" stroke="#1565c0" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M29 16c-4 0-7 3-7 7 0 5 7 12 7 12s7-7 7-12c0-4-3-7-7-7Z" stroke="#1565c0" strokeWidth="2" />
      <circle cx="29" cy="23" r="2.600" fill="#1565c0" />
      <path d="M10 56V40c0-3 5-3 5 0v8M15 48h22c3 0 3 5 0 5H26M10 56h10" stroke="#1565c0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GroupChatIcon() {
  return (
    <svg viewBox="0 0 56 64" fill="none" className="h-16 w-14" aria-hidden>
      <rect x="18" y="4" width="20" height="9" rx="1.500" stroke="#1565c0" strokeWidth="1.800" />
      <rect x="6" y="12" width="18" height="8" rx="1.500" stroke="#1565c0" strokeWidth="1.800" />
      <rect x="32" y="12" width="18" height="8" rx="1.500" stroke="#1565c0" strokeWidth="1.800" />
      <path d="M21 8h12M10 16h10M36 16h10" stroke="#1565c0" strokeWidth="1.400" strokeLinecap="round" />
      {[10, 28, 46].map((x) => (
        <g key={x} stroke="#1565c0" strokeWidth="1.800">
          <circle cx={x} cy="30" r="4.500" />
          <path d={`M${x - 8} 48v-6c0-4 3.500-7 8-7s8 3 8 7v6z`} />
        </g>
      ))}
    </svg>
  );
}

function InfoCard({
  href,
  icon,
  children,
}: {
  href: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className="flex h-[142px] w-[120px] flex-col items-center justify-center gap-2 rounded-[3px] border border-[#e3e3e3] bg-white px-2 text-center text-sm leading-4 font-bold text-black outline-none focus-visible:ring-2 focus-visible:ring-[#0d4c9b]"
    >
      {icon}
      <span>{children}</span>
    </a>
  );
}

/* -------------------------------------------------------------------------- */
/*  Built-in speed test engine                                                */
/* -------------------------------------------------------------------------- */

type Sample = { t: number; v: number };
type Phase = "idle" | "ping" | "download" | "upload" | "done" | "error";

const TEST_MS = 8000; // per direction
const RAMP_MS = 1500; // ignored when computing the final figure

/** Runs `worker` in parallel for TEST_MS and reports live + final Mbps. */
async function measureThroughput(
  streams: number,
  worker: (
    signal: AbortSignal,
    add: (bytes: number) => void,
  ) => Promise<void>,
  outer: AbortSignal,
  onSample: (mbps: number, elapsed: number) => void,
): Promise<number> {
  const ctrl = new AbortController();
  const stop = () => ctrl.abort();
  outer.addEventListener("abort", stop);

  let total = 0;
  let rampBytes = 0;
  let rampTime = 0;
  let lastBytes = 0;
  let lastT = performance.now();
  let ema = 0;
  const start = lastT;

  const timer = setInterval(() => {
    const now = performance.now();
    const elapsed = now - start;
    const inst = ((total - lastBytes) * 8) / ((now - lastT) / 1000) / 1e6;
    ema = ema === 0 ? inst : ema * 0.6 + inst * 0.4;
    lastBytes = total;
    lastT = now;
    if (!rampTime && elapsed >= RAMP_MS) {
      rampTime = now;
      rampBytes = total;
    }
    onSample(ema, elapsed);
  }, 200);

  const add = (b: number) => {
    total += b;
  };

  const workers = Array.from({ length: streams }, () =>
    worker(ctrl.signal, add).catch(() => undefined),
  );

  await new Promise<void>((res) => setTimeout(res, TEST_MS));
  const endT = performance.now();
  const endBytes = total;
  ctrl.abort();
  clearInterval(timer);
  outer.removeEventListener("abort", stop);
  await Promise.allSettled(workers);

  if (outer.aborted) throw new DOMException("aborted", "AbortError");
  const t0 = rampTime || start;
  const b0 = rampTime ? rampBytes : 0;
  return ((endBytes - b0) * 8) / ((endT - t0) / 1000) / 1e6;
}

async function measurePing(base: string, signal: AbortSignal) {
  const times: number[] = [];
  for (let i = 0; i < 10; i++) {
    const t0 = performance.now();
    const res = await fetch(`${base}/__down?bytes=0&r=${Math.random()}`, {
      cache: "no-store",
      signal,
    });
    await res.arrayBuffer();
    times.push(performance.now() - t0);
  }
  times.shift(); // first request includes connection setup
  const sorted = [...times].sort((a, b) => a - b);
  const ping = sorted[Math.floor(sorted.length / 2)];
  let jitter = 0;
  for (let i = 1; i < times.length; i++) jitter += Math.abs(times[i] - times[i - 1]);
  jitter /= Math.max(1, times.length - 1);
  return { ping, jitter };
}

/* -------------------------------------------------------------------------- */
/*  Speed test panel                                                          */
/* -------------------------------------------------------------------------- */

const MARKS = [0, 1, 5, 10, 20, 30, 50, 75, 100];
const SWEEP = 135;

/** Maps a speed to a needle angle (deg from top), using the non-linear scale. */
function speedToAngle(v: number) {
  const x = Math.max(0, v);
  const step = (SWEEP * 2) / (MARKS.length - 1);
  for (let i = 1; i < MARKS.length; i++) {
    if (x <= MARKS[i]) {
      const f = (x - MARKS[i - 1]) / (MARKS[i] - MARKS[i - 1]);
      return -SWEEP + (i - 1 + f) * step;
    }
  }
  return SWEEP;
}

const polar = (cx: number, cy: number, r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return [cx + r * Math.sin(a), cy - r * Math.cos(a)] as const;
};

function arcPath(cx: number, cy: number, r: number, a0: number, a1: number) {
  const [x0, y0] = polar(cx, cy, r, a0);
  const [x1, y1] = polar(cx, cy, r, a1);
  return `M ${x0} ${y0} A ${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`;
}

const PURPLE = "#4a2a5a";

function LiveGauge({ value }: { value: number }) {
  const angle = speedToAngle(value);
  return (
    <svg viewBox="0 0 260 260" className="w-full max-w-[260px]" role="img" aria-label={`Speed ${value.toFixed(1)} Mbps`}>
      <path d={arcPath(130, 130, 100, -SWEEP, SWEEP)} stroke="#e3e3e6" strokeWidth="22" fill="none" />
      {angle > -SWEEP + 0.5 && (
        <path d={arcPath(130, 130, 100, -SWEEP, angle)} stroke={PURPLE} strokeWidth="22" fill="none" />
      )}
      {MARKS.map((m, i) => {
        const [x, y] = polar(130, 130, 74, -SWEEP + i * ((SWEEP * 2) / (MARKS.length - 1)));
        return (
          <text key={m} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize="11" fill="#555">
            {m}
          </text>
        );
      })}
      <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: "130px 130px", transition: "transform 0.25s ease-out" }}>
        <polygon points="127,130 133,130 130.8,62 129.2,62" fill="#333" />
      </g>
      <text x="130" y="196" textAnchor="middle" fontSize="38" fill="#555" fontWeight="300">
        {value.toFixed(1)}
      </text>
      <text x="130" y="216" textAnchor="middle" fontSize="12" fill="#666">
        Mbps
      </text>
    </svg>
  );
}

function Spark({ samples, max }: { samples: Sample[]; max: number }) {
  if (samples.length < 2) return null;
  const pts = samples.map((s) => [
    (s.t / TEST_MS) * 100,
    30 - Math.min(1, s.v / Math.max(max, 10)) * 28,
  ]);
  const d =
    `M 0 30 ` + pts.map(([x, y]) => `L ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ") +
    ` L ${pts[pts.length - 1][0].toFixed(1)} 30 Z`;
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="h-8 w-full" aria-hidden>
      <path d={d} fill={PURPLE} />
    </svg>
  );
}

function Metric({
  label,
  value,
  unit,
  active,
  chart,
}: {
  label: string;
  value: string;
  unit: string;
  active?: boolean;
  chart?: ReactNode;
}) {
  return (
    <div
      className={`rounded-[3px] p-3 transition-shadow ${
        active ? "bg-white shadow-[0_4px_16px_rgba(0,0,0,0.18)]" : ""
      }`}
    >
      <p className="text-[10px] font-medium tracking-wider text-[#555] uppercase">
        {label}
      </p>
      <div className="mt-1 flex items-end gap-2">
        <p
          className={`${condensed} text-[34px] leading-none font-light! text-[#555]`}
          aria-live="off"
        >
          {value}
        </p>
        <p className="pb-0.5 text-[11px] text-[#666]">{unit}</p>
      </div>
      {chart && <div className="mt-2">{chart}</div>}
    </div>
  );
}

type ClientInfo = { ip?: string; isp?: string; colo?: string };

function InfoBlock({
  title,
  subtitle,
  align,
}: {
  title: string;
  subtitle?: string;
  align: "left" | "right";
}) {
  return (
    <div className={`min-w-0 text-[#4a2a5a] ${align === "right" ? "text-right" : "text-left"}`}>
      <p className="truncate text-sm font-semibold">{title}</p>
      {subtitle && <p className="truncate text-xs text-[#6b5a75]">{subtitle}</p>}
    </div>
  );
}

function SpeedTestPanel({
  endpoint,
  serverName,
  serverLocation,
  clientInfoUrl,
  onBack,
}: {
  endpoint: string;
  serverName?: string;
  serverLocation?: string;
  clientInfoUrl?: string;
  onBack: () => void;
}) {
  const [info, setInfo] = useState<ClientInfo | null>(null);

  // Visitor IP + ISP (and the Cloudflare data-centre code as a location fallback)
  useEffect(() => {
    const c = new AbortController();
    const url = clientInfoUrl ?? `${endpoint.replace(/\/$/, "")}/meta`;
    fetch(url, { signal: c.signal, cache: "no-store" })
      .then((r) => r.json())
      .then((j) =>
        setInfo({
          ip: j.clientIp ?? j.ip,
          isp: j.asOrganization ?? j.isp ?? j.org,
          colo: j.colo,
        }),
      )
      .catch(() => setInfo({}));
    return () => c.abort();
  }, [endpoint, clientInfoUrl]);

  const [phase, setPhase] = useState<Phase>("idle");
  const [live, setLive] = useState(0);
  const [ping, setPing] = useState<number | null>(null);
  const [jitter, setJitter] = useState<number | null>(null);
  const [down, setDown] = useState<number | null>(null);
  const [up, setUp] = useState<number | null>(null);
  const [downS, setDownS] = useState<Sample[]>([]);
  const [upS, setUpS] = useState<Sample[]>([]);
  const [progress, setProgress] = useState(0);
  const ctrl = useRef<AbortController | null>(null);

  useEffect(() => () => ctrl.current?.abort(), []);

  const run = useCallback(async () => {
    ctrl.current?.abort();
    const c = new AbortController();
    ctrl.current = c;
    const base = endpoint.replace(/\/$/, "");

    setPing(null);
    setJitter(null);
    setDown(null);
    setUp(null);
    setDownS([]);
    setUpS([]);
    setLive(0);
    setProgress(0);

    try {
      setPhase("ping");
      const p = await measurePing(base, c.signal);
      setPing(p.ping);
      setJitter(p.jitter);
      setProgress(10);

      setPhase("download");
      const dl = await measureThroughput(
        4,
        async (signal, add) => {
          while (!signal.aborted) {
            const res = await fetch(`${base}/__down?bytes=25000000&r=${Math.random()}`, {
              cache: "no-store",
              signal,
            });
            const reader = res.body!.getReader();
            for (;;) {
              const { done, value } = await reader.read();
              if (done) break;
              add(value.byteLength);
            }
          }
        },
        c.signal,
        (v, t) => {
          setLive(v);
          setDown(v);
          setDownS((s) => [...s, { t, v }]);
          setProgress(10 + (t / TEST_MS) * 45);
        },
      );
      setDown(dl);
      setLive(0);

      setPhase("upload");
      const body = new Blob([new Uint8Array(4_000_000)]);
      const ul = await measureThroughput(
        3,
        (signal, add) =>
          new Promise<void>((resolve) => {
            const send = () => {
              if (signal.aborted) return resolve();
              const xhr = new XMLHttpRequest();
              let prev = 0;
              xhr.open("POST", `${base}/__up`);
              xhr.upload.onprogress = (e) => {
                add(e.loaded - prev);
                prev = e.loaded;
              };
              xhr.onload = send;
              xhr.onerror = () => resolve();
              signal.addEventListener("abort", () => {
                xhr.abort();
                resolve();
              });
              xhr.send(body);
            };
            send();
          }),
        c.signal,
        (v, t) => {
          setLive(v);
          setUp(v);
          setUpS((s) => [...s, { t, v }]);
          setProgress(55 + (t / TEST_MS) * 45);
        },
      );
      setUp(ul);
      setLive(0);
      setProgress(100);
      setPhase("done");
    } catch (e) {
      if ((e as Error).name !== "AbortError") setPhase("error");
    }
  }, [endpoint]);

  const fmt = (v: number | null, d = 1) => (v == null ? "--" : v.toFixed(d));
  const maxS = Math.max(0, ...downS.map((s) => s.v), ...upS.map((s) => s.v));

  const metrics = (
    <div className="grid w-full grid-cols-2 gap-x-6 gap-y-3 sm:max-w-[420px]">
      <Metric label="Ping" value={fmt(ping, 0)} unit="ms" active={phase === "ping"} />
      <Metric
        label="Download"
        value={fmt(down)}
        unit="Mbps"
        active={phase === "download"}
        chart={<Spark samples={downS} max={maxS} />}
      />
      <Metric label="Jitter" value={fmt(jitter, 0)} unit="ms" />
      <Metric
        label="Upload"
        value={fmt(up)}
        unit="Mbps"
        active={phase === "upload"}
        chart={<Spark samples={upS} max={maxS} />}
      />
    </div>
  );

  const circleBtn = (label: string, size: string, text: string) => (
    <button
      type="button"
      onClick={run}
      className={`${size} grid place-items-center rounded-full border-2 border-[#4a2a5a] bg-[#ece6ee] ${text} font-light tracking-wide text-[#4a2a5a] outline-none transition-transform duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:ring-[#4a2a5a] focus-visible:ring-offset-2 active:scale-95`}
    >
      {label}
    </button>
  );

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          ctrl.current?.abort();
          onBack();
        }}
        className="mb-2 text-sm font-medium text-[#0d4c9b] outline-none hover:underline focus-visible:ring-2 focus-visible:ring-[#0d4c9b]"
      >
        ← Back
      </button>

      <div className="relative min-h-[400px] rounded-[3px] bg-white px-6 py-8">
        {phase === "idle" && (
          <div className="flex min-h-[340px] flex-col items-center justify-center gap-6">
            {circleBtn("GO", "size-[170px]", "text-4xl")}
          </div>
        )}

        {phase === "error" && (
          <div className="flex min-h-[340px] flex-col items-center justify-center gap-5 text-center">
            <p className="text-base font-medium text-[#b3261e]">
              Couldn&apos;t reach the speed test server. Check your connection and try again.
            </p>
            {circleBtn("AGAIN", "size-[110px]", "text-lg")}
          </div>
        )}

        {(phase === "ping" || phase === "download" || phase === "upload") && (
          <div className="flex flex-col items-center justify-center gap-6 md:flex-row md:gap-10">
            <LiveGauge value={live} />
            {metrics}
          </div>
        )}

        {phase === "done" && (
          <div className="flex flex-col items-center justify-center gap-8 md:flex-row md:gap-14">
            {metrics}
            <div className="flex flex-col items-center gap-3">
              {circleBtn("AGAIN", "size-[110px]", "text-lg")}
            </div>
          </div>
        )}

        {/* Bottom bar: your IP / ISP  |  progress  |  test server */}
        <div className="mt-6 flex items-end gap-4">
          <div className="w-1/3 min-w-0">
            <InfoBlock
              align="left"
              title={info?.isp ?? (info ? "Your network" : "Detecting…")}
              subtitle={info?.ip ?? (info ? "IP unavailable" : "")}
            />
          </div>
          <div className="flex flex-1 items-center pb-2">
            <div
              className="h-[3px] w-full bg-[#e3e3e6]"
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full bg-[#4a2a5a] transition-[width] duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="w-1/3 min-w-0">
            <InfoBlock
              align="right"
              title={serverName ?? "Cloudflare"}
              subtitle={serverLocation ?? (info?.colo ? `Data centre ${info.colo}` : "")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                            */
/* -------------------------------------------------------------------------- */

export default function SpeedCheck({
  speedTestUrl,
  endpoint = "https://speed.cloudflare.com",
  serverName,
  serverLocation,
  clientInfoUrl,
  onCheck,
  getLinkHref = "#",
  concernsHref = "#",
}: SpeedCheckProps) {
  const [testing, setTesting] = useState(false);

  const start = () => {
    onCheck?.();
    setTesting(true);
  };

  return (
    <section className="w-full bg-[#f3f3f3] px-4 py-8">
      <div className="mx-auto max-w-[1000px]">
        {testing ? (
          speedTestUrl ? (
            <div>
              <button
                type="button"
                onClick={() => setTesting(false)}
                className="mb-2 text-sm font-medium text-[#0d4c9b] outline-none hover:underline focus-visible:ring-2 focus-visible:ring-[#0d4c9b]"
              >
                ← Back
              </button>
              <iframe
                src={speedTestUrl}
                title="Internet speed test"
                className="h-[480px] w-full border-0 bg-white"
                allow="geolocation"
              />
            </div>
          ) : (
            <SpeedTestPanel
              endpoint={endpoint}
              serverName={serverName}
              serverLocation={serverLocation}
              clientInfoUrl={clientInfoUrl}
              onBack={() => setTesting(false)}
            />
          )
        ) : (
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-4">
            {/* gauge column */}
            <div className="flex flex-col items-center text-center">
              <p className={`${condensed} text-[22px] leading-8 text-[#444]`}>
                Are you getting what you are paying for?
              </p>

              <div className="mt-9">
                <Gauge />
              </div>

              <button
                type="button"
                onClick={start}
                className="mt-4 h-8 rounded-full bg-[#0d4c9b] px-[19px] text-[13px] font-bold text-white outline-none transition-colors hover:bg-[#0a3d7e] focus-visible:ring-2 focus-visible:ring-[#0d4c9b] focus-visible:ring-offset-2"
              >
                Check Here
              </button>

              <h2
                className={`${condensed} mt-7 max-w-[400px] text-[40px] leading-[52px] text-[#2a2420]`}
              >
                What is my{" "}
                <span className="text-[#0d4c9b]">current internet speed?</span>
              </h2>
            </div>

            {/* cards column */}
            <div className="flex items-center justify-center gap-[15px]">
              <InfoCard href={getLinkHref} icon={<PhoneHandIcon />}>
                Get Link3
                <br />
                Now
              </InfoCard>
              <InfoCard href={concernsHref} icon={<GroupChatIcon />}>
                Send us your
                <br />
                concerns
              </InfoCard>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}