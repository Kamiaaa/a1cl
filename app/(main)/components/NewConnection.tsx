"use client";

import Image from "next/image";
import { useId, useState, type FormEvent, type ReactNode } from "react";

/* -------------------------------------------------------------------------- */
/*  Data — replace with your full district → upazila dataset or an API call.  */
/* -------------------------------------------------------------------------- */

const LOCATIONS: Record<string, string[]> = {
  Dhaka: ["Dhanmondi", "Gulshan", "Mirpur", "Mohammadpur", "Uttara"],
  Chattogram: ["Bakalia", "Double Mooring", "Halishahar", "Kotwali", "Pahartali"],
  Rajshahi: ["Boalia", "Motihar", "Paba", "Rajpara"],
  Khulna: ["Daulatpur", "Khalishpur", "Sonadanga"],
  Sylhet: ["Beanibazar", "Jaintapur", "Sylhet Sadar"],
};

const DISTRICTS = Object.keys(LOCATIONS);

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type FormState = {
  name: string;
  phone: string;
  email: string;
  address: string;
  district: string;
  upazila: string;
};

type Status = "idle" | "submitting" | "success" | "error";

const INITIAL_STATE: FormState = {
  name: "",
  phone: "",
  email: "",
  address: "",
  district: "",
  upazila: "",
};

/* -------------------------------------------------------------------------- */
/*  Shared styles                                                             */
/* -------------------------------------------------------------------------- */

const fieldBase =
  "w-full rounded-md border border-neutral-300 bg-neutral-100 text-[15px] text-neutral-800 " +
  "placeholder:text-neutral-400 outline-none transition " +
  "focus-visible:border-[#1a56a8] focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#1a56a8]/25 " +
  "disabled:cursor-not-allowed disabled:opacity-60";

/* -------------------------------------------------------------------------- */
/*  Icons (inline so there are no extra dependencies)                         */
/* -------------------------------------------------------------------------- */

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="currentColor" aria-hidden="true">
      <path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 2.25c-3.2 0-9 1.6-9 4.8V21h18v-1.95c0-3.2-5.8-4.8-9-4.8Z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="currentColor" aria-hidden="true">
      <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.6 21 3 13.4 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1l-2.2 2.2Z" />
    </svg>
  );
}

function AtIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3.5" />
      <path d="M15.5 12v1.5a2.5 2.5 0 0 0 5 0V12a8.5 8.5 0 1 0-3.4 6.8" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Small building blocks                                                     */
/* -------------------------------------------------------------------------- */

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-neutral-600">
        {label}
      </label>
      {children}
    </div>
  );
}

function IconInput({
  icon,
  ...props
}: { icon: ReactNode } & React.ComponentProps<"input">) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-600">
        {icon}
      </span>
      <input {...props} className={`${fieldBase} h-[42px] pl-10 pr-3`} />
    </div>
  );
}

function SectionTitle({ lead, accent }: { lead: string; accent: string }) {
  return (
    <h2 className="text-center text-3xl font-bold tracking-tight text-neutral-800 sm:text-4xl">
      {lead} <span className="text-[#1a56a8]">{accent}</span>
    </h2>
  );
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function NewConnection() {
  const uid = useId();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [status, setStatus] = useState<Status>("idle");

  const upazilas = form.district ? LOCATIONS[form.district] ?? [] : [];
  const submitting = status === "submitting";

  const id = (name: keyof FormState) => `${uid}-${name}`;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (status === "success" || status === "error") setStatus("idle");
  }

  function onDistrictChange(district: string) {
    // Changing district invalidates the previously chosen upazila.
    setForm((prev) => ({ ...prev, district, upazila: "" }));
    if (status === "success" || status === "error") setStatus("idle");
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      setForm(INITIAL_STATE);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      id="new-connection"
      aria-labelledby={`${uid}-heading`}
      className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:py-16"
    >
      <h1 id={`${uid}-heading`} className="sr-only">
        New connection
      </h1>

      <div className="grid items-start gap-x-12 gap-y-10 lg:grid-cols-2">
        {/* ------------------------------- Form ------------------------------ */}
        <div>
          <SectionTitle lead="Need" accent="New Connection?" />

          <p className="mt-10 text-base text-neutral-700">
            Fill up the form and our team will get back to you with in 24 hours.
          </p>

          <form onSubmit={onSubmit} className="mt-3 flex flex-col gap-5" noValidate={false}>
            <Field id={id("name")} label="Your Name">
              <IconInput
                id={id("name")}
                name="name"
                type="text"
                icon={<UserIcon />}
                placeholder="Your Name"
                autoComplete="name"
                required
                disabled={submitting}
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
              />
            </Field>

            <Field id={id("phone")} label="Phone Number">
              <IconInput
                id={id("phone")}
                name="phone"
                type="tel"
                inputMode="tel"
                icon={<PhoneIcon />}
                placeholder="01XXXXXXXXX"
                autoComplete="tel"
                pattern="01[3-9][0-9]{8}"
                title="Enter an 11-digit Bangladeshi mobile number, e.g. 01712345678"
                required
                disabled={submitting}
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
            </Field>

            <Field id={id("email")} label="Email">
              <IconInput
                id={id("email")}
                name="email"
                type="email"
                icon={<AtIcon />}
                placeholder="name@email.com"
                autoComplete="email"
                required
                disabled={submitting}
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </Field>

            <Field id={id("address")} label="Address">
              <textarea
                id={id("address")}
                name="address"
                rows={4}
                autoComplete="street-address"
                required
                disabled={submitting}
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                className={`${fieldBase} resize-y px-3 py-2.5`}
              />
            </Field>

            <Field id={id("district")} label="Your District Name">
              <select
                id={id("district")}
                name="district"
                required
                disabled={submitting}
                value={form.district}
                onChange={(e) => onDistrictChange(e.target.value)}
                className={`${fieldBase} h-[42px] px-3`}
              >
                <option value="">-</option>
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </Field>

            <Field id={id("upazila")} label="Your Upazila Name">
              <select
                id={id("upazila")}
                name="upazila"
                required
                disabled={submitting || !form.district}
                value={form.upazila}
                onChange={(e) => update("upazila", e.target.value)}
                className={`${fieldBase} h-[42px] px-3`}
              >
                <option value="">{form.district ? "-" : "Select a district first"}</option>
                {upazilas.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </Field>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-10 min-w-24 items-center justify-center rounded-full border-2 border-[#1a56a8] px-6 text-sm font-semibold text-[#1a56a8] transition hover:bg-[#1a56a8] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a56a8] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Submit"}
              </button>

              <p role="status" aria-live="polite" className="text-sm">
                {status === "success" && (
                  <span className="text-emerald-700">
                    Thanks! Our team will contact you within 24 hours.
                  </span>
                )}
                {status === "error" && (
                  <span className="text-red-700">
                    Something went wrong. Please try again.
                  </span>
                )}
              </p>
            </div>
          </form>
        </div>

        {/* ------------------------------ Image ------------------------------ */}
        <aside className="lg:sticky lg:top-24">
          <SectionTitle lead="24/7 Support" accent="Service" />

          <div className="relative mt-10 aspect-[4/5] overflow-hidden rounded-[2rem] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.35)] sm:aspect-[5/4] lg:aspect-[4/5]">
            {/* Put your photo at /public/images/customer-service.jpg */}
            <Image
              src="/img/noc.jpg"
              alt="Support team members working at their desks"
              fill
              sizes="(min-width: 1024px) 480px, 100vw"
              className="object-cover"
            />
            {/* Washed-out overlay so the caption stays readable */}
            <div className="absolute inset-0 bg-white/55" aria-hidden="true" />

            <p className="absolute inset-0 flex items-center justify-center px-6 text-center text-2xl font-bold leading-snug text-black sm:text-3xl">
              Enjoy
              <br />
              Premium Customer Service
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}