import Image from "next/image";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import HeroSection from "@/components/home/HeroSection";

export default function Home() {
  return (
    <MainLayout>
      <main className="overflow-hidden">
          <HeroSection />

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-[#17408B] dark:text-[#FDBB30] rounded-full text-sm font-semibold mb-4">
              FEATURES
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Create Your NBA Legacy</h2>
            <div className="w-24 h-1 bg-[#C9082A] mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Join thousands of NBA fans in creating the definitive ranking of the greatest players of all time
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 transform transition-all hover:-translate-y-2 hover:shadow-2xl">
              <div className="w-16 h-16 mb-6 flex items-center justify-center bg-[#17408B] text-white rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Select Players</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Browse through our comprehensive database of NBA legends and current stars to build your perfect ranking.
              </p>
              <Link href="/create" className="text-[#17408B] dark:text-[#FDBB30] font-semibold flex items-center gap-1 group">
                Get Started
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 transform transition-all hover:-translate-y-2 hover:shadow-2xl">
              <div className="w-16 h-16 mb-6 flex items-center justify-center bg-[#C9082A] text-white rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Drag & Rank</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Our intuitive drag-and-drop interface makes it easy to create your personalized Top 10, 25, 50, or 100 list.
              </p>
              <Link href="/create" className="text-[#C9082A] dark:text-[#FDBB30] font-semibold flex items-center gap-1 group">
                Try It Now
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 transform transition-all hover:-translate-y-2 hover:shadow-2xl">
              <div className="w-16 h-16 mb-6 flex items-center justify-center bg-[#FDBB30] text-black rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">See Results</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Submit your ranking and see how it compares to the ultimate consensus list created by NBA fans worldwide.
              </p>
              <Link href="/rankings/25" className="text-[#FDBB30] dark:text-[#FDBB30] font-semibold flex items-center gap-1 group">
                View Rankings
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-5xl font-bold text-[#17408B] dark:text-[#FDBB30] mb-2">10K+</div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">Rankings Created</p>
            </div>
            <div className="p-6">
              <div className="text-5xl font-bold text-[#17408B] dark:text-[#FDBB30] mb-2">500+</div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">NBA Players</p>
            </div>
            <div className="p-6">
              <div className="text-5xl font-bold text-[#17408B] dark:text-[#FDBB30] mb-2">4</div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">Ranking Types</p>
            </div>
            <div className="p-6">
              <div className="text-5xl font-bold text-[#17408B] dark:text-[#FDBB30] mb-2">24/7</div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">Real-time Updates</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#17408B] text-white relative overflow-hidden">
        {/* Basketball pattern background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBkPSJNMzAgMzBtLTI1IDBhMjUgMjUgMCAxIDAgNTAgMCAyNSAyNSAwIDEgMC01MCAweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=')] bg-repeat"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-2/3 mb-10 md:mb-0">
              <h2 className="text-4xl font-bold mb-6">Ready to Create Your Ultimate NBA Ranking?</h2>
              <p className="text-xl text-blue-100 mb-8 max-w-lg">
                Join thousands of NBA fans and create your personalized ranking of the greatest players of all time.
              </p>
              <Link
                href="/create"
                className="inline-block bg-[#FDBB30] text-black hover:bg-[#FDBB30]/90 px-8 py-4 rounded-md font-bold text-lg shadow-lg transition-all hover:-translate-y-1"
              >
                CREATE YOUR RANKING
              </Link>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <div className="relative w-40 h-40">
                <div className="absolute inset-0 bg-[#FDBB30] rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-32 h-32 text-white">
                    <path fill="currentColor" d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 464c-114.7 0-208-93.31-208-208S141.3 48 256 48s208 93.31 208 208S370.7 464 256 464zM256 128c-17.67 0-32 14.33-32 32c0 17.67 14.33 32 32 32s32-14.33 32-32C288 142.3 273.7 128 256 128zM304 384h-96C199.1 384 192 376.9 192 368C192 359.1 199.1 352 208 352h16v-80H208C199.1 272 192 264.9 192 256c0-8.875 7.125-16 16-16h64c8.875 0 16 7.125 16 16v96h16c8.875 0 16 7.125 16 16C320 376.9 312.9 384 304 384z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </main>
    </MainLayout>
  );
}
