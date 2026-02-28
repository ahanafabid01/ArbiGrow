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

const OverviewPage = ({
  mockUserData,
  mockMarketPrices,
  arbxCardImg,
  arbxCoinImg,
  transactionFilter,
  setTransactionFilter,
  currentTransactions,
  currentPage,
  setCurrentPage,
  totalPages,
  startIndex,
  endIndex,
  filteredTransactions,
  getStatusColor,
}) => {
  const { user } = useUserStore();

  console.log(user);
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
      </div>

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
            balance: mockUserData.wallets.main,
            description: "Usable Balance",
            icon: Wallet,
          },
          {
            label: "Deposit Wallet",
            balance: mockUserData.wallets.deposit,
            description: "Total Deposited",
            icon: Download,
          },
          {
            label: "Withdraw Wallet",
            balance: mockUserData.wallets.withdraw,
            description: "Total Withdrawn",
            icon: Upload,
          },
          {
            label: "Referral Wallet",
            balance: mockUserData.wallets.referral,
            description: "Referral Earnings",
            icon: Users,
          },
          {
            label: "Generation Wallet",
            balance: mockUserData.wallets.generation,
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
              ${wallet.balance.toFixed(2)}
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

          <div className="relative max-w-md mx-auto mb-6">
            <img
              src={arbxCardImg}
              alt="ARBX Card"
              className="w-full h-[220px] md:h-[260px] object-cover rounded-xl"
            />

            {/* Bottom to Top Animation Overlay */}
            <div
              className="absolute inset-0 flex flex-col items-start justify-end 
                   px-4 pb-[45px] pl-[70px] sm:pb-[15px] md:px-6 md:pb-[45px] md:pl-[100px]"
            >
              <div className="text-white font-mono text-sm md:text-xl drop-shadow-lg ml-1">
                {mockUserData.fullName}
              </div>

              <div className="flex items-center gap-1  mt-0 sm:mt-2">
                <img
                  src={arbxCoinImg}
                  alt="ARBX"
                  className="w-5 h-5 sm:w-6 sm:h-6"
                />
                <div className="text-white  text-sm sm:text-base md:text-lg drop-shadow-lg">
                  {mockUserData.wallets.arbx} ARBX
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
            <div className="border-t border-white/10 pt-4">
              <div className="text-xs text-gray-400 mb-1">Utility</div>
              <div className="text-white">
                Governance, Arbitrage Fee Discounts, and Staking Rewards
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
              These {mockUserData.wallets.arbx} ARBX tokens you earned are not
              just a number, they are a part of tomorrow's global arbitrage
              ecosystem.
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
                {mockUserData.wallets.mining} ARBX
              </div>
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
              <h2 className="text-xl font-bold text-white mb-1">
                Transaction History
              </h2>
              <p className="text-sm text-gray-400">
                View all your wallet transactions
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={transactionFilter}
                onChange={(e) => {
                  setTransactionFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 rounded-lg bg-[#0A122C] border border-white/10 text-white text-sm focus:border-cyan-500/50 focus:outline-none"
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
                <th className="text-left p-4 text-sm font-semibold text-gray-400">
                  Date
                </th>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">
                  Type
                </th>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">
                  Wallet
                </th>
                <th className="text-right p-4 text-sm font-semibold text-gray-400">
                  Amount
                </th>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">
                  Currency
                </th>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="p-4 text-gray-400 text-sm">
                    {transaction.date}
                  </td>
                  <td className="p-4 text-white text-sm">{transaction.type}</td>
                  <td className="p-4 text-gray-400 text-sm">
                    {transaction.wallet}
                  </td>
                  <td className="p-4 text-right text-white font-semibold">
                    {transaction.amount}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        transaction.currency === "ARBX"
                          ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30"
                          : "bg-green-500/10 text-green-400 border border-green-500/30"
                      }`}
                    >
                      {transaction.currency}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(transaction.status)}`}
                    >
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
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, filteredTransactions.length)} of{" "}
            {filteredTransactions.length} transactions
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-4 py-2 text-sm text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
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

export default OverviewPage;
