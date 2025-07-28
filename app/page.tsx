import Image from "next/image";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="nba-gradient text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                NBA Ultimate Top 25
              </h1>
              <p className="text-xl md:text-2xl mb-8">
                Create your own NBA player rankings and see how they compare to the consensus
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/create"
                  className="bg-white text-nba-blue hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold shadow-lg transition-colors"
                >
                  Create Your Ranking
                </Link>
                <Link
                  href="/rankings/25"
                  className="bg-transparent border-2 border-white hover:bg-white/10 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  View Top 25
                </Link>
              </div>
            </div>
            <div className="relative h-64 md:h-96">
              <Image
                src="/basketball-court.svg"
                alt="Basketball Court"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Create and submit your own NBA player rankings and contribute to the ultimate consensus list
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-nba-blue/10 text-nba-blue rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Select Players</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Browse through NBA players and select your favorites to include in your ranking
              </p>
            </div>

            <div className="card p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-nba-red/10 text-nba-red rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Drag & Rank</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Drag and drop players to create your personalized Top 10, 25, 50, or 100 list
              </p>
            </div>

            <div className="card p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-nba-accent/10 text-nba-accent rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">See Results</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Submit your ranking and see how it compares to the ultimate consensus list
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Ready to create your ranking?</h2>
          <Link
            href="/create"
            className="inline-block bg-nba-blue text-white hover:bg-nba-blue/90 px-8 py-4 rounded-lg font-semibold shadow-lg transition-colors text-lg"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </MainLayout>
  );
}
