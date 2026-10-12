import Link from "next/link";

type PayBillProps = {
  href?: string;
  label?: string;
};

export default function PayBill({
  href = "/pay-bill",
  label = "Pay Bill",
}: PayBillProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="group fixed right-0 top-[71%] z-40 flex h-24 w-[26px] items-center justify-center
                 rounded-l-full bg-[#1565c0] shadow-md transition-all duration-200
                 hover:w-8 hover:bg-[#0d4f9e] focus-visible:outline-2 focus-visible:outline-offset-2
                 focus-visible:outline-[#1565c0] max-sm:top-[65%]"
    >
      <span
        className="-rotate-90 whitespace-nowrap text-[11px] font-bold uppercase leading-none
                   tracking-wider text-white select-none"
      >
        {label}
      </span>
    </Link>
  );
}

/*
  Usage: render once in app/layout.tsx, inside <body>:

    import PayBill from "@/components/PayBill";
    ...
    <body>
      {children}
      <PayBill href="/pay-bill" />
    </body>
*/