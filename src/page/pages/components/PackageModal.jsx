import { AnimatePresence, motion } from "framer-motion";
import { X, TrendingUp } from "lucide-react";

const riskColors = {
  Low: "border-green-500/30 bg-green-500/10 text-green-400",
  Medium: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
  High: "border-red-500/30 bg-red-500/10 text-red-400",
};

export default function PackageModal({ selectedPackage, setSelectedPackage }) {
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
            {/* Modal Content */}
            <div
              onClick={(e) => e.stopPropagation()} // <-- Prevent click from bubbling to backdrop
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-gradient-to-b from-[#0d1428] to-[#0a0e27] p-8 shadow-2xl"
            >
              {/* Close Button */}
              <button
                type="button" // <-- Ensure it's not submit
                onClick={() => setSelectedPackage(null)}
                className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                <X className="size-5" />
              </button>

              {/* Header */}
              <div className="mb-6">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1">
                  <span className="text-xs text-cyan-300">{selectedPackage.tier}</span>
                </div>
                <h2 className="mb-2 text-3xl font-bold text-white">{selectedPackage.name}</h2>
                <p className="text-4xl font-bold text-cyan-400">${selectedPackage.amount.toLocaleString()}</p>
              </div>

              {/* Risk Level */}
              <div className="mb-6">
                <p className="mb-2 text-sm text-gray-400">Risk Level</p>
                <div className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 ${riskColors[selectedPackage.riskLevel]}`}>
                  <TrendingUp className="size-4" />
                  <span className="font-medium">{selectedPackage.riskLevel}</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="mb-3 text-lg font-semibold text-white">Strategy Description</h3>
                <p className="leading-relaxed text-gray-300">{selectedPackage.description}</p>
              </div>

              {/* Projected Scenarios */}
              <div className="mb-8">
                <div className="mb-4 flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-white">Projected Performance Range</h3>
                  <div className="rounded bg-yellow-500/10 px-2 py-0.5 text-xs text-yellow-300">Simulations Only</div>
                </div>
               <div className="space-y-3">
        {["conservative", "moderate", "aggressive"].map((type) => (
        <div key={type} className="rounded-lg border border-white/5 bg-white/5 p-4">
        <div className="mb-2 flex items-center justify-between">
        <span
          className={`font-medium capitalize ${
            type === "conservative"
              ? "text-green-400"
              : type === "moderate"
              ? "text-yellow-400"
              : "text-red-400"
          }`}
        >
          {type} Scenario
        </span>
      </div>
      <p
        // className={`text-2xl font-bold ${
        //   type === "conservative"
        //     ? "text-green-400"
        //     : type === "moderate"
        //     ? "text-yellow-400"
        //     : "text-red-400"
        // }`}
      >
        {selectedPackage[type].min}% – {selectedPackage[type].max}%
      </p>
      <p className="mt-1 text-xs text-gray-400">Annualized return simulation</p>
    </div>
  ))}
</div>
                <p className="mt-4 text-xs text-gray-500">
                  ⚠️ Projections are algorithmic simulations and not guaranteed returns. Actual performance may vary significantly.
                </p>
              </div>

              {/* CTA */}
              <button className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-4 font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40">
                Proceed to Secure Allocation
              </button>

              <p className="mt-4 text-center text-xs text-gray-500">Requires wallet connection and compliance verification</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}