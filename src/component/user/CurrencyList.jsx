// Main currency list container
import { motion } from 'motion/react';
import { CurrencyListItem } from './CurrencyListItem';



export default function CurrencyList({ currencies}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 py-4 border-b border-white/10">
        <h2 className="text-base font-semibold text-gray-300">Popular currencies</h2>
      </div>

      {/* Currency List */}
      <div className="divide-y divide-white/5">
        {currencies.map((currency) => (
          <CurrencyListItem key={currency.id} currency={currency} />
        ))}
      </div>
    </motion.div>
  );
}
