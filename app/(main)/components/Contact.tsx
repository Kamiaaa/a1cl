"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  Headphones, 
  HeartHandshake, 
  ShieldCheck, 
  Play, 
  MapPin, 
  Send 
} from "lucide-react";

type RegionKey = 
  | "Dhaka North" 
  | "Dhaka South" 
  | "Outer Dhaka" 
  | "Barishal & Faridpur" 
  | "CTG" 
  | "Khulna" 
  | "Kishoreganj" 
  | "Mymensingh" 
  | "Northern" 
  | "Rangpur" 
  | "Sylhet";

interface OfficeInfo {
  name: string;
  address: string;
  salesEnquiry?: string;
  serviceSupport?: string;
  email: string;
}

const officeData: Record<RegionKey, OfficeInfo[]> = {
  "Dhaka North": [
    {
      name: "Corporate Service Office",
      address: "Police Plaza Concord, 12th Floor (Tower-1), Plot-02, Road-144, Gulshan, Dhaka-1212.",
      salesEnquiry: "01787667009",
      serviceSupport: "09678-123123 / 16335",
      email: "sales@link3.net"
    },
    {
      name: "Banani Service Office",
      address: "Road :124 House :7A (1st Floor) Gulshan-1 Dhaka-1212.",
      salesEnquiry: "01787667009",
      serviceSupport: "09678-123123 / 16335",
      email: "sales@link3.net"
    },
    {
      name: "Banasree Service Office",
      address: "Toba Garments, House #41, Anunda Nagar Merul Badda, Dhaka.",
      salesEnquiry: "01787667009",
      serviceSupport: "09678-123123 / 16335",
      email: "sales@link3.net"
    },
    {
      name: "Dakshinkhan Service Office",
      address: "185 Canada Plaza, 2nd Floor Shahid Latif Road, Mollartek, Dakshinkhan, Uttara, Dhaka-1230",
      salesEnquiry: "01787667016",
      serviceSupport: "09678-123123 / 16335",
      email: "sales@link3.net"
    }
  ],
  "Dhaka South": [],
  "Outer Dhaka": [],
  "Barishal & Faridpur": [],
  "CTG": [],
  "Khulna": [],
  "Kishoreganj": [],
  "Mymensingh": [],
  "Northern": [],
  "Rangpur": [],
  "Sylhet": []
};

export default function Contact() {
  const [activeRegion, setActiveRegion] = useState<RegionKey>("Dhaka North");
  const [formData, setFormData] = useState({
    service: "",
    name: "",
    phone: "",
    email: "",
    message: ""
  });

  const regions: RegionKey[] = [
    "Dhaka North", "Dhaka South", "Outer Dhaka", 
    "Barishal & Faridpur", "CTG", "Khulna", 
    "Kishoreganj", "Mymensingh", "Northern", 
    "Rangpur", "Sylhet"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="w-full bg-[#f8f9fa] text-gray-800 font-sans pb-20">
      
      {/* Hero Banner Section */}
      <div className="relative bg-gradient-to-r from-[#002855] via-[#004080] to-[#002855] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 flex flex-col lg:flex-row items-center justify-between">
          
          {/* Left Hero Image/Illustration (Customer Support Representative) */}
          <div className="relative w-full lg:w-1/2 h-64 sm:h-80 lg:h-96 mb-8 lg:mb-0 flex items-center">
            <div className="absolute left-0 bottom-0 w-full h-full max-w-lg">
              {/* Replace with your actual asset path or external url */}
              <Image 
                src="/img/contact-hero.jpg" 
                alt="Support Representative" 
                fill
                className="object-contain object-bottom-left"
                priority
              />
            </div>
          </div>

          {/* Right Hero Content */}
          <div className="z-10 max-w-xl text-center lg:text-right flex flex-col items-center lg:items-end">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-8">
              WE LISTEN, WE CARE, WE SOLVE
            </h1>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-6 z-10">
              <div className="flex flex-col items-center lg:items-end border-r border-white/20 pr-6">
                <span className="flex items-center gap-1.5 text-xs text-gray-200">
                  <Mail className="w-3.5 h-3.5" /> Mail us at
                </span>
                <a href="mailto:support@link3.net" className="font-semibold text-sm hover:underline">
                  support@link3.net
                </a>
              </div>
              
              <div className="flex flex-col items-center lg:items-end border-r border-white/20 pr-6">
                <span className="flex items-center gap-1.5 text-xs text-gray-200">
                  <MessageSquare className="w-3.5 h-3.5" /> Knock us at
                </span>
                <span className="font-semibold text-sm">Messenger</span>
              </div>

              <div className="flex flex-col items-center lg:items-end">
                <span className="flex items-center gap-1.5 text-xs text-gray-200">
                  <Phone className="w-3.5 h-3.5" /> Call us at
                </span>
                <span className="font-semibold text-xs leading-tight">16335 or<br/>09678-123123</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* We Listen / We Care / We Solve Icons Header */}
      <div className="max-w-5xl mx-auto px-4 -mt-8 mb-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center border-t-4 border-blue-600">
            <div className="w-14 h-14 bg-blue-600 text-white rounded-lg flex items-center justify-center mb-4 shadow-lg rotate-45">
              <Headphones className="w-7 h-7 -rotate-45" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">We Listen</h3>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center border-t-4 border-blue-600">
            <div className="w-14 h-14 bg-blue-600 text-white rounded-lg flex items-center justify-center mb-4 shadow-lg rotate-45">
              <HeartHandshake className="w-7 h-7 -rotate-45" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">We Care</h3>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center border-t-4 border-blue-600">
            <div className="w-14 h-14 bg-blue-600 text-white rounded-lg flex items-center justify-center mb-4 shadow-lg rotate-45">
              <ShieldCheck className="w-7 h-7 -rotate-45" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">We Solve</h3>
          </div>
        </div>
      </div>

      {/* Preferred Channel Section */}
      <div className="text-center max-w-3xl mx-auto px-4 mb-20">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
          Choose your preferred channel to <span className="text-blue-600">reach us.</span>
        </h2>
        <p className="text-gray-500 mb-8">via Email, Text or Call. We are here for you</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
            <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Call us at</p>
            <p className="text-base font-bold text-gray-800">16335 <span className="text-sm font-normal text-gray-500">or</span> 09678123123</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
            <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Mail us at</p>
            <p className="text-base font-bold text-blue-600">support@link3.net</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
            <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Knock us at</p>
            <p className="text-base font-bold text-gray-800">Messenger</p>
          </div>
        </div>
      </div>

      {/* How to get customer support Video Section */}
      <div className="max-w-4xl mx-auto px-4 mb-24 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">How to get customer support?</h2>
        <div className="relative bg-[#0b1329] rounded-2xl p-4 shadow-2xl overflow-hidden group aspect-video flex items-center justify-center border border-gray-800">
          
          {/* Optional Video Thumbnail Image */}
          <div className="absolute inset-0 opacity-50">
            <Image 
              src="/images/video-thumbnail.png" 
              alt="Customer support video preview" 
              fill 
              className="object-cover"
            />
          </div>

          <div className="relative z-10 w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition cursor-pointer">
            <Play className="w-8 h-8 fill-current ml-1" />
          </div>
        </div>
      </div>

      {/* Service Offices Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Service Offices</h2>
        
        {/* Region Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setActiveRegion(region)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition shadow-sm ${
                activeRegion === region
                  ? "bg-[#002855] text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        {/* Office Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {officeData[activeRegion]?.map((office, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{office.name}</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-start gap-2">
                  <span className="font-semibold text-gray-800 min-w-[110px]">Address :</span> 
                  <span>{office.address}</span>
                </p>
                {office.salesEnquiry && (
                  <p className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800 min-w-[110px]">For sales enquiry :</span> 
                    <span className="text-blue-600 font-medium">{office.salesEnquiry}</span>
                  </p>
                )}
                {office.serviceSupport && (
                  <p className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800 min-w-[110px]">For service/support :</span> 
                    <span>{office.serviceSupport}</span>
                  </p>
                )}
                <p className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800 min-w-[110px]">Email :</span> 
                  <span className="text-blue-600 font-medium">{office.email}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Want to Get in Touch Form Section */}
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white border border-gray-200 rounded-3xl p-8 sm:p-10 shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Want to <span className="text-blue-600">get in touch?</span></h2>
            <p className="text-gray-500 text-sm">Fill up the form and our team will get back to you within 24 hours.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Services</label>
              <select
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Select Service</option>
                <option value="broadband">Broadband Internet</option>
                <option value="corporate">Corporate Solutions</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="01XXXXXXXXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="name@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                rows={4}
                placeholder="Enter Your Message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
              />
            </div>

            <button
              type="submit"
              className="bg-[#002855] hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg transition shadow-md flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Submit
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}