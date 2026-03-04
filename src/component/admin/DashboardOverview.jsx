import { motion } from "motion/react";

export default function DashboardOverview() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Admin{" "}
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Overview
          </span>
        </h1>
        <p className="text-gray-400">Welcome to the admin dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Users", value: "1,234", change: "+12%" },
          { label: "Active Users", value: "856", change: "+8%" },
          { label: "Pending Verifications", value: "42", change: "-5%"},
          { label: "Total Revenue", value: "$125K", change: "+18%" },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10"
          >
            <div className="text-sm text-gray-400 mb-2">{stat.label}</div>

            <div className="text-2xl font-bold text-white mb-1">
              {stat.value}
            </div>

            <div
              className={`text-sm ${
                stat.change.startsWith("+") ? "text-green-400" : "text-red-400"
              }`}
            >
              {stat.change} from last month
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
