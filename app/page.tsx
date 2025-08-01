import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import StatsSection from "@/components/home/StatsSection";
import TopPlayersSection from "@/components/home/TopPlayersSection";

export default function Home() {
  return (
    <MainLayout>
      <main className="overflow-hidden">
          <HeroSection />
      {/* Stats Section */}
      <StatsSection />

      {/* Top Players Section */}
      <TopPlayersSection />

      {/* Features Section */}
      <FeaturesSection />

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
