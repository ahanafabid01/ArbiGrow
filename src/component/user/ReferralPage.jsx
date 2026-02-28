// src/pages/ReferralPage.jsx

import { motion, AnimatePresence } from "motion/react";
import {
  Users,
  Star,
  DollarSign,
  LinkIcon,
  Check,
  Copy,
  GitBranch,
  Award,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import useUserStore from "../../store/userStore";

const ReferralPage = ({
  totalReferrals,
  totalActiveReferrals,
  mockUserData,
  fixedReferralData,
  levelColors,
  selectedReferralLevel,
  setSelectedReferralLevel,
  handleCopyLink,
  copiedLink,
  activeLevel,
  lc,
}) => {
  const { user } = useUserStore();
  return (
    <div className="p-4 md:p-6 space-y-5">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-1">
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Referral Program
          </span>
        </h1>
        <p className="text-gray-400 text-sm">
          Invite friends and earn rewards up to 5 levels deep
        </p>
      </div>

      {/* Referral Stats — 2 compact cards */}
      <div className="grid grid-cols-2 gap-4">
        {[
          {
            icon: Users,
            label: "Total",
            value: String(totalReferrals),
            color: "text-cyan-400",
            border: "border-cyan-500/30",
            bg: "from-blue-600/10 to-cyan-600/10",
          },
          {
            icon: DollarSign,
            label: "Earned",
            value: `$${mockUserData.wallets.referral.toFixed(0)}`,
            color: "text-purple-400",
            border: "border-purple-500/30",
            bg: "from-purple-600/10 to-pink-600/10",
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`p-3 md:p-5 rounded-xl bg-gradient-to-br ${stat.bg} backdrop-blur-xl border ${stat.border} flex flex-col items-center text-center`}
          >
            <stat.icon className={`w-5 h-5 ${stat.color} mb-1`} />
            <div className={`text-xl md:text-3xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-[10px] md:text-xs text-gray-400 mt-0.5">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Referral Link Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
        className="p-4 md:p-5 rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600/20 to-cyan-600/20 flex items-center justify-center flex-shrink-0">
            <LinkIcon className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Your Referral Link</h3>
            <p className="text-xs text-gray-400">Share to invite new members</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white font-mono text-xs break-all">
            {import.meta.env.VITE_FRONTNED_URL}/register?ref_code=
            {user.referral_code}
          </div>
          <button
            onClick={handleCopyLink}
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 text-sm shrink-0"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* ── Network Tree ── */}
    </div>
  );
};

export default ReferralPage;
