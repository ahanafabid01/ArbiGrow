// src/pages/ReferralPage.jsx

import { useState } from "react";
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
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import useUserStore from "../../store/userStore";

const ReferralPage = ({
  totalReferrals,
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
  const [isTreeOpen, setIsTreeOpen] = useState(false);
  const [collapsedNodes, setCollapsedNodes] = useState({});
  const rootUsername = user?.username || "";
  const rootName = user?.full_name || "You";
  const totalEarned =
    Number(user?.referral_wallet || 0) + Number(user?.generation_wallet || 0);

  const membersByLevel = fixedReferralData.flatMap((levelGroup) =>
    levelGroup.users.map((member) => ({
      ...member,
      level: levelGroup.level,
    })),
  );

  const childrenByReferrer = membersByLevel.reduce((acc, member) => {
    if (!acc[member.referredBy]) {
      acc[member.referredBy] = [];
    }
    acc[member.referredBy].push(member);
    return acc;
  }, {});

  const buildReferralTree = (member, maxDepth = 5) => {
    if (member.level >= maxDepth) {
      return { ...member, children: [] };
    }
    const children = (childrenByReferrer[member.username] || []).map((child) =>
      buildReferralTree(child, maxDepth),
    );
    return { ...member, children };
  };

  const rootChildren = (childrenByReferrer[rootUsername] || []).map((child) =>
    buildReferralTree(child),
  );

  const treeRoot = {
    id: "root-user",
    name: rootName,
    username: rootUsername,
    level: 0,
    joinDate: "Root",
    totalEarnings: totalEarned,
    directReferrals: rootChildren.length,
    referredBy: null,
    children: rootChildren,
  };

  const renderTreeNode = (node, depth = 0) => {
    const isRoot = depth === 0;
    const hasChildren = (node.children?.length || 0) > 0;
    const isCollapsed =
      collapsedNodes[node.id] ?? (hasChildren && depth > 0);
    const nodeTheme =
      node.level === 0
        ? {
            bg: "from-cyan-600/15 to-blue-600/10",
            border: "border-cyan-500/30",
            text: "text-cyan-300",
          }
        : levelColors[node.level] || levelColors[1];

    const toggleNode = () => {
      if (!hasChildren) return;
      setCollapsedNodes((prev) => ({
        ...prev,
        [node.id]: !(prev[node.id] ?? (hasChildren && depth > 0)),
      }));
    };

    return (
      <div
        key={`${node.id}-${depth}`}
        className={`relative ${isRoot ? "" : "ml-4 sm:ml-6 pl-4 sm:pl-6 border-l border-white/10"}`}
      >
        {!isRoot && (
          <span className="absolute left-0 top-6 w-4 sm:w-6 border-t border-white/10" />
        )}

        <div
          className={`rounded-xl border ${nodeTheme.border} bg-gradient-to-br ${nodeTheme.bg} p-2.5 sm:p-3`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-white text-[13px] sm:text-sm font-semibold truncate">
                {node.name}
              </p>
              <p className="text-[11px] text-gray-400 truncate">
                @{node.username}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              {isRoot ? (
                <Star className="w-4 h-4 text-cyan-300 flex-shrink-0" />
              ) : (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full border ${nodeTheme.border} ${nodeTheme.text} bg-black/20`}
                >
                  L{node.level}
                </span>
              )}
              {hasChildren && (
                <button
                  type="button"
                  onClick={toggleNode}
                  className="w-6 h-6 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center"
                  title={isCollapsed ? "Expand branch" : "Collapse branch"}
                >
                  {isCollapsed ? (
                    <ChevronDown className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <ChevronUp className="w-3.5 h-3.5 text-white" />
                  )}
                </button>
              )}
            </div>
          </div>

          {!isCollapsed && (
            <>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[10px]">
                <div className="rounded-md bg-white/[0.04] px-2 py-1">
                  <p className="text-gray-500 uppercase">Direct</p>
                  <p className="text-white font-semibold">{node.directReferrals}</p>
                </div>
                <div className="rounded-md bg-white/[0.04] px-2 py-1">
                  <p className="text-gray-500 uppercase">Earned</p>
                  <p className="text-green-400 font-semibold">
                    ${Number(node.totalEarnings || 0).toFixed(2)}
                  </p>
                </div>
                <div className="rounded-md bg-white/[0.04] px-2 py-1 col-span-2 sm:col-span-1">
                  <p className="text-gray-500 uppercase">Joined</p>
                  <p className="text-white font-semibold truncate">
                    {node.joinDate}
                  </p>
                </div>
              </div>

              {!isRoot && (
                <p className="text-[10px] text-gray-400 mt-1.5 truncate">
                  Referred by @{node.referredBy}
                </p>
              )}
            </>
          )}
        </div>

        {hasChildren && !isCollapsed && (
          <div className="mt-3 space-y-3">
            {node.children.map((child) => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

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
            value: `$${totalEarned.toFixed(2)}`,
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
            {user?.referral_code || ""}
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38 }}
        className="rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-white/10 flex items-center gap-3">
          <GitBranch className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <div>
            <h2 className="font-bold text-white">Network Tree</h2>
            <p className="text-xs text-gray-400">
              {totalReferrals} members across 5 levels
            </p>
          </div>
        </div>

        {/* Level selector tabs — horizontally scrollable on mobile */}
        <div className="px-4 md:px-5 pt-4 pb-1">
          <div
            className="flex gap-2 overflow-x-auto pb-1"
            style={{ scrollbarWidth: "none" }}
          >
            {fixedReferralData.map((lvl) => {
              const lc2 = levelColors[lvl.level];
              const isActive = selectedReferralLevel === lvl.level;
              return (
                <button
                  key={lvl.level}
                  onClick={() => setSelectedReferralLevel(lvl.level)}
                  className={`flex-shrink-0 flex flex-col items-center gap-0.5 px-3 py-2.5 rounded-xl border transition-all duration-250 min-w-[72px] ${
                    isActive
                      ? `bg-gradient-to-br ${lc2.bg} ${lc2.border}`
                      : "bg-white/[0.04] border-white/10 hover:border-white/20"
                  }`}
                >
                  <span
                    className={`text-[10px] font-semibold ${isActive ? lc2.text : "text-gray-500"}`}
                  >
                    Level {lvl.level}
                  </span>
                  <span
                    className={`text-lg font-bold leading-none ${isActive ? "text-white" : "text-gray-500"}`}
                  >
                    {lvl.users.length}
                  </span>
                  <span
                    className={`text-[9px] font-medium ${isActive ? lc2.text : "text-gray-600"}`}
                  >
                    {lvl.commissionRate}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active level summary strip */}
        <div
          className={`mx-4 md:mx-5 mt-3 px-3 py-2.5 rounded-xl bg-gradient-to-r ${lc.bg} border ${lc.border} flex flex-wrap items-center justify-between gap-2`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${lc.border} ${lc.text} bg-black/20`}
            >
              L{selectedReferralLevel}
            </span>
            <span className="text-white text-sm font-semibold">
              {activeLevel.users.length} member
              {activeLevel.users.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <Award className={`w-3.5 h-3.5 ${lc.text}`} />
              <span className={`${lc.text} font-semibold`}>
                {activeLevel.commissionRate} commission
              </span>
            </div>
            <span className="text-green-400 font-semibold">
              ${activeLevel.totalEarnings.toFixed(2)} earned
            </span>
          </div>
        </div>

        {/* Tree-wise hierarchy view */}
        <div className="mx-4 md:mx-5 mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-3 sm:p-4">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">
                Tree View (Who referred who)
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsTreeOpen((prev) => !prev)}
              className="px-2.5 py-1 rounded-md text-xs border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 flex items-center gap-1"
            >
              {isTreeOpen ? "Collapse" : "Expand"}
              {isTreeOpen ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {!isTreeOpen ? (
            <p className="text-xs text-gray-500">
              Tree is collapsed. Expand to view hierarchy.
            </p>
          ) : treeRoot.children.length === 0 ? (
            <p className="text-xs text-gray-400">
              No referral hierarchy found yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[280px]">{renderTreeNode(treeRoot)}</div>
            </div>
          )}
        </div>

        {/* User cards grid */}
        <div className="p-4 md:p-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedReferralLevel}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3"
            >
              {activeLevel.users.map((user, idx) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.04 }}
                  className={`p-4 rounded-xl bg-gradient-to-br from-white/[0.06] to-white/[0.01] border border-white/10 hover:${lc.border} transition-all duration-300`}
                >
                  {/* Top row: avatar + name + status */}
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-full bg-gradient-to-br ${lc.bg} border ${lc.border} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
                      >
                        {user.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-white font-semibold text-sm truncate">
                          {user.name}
                        </div>
                        <div className="text-gray-400 text-[11px] truncate">
                          @{user.username}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-1.5 mb-3">
                    {[
                      {
                        label: "Joined",
                        value: user.joinDate,
                        cls: "text-white",
                      },
                      {
                        label: "Earnings",
                        value: `$${user.totalEarnings.toFixed(2)}`,
                        cls: "text-green-400",
                      },
                      {
                        label: "Sub-refs",
                        value: String(user.directReferrals),
                        cls: lc.text,
                      },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="bg-white/[0.04] rounded-lg px-2 py-1.5 text-center"
                      >
                        <div className="text-[9px] text-gray-500 mb-0.5 uppercase tracking-wide">
                          {s.label}
                        </div>
                        <div
                          className={`text-[11px] font-bold ${s.cls} leading-tight`}
                        >
                          {s.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Referred-by footer */}
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r ${lc.bg} border ${lc.border}`}
                  >
                    <Users className={`w-3 h-3 ${lc.text} flex-shrink-0`} />
                    <span className="text-gray-500 text-[10px]">via</span>
                    <span
                      className={`${lc.text} text-[10px] font-semibold truncate`}
                    >
                      @{user.referredBy}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Prev / dot-indicators / Next footer */}
        <div className="px-4 md:px-5 pb-4 border-t border-white/10 pt-3 flex items-center justify-between">
          <button
            onClick={() =>
              setSelectedReferralLevel((prev) => Math.max(1, prev - 1))
            }
            disabled={selectedReferralLevel === 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Prev
          </button>

          <div className="flex items-center gap-1.5">
            {fixedReferralData.map((lvl) => {
              const lc2 = levelColors[lvl.level];
              const isActive = selectedReferralLevel === lvl.level;
              return (
                <button
                  key={lvl.level}
                  onClick={() => setSelectedReferralLevel(lvl.level)}
                  className={`rounded-full transition-all duration-300 ${
                    isActive
                      ? `h-2 w-5 ${lc2.dot}`
                      : "h-2 w-2 bg-white/20 hover:bg-white/40"
                  }`}
                />
              );
            })}
          </div>

          <button
            onClick={() =>
              setSelectedReferralLevel((prev) => Math.min(5, prev + 1))
            }
            disabled={selectedReferralLevel === 5}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ReferralPage;
