'use client';

import Image from 'next/image';
import { FaRegClock, FaRegUser, FaRegFolderOpen, FaMapMarkerAlt, FaBell } from 'react-icons/fa';
import { FaQuoteLeft, FaCheckCircle } from 'react-icons/fa';

export default function PortfolioComp() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-[DM_Sans] text-gray-700">
      
      {/* ================= 1. HERO IMAGE ================= */}
      <div className="w-full relative h-[300px] md:h-[500px] rounded-2xl overflow-hidden mb-12 shadow-lg">
        <Image 
          src="/images/coffee-shop-interior.jpg" // Đổi lại thành đường dẫn ảnh thật của bạn
          alt="Coffee Shop Interior"
          fill
          className="object-cover"
        />
      </div>

      {/* ================= 2. META INFO BAR ================= */}
      <div className="flex flex-wrap justify-between items-center border-b border-gray-200 pb-6 mb-12 gap-4 text-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#f9f6f0] flex items-center justify-center text-[#C19D56]"><FaRegClock size={18}/></div>
          <div><p className="text-gray-400 text-xs">Date:</p><p className="font-medium text-gray-900">January 10, 2026</p></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#f9f6f0] flex items-center justify-center text-[#C19D56]"><FaRegUser size={18}/></div>
          <div><p className="text-gray-400 text-xs">Client:</p><p className="font-medium text-gray-900">Samira & Rufus</p></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#f9f6f0] flex items-center justify-center text-[#C19D56]"><FaRegFolderOpen size={18}/></div>
          <div><p className="text-gray-400 text-xs">Category:</p><p className="font-medium text-gray-900">Clean World</p></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#f9f6f0] flex items-center justify-center text-[#C19D56]"><FaMapMarkerAlt size={18}/></div>
          <div><p className="text-gray-400 text-xs">Place:</p><p className="font-medium text-gray-900">Morgue Street, UK</p></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#f9f6f0] flex items-center justify-center text-[#C19D56]"><FaBell size={18}/></div>
          <div><p className="text-gray-400 text-xs">Service:</p><p className="font-medium text-gray-900">Clean Save Nature</p></div>
        </div>
      </div>

      {/* ================= 3. MAIN ARTICLE & FEATURES GRID ================= */}
      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-[Marcellus] text-gray-900 mb-6">
          What Makes Our Baked Goods Irresistibly Fresh & Tasty
        </h2>
        <p className="text-gray-500 leading-relaxed mb-12">
          Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.
        </p>

        {/* 6 Grid Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
          {[
            { id: '01', sub: 'Served with a Smile', title: 'Brewed Fresh Daily' },
            { id: '02', sub: 'Every Cup Tells a Story', title: 'Where Every Cup Tells a Story' },
            { id: '03', sub: 'Comfort & Community', title: 'Your Daily Dose of Coffee' },
            { id: '04', sub: 'Fresh Brews', title: 'Perfect Pairings' },
            { id: '05', sub: 'Artisan Coffee Meets', title: 'Sips & Bites' },
            { id: '06', sub: 'Always Worth It', title: 'Freshly Brewed. Oven-Fresh.' }
          ].map((item) => (
            <div key={item.id} className="border-t border-gray-200 pt-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-[#C19D56]">{item.sub}</span>
                <span className="text-5xl font-[Marcellus] text-gray-100">{item.id}</span>
              </div>
              <h3 className="text-xl font-[Marcellus] text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= 4. TESTIMONIAL/QUOTE BLOCK ================= */}
      <div className="bg-[#fcfaf5] p-10 md:p-16 rounded-xl flex flex-col items-center text-center mb-16">
        <FaQuoteLeft className="text-4xl text-[#C19D56] mb-6 opacity-60" />
        <p className="text-xl md:text-2xl font-[Marcellus] text-gray-800 italic max-w-3xl mb-8 leading-relaxed">
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        </p>
        <div className="font-[Marcellus] text-2xl text-gray-400 signature-font">
          Richard Nixon {/* Bạn có thể thay bằng 1 thẻ <Image> chứa chữ ký tay */}
        </div>
      </div>

      {/* ================= 5. BOTTOM SECTION (IMAGE + TEXT) ================= */}
      <div className="flex flex-col md:flex-row gap-12 items-center">
        <div className="w-full md:w-1/2 relative h-[400px] rounded-xl overflow-hidden shadow-md">
          <Image 
            src="/images/barista-working.jpg" // Đổi thành ảnh barista của bạn
            alt="Barista"
            fill
            className="object-cover"
          />
        </div>
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl md:text-4xl font-[Marcellus] text-gray-900 mb-6">
            The Coffee Shop Where Ideas Perk Up
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.
          </p>
          
          <ul className="space-y-4 mb-8">
            {[
              "Where Every Cup Tells a Story",
              "Coffee That Cares From Bean to Cup",
              "Because Life Is Too Short for Bad Coffee",
              "Brewed Bold, Served Warm",
              "A Place to Pause, a Cup to Remember"
            ].map((text, idx) => (
              <li key={idx} className="flex items-center gap-3 text-gray-700 font-medium">
                <FaCheckCircle className="text-[#C19D56]" />
                {text}
              </li>
            ))}
          </ul>

          <button className="bg-[#C19D56] hover:bg-[#a68648] text-white px-8 py-3 rounded-md font-bold tracking-wider transition-colors uppercase text-sm">
            Contact Us ↗
          </button>
        </div>
      </div>

    </div>
  );
}