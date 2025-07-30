import Link from "next/link";

const FeaturesSection = () => (
  <section className="relative py-32 bg-gradient-to-br from-slate-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
    {/* Abstract Background Elements */}
    <div className="absolute inset-0">
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-[#17408B]/10 to-[#C9082A]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-32 right-16 w-48 h-48 bg-gradient-to-tl from-[#C9082A]/8 to-[#17408B]/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-r from-slate-300/20 to-gray-400/20 rounded-full blur-2xl animate-pulse delay-500"></div>
      
      <svg className="absolute top-0 left-0 w-full h-full opacity-30" viewBox="0 0 1000 1000" preserveAspectRatio="none">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#17408B" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#C9082A" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <path d="M0,200 Q250,100 500,200 T1000,150 L1000,0 L0,0 Z" fill="url(#grad1)" />
        <path d="M0,800 Q250,700 500,800 T1000,750 L1000,1000 L0,1000 Z" fill="url(#grad1)" />
      </svg>
    </div>

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-24">
        <div className="inline-block mb-6">
          <span className="px-6 py-2 bg-gradient-to-r from-[#17408B]/10 to-[#C9082A]/10 rounded-full text-sm font-semibold text-[#17408B] dark:text-blue-400 border border-[#17408B]/20">
            FAN-POWERED NBA RANKINGS
          </span>
        </div>
        <h2 className="text-6xl lg:text-7xl font-black text-gray-900 dark:text-white mb-8 leading-tight">
          NBA Rankings
          <br />
          <span className="text-[#C9082A] dark:text-white">By The Fans</span>
        </h2>
        <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
          Your vote matters! Join thousands of fans in creating the definitive NBA player rankings through community voting
        </p>
      </div>

      {/* Main Content - Asymmetric Layout */}
      <div className="space-y-32">
        {/* First Section - Player Database */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="absolute -top-8 -left-8 text-8xl font-black text-[#17408B]/10 dark:text-blue-400/10 select-none">01</div>
              
              <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-2xl border border-gray-100 dark:border-gray-700">
                <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Vote For Your Favorites</h3>
                <div className="w-20 h-1 bg-gradient-to-r from-[#17408B] to-[#C9082A] rounded-full mb-6"></div>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                  Every fan vote counts! Browse through NBA legends and current stars to cast your votes and help shape the definitive fan rankings.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <div className="w-2 h-2 bg-[#17408B] rounded-full mr-4"></div>
                    <span className="text-lg">Your votes shape the official fan rankings</span>
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <div className="w-2 h-2 bg-[#C9082A] rounded-full mr-4"></div>
                    <span className="text-lg">Rankings updated in real-time with fan votes</span>
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <div className="w-2 h-2 bg-slate-600 rounded-full mr-4"></div>
                    <span className="text-lg">Simple and clean interface</span>
                  </div>
                </div>
                
                <Link href="/create" className="inline-flex items-center bg-gradient-to-r from-[#17408B] to-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                  Browse Players
                  <svg className="w-6 h-6 ml-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <div className="relative bg-gradient-to-br from-[#17408B]/5 to-[#C9082A]/5 rounded-3xl p-12 border border-[#17408B]/10">
              <svg viewBox="0 0 400 300" className="w-full h-auto">
                <rect x="50" y="50" width="300" height="200" rx="20" fill="none" stroke="#17408B" strokeWidth="3" opacity="0.3" />
                
                <g transform="translate(100, 80)">
                  <circle cx="0" cy="0" r="15" fill="#C9082A" opacity="0.8" />
                  <rect x="-8" y="15" width="16" height="30" rx="8" fill="#C9082A" opacity="0.8" />
                  <text x="0" y="60" textAnchor="middle" className="fill-[#17408B] text-xs font-bold">#23</text>
                </g>
                
                <g transform="translate(200, 90)">
                  <circle cx="0" cy="0" r="15" fill="#17408B" opacity="0.8" />
                  <rect x="-8" y="15" width="16" height="30" rx="8" fill="#17408B" opacity="0.8" />
                  <text x="0" y="60" textAnchor="middle" className="fill-[#C9082A] text-xs font-bold">#24</text>
                </g>
                
                <g transform="translate(300, 85)">
                  <circle cx="0" cy="0" r="15" fill="#666" opacity="0.6" />
                  <rect x="-8" y="15" width="16" height="30" rx="8" fill="#666" opacity="0.6" />
                  <text x="0" y="60" textAnchor="middle" className="fill-gray-600 text-xs font-bold">#6</text>
                </g>
                
                <g transform="translate(80, 180)">
                  <rect x="0" y="0" width="240" height="8" rx="4" fill="#f3f4f6" />
                  <rect x="0" y="0" width="180" height="8" rx="4" fill="url(#statsGrad)" />
                  <text x="0" y="25" className="fill-gray-600 text-xs">Career Stats</text>
                </g>
                
                <defs>
                  <linearGradient id="statsGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#17408B" />
                    <stop offset="100%" stopColor="#C9082A" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>

        {/* Second Section - Ranking Tools */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-1">
            <div className="relative bg-gradient-to-br from-[#C9082A]/5 to-red-600/5 rounded-3xl p-12 border border-[#C9082A]/10">
              <svg viewBox="0 0 400 300" className="w-full h-auto">
                {[1, 2, 3, 4, 5].map((rank, index) => (
                  <g key={rank} transform={`translate(50, ${40 + index * 45})`}>
                    <rect x="0" y="0" width="300" height="35" rx="17" fill={index < 3 ? '#C9082A' : index < 5 ? '#17408B' : '#666'} opacity={index < 3 ? '0.9' : '0.7'} />
                    <circle cx="20" cy="17" r="12" fill="white" />
                    <text x="20" y="22" textAnchor="middle" className="fill-gray-800 text-sm font-bold">{rank}</text>
                    <text x="45" y="22" className="fill-white text-sm font-semibold">NBA Legend #{rank}</text>
                    
                    <g transform="translate(270, 10)">
                      <circle cx="0" cy="0" r="2" fill="white" opacity="0.8" />
                      <circle cx="0" cy="7" r="2" fill="white" opacity="0.8" />
                      <circle cx="0" cy="14" r="2" fill="white" opacity="0.8" />
                      <circle cx="7" cy="0" r="2" fill="white" opacity="0.8" />
                      <circle cx="7" cy="7" r="2" fill="white" opacity="0.8" />
                      <circle cx="7" cy="14" r="2" fill="white" opacity="0.8" />
                    </g>
                  </g>
                ))}
              </svg>
            </div>
          </div>
          
          <div className="order-2">
            <div className="relative">
              <div className="absolute -top-8 -right-8 text-8xl font-black text-[#C9082A]/10 dark:text-red-400/10 select-none">02</div>
              
              <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-2xl border border-gray-100 dark:border-gray-700">
                <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Community-Driven Rankings</h3>
                <div className="w-20 h-1 bg-gradient-to-r from-[#C9082A] to-red-600 rounded-full mb-6"></div>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                  The ultimate NBA player rankings created by fans, not analysts. Your votes combine with thousands of others to create the true voice of basketball fandom.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <div className="w-2 h-2 bg-[#C9082A] rounded-full mr-4"></div>
                    <span className="text-lg">Simple drag-and-drop interface</span>
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <div className="w-2 h-2 bg-[#17408B] rounded-full mr-4"></div>
                    <span className="text-lg">Create Top 10, 25, 50, or 100 lists</span>
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <div className="w-2 h-2 bg-slate-600 rounded-full mr-4"></div>
                    <span className="text-lg">Save and share your rankings</span>
                  </div>
                </div>
                
                <Link href="/create" className="inline-flex items-center bg-gradient-to-r from-[#C9082A] to-red-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                  Create Ranking
                  <svg className="w-6 h-6 ml-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Call to Action */}
      <div className="text-center mt-32">
        <div className="relative bg-gradient-to-r from-[#17408B]/5 via-[#C9082A]/5 to-[#17408B]/5 rounded-3xl p-16 border border-gray-200/50 dark:border-gray-700/50">
          <div className="absolute inset-0 bg-gradient-to-r from-[#17408B]/10 to-[#C9082A]/10 rounded-3xl blur-xl"></div>
          
          <div className="relative">
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Join The Fan Community
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
              Add your voice to thousands of passionate NBA fans and help determine the true fan-voted player rankings
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                href="/create" 
                className="group relative bg-gradient-to-r from-[#C9082A] to-red-700 text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-[#C9082A] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center">
                  Create Ranking
                  <svg className="w-6 h-6 ml-3 transform group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </Link>
              
              <Link 
                href="/rankings" 
                className="group relative border-2 border-[#17408B] text-[#17408B] dark:text-blue-400 dark:border-blue-400 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-[#17408B] hover:text-white dark:hover:bg-blue-400 dark:hover:text-gray-900 transition-all duration-300 overflow-hidden"
              >
                <span className="relative flex items-center">
                  See Fan Rankings
                  <svg className="w-6 h-6 ml-3 transform group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default FeaturesSection;
