import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full bg-[#0047AB] text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end h-10">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <Link 
              href="/tariff" 
              className="text-xs sm:text-sm font-semibold tracking-wide hover:underline focus:outline-none focus:ring-1 focus:ring-white rounded"
            >
              BTRC Approved Tariff
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}