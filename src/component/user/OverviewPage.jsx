import { motion, AnimatePresence } from "motion/react";
import { createPortal } from "react-dom";
import {
  Wallet,
  Coins,
  Download,
  Upload,
  Users,
  TrendingUp,
  Pickaxe,
} from "lucide-react";
import useUserStore from "../../store/userStore";
import { useCallback, useEffect, useState } from "react";
import {
  getMyDeposits,
  refreshUserStore,
  startMining,
  claimMining,
} from "../../api/user.api.js";

const OverviewPage = ({
  mockUserData,
  mockMarketPrices,
  arbxCardImg,
  arbxCoinImg,
}) => {
  const MINING_CYCLE_MS = 24 * 60 * 60 * 1000;
  const { user, setUser, logout } = useUserStore();
  const [isTokenInfoOpen, setIsTokenInfoOpen] = useState(false);
  const [totalApprovedDeposits, setTotalApprovedDeposits] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const [isMiningActionLoading, setIsMiningActionLoading] = useState(false);
  const [miningActionError, setMiningActionError] = useState("");
  const isMiningActive = user?.is_mining && user?.mining_started_at;

  const syncUserFromServer = useCallback(async () => {
    const userResponse = await refreshUserStore();
    if (userResponse?.status === 200 && userResponse?.data?.user) {
      setUser(userResponse.data.user);
    }
    return userResponse;
  }, [setUser]);

  const handleUnauthorized = useCallback(
    (error) => {
      if (error?.response?.status !== 401) return false;

      logout();
      window.location.href = "/login";
      return true;
    },
    [logout],
  );

  // console.log("global user store from OverviewPage", user);
  useEffect(() => {
    const loadUser = async () => {
      try {
        const [, depositsResponse] = await Promise.all([
          syncUserFromServer(),
          getMyDeposits(),
        ]);

        const deposits = depositsResponse?.data?.data || [];
        const approvedTotal = deposits.reduce((sum, deposit) => {
          const isApproved =
            String(deposit?.status || "").toLowerCase() === "approved";
          const amount = Number(deposit?.amount || 0);
          return isApproved ? sum + (Number.isNaN(amount) ? 0 : amount) : sum;
        }, 0);

        setTotalApprovedDeposits(approvedTotal);
      } catch (error) {
        if (handleUnauthorized(error)) return;
        console.error("Failed to refresh user:", error);
      }
    };

    loadUser();
  }, [handleUnauthorized, setUser, syncUserFromServer]);

  useEffect(() => {
    if (!user?.is_mining || !user?.mining_started_at) {
      setRemainingTime(null);
      return;
    }

    const start = new Date(user.mining_started_at).getTime();
    const end = start + MINING_CYCLE_MS;

    const updateTimer = () => {
      const now = Date.now();
      const diff = end - now;

      if (diff <= 0) {
        setRemainingTime(0);
        return;
      }

      setRemainingTime(diff);
    };

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [MINING_CYCLE_MS, user?.is_mining, user?.mining_started_at]);

  const formatTime = (ms) => {
    if (!ms) return "00:00:00";

    const totalSeconds = Math.floor(ms / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleStartMining = async () => {
    if (isMiningActionLoading) return;

    setMiningActionError("");
    setIsMiningActionLoading(true);
    try {
      const response = await startMining();
      const miningStartedAt =
        response?.data?.mining_started_at || new Date().toISOString();

      setUser({
        is_mining: true,
        mining_started_at: miningStartedAt,
      });
      setRemainingTime(MINING_CYCLE_MS);

      syncUserFromServer().catch(() => null);
    } catch (err) {
      if (handleUnauthorized(err)) return;
      const detail = err?.response?.data?.detail || "Failed to start mining.";
      setMiningActionError(detail);
      console.error(err?.response?.data || err);
    } finally {
      setIsMiningActionLoading(false);
    }
  };

  const handleClaimMining = async () => {
    if (isMiningActionLoading) return;

    setMiningActionError("");
    setIsMiningActionLoading(true);
    try {
      const response = await claimMining();
      setUser({
        is_mining: false,
        mining_started_at: null,
        arbx_mining_wallet:
          response?.data?.arbx_mining_wallet ?? user?.arbx_mining_wallet,
      });
      setRemainingTime(null);

      syncUserFromServer().catch(() => null);
    } catch (err) {
      if (handleUnauthorized(err)) return;
      const detail = err?.response?.data?.detail || "Failed to claim reward.";
      setMiningActionError(detail);
      console.error(err?.response?.data || err);
    } finally {
      setIsMiningActionLoading(false);
    }
  };

  const canClaim = isMiningActive && remainingTime !== null && remainingTime <= 0;
  const isTimerRunning = isMiningActive && !canClaim;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Market Prices Bar */}
      {/* <div className="rounded-xl bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-blue-600/10 border border-white/10 p-4 overflow-x-auto">
        <div className="flex gap-6 md:gap-8 justify-center items-center min-w-max">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
              <span className="text-orange-400 font-bold text-sm">₿</span>
            </div>
            <div>
              <div className="text-xs text-gray-400">BTC</div>
              <div className="font-bold text-white">
                ${mockMarketPrices.btc.price.toLocaleString()}
              </div>
            </div>
            <div
              className={`flex items-center gap-1 text-sm ${mockMarketPrices.btc.change >= 0 ? "text-green-400" : "text-red-400"}`}
            >
              {mockMarketPrices.btc.change >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
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
              <div className="font-bold text-white">
                ${mockMarketPrices.eth.price.toLocaleString()}
              </div>
            </div>
            <div
              className={`flex items-center gap-1 text-sm ${mockMarketPrices.eth.change >= 0 ? "text-green-400" : "text-red-400"}`}
            >
              {mockMarketPrices.eth.change >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
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
              <div className="font-bold text-white">
                ${mockMarketPrices.arb.price.toFixed(2)}
              </div>
            </div>
            <div
              className={`flex items-center gap-1 text-sm ${mockMarketPrices.arb.change >= 0 ? "text-green-400" : "text-red-400"}`}
            >
              {mockMarketPrices.arb.change >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {Math.abs(mockMarketPrices.arb.change)}%
            </div>
          </div>
        </div>
      </div> */}

      {/* Welcome Message */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Welcome back,{" "}
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            {user.full_name}
          </span>
        </h1>
        <p className="text-gray-400">
          Here's your wallet overview and recent activities
        </p>
      </div>

      {/* USDT Wallet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            label: "Main Wallet",
            balance: Number(user?.main_wallet ?? 0),
            description: "Usable Balance",
            icon: Wallet,
            currency: "USDT",
          },
          {
            label: "ARBX Wallet",
            balance: Number(user?.arbx_wallet ?? 0),
            description: "Token Information",
            icon: Coins,
            currency: "ARBX",
            hasInfo: true,
          },
          {
            label: "Deposit Wallet",
            balance:
              totalApprovedDeposits !== null
                ? totalApprovedDeposits
                : Number(user?.deposit_wallet ?? 0),
            description: "Total Deposited",
            icon: Download,
            currency: "USDT",
          },
          {
            label: "Withdraw Wallet",
            balance: Number(user?.withdraw_wallet ?? 0),
            description: "Total Withdrawn",
            icon: Upload,
            currency: "USDT",
          },
          {
            label: "Referral Wallet",
            balance: Number(user?.referral_wallet ?? 0),
            description: "Referral Earnings",
            icon: Users,
            currency: "USDT",
          },
          {
            label: "Generation Wallet",
            balance: Number(user?.generation_wallet ?? 0),
            description: "Generation Bonus",
            icon: TrendingUp,
            currency: "USDT",
          },
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
              <div className="flex items-center gap-2">
                <div className="text-xs px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {wallet.currency}
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-400 mb-1">{wallet.label}</div>
            <div className="text-2xl font-bold text-white mb-1">
              ${wallet.balance.toFixed(7)}
            </div>
            <div className="text-xs text-gray-500">
              {wallet.hasInfo ? (
                <button
                  type="button"
                  onClick={() => setIsTokenInfoOpen(true)}
                  className="text-cyan-300 hover:text-cyan-200 transition-colors"
                  aria-label="Open token information"
                >
                  {wallet.description}
                </button>
              ) : (
                wallet.description
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Token Information Modal */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isTokenInfoOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm p-2 sm:p-4 md:p-6 flex items-center justify-center"
                onClick={() => setIsTokenInfoOpen(false)}
              >
                <motion.div
                  initial={{ opacity: 0, y: 18, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 18, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  onClick={(event) => event.stopPropagation()}
                  className="w-full max-w-3xl rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#151d45] to-[#10183a] border border-white/10 p-4 sm:p-5 md:p-8 max-h-[calc(100dvh-1rem)] sm:max-h-[85vh] overflow-y-auto"
                >
                  <div className="flex items-start justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                      Token Information
                    </h3>
                    {/* <button
                      type="button"
                      onClick={() => setIsTokenInfoOpen(false)}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg border border-white/20 text-gray-300 hover:text-white hover:border-cyan-400/60 transition-colors flex items-center justify-center shrink-0"
                      aria-label="Close token information popup"
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button> */}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 border-b border-white/10 pb-4 sm:pb-5">
                    <div>
                      <div className="text-xs text-gray-400 mb-1">
                        Token Name
                      </div>
                      <div className="text-white font-semibold">
                        Arbitrax AI
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">
                        Token Symbol
                      </div>
                      <div className="text-white font-semibold">ARBX</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Network</div>
                      <div className="text-white font-semibold">
                        Arbitrum One (ERC-20)
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">
                        Total Supply
                      </div>
                      <div className="text-white font-semibold">
                        1,000,000,000 ARBX
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-4 sm:pt-5 mb-5 sm:mb-6">
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Utility</div>
                      <div className="text-white">
                        Governance, Arbitrage Fee Discounts, and Staking Rewards
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">
                        Token Listed
                      </div>
                      <div className="text-white">
                        Socket, Rango, Sonarwatch, Metamask
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsTokenInfoOpen(false)}
                    className="w-full sm:w-auto px-6 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 hover:text-white hover:bg-cyan-500/30 transition-colors"
                  >
                    Close
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}

      {/* ARBX Description */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-blue-600/10 border border-cyan-500/20 rounded-xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-3">
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            ARBX: The Power of AI on Arbitrum
          </span>
        </h3>
        <p className="text-gray-300 mb-3">
          These {Number(user.arbx_wallet).toFixed(7)} ARBX tokens you earned are
          not just a number, they are a part of tomorrow&apos;s global arbitrage
          ecosystem.
        </p>
        <p className="text-gray-300">
          According to our launching roadmap, these tokens will be tradable very
          soon.{" "}
          <span className="text-cyan-400 font-semibold">
            Grow your network, accumulate more tokens!
          </span>
        </p>
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
              <h3 className="text-xl font-bold text-white mb-1">
                ARBX Mining Wallet
              </h3>
              <div className="text-2xl font-bold text-yellow-400">
                {Number(user.arbx_mining_wallet).toFixed(7)} ARBX
              </div>
              <div className="text-sm text-gray-400">
                The ARBX mining rate is set at 0.01% per 24-hour cycle
              </div>
            </div>
          </div>
          <button
            onClick={
              !isMiningActive
                ? handleStartMining
                : canClaim
                  ? handleClaimMining
                : null
            }
            disabled={isMiningActionLoading || isTimerRunning}
            className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 ${
              isMiningActionLoading || isTimerRunning
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-yellow-600 to-orange-600"
            }`}
          >
            <Pickaxe className="w-5 h-5" />

            {!isMiningActive && (isMiningActionLoading ? "Starting..." : "Start Mining")}

            {isTimerRunning && formatTime(remainingTime)}

            {canClaim && (isMiningActionLoading ? "Claiming..." : "Claim Reward")}
          </button>
        </div>
        {miningActionError && (
          <p className="mt-3 text-sm text-red-400">{miningActionError}</p>
        )}
      </motion.div>
    </div>
  );
};

export default OverviewPage;
