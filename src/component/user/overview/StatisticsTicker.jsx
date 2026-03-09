import { motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  TrendingUp,
  DollarSign,
  Download,
} from "lucide-react";

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
      value: (stats?.total_users ?? 0).toLocaleString(),
      color: "text-blue-400",
    },
    {
      icon: UserCheck,
      label: "Active Investors",
      value: (stats?.active_investors ?? 0).toLocaleString(),
      color: "text-green-400",
    },
    {
      icon: TrendingUp,
      label: "Investments Made",
      value: Number(stats?.total_invested ?? 0).toFixed(4),
      color: "text-red-400",
    },
    {
      icon: DollarSign,
      label: "Profits Generated",
      value: Number(stats?.total_profit_shared ?? 0).toFixed(4),
      color: "text-green-400",
    },
    {
      icon: Download,
      label: "Successful Withdrawals",
      value: Number(stats?.total_withdrawn ?? 0).toFixed(4),
      color: "text-orange-400",
    },
  ];

  // const duplicatedStats = [...statsArray, ...statsArray];
  const duplicatedStats = Array(4).fill(statsArray).flat();

  return (
    <div className="relative rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-20 bg-gradient-to-r from-[#0a0e27] to-transparent z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-20 bg-gradient-to-l from-[#0a0e27] to-transparent z-10"></div>

      <div className="overflow-hidden py-4">
        <motion.div
          className="flex gap-4 md:gap-8 w-max"
          animate={{ x: [0, "-50%"] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: isMobile ? 15 : 20,
              ease: "linear",
            },
          }}
        >
          {duplicatedStats.map((stat, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 whitespace-nowrap"
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
