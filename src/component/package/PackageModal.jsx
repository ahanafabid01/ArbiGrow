import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Button from "../Button";
import useUserStore from "../../store/userStore";

export default function PackageModal({ selectedPackage, setSelectedPackage }) {
 const token = useUserStore((state) => state.token);
 const isLoggedIn = !!token;

 console.log("Login", isLoggedIn)
  if (!selectedPackage) return null;

  // ===== ROI CONFIG =====
  const DAILY_ROI = 3;
  const TOTAL_ROI_LIMIT = 150;

  // ===== CALCULATIONS =====
  const duration = Math.ceil(TOTAL_ROI_LIMIT / DAILY_ROI);

  const dailyProfit =
    (selectedPackage.amount * DAILY_ROI) / 100;

  const totalProfit =
    (selectedPackage.amount * TOTAL_ROI_LIMIT) / 100;

  const totalReturn =
    selectedPackage.amount + totalProfit;

  return (
    <AnimatePresence>
      {selectedPackage && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPackage(null)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-gradient-to-b from-[#0d1428] to-[#0a0e27] p-8 shadow-2xl"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedPackage(null)}
                className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white"
              >
                <X className="size-5" />
              </button>

              {/* Header */}
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-white">
                  {selectedPackage.tier}
                </h2>

                <p className="mt-2 text-gray-400">
                  Investment Package Overview
                </p>
              </div>

              {/* ===== SINGLE INFO BOX ===== */}
              <div className="mb-8 rounded-xl border border-white/10 bg-white/5 p-6">

                <div className="grid grid-cols-2 gap-6 text-sm">

                  <div>
                    <p className="text-gray-400">Package Name</p>
                    <p className="font-semibold text-white">
                      {selectedPackage.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400">Capital Allocation</p>
                    <p className="font-semibold text-cyan-400">
                      {selectedPackage.amount.toLocaleString()} USDT
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400">Duration</p>
                    <p className="font-semibold text-white">
                      {duration} Days
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400">ROI</p>
                    <p className="font-semibold text-green-400">
                      {DAILY_ROI}% Daily
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400">Total Expected Return</p>
                    <p className="font-semibold text-yellow-400">
                      {totalReturn.toLocaleString()} USDT
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400">Daily Profit</p>
                    <p className="font-semibold text-purple-400">
                      {dailyProfit.toFixed(2)} USDT
                    </p>
                  </div>

                </div>
              </div>

              {/* CTA */}
             {isLoggedIn && (
            <Button variant="gradient">
            Proceed to Secure Allocation
            </Button>
            )}

              <p className="mt-4 text-center text-xs text-gray-500">
                Requires wallet connection and compliance verification
              </p>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}