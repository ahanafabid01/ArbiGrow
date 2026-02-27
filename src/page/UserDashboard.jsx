import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  DollarSign,
  Package,
  FileText,
  Users,
  UserCircle,
  Download,
  Upload,
  Home,
  X,
  Menu,
  Pickaxe,
  Lock,
  Copy,
  Check,
  Link as LinkIcon,
  GitBranch,
  Star,
  Award
} from 'lucide-react';
import arbxCardImg from '../assets/Card-design.png';
import arbxCoinImg from '../assets/Coin.png';
import Logo from '../assets/Arbigrow-Logo.png';
import { mockMarketPrices, mockUserData, fixedReferralData, generateMockTransactions } from '../constants/mockdata.js';
import { useNavigate } from 'react-router-dom';

// Mock data for market prices
  

export function UserDashboard() {
  const [activePage, setActivePage] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showCoinRain, setShowCoinRain] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionFilter, setTransactionFilter] = useState('All');
  const [transactions] = useState(generateMockTransactions());
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedReferralLevel, setSelectedReferralLevel] = useState(1);
  const navigate = useNavigate();
  const transactionsPerPage = 50;

  useEffect(() => {
    // Hide coin rain animation after 1 second
    const timer = setTimeout(() => {
      setShowCoinRain(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const userPages = [
    { id: 'overview', label: 'Overview', icon: Home, description: 'Dashboard & Wallets' },
    { id: 'deposit', label: 'Deposit', icon: Download, description: 'Add funds', comingSoon: true },
    { id: 'packages', label: 'Packages', icon: Package, description: 'Investment plans', comingSoon: true },
    { id: 'investments', label: 'My Investments', icon: TrendingUp, description: 'Active investments', comingSoon: true },
    { id: 'withdraw', label: 'Withdraw', icon: Upload, description: 'Withdraw funds', comingSoon: true },
    { id: 'referral', label: 'Referral', icon: Users, description: 'Invite & earn' },
    { id: 'profile', label: 'Profile', icon: UserCircle, description: 'Account settings' },
  ];

  // Filter transactions
  const filteredTransactions = transactionFilter === 'All'  
    ? transactions 
    : transactions.filter(t => t.type.toLowerCase().includes(transactionFilter.toLowerCase()));

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);
  const startIndex = (currentPage - 1) * transactionsPerPage;
  const endIndex = startIndex + transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'Pending': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'Processing': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(mockUserData.referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // ── Referral helpers ──────────────────────────────────────────
  const totalReferrals = fixedReferralData.reduce((s, l) => s + l.users.length, 0);
  const totalActiveReferrals = fixedReferralData.reduce((s, l) => s + l.users.filter(u => u.status === 'active').length, 0);

  const levelColors = {
    1: { bg: 'from-blue-600/15 to-cyan-600/10',    border: 'border-blue-500/30',   text: 'text-blue-400',   dot: 'bg-blue-500' },
    2: { bg: 'from-cyan-600/15 to-teal-600/10',    border: 'border-cyan-500/30',   text: 'text-cyan-400',   dot: 'bg-cyan-500' },
    3: { bg: 'from-purple-600/15 to-violet-600/10',border: 'border-purple-500/30', text: 'text-purple-400', dot: 'bg-purple-500' },
    4: { bg: 'from-pink-600/15 to-rose-600/10',    border: 'border-pink-500/30',   text: 'text-pink-400',   dot: 'bg-pink-500' },
    5: { bg: 'from-amber-600/15 to-orange-600/10', border: 'border-amber-500/30',  text: 'text-amber-400',  dot: 'bg-amber-500' },
  };

  const renderPageContent = () => {
    // Referral Page
    if (activePage === 'referral') {
      const activeLevel = fixedReferralData.find(l => l.level === selectedReferralLevel);
      const lc = levelColors[selectedReferralLevel];

      return (
        <div className="p-4 md:p-6 space-y-5">
          {/* Page Header */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Referral Program</span>
            </h1>
            <p className="text-gray-400 text-sm">Invite friends and earn rewards up to 5 levels deep</p>
          </div>

          {/* Referral Stats — 3 compact cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Users,      label: 'Total',    value: String(totalReferrals),                       color: 'text-cyan-400',   border: 'border-cyan-500/30',   bg: 'from-blue-600/10 to-cyan-600/10' },
              { icon: Star,       label: 'Active',   value: String(totalActiveReferrals),                 color: 'text-green-400',  border: 'border-green-500/30',  bg: 'from-green-600/10 to-emerald-600/10' },
              { icon: DollarSign, label: 'Earned',   value: `$${mockUserData.wallets.referral.toFixed(0)}`, color: 'text-purple-400', border: 'border-purple-500/30', bg: 'from-purple-600/10 to-pink-600/10' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`p-3 md:p-5 rounded-xl bg-gradient-to-br ${stat.bg} backdrop-blur-xl border ${stat.border} flex flex-col items-center text-center`}
              >
                <stat.icon className={`w-5 h-5 ${stat.color} mb-1`} />
                <div className={`text-xl md:text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-[10px] md:text-xs text-gray-400 mt-0.5">{stat.label}</div>
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
                {mockUserData.referralLink}
              </div>
              <button
                onClick={handleCopyLink}
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 text-sm shrink-0"
              >
                {copiedLink ? <><Check className="w-4 h-4" />Copied!</> : <><Copy className="w-4 h-4" />Copy</>}
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
                <p className="text-xs text-gray-400">{totalReferrals} members across 5 levels</p>
              </div>
            </div>

            {/* Level selector tabs — horizontally scrollable on mobile */}
            <div className="px-4 md:px-5 pt-4 pb-1">
              <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
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
                          : 'bg-white/[0.04] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <span className={`text-[10px] font-semibold ${isActive ? lc2.text : 'text-gray-500'}`}>Level {lvl.level}</span>
                      <span className={`text-lg font-bold leading-none ${isActive ? 'text-white' : 'text-gray-500'}`}>{lvl.users.length}</span>
                      <span className={`text-[9px] font-medium ${isActive ? lc2.text : 'text-gray-600'}`}>{lvl.commissionRate}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active level summary strip */}
            <div className={`mx-4 md:mx-5 mt-3 px-3 py-2.5 rounded-xl bg-gradient-to-r ${lc.bg} border ${lc.border} flex flex-wrap items-center justify-between gap-2`}>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${lc.border} ${lc.text} bg-black/20`}>L{selectedReferralLevel}</span>
                <span className="text-white text-sm font-semibold">{activeLevel.users.length} member{activeLevel.users.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <Award className={`w-3.5 h-3.5 ${lc.text}`} />
                  <span className={`${lc.text} font-semibold`}>{activeLevel.commissionRate} commission</span>
                </div>
                <span className="text-green-400 font-semibold">${activeLevel.totalEarnings.toFixed(2)} earned</span>
              </div>
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
                          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${lc.bg} border ${lc.border} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                            {user.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="text-white font-semibold text-sm truncate">{user.name}</div>
                            <div className="text-gray-400 text-[11px] truncate">@{user.username}</div>
                          </div>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold flex-shrink-0 ${
                          user.status === 'active'
                            ? 'bg-green-500/10 text-green-400 border-green-500/30'
                            : 'bg-gray-500/10 text-gray-500 border-gray-500/30'
                        }`}>
                          {user.status === 'active' ? '● Active' : '○ Inactive'}
                        </span>
                      </div>

                      {/* Stats row */}
                      <div className="grid grid-cols-3 gap-1.5 mb-3">
                        {[
                          { label: 'Joined',   value: user.joinDate,                    cls: 'text-white' },
                          { label: 'Earnings', value: `$${user.totalEarnings.toFixed(2)}`, cls: 'text-green-400' },
                          { label: 'Sub-refs', value: String(user.directReferrals),     cls: lc.text },
                        ].map((s) => (
                          <div key={s.label} className="bg-white/[0.04] rounded-lg px-2 py-1.5 text-center">
                            <div className="text-[9px] text-gray-500 mb-0.5 uppercase tracking-wide">{s.label}</div>
                            <div className={`text-[11px] font-bold ${s.cls} leading-tight`}>{s.value}</div>
                          </div>
                        ))}
                      </div>

                      {/* Referred-by footer */}
                      <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r ${lc.bg} border ${lc.border}`}>
                        <Users className={`w-3 h-3 ${lc.text} flex-shrink-0`} />
                        <span className="text-gray-500 text-[10px]">via</span>
                        <span className={`${lc.text} text-[10px] font-semibold truncate`}>@{user.referredBy}</span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Prev / dot-indicators / Next footer */}
            <div className="px-4 md:px-5 pb-4 border-t border-white/10 pt-3 flex items-center justify-between">
              <button
                onClick={() => setSelectedReferralLevel(prev => Math.max(1, prev - 1))}
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
                        isActive ? `h-2 w-5 ${lc2.dot}` : 'h-2 w-2 bg-white/20 hover:bg-white/40'
                      }`}
                    />
                  );
                })}
              </div>

              <button
                onClick={() => setSelectedReferralLevel(prev => Math.min(5, prev + 1))}
                disabled={selectedReferralLevel === 5}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </div>
      );
    }

    // Profile Page
    if (activePage === 'profile') {
      return (
        <div className="p-4 md:p-6 space-y-5">
          {/* Page Header */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Profile</span>
            </h1>
            <p className="text-sm text-gray-400">Manage your account information</p>
          </div>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 overflow-hidden"
          >
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-blue-600/20 via-cyan-500/20 to-blue-600/20 border-b border-white/10 px-4 md:px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <UserCircle className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg md:text-xl font-bold text-white">{mockUserData.fullName}</h2>
                      {mockUserData.isVerified && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/40 text-xs text-green-400">
                          <Check className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">@{mockUserData.username}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="p-4 md:p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Full Name</label>
                  <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-white">{mockUserData.fullName}</p>
                  </div>
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Username</label>
                  <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-white">@{mockUserData.username}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Email</label>
                  <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-white">{mockUserData.email}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Phone</label>
                  <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-white">{mockUserData.phone}</p>
                  </div>
                </div>

                {/* Country - Full Width */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm text-gray-400">Country</label>
                  <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-white">{mockUserData.country}</p>
                  </div>
                </div>
              </div>

              {/* Change Password Button */}
              <div className="pt-4 border-t border-white/10">
                <button className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" />
                  Change Password
                </button>
              </div>
            </div>
          </motion.div>

          {/* Additional Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Account Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-xl bg-gradient-to-br from-green-600/10 to-green-600/5 backdrop-blur-xl border border-green-500/30 p-4 md:p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Account Status</h3>
                  <p className="text-xs text-gray-400">Active & Verified</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">Your account is fully verified and active. You can access all platform features.</p>
            </motion.div>

            {/* Member Since */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-xl bg-gradient-to-br from-blue-600/10 to-cyan-600/5 backdrop-blur-xl border border-blue-500/30 p-4 md:p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Award className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Member Since</h3>
                  <p className="text-xs text-gray-400">Join Date</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">You joined ArbiGrow on <span className="text-white font-semibold">December 1, 2024</span></p>
            </motion.div>
          </div>
        </div>
      );
    }

    if (activePage !== 'overview') {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 flex items-center justify-center">
              <FileText className="w-10 h-10 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
            <p className="text-gray-400">This page is under development</p>
          </div>
        </div>
      );
    }

    return (
      <div className="p-4 md:p-6 space-y-6">
        {/* Market Prices Bar */}
        <div className="rounded-xl bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-blue-600/10 border border-white/10 p-4 overflow-x-auto">
          <div className="flex gap-6 md:gap-8 justify-center items-center min-w-max">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                <span className="text-orange-400 font-bold text-sm">₿</span>
              </div>
              <div>
                <div className="text-xs text-gray-400">BTC</div>
                <div className="font-bold text-white">${mockMarketPrices.btc.price.toLocaleString()}</div>
              </div>
              <div className={`flex items-center gap-1 text-sm ${mockMarketPrices.btc.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {mockMarketPrices.btc.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {Math.abs(mockMarketPrices.btc.change)}%
              </div>
            </div>

            <div className="h-8 w-px bg-white/10"></div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                <span className="text-purple-400 font-bold text-sm">Ξ</span>
              </div>
              <div>
                <div className="text-xs text-gray-400">ETH</div>
                <div className="font-bold text-white">${mockMarketPrices.eth.price.toLocaleString()}</div>
              </div>
              <div className={`flex items-center gap-1 text-sm ${mockMarketPrices.eth.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {mockMarketPrices.eth.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {Math.abs(mockMarketPrices.eth.change)}%
              </div>
            </div>

            <div className="h-8 w-px bg-white/10"></div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <span className="text-blue-400 font-bold text-sm">ARB</span>
              </div>
              <div>
                <div className="text-xs text-gray-400">ARB</div>
                <div className="font-bold text-white">${mockMarketPrices.arb.price.toFixed(2)}</div>
              </div>
              <div className={`flex items-center gap-1 text-sm ${mockMarketPrices.arb.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {mockMarketPrices.arb.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {Math.abs(mockMarketPrices.arb.change)}%
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Welcome back, <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{mockUserData.fullName}</span>
          </h1>
          <p className="text-gray-400">Here's your wallet overview and recent activities</p>
        </div>

        {/* USDT Wallet Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: 'Main Wallet', balance: mockUserData.wallets.main, description: 'Usable Balance', icon: Wallet },
            { label: 'Deposit Wallet', balance: mockUserData.wallets.deposit, description: 'Total Deposited', icon: Download },
            { label: 'Withdraw Wallet', balance: mockUserData.wallets.withdraw, description: 'Total Withdrawn', icon: Upload },
            { label: 'Referral Wallet', balance: mockUserData.wallets.referral, description: 'Referral Earnings', icon: Users },
            { label: 'Generation Wallet', balance: mockUserData.wallets.generation, description: 'Generation Bonus', icon: TrendingUp },
          ].map((wallet, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-5 rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-cyan-500/30 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600/20 to-cyan-600/20 flex items-center justify-center">
                  <wallet.icon className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="text-xs px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  USDT
                </div>
              </div>
              <div className="text-sm text-gray-400 mb-1">{wallet.label}</div>
              <div className="text-2xl font-bold text-white mb-1">${wallet.balance.toFixed(2)}</div>
              <div className="text-xs text-gray-500">{wallet.description}</div>
            </motion.div>
          ))}
        </div>

        {/* ARBX Premium Card Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-blue-600/5 to-cyan-600/5 p-6 md:p-8">
            {/* Card Image */}
      
<div className="relative max-w-md mx-auto mb-6">
  <img
    src={arbxCardImg}
    alt="ARBX Card"
     className="w-full h-[220px] md:h-[260px] object-cover rounded-xl"
  />

  {/* Bottom to Top Animation Overlay */}
    <div className="absolute inset-0 flex flex-col items-start justify-end 
                  px-4 pb-[45px] pl-[70px] sm:pb-[15px] md:px-6 md:pb-[45px] md:pl-[100px]">
      <div className="text-white font-mono text-sm md:text-xl drop-shadow-lg ml-1">
      {mockUserData.fullName}
      </div>

    <div className="flex items-center gap-1  mt-0 sm:mt-2">
    <img src={arbxCoinImg} alt="ARBX" className="w-5 h-5 sm:w-6 sm:h-6" />
    <div className="text-white  text-sm sm:text-base md:text-lg drop-shadow-lg">
      {mockUserData.wallets.arbx} ARBX
    </div>
  </div>
  </div>
</div>

            {/* Token Information Panel */}
            <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-white mb-4">Token Information</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                    <img src={arbxCoinImg} alt="ARBX" className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Token Name</div>
                    <div className="text-white font-semibold">Arbitrax AI</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <span className="text-blue-400 font-bold">ARBX</span>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Token Symbol</div>
                    <div className="text-white font-semibold">ARBX</div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Network</div>
                  <div className="text-white font-semibold">Arbitrum One (ERC-20)</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Total Supply</div>
                  <div className="text-white font-semibold">1,000,000,000 ARBX</div>
                </div>
              </div>
              <div className="border-t border-white/10 pt-4">
                <div className="text-xs text-gray-400 mb-1">Utility</div>
                <div className="text-white">Governance, Arbitrage Fee Discounts, and Staking Rewards</div>
              </div>
            </div>

            {/* ARBX Description */}
            <div className="bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-blue-600/10 border border-cyan-500/20 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  ARBX: The Power of AI on Arbitrum
                </span>
              </h3>
              <p className="text-gray-300 mb-3">
                These {mockUserData.wallets.arbx} ARBX tokens you earned are not just a number, they are a part of tomorrow's global arbitrage ecosystem. 
              </p>
              <p className="text-gray-300">
                According to our launching roadmap, these tokens will be tradable very soon. <span className="text-cyan-400 font-semibold">Grow your network, accumulate more tokens!</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* ARBX Mining Wallet */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-600/20 to-orange-600/20 flex items-center justify-center">
                <Pickaxe className="w-7 h-7 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">ARBX Mining Wallet</h3>
                <div className="text-2xl font-bold text-yellow-400">{mockUserData.wallets.mining} ARBX</div>
                <div className="text-sm text-gray-400">Available for mining</div>
              </div>
            </div>
            <button
              disabled
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-600/50 to-orange-600/50 text-white font-semibold flex items-center gap-2 opacity-50 cursor-not-allowed"
            >
              <Lock className="w-5 h-5" />
              Start Mining (Coming Soon)
            </button>
          </div>
        </motion.div>

        {/* Transaction History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 overflow-hidden"
        >
          <div className="p-6 border-b border-white/10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Transaction History</h2>
                <p className="text-sm text-gray-400">View all your wallet transactions</p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={transactionFilter}
                  onChange={(e) => {
                    setTransactionFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-cyan-500/50 focus:outline-none"
                >
                  <option value="All">All Transactions</option>
                  <option value="Deposit">Deposits</option>
                  <option value="Withdrawal">Withdrawals</option>
                  <option value="Profit">Profit</option>
                  <option value="Referral">Referral</option>
                  <option value="Mining">Mining</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-sm font-semibold text-gray-400">Date</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-400">Type</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-400">Wallet</th>
                  <th className="text-right p-4 text-sm font-semibold text-gray-400">Amount</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-400">Currency</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {currentTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4 text-gray-400 text-sm">{transaction.date}</td>
                    <td className="p-4 text-white text-sm">{transaction.type}</td>
                    <td className="p-4 text-gray-400 text-sm">{transaction.wallet}</td>
                    <td className="p-4 text-right text-white font-semibold">{transaction.amount}</td>
                    <td className="p-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        transaction.currency === 'ARBX' 
                          ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                          : 'bg-green-500/10 text-green-400 border border-green-500/30'
                      }`}>
                        {transaction.currency}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-white/10 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredTransactions.length)} of {filteredTransactions.length} transactions
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="px-4 py-2 text-sm text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] via-[#0d1137] to-[#0a0e27] text-white">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Coin Rain Animation */}
      <AnimatePresence>
        {showCoinRain && (
          <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.img
                key={i}
                src={arbxCoinImg}
                alt="Coin"
                initial={{ 
                  y: -100, 
                  x: `${Math.random() * 100}vw`,
                  rotate: 0,
                  opacity: 0.8
                }}
                animate={{ 
                  y: '110vh',
                  rotate: 360 * 3,
                  opacity: 0
                }}
                transition={{ 
                  duration: 1,
                  delay: i * 0.03,
                  ease: 'linear'
                }}
                className="absolute w-8 h-8 md:w-12 md:h-12"
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        className="lg:hidden fixed top-6 left-6 z-[60] p-3 rounded-xl bg-gradient-to-br from-white/10 to-white/[0.02] backdrop-blur-2xl border border-white/10 hover:border-cyan-500/30 transition-all"
      >
        {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          x: mobileSidebarOpen || window.innerWidth >= 1024 ? 0 : -300,
          width: sidebarCollapsed ? 80 : 280 
        }}
        className={`fixed top-0 left-0 bottom-0 z-50 bg-gradient-to-b from-[#0a0e27] via-[#0d1137] to-[#0a0e27] border-r border-white/10 backdrop-blur-xl ${
          mobileSidebarOpen ? 'block' : 'hidden lg:block'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-white/10" 
             onClick={() => navigate("/")}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-b flex items-center justify-center shadow-lg flex-shrink-0">
                <div className="w-10 h-10  rounded-full flex items-center justify-center">
                    <img
                   src={Logo}
                  alt="Arbigrow Logo"
                  className="w-10 h-10 object-contain"
                 />
                   <motion.div 
                    className="w-1.5 h-1.5 bg-white rounded-full"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
              </div>
              {!sidebarCollapsed && (
                <div>
                  <div className="font-bold text-white">ArbiGrow</div>
                  <div className="text-[10px] text-cyan-400/80 uppercase tracking-wider">User Portal</div>
                </div>
              )}
            </div>
          </div>

          {/* User Info */}
          {/* {!sidebarCollapsed && (
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border border-white/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold">
                  {mockUserData.fullName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold text-sm truncate">{mockUserData.fullName}</div>
                  <div className="text-xs text-gray-400 truncate">@{mockUserData.username}</div>
                </div>
              </div>
            </div>
          )} */}

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {userPages.map((page) => (
              <button
                key={page.id}
                onClick={() => {
                  if (!page.comingSoon) {
                    setActivePage(page.id);
                    setMobileSidebarOpen(false);
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  activePage === page.id
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                    : page.comingSoon
                    ? 'text-gray-600 cursor-default'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <page.icon className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <div className="flex-1 text-left">
                    <div className="font-medium flex items-center gap-2">
                      {page.label}
                      {page.comingSoon && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                          Soon
                        </span>
                      )}
                    </div>
                    <div className={`text-xs ${activePage === page.id ? 'text-white/70' : 'text-gray-500'}`}>
                      {page.description}
                    </div>
                  </div>
                )}
              </button>
            ))}
          </nav>

          {/* Collapse Button */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex w-full items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 text-gray-400 hover:text-white"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <>
                  <ChevronLeft className="w-5 h-5" />
                  <span className="text-sm">Collapse</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div 
        className={`relative z-10 transition-all duration-300`}
        style={{ 
          marginLeft: window.innerWidth >= 1024 ? (sidebarCollapsed ? '80px' : '280px') : '0'
        }}
      >
        {renderPageContent()}
      </div>
    </div>
  );
}