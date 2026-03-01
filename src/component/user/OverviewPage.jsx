import { motion } from "motion/react";
import {
  Wallet,
  Download,
  Upload,
  Users,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  Pickaxe,
  Lock,
} from "lucide-react";
import useUserStore from "../../store/userStore";
import { useEffect } from "react";
import { refreshUserStore } from "../../api/user.api.js";

const OverviewPage = ({
  mockUserData,
  mockMarketPrices,
  arbxCardImg,
  arbxCoinImg,
}) => {
  const { user, setUser } = useUserStore();

  // console.log("global user store from OverviewPage", user);
  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await refreshUserStore();
        // console.log("response from refreshUserStore", response.data);

        // update global store
        if (response?.status === 200) {
          const updatedUser = {
            ...useUserStore.getState().user,
            ...response.data.user,
          };

          setUser(updatedUser);
          // console.log("global user store after OverviewPage", user);
        }
      } catch (error) {
        console.error("Failed to refresh user:", error);
      }
    };

    loadUser();
  }, []);

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
          },
          {
            label: "Deposit Wallet",
            balance: Number(user?.deposit_wallet ?? 0),
            description: "Total Deposited",
            icon: Download,
          },
          {
            label: "Withdraw Wallet",
            balance: Number(user?.withdraw_wallet ?? 0),
            description: "Total Withdrawn",
            icon: Upload,
          },
          {
            label: "Referral Wallet",
            balance: Number(user?.referral_wallet ?? 0),
            description: "Referral Earnings",
            icon: Users,
          },
          {
            label: "Generation Wallet",
            balance: Number(user?.generation_wallet ?? 0),
            description: "Generation Bonus",
            icon: TrendingUp,
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
              <div className="text-xs px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                USDT
              </div>
            </div>
            <div className="text-sm text-gray-400 mb-1">{wallet.label}</div>
            <div className="text-2xl font-bold text-white mb-1">
              ${wallet.balance.toFixed(7)}
            </div>
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
        {/* Add card Text */}

        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-blue-600/5 to-cyan-600/5 p-6 md:p-8">
          {/* Card Image */}
          <div className="pl-3 font-bold text-xl">Arbigrow Wallet</div>
          <div className="relative max-w-md mx-auto mb-6">
            <img
              src={arbxCardImg}
              alt="ARBX Card"
              className="w-full h-[220px] md:h-[260px] object-cover rounded-xl"
            />

            {/* Bottom to Top Animation Overlay */}
            <div
              className="absolute inset-0 flex flex-col items-start justify-end 
                   px-4 pb-[45px] pl-[78px] sm:pl-[95px] sm:pb-[30px] md:px-6 md:pb-[45px] md:pl-[100px]"
            >
              <div className="text-white  text-sm md:text-xl drop-shadow-lg ml-1">
                {user.full_name.toUpperCase()}
              </div>

              <div className="flex items-center gap-1 mt-0 sm:mt-2">
                <img
                  src={arbxCoinImg}
                  alt="ARBX"
                  className="w-5 h-5 sm:w-6 sm:h-6"
                />
                <div className="text-white text-[10px] sm:text-[12px] md:text-[12px] drop-shadow-lg">
                  {Number(user.arbx_wallet).toFixed(7)} ARBX
                </div>
              </div>
            </div>
          </div>

          {/* Token Information Panel */}
          <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-bold text-white mb-4">
              Token Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-3">
                {/* <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                     <img src={arbxCoinImg} alt="ARBX" className="w-6 h-6" />
                   </div> */}
                <div>
                  <div className="text-xs text-gray-400">Token Name</div>
                  <div className="text-white font-semibold">Arbitrax AI</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                     <span className="text-blue-400 font-bold">ARBX</span>
                   </div> */}
                <div>
                  <div className="text-xs text-gray-400">Token Symbol</div>
                  <div className="text-white font-semibold">ARBX</div>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Network</div>
                <div className="text-white font-semibold">
                  Arbitrum One (ERC-20)
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Total Supply</div>
                <div className="text-white font-semibold">
                  1,000,000,000 ARBX
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6 border-t border-white/10 pt-4">
              <div>
                <div className="text-xs text-gray-400 mb-1">Utility</div>
                <div className="text-white">
                  Governance, Arbitrage Fee Discounts, and Staking Rewards
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-400 mb-1">Token Listed</div>
                <div className="text-white">
                  Socket, Rango , Sonarwatch , Metamask
                </div>
              </div>
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
              These {Number(user.arbx_wallet).toFixed(7)} ARBX tokens you earned
              are not just a number, they are a part of tomorrow's global
              arbitrage ecosystem.
            </p>
            <p className="text-gray-300">
              According to our launching roadmap, these tokens will be tradable
              very soon.{" "}
              <span className="text-cyan-400 font-semibold">
                Grow your network, accumulate more tokens!
              </span>
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
            disabled
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-600/50 to-orange-600/50 text-white font-semibold flex items-center gap-2 opacity-50 cursor-not-allowed"
          >
            <Lock className="w-5 h-5" />
            Start Mining (Coming Soon)
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OverviewPage;
