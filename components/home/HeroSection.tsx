"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function HeroSection() {
  // Define the player images to cycle through
  const playerImages = [
    "/players/michael.png",
    "/players/kobe.png",
    "/players/lebron.png",
    "/players/stephen.png",
    "/players/kevin.png"
  ];
  
  // State to track the current player image index
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  
  // Effect to cycle through player images every 5 seconds
  useEffect(() => {    
    const intervalId = setInterval(() => {
      setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % playerImages.length);
    }, 5000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  return (
    <section className="relative bg-gradient-to-br from-[#17408B] via-[#17408B]/90 to-[#C9082A]/80 text-white min-h-[90vh] flex items-center">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBkPSJNMzAgMzBtLTI1IDBhMjUgMjUgMCAxIDAgNTAgMCAyNSAyNSAwIDEgMC01MCAweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=')] bg-repeat opacity-50"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 md:py-32">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-3/5">
            <div className="inline-block bg-[#FDBB30] px-4 py-1 rounded-md mb-6 transform -rotate-2 shadow-lg">
              <span className="font-bold tracking-wider text-black text-sm">OFFICIAL NBA RANKINGS</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-none">
              <span className="block mb-2">THE ULTIMATE</span>
              <span className="bg-white text-[#17408B] px-4 py-1 inline-block transform -rotate-1 shadow-xl">NBA RANKINGS</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-xl leading-relaxed">
              Create, share, and explore definitive rankings of the greatest NBA players of all time.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/create" className="bg-[#FDBB30] hover:bg-[#FDBB30]/90 text-black px-8 py-4 rounded-md font-bold text-lg shadow-xl transition-all hover:-translate-y-1 flex items-center gap-2 group">
                <span>CREATE RANKING</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href="/rankings/25" className="bg-white/10 backdrop-blur-sm border-2 border-white hover:bg-white/20 text-white px-8 py-4 rounded-md font-bold text-lg transition-all hover:-translate-y-1 shadow-lg">
                VIEW RANKINGS
              </Link>
            </div>
          </div>
          <div className="md:w-2/5 relative mt-12 md:mt-0">
            <div className="relative w-72 h-72 md:w-80 md:h-80 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-[#17408B] to-[#C9082A] rounded-full opacity-30 animate-pulse shadow-lg"></div>
              <div className="absolute inset-0 rounded-full border-4 border-[#FDBB30]/30 shadow-xl"></div>
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                {/* Player images */}
                {playerImages.map((src, index) => (
                  <div 
                    key={src}
                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${index === currentPlayerIndex ? 'opacity-100' : 'opacity-0'}`}
                  >
                    <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                      <Image 
                        src={src} 
                        alt={`NBA Player ${index + 1}`} 
                        fill
                        sizes="(max-width: 768px) 256px, 288px"
                        className="object-cover object-center" 
                        priority={index === 0}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
          <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,133.3C672,139,768,181,864,181.3C960,181,1056,139,1152,122.7C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
}
