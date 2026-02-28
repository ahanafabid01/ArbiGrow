import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  Award,
} from "lucide-react";
import arbxCardImg from "../assets/Card-design.png";
import arbxCoinImg from "../assets/Coin.png";
import Logo from "../assets/Arbigrow-Logo.png";
import {
  mockMarketPrices,
  mockUserData,
  fixedReferralData,
  generateMockTransactions,
} from "../constants/mockdata.js";
import { useNavigate } from "react-router-dom";
import ReferralPage from "../component/user/ReferralPage.jsx";
import ProfilePage from "../component/user/ProfilePage.jsx";
import OverviewPage from "../component/user/OverviewPage.jsx";
import useUserStore from "../store/userStore.js";
import { LogOut } from "lucide-react";
import TransactionHistoryPage from "../component/user/TransactionHistoryPage.jsx";
// Mock data for market prices

export function UserDashboard() {
  const [activePage, setActivePage] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showCoinRain, setShowCoinRain] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionFilter, setTransactionFilter] = useState("All");
  const [transactions] = useState(generateMockTransactions());
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedReferralLevel, setSelectedReferralLevel] = useState(1);
  //  const [user, setuUsers] = useState();
  const navigate = useNavigate();
  const transactionsPerPage = 50;
  const { user } = useUserStore();
   const { logout } = useUserStore();

  useEffect(() => {
    // console.log("userrr", user);
  }, [user]);

  const handleLogout = () => {
  logout();
  navigate("/login");
 };

  const userPages = [
    {
      id: "overview",
      label: "Overview",
      icon: Home,
      description: "Dashboard & Wallets",
    },
    {
      id: "deposit",
      label: "Deposit",
      icon: Download,
      description: "Add funds",
      comingSoon: true,
    },
    {
      id: "packages",
      label: "Packages",
      icon: Package,
      description: "Investment plans",
      comingSoon: true,
    },
    {
      id: "investments",
      label: "My Investments",
      icon: TrendingUp,
      description: "Active investments",
      comingSoon: true,
    },
    {
      id: "withdraw",
      label: "Withdraw",
      icon: Upload,
      description: "Withdraw funds",
      comingSoon: true,
    },
     {
  id: "transactions",
  label: "Transactions",
  icon: FileText,
  description: "Transaction history",
},
    {
      id: "referral",
      label: "Referral",
      icon: Users,
      description: "Invite & earn",
    },
    {
      id: "profile",
      label: "Profile",
      icon: UserCircle,
      description: "Account settings",
    },
  ];

  // Filter transactions
  const filteredTransactions =
    transactionFilter === "All"
      ? transactions
      : transactions.filter((t) =>
          t.type.toLowerCase().includes(transactionFilter.toLowerCase()),
        );

  // Pagination
  const totalPages = Math.ceil(
    filteredTransactions.length / transactionsPerPage,
  );
  const startIndex = (currentPage - 1) * transactionsPerPage;
  const endIndex = startIndex + transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "text-green-400 bg-green-500/10 border-green-500/30";
      case "Pending":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";
      case "Processing":
        return "text-blue-400 bg-blue-500/10 border-blue-500/30";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/30";
    }
  };

  const handleCopyLink = () => {
    const copiedLink = `${import.meta.env.VITE_FRONTNED_URL}/register?ref_code=${user.referral_code}`;
    navigator.clipboard.writeText(copiedLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // ── Referral helpers ──────────────────────────────────────────
  const totalReferrals = fixedReferralData.reduce(
    (s, l) => s + l.users.length,
    0,
  );
  const totalActiveReferrals = fixedReferralData.reduce(
    (s, l) => s + l.users.filter((u) => u.status === "active").length,
    0,
  );

  const levelColors = {
    1: {
      bg: "from-blue-600/15 to-cyan-600/10",
      border: "border-blue-500/30",
      text: "text-blue-400",
      dot: "bg-blue-500",
    },
    2: {
      bg: "from-cyan-600/15 to-teal-600/10",
      border: "border-cyan-500/30",
      text: "text-cyan-400",
      dot: "bg-cyan-500",
    },
    3: {
      bg: "from-purple-600/15 to-violet-600/10",
      border: "border-purple-500/30",
      text: "text-purple-400",
      dot: "bg-purple-500",
    },
    4: {
      bg: "from-pink-600/15 to-rose-600/10",
      border: "border-pink-500/30",
      text: "text-pink-400",
      dot: "bg-pink-500",
    },
    5: {
      bg: "from-amber-600/15 to-orange-600/10",
      border: "border-amber-500/30",
      text: "text-amber-400",
      dot: "bg-amber-500",
    },
  };

  const renderPageContent = () => {
    // Referral Page
    if (activePage === "referral") {
      const activeLevel = fixedReferralData.find(
        (l) => l.level === selectedReferralLevel,
      );
      const lc = levelColors[selectedReferralLevel];

      return (
        <ReferralPage
          totalReferrals={totalReferrals}
          totalActiveReferrals={totalActiveReferrals}
          mockUserData={mockUserData}
          fixedReferralData={fixedReferralData}
          levelColors={levelColors}
          selectedReferralLevel={selectedReferralLevel}
          setSelectedReferralLevel={setSelectedReferralLevel}
          handleCopyLink={handleCopyLink}
          copiedLink={copiedLink}
          activeLevel={activeLevel}
          lc={lc}
        />
      );
    }

    // Profile Page
    if (activePage === "profile") {
      return <ProfilePage mockUserData={mockUserData} />;
    }
            if (activePage === "transactions") {
  return (
    <TransactionHistoryPage
      currentTransactions={currentTransactions}
      transactionFilter={transactionFilter}
      setTransactionFilter={setTransactionFilter}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      totalPages={totalPages}
      filteredTransactions={filteredTransactions}
      startIndex={startIndex}
      endIndex={endIndex}
      getStatusColor={getStatusColor}
    />
  );
}

    if (activePage !== "overview") {
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

    if (activePage === "overview") {
      return (
        <OverviewPage
          mockUserData={mockUserData}
          mockMarketPrices={mockMarketPrices}
          arbxCardImg={arbxCardImg}
          arbxCoinImg={arbxCoinImg}
          transactionFilter={transactionFilter}
          setTransactionFilter={setTransactionFilter}
          currentTransactions={currentTransactions}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={endIndex}
          filteredTransactions={filteredTransactions}
          getStatusColor={getStatusColor}
        />
      );
    }


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
                  opacity: 0.8,
                }}
                animate={{
                  y: "110vh",
                  rotate: 360 * 3,
                  opacity: 0,
                }}
                transition={{
                  duration: 1,
                  delay: i * 0.03,
                  ease: "linear",
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
        {mobileSidebarOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
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
          width: sidebarCollapsed ? 80 : 280,
        }}
        className={`fixed top-0 left-0 bottom-0 z-50 bg-gradient-to-b from-[#0a0e27] via-[#0d1137] to-[#0a0e27] border-r border-white/10 backdrop-blur-xl ${
          mobileSidebarOpen ? "block" : "hidden lg:block"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div
            className="p-6 border-b border-white/10"
            onClick={() => navigate("/")}
          >
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
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
              </div>
              {!sidebarCollapsed && (
                <div>
                  <div className="font-bold text-white">ArbiGrow</div>
                  <div className="text-[10px] text-cyan-400/80 uppercase tracking-wider">
                    User Portal
                  </div>
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
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30"
                    : page.comingSoon
                      ? "text-gray-600 cursor-default"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
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
                    <div
                      className={`text-xs ${activePage === page.id ? "text-white/70" : "text-gray-500"}`}
                    >
                      {page.description}
                    </div>
                  </div>
                )}
              </button>
            ))}
          </nav>

          {/* Collapse Button */}
          {/* Sidebar Footer */}
<div className="p-4 border-t border-white/10 space-y-3">

  {/* Logout Button */}
  <button
    onClick={handleLogout}
    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl 
               bg-red-500/10 hover:bg-red-500/20 
               text-red-400 hover:text-red-300 
               transition-all duration-300"
  >
    <LogOut className="w-5 h-5" />
    {!sidebarCollapsed && <span className="text-sm">Logout</span>}
  </button>

  {/* Collapse Button */}
  <button
    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
    className="hidden lg:flex w-full items-center justify-center gap-2 px-4 py-2 
               rounded-xl bg-white/5 hover:bg-white/10 
               transition-all duration-300 
               text-gray-400 hover:text-white"
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
          marginLeft:
            window.innerWidth >= 1024
              ? sidebarCollapsed
                ? "80px"
                : "280px"
              : "0",
        }}
      >
        {renderPageContent()}
      </div>
    </div>
  );
}
