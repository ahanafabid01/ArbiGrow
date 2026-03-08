import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Users, UserCheck, TrendingUp, DollarSign, Download } from "lucide-react";

export function StatisticsTicker({ stats }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const statsArray = [
    {
      icon: Users,
      label: "Total Users",
      value: stats.total_users.toLocaleString(),
      color: "text-blue-400",
    },
    {
      icon: UserCheck,
      label: "Active Investors",
      value: stats.active_investors.toLocaleString(),
      color: "text-green-400",
    },
    {
      icon: TrendingUp,
      label: "Investments Made",
      value: stats.total_invested.toLocaleString(),
      color: "text-red-400",
    },
    {
      icon: DollarSign,
      label: "Profits Generated",
      value: `$${stats.total_profit_shared.toLocaleString()}`,
      color: "text-green-400",
    },
    {
      icon: Download,
      label: "Successful Withdrawals",
      value: stats.total_withdrawn.toLocaleString(),
      color: "text-orange-400",
    },
  ];

  // Duplicate for infinite scroll
  const duplicatedStats = [...statsArray, ...statsArray];

  return (
    <div className="relative rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 overflow-hidden">

      {/* Left fade */}
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-20 bg-gradient-to-r from-[#0a0e27] to-transparent z-10"></div>

      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-20 bg-gradient-to-l from-[#0a0e27] to-transparent z-10"></div>

      <div className="overflow-hidden py-4">
        <motion.div
          className="flex gap-4 md:gap-8"
          animate={{
            x: [0, "-50%"],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: isMobile ? 2 : 30, 
              ease: "linear",
            },
          }}
        >
          {duplicatedStats.map((stat, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 whitespace-nowrap px-4"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600/20 to-cyan-600/20 flex items-center justify-center flex-shrink-0">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>

              <div>
                <div className="text-xs text-gray-400">{stat.label}</div>
                <div className={`text-sm font-bold ${stat.color}`}>
                  {stat.value}
                </div>
              </div>

              {idx < duplicatedStats.length - 1 && (
                <div className="w-px h-8 bg-white/10 ml-4"></div>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}