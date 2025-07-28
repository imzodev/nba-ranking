import Link from "next/link";

export default function HeroSection() {
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
              <div className="absolute inset-0 bg-[#17408B] rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute inset-4 bg-[#C9082A] rounded-full opacity-30 animate-pulse" style={{animationDelay: '300ms'}}></div>
              <div className="absolute inset-8 bg-[#FDBB30] rounded-full opacity-40 animate-pulse" style={{animationDelay: '600ms'}}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 267.1 305.5" className="w-40 h-40 drop-shadow-2xl">
                  <path fill="#fff" d="M266.1 39.3c-.3-2.9-2.3-5.2-5.1-5.9l-97.1-22.6c-2.5-.6-5.2.4-6.7 2.5-1.5 2.1-1.5 5 .1 7.1 1.6 2 4.3 2.9 6.8 2.2l75.9-17.6c-2.7 3.3-5.6 6.5-8.5 9.6-21.9 23-54.9 41.6-93.1 52.4-38.3-10.8-71.2-29.4-93.1-52.4-3-3.1-5.8-6.3-8.5-9.6l75.9 17.6c2.5.6 5.2-.2 6.8-2.2 1.6-2 1.6-4.9.1-7.1-1.5-2.1-4.2-3.1-6.7-2.5L15.1 33.4c-2.8.7-4.8 3-5.1 5.9-.3 2.9 1.2 5.7 3.7 7 1.1.6 2.2 1.2 3.3 1.7 1.3.7 2.7 1.4 4 2.1 1.9 1 3.8 2 5.8 3 .8.4 1.6.8 2.3 1.2 1.3.6 2.5 1.3 3.8 1.9.8.4 1.7.8 2.5 1.2 1.3.6 2.7 1.3 4 1.9.8.4 1.7.8 2.5 1.1 1.4.6 2.8 1.3 4.2 1.9.8.4 1.6.7 2.4 1.1 1.5.7 3.1 1.3 4.6 2 .7.3 1.4.6 2.1.9 2 .8 4 1.7 6 2.5.2.1.4.2.7.3 2.1.8 4.3 1.7 6.5 2.5.7.3 1.5.5 2.2.8 1.7.6 3.5 1.2 5.2 1.8.8.3 1.7.6 2.5.9 1.7.6 3.4 1.1 5.1 1.7.8.3 1.7.5 2.5.8 1.7.5 3.5 1.1 5.3 1.6.8.2 1.6.5 2.4.7 1.9.6 3.9 1.1 5.8 1.6.7.2 1.3.4 2 .5 2.3.6 4.6 1.2 6.9 1.7.2.1.5.1.7.2 2.4.6 4.9 1.1 7.3 1.6.7.1 1.4.3 2.1.4 2 .4 4 .8 6 1.1.8.1 1.6.3 2.4.4 2 .3 4 .7 6 1 .8.1 1.5.2 2.3.3 2.2.3 4.3.6 6.5.8.6.1 1.3.1 1.9.2 2.5.3 5.1.5 7.6.7.5 0 .9.1 1.4.1 2.7.2 5.4.3 8.1.5.4 0 .9 0 1.3.1 2.8.1 5.7.2 8.5.2s5.7-.1 8.5-.2c.4 0 .9 0 1.3-.1 2.7-.1 5.4-.3 8.1-.5.5 0 .9-.1 1.4-.1 2.6-.2 5.1-.4 7.6-.7.6-.1 1.3-.1 1.9-.2 2.2-.3 4.4-.5 6.5-.8.8-.1 1.5-.2 2.3-.3 2-.3 4-.6 6-1 .8-.1 1.6-.3 2.4-.4 2-.4 4-.7 6-1.1.7-.1 1.4-.3 2.1-.4 2.5-.5 4.9-1 7.3-1.6.2-.1.5-.1.7-.2 2.3-.6 4.6-1.1 6.9-1.7.7-.2 1.3-.4 2-.5 2-.5 3.9-1 5.8-1.6.8-.2 1.6-.5 2.4-.7 1.8-.5 3.5-1 5.3-1.6.8-.3 1.7-.5 2.5-.8 1.7-.5 3.4-1.1 5.1-1.7.8-.3 1.7-.6 2.5-.9 1.8-.6 3.5-1.2 5.2-1.8.7-.3 1.5-.5 2.2-.8 2.2-.8 4.4-1.7 6.5-2.5.2-.1.4-.2.7-.3 2-.8 4-1.6 6-2.5.7-.3 1.4-.6 2.1-.9 1.6-.7 3.1-1.3 4.6-2 .8-.3 1.6-.7 2.4-1.1 1.4-.6 2.8-1.3 4.2-1.9.8-.4 1.7-.7 2.5-1.1 1.3-.6 2.7-1.3 4-1.9.8-.4 1.7-.8 2.5-1.2 1.3-.6 2.5-1.3 3.8-1.9.8-.4 1.6-.8 2.3-1.2 2-1 3.9-2 5.8-3 1.3-.7 2.7-1.4 4-2.1 1.1-.6 2.2-1.2 3.3-1.7 2.5-1.3 4-4.1 3.7-7z"/>
                  <path fill="#fff" d="M133.5 179.9c-40.7-11.5-74.7-31.3-97.4-56.2-1.7-1.9-4.3-2.5-6.6-1.5s-3.8 3.4-3.8 5.9v118.3c0 27.8 46.7 59.1 108.3 59.1s108.3-31.3 108.3-59.1V128.1c0-2.5-1.5-4.9-3.8-5.9s-4.9-.4-6.6 1.5c-22.7 24.9-56.7 44.7-97.4 56.2-1 .3-2 .3-3 0z"/>
                </svg>
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
