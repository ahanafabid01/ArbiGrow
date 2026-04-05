// Main currency list container
import { motion } from 'motion/react';
import { CurrencyListItem } from './CurrencyListItem';

export default function CurrencyList({ currencies }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 overflow-hidden"
    >
      {/* Column headers */}
      <div className="grid grid-cols-[24px_1fr_auto_auto] lg:grid-cols-[24px_1fr_auto_auto_auto] items-center gap-3 px-4 py-3 border-b border-white/10 text-xs font-semibold text-gray-500 uppercase tracking-wide">
        <span>#</span>
        <span>Asset</span>
        <span className="hidden lg:block text-right">Volume (24h)</span>
        <span className="text-right">Price</span>
        <span className="text-right w-20">24h %</span>
      </div>

      {/* Currency rows */}
      <div className="divide-y divide-white/5">
        {currencies.map((currency, idx) => (
          <CurrencyListItem key={currency.id} currency={currency} rank={idx + 1} />
        ))}
      </div>
    </motion.div>
  );
}
