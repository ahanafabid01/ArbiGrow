import { motion, AnimatePresence } from 'motion/react';
import { X, DollarSign } from 'lucide-react';

export function AddProfitModal({
  isOpen,
  investment,
  profitAmount,
  onClose,
  onAmountChange,
  onConfirm,
}) {
  if (!isOpen || !investment) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gradient-to-br from-[#0d1137] to-[#0a0e27] border border-white/10 rounded-2xl max-w-md w-full"
        >
          {/* Modal Header */}
          <div className="border-b border-white/10 p-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-cyan-400" />
              Add Profit Distribution
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-4">
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-400">Remaining Profit:</span>
                <span className="text-white font-bold">
                  ${(investment.expectedProfit - investment.profitPaid).toLocaleString()} USDT
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Already Paid:</span>
                <span className="text-blue-400 font-semibold">
                  ${investment.profitPaid.toLocaleString()} USDT
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                Profit Amount (USDT)
              </label>
              <input
                type="number"
                value={profitAmount}
                onChange={(e) => onAmountChange(e.target.value)}
                placeholder="Enter amount..."
                min="0"
                step="0.01"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500/50 focus:outline-none transition-colors text-white placeholder-gray-500"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 transition-all"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onConfirm}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all"
              >
                Confirm
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}