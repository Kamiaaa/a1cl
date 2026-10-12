"use client";

import { useId, useMemo, useState, type ReactNode } from "react";

/* -------------------------------------------------------------------------- */
/*  Types & sample data                                                       */
/* -------------------------------------------------------------------------- */

export type CoverageThana = {
  name: string;
  /** true when the service is available in this thana */
  covered: boolean;
};

export type CoverageDistrict = {
  name: string;
  thanas: CoverageThana[];
};

export type ServiceOffice = {
  name: string;
  address: string;
  salesEnquiry: string;
  support: string;
};

type CheckCoverageProps = {
  /** Replace with your real district → thana coverage list. */
  districts?: CoverageDistrict[];
  /** Office card shown when the area is covered. */
  office?: ServiceOffice;
  onCheck?: (result: {
    district: string;
    thana: string;
    covered: boolean;
  }) => void;
};

// Sample data only (the recording shows long lists). Pass your own via `districts`.
const DEFAULT_DISTRICTS: CoverageDistrict[] = [
  { name: "BRAHMANBARIA", thanas: [{ name: "BRAHMANBARIA SADAR", covered: false }] },
  {
    name: "CHANDPUR",
    thanas: [
      { name: "FARIDGONJ", covered: false },
      { name: "HAIMCHAR", covered: false },
      { name: "HAJIGANJ", covered: false },
      { name: "KACHUA", covered: false },
    ],
  },
  { name: "CHATTOGRAM", thanas: [{ name: "KOTWALI", covered: true }] },
  { name: "COXSBAZAR", thanas: [{ name: "COXSBAZAR SADAR", covered: false }] },
  { name: "CUMILLA", thanas: [{ name: "CUMILLA SADAR", covered: false }] },
  {
    name: "DHAKA",
    thanas: [
      { name: "DHANMONDI", covered: true },
      { name: "DOHAR", covered: false },
      { name: "GULSHAN", covered: true },
      { name: "JATRABARI", covered: true },
      { name: "KAFRUL", covered: true },
      { name: "KALABAGAN", covered: true },
      { name: "KERANIGANJ", covered: false },
    ],
  },
];

const DEFAULT_OFFICE: ServiceOffice = {
  name: "Corporate Service Office",
  address:
    "Police Plaza Concord, 13th Floor (Tower-1), Plot-02, Road- 144, Gulshan, Dhaka-1212.",
  salesEnquiry: "01787667009",
  support: "09678-123123 /16335",
};

// Set --font-condensed (e.g. Open Sans with the `wdth` axis via next/font) in your layout.
const condensed =
  "font-(family-name:--font-condensed) font-stretch-condensed font-bold";

/* -------------------------------------------------------------------------- */
/*  Small pieces                                                              */
/* -------------------------------------------------------------------------- */

function Chevron() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className="pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2 text-[#3a3a3a]"
    >
      <path
        d="M2.5 5.5 8 11l5.5-5.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SelectField({
  label,
  value,
  onChange,
  disabled,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="mb-1 block text-xs font-medium text-[#5b5f68]"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="h-[30px] w-full appearance-none rounded-[3px] border border-[#cfd2d9] bg-white px-2.5 pr-8 text-xs text-[#4a4d55] uppercase outline-none transition-shadow focus:border-[#0d4c9b] focus:shadow-[0_0_0_1px_#0d4c9b] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {children}
        </select>
        <Chevron />
      </div>
    </div>
  );
}

const iconCls = "size-3.5 shrink-0 text-[#5b5f68]";

function BuildingIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-4 shrink-0 text-[#0d4c9b]" fill="currentColor" aria-hidden>
      <path d="M3 1.5h7v13H3v-13Zm1.5 2v1.2H6V3.5H4.5Zm2.5 0v1.2h1.5V3.5H7ZM4.5 6v1.2H6V6H4.5Zm2.5 0v1.2h1.5V6H7ZM4.5 8.5v1.2H6V8.5H4.5Zm2.5 0v1.2h1.5V8.5H7ZM10.5 6H13v8.5h-2.5V6Z" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg viewBox="0 0 16 16" className={iconCls} fill="currentColor" aria-hidden>
      <path d="M8 1a4.5 4.5 0 0 0-4.5 4.5C3.5 9 8 15 8 15s4.5-6 4.5-9.5A4.5 4.5 0 0 0 8 1Zm0 6.2a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4Z" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg viewBox="0 0 16 16" className={iconCls} fill="currentColor" aria-hidden>
      <path d="M3.6 1.5c.3 0 .6.2.7.5l1 2.4c.1.3 0 .6-.2.8l-.9.9a8 8 0 0 0 3.7 3.7l.9-.9c.2-.2.5-.3.8-.2l2.4 1c.3.1.5.4.5.7V13c0 .8-.7 1.5-1.5 1.5A11 11 0 0 1 1.5 3C1.5 2.2 2.2 1.5 3 1.5h.6Z" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden>
      <circle cx="6.5" cy="6.5" r="4.2" stroke="currentColor" strokeWidth="2" />
      <path d="m10 10 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                            */
/* -------------------------------------------------------------------------- */

type Result = { covered: boolean } | null;

export default function CheckCoverage({
  districts = DEFAULT_DISTRICTS,
  office = DEFAULT_OFFICE,
  onCheck,
}: CheckCoverageProps) {
  const [district, setDistrict] = useState("");
  const [thana, setThana] = useState("");
  const [result, setResult] = useState<Result>(null);
  const [error, setError] = useState(false);

  const thanas = useMemo(
    () => districts.find((d) => d.name === district)?.thanas ?? [],
    [districts, district],
  );

  const pickDistrict = (name: string) => {
    setDistrict(name);
    setThana("");
    setResult(null);
    setError(false);
  };

  const pickThana = (name: string) => {
    setThana(name);
    setResult(null);
    setError(false);
  };

  const check = () => {
    if (!district || !thana) {
      setError(true);
      setResult(null);
      return;
    }
    const covered = thanas.find((t) => t.name === thana)?.covered ?? false;
    setError(false);
    setResult({ covered });
    onCheck?.({ district, thana, covered });
  };

  const showResult = result !== null;

  return (
    <section className="w-full bg-[#f3f3f3] px-4 py-14">
      <div className="mx-auto max-w-[620px] text-center">
        <h2 className={`${condensed} text-[40px] leading-tight text-[#2a2420]`}>
          Check <span className="text-[#0d4c9b]">Coverage</span>
        </h2>
        <p className="mt-2 text-base font-medium text-[#6a6d75]">
          Please enter your district and thana to check coverage.
        </p>

        <form
          className="mt-9"
          onSubmit={(e) => {
            e.preventDefault();
            check();
          }}
        >
          <div className="grid grid-cols-1 gap-5 text-left sm:grid-cols-2 sm:gap-8">
            <SelectField label="Your District Name" value={district} onChange={pickDistrict}>
              <option value="">-</option>
              {districts.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name}
                </option>
              ))}
            </SelectField>

            <SelectField
              label="Your Thana Name"
              value={thana}
              onChange={pickThana}
              disabled={!district}
            >
              <option value="">-</option>
              {thanas.map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name}
                </option>
              ))}
            </SelectField>
          </div>

          <button
            type="submit"
            className="mt-6 inline-flex h-[38px] items-center gap-2 rounded-full bg-[#0d4c9b] px-[17px] text-xs font-bold text-white outline-none transition-[background-color,transform] duration-200 hover:bg-[#0a3d7e] focus-visible:ring-2 focus-visible:ring-[#0d4c9b] focus-visible:ring-offset-2 active:scale-[0.97]"
          >
            Check Area
            <SearchIcon />
          </button>
        </form>

        {/* Result / validation (grid-rows trick animates height smoothly) */}
        <div
          aria-live="polite"
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
            showResult || error
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            {error && (
              <p className="pt-8 text-sm font-medium text-[#b3261e]">
                Please select both a district and a thana.
              </p>
            )}

            {result && !result.covered && (
              <p className="pt-9 text-xl font-bold text-[#2a2420]">
                A1C currently unavailable at your location.
              </p>
            )}

            {result?.covered && (
              <div className="pt-9">
                <p className="text-xl font-bold text-[#2a2420]">
                  A1C available at your location! Want to get a new
                  Connection?
                </p>

                <div className="mx-auto mt-5 w-full max-w-[260px] rounded-[3px] border border-[#0d4c9b] bg-white p-3 text-left shadow-[0_1px_4px_rgba(0,0,0,0.12)]">
                  <div className="flex items-center gap-2">
                    <BuildingIcon />
                    <h3 className="text-sm font-bold text-[#0d4c9b]">
                      {office.name}
                    </h3>
                  </div>

                  <ul className="mt-2.5 flex flex-col gap-2 text-[11px] leading-snug font-medium text-[#4a4d55]">
                    <li className="flex gap-2">
                      <PinIcon />
                      <span>Address : {office.address}</span>
                    </li>
                    <li className="flex gap-2">
                      <PhoneIcon />
                      <span>
                        For sales enquiry :{" "}
                        <a
                          href={`tel:${office.salesEnquiry}`}
                          className="font-bold text-[#0d4c9b]"
                        >
                          {office.salesEnquiry}
                        </a>
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <PhoneIcon />
                      <span>
                        For service/support :{" "}
                        <span className="font-bold text-[#0d4c9b]">
                          {office.support}
                        </span>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
