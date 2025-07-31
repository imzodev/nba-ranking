import React from "react";
import { Trophy, Users, Layers } from "lucide-react";

const stats = [
  {
    label: "Rankings Created",
    value: "1K+",
    icon: <Trophy className="w-10 h-10 text-[#17408B] mb-4" strokeWidth={2.2} />,
    gradient: "from-[#17408B]/10 to-[#17408B]/5 dark:from-[#17408B]/30 dark:to-slate/10"
  },
  {
    label: "NBA Players",
    value: "5000+",
    icon: <Users className="w-10 h-10 text-[#C9082A] mb-4" strokeWidth={2.2} />,
    gradient: "from-[#C9082A]/10 to-[#C9082A]/5 dark:from-[#C9082A]/30 dark:to-slate/10"
  },
  {
    label: "Ranking Types",
    value: "4",
    icon: <Layers className="w-10 h-10 text-slate mb-4" strokeWidth={2.2} />,
    gradient: "from-slate/10 to-slate/5 dark:from-slate/20 dark:to-[#17408B]/10"
  },
];

const StatsSection = () => (
  <section className="py-24 bg-gradient-to-br from-white via-[#F4F7FB] to-gray-100 dark:from-gray-900 dark:via-[#17408B] dark:to-[#0a1836]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4 drop-shadow">NBA Ranking Platform Stats</h2>
        <p className="text-lg text-gray-500 dark:text-blue-100 font-medium">Trusted by thousands of fans worldwide</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, idx) => (
          <div
            key={stat.label}
            className={`relative flex flex-col items-center bg-gradient-to-br ${stat.gradient} rounded-3xl shadow-xl transition-transform transform hover:-translate-y-2 hover:shadow-2xl p-8 border border-white/60 dark:border-[#17408B]/30`}
            style={{ minHeight: 220 }}
          >
            <div className="absolute top-4 right-4 opacity-10 text-7xl pointer-events-none select-none font-black">
              {idx + 1}
            </div>
            {stat.icon}
            <div className="text-5xl font-extrabold mb-2 font-mono drop-shadow-lg"
              style={{ color: stat.label === "Ranking Types" ? "#676767" : stat.label === "NBA Players" ? "#C9082A" : "#17408B" }}>
              {stat.value}
            </div>
            <p className="text-gray-700 dark:text-blue-100 font-semibold text-lg tracking-wide mb-1 font-sans">{stat.label}</p>
            <div className={`h-1 w-10 rounded-full mt-2 mb-1 ${
              stat.label === "Ranking Types"
                ? "bg-slate"
                : stat.label === "NBA Players"
                ? "bg-[#C9082A]"
                : "bg-[#17408B]"
            }`}></div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default StatsSection;
