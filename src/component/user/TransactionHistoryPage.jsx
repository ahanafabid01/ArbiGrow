import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TransactionHistoryPage = ({
  currentTransactions,
  transactionFilter,
  setTransactionFilter,
  currentPage,
  setCurrentPage,
  totalPages,
  filteredTransactions,
  startIndex,
  endIndex,
  getStatusColor,
}) => {
  return (
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
  );
};

export default TransactionHistoryPage;