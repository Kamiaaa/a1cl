'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

// Lucide Icons tailored for Internet Service Provider (ISP) & Telecom
import {
  Wifi,
  Zap,
  Server,
  Globe,
  Tv,
  Headphones,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  HelpCircle,
  Gauge,
  CreditCard,
  FileCheck2,
} from 'lucide-react';

// Custom Simple SVGs for Social Media
const FacebookIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const Footer = () => {
  const pathname = usePathname();

  // Company & Support Navigation Links
  const companyLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Coverage Area', href: '/coverage', icon: <Globe className="w-4 h-4" /> },
    { name: 'Pay Bill Online', href: '/pay-bill', icon: <CreditCard className="w-4 h-4" /> },
    { name: 'Speedtest Portal', href: '/speedtest', icon: <Gauge className="w-4 h-4" /> },
    { name: 'Selfcare Login', href: '/portal', icon: <Headphones className="w-4 h-4" /> },
    { name: 'BTRC License Info', href: '/license', icon: <FileCheck2 className="w-4 h-4" /> },
  ];

  // Internet Services & Packages Links
  const serviceLinks = [
    { name: 'Home Broadband', href: '/packages/home', icon: <Wifi className="w-4 h-4" /> },
    { name: 'Corporate Connectivity', href: '/packages/corporate', icon: <Server className="w-4 h-4" /> },
    { name: 'Dedicated Internet', href: '/packages/dedicated', icon: <Zap className="w-4 h-4" /> },
    { name: 'IPTV & Streaming Services', href: '/services/iptv', icon: <Tv className="w-4 h-4" /> },
    { name: 'Data Center & Hosting', href: '/services/hosting', icon: <Server className="w-4 h-4" /> },
  ];

  // ISP Contact Details
  const contactInfo = [
    { icon: <Phone className="w-5 h-5" />, label: 'Helpdesk Hotline', value: '+880 9612-000111, +880 1711-111222', link: 'tel:+8809612000111' },
    { icon: <Mail className="w-5 h-5" />, label: 'Support Email', value: 'support@a1communication.net', link: 'mailto:support@a1communication.net' },
    { icon: <MapPin className="w-5 h-5" />, label: 'Head Office', value: 'Level 5, A1 Tower, Main Road, Block B, Dhaka, Bangladesh.', link: null },
    { icon: <Clock className="w-5 h-5" />, label: 'Support Hours', value: '24/7 Technical Assistance & Customer Care', link: null },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: <FacebookIcon />, href: 'https://facebook.com', color: 'hover:bg-[#1877f2]' },
    { name: 'Twitter', icon: <TwitterIcon />, href: 'https://twitter.com', color: 'hover:bg-[#1da1f2]' },
    { name: 'YouTube', icon: <YouTubeIcon />, href: 'https://youtube.com', color: 'hover:bg-[#ff0000]' },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white border-t border-slate-800/80 mt-auto">
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 lg:pt-16 pb-8">
        
        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Company Profile Column */}
          <div className="space-y-4">
            <Link href="/" className="inline-block group">
              <div className="relative w-48 h-20">
                <Image
                  src="/img/logo.png"
                  alt="A1 Communication Logo"
                  fill
                  loading="eager"
                  className="object-contain object-left"
                />
              </div>
            </Link>

            {/* Social Media Icons */}
            <div className="flex items-center gap-3 pt-1">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    p-2.5 rounded-full bg-slate-800/60 text-gray-400 transition-all duration-200
                    ${social.color} hover:text-white hover:scale-110
                  `}
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            <p className="text-gray-400 text-sm leading-relaxed pt-2">
              Empowering homes and businesses with high-speed fiber-optic internet, low latency routing, and uninterrupted 24/7 connectivity.
            </p>
          </div>

          {/* Quick Links & Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 relative inline-block">
              Quick Links
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-jolpai-500 rounded-full"></span>
            </h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`
                      flex items-center gap-2 text-gray-400 hover:text-jolpai-500 transition-all duration-200 group text-sm
                      ${pathname === link.href ? 'text-jolpai-500 font-medium' : ''}
                    `}
                  >
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-slate-500 group-hover:text-jolpai-500" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Internet Packages Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 relative inline-block">
              Our Services
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-jolpai-500 rounded-full"></span>
            </h3>
            <ul className="space-y-2">
              {serviceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`
                      flex items-center gap-2 text-gray-400 hover:text-jolpai-500 transition-colors group text-sm
                      ${pathname === link.href ? 'text-jolpai-500 font-medium' : ''}
                    `}
                  >
                    <span className={`text-slate-500 group-hover:text-jolpai-500 transition-colors ${pathname === link.href ? 'text-jolpai-500' : ''}`}>
                      {link.icon}
                    </span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Contact Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 relative inline-block">
              Support & Contact
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-jolpai-500 rounded-full"></span>
            </h3>
            <div className="space-y-4">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-start gap-3 group">
                  <div className="text-jolpai-500 mt-0.5 shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    {item.link ? (
                      <a 
                        href={item.link}
                        className="text-gray-400 hover:text-jolpai-500 transition-colors text-sm block"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm block leading-normal">{item.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section Divider */}
        <div className="border-t border-slate-800/80 my-8 lg:my-10"></div>

        {/* Bottom Metadata Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Copyright Information */}
          <div className="text-gray-500 text-sm text-center md:text-left">
            &copy; {currentYear} A1 Communication. All rights reserved.
          </div>

          {/* ISP Badges & Support Info */}
          <div className="flex items-center gap-3 text-gray-500 text-xs">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-jolpai-500/80" />
              BTRC Licensed ISP
            </span>
            <span className="w-px h-3 bg-slate-800"></span>
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-jolpai-500/80" />
              24/7 Tech Support
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;