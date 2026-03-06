// Individual currency row component
import { TrendingUp, TrendingDown } from 'lucide-react';



export function CurrencyListItem({ currency }) {
  const isPositive = currency.change24h >= 0;
  
  return (
    <div className="flex items-center justify-between py-3 px-4 hover:bg-white/5 rounded-lg transition-all duration-200">
      {/* Left: Icon and Symbol */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
          currency.symbol === 'BTC' ? 'bg-orange-500/20 text-orange-400' :
          currency.symbol === 'ETH' ? 'bg-purple-500/20 text-purple-400' :
          currency.symbol === 'SOL' ? 'bg-green-500/20 text-green-400' :
          currency.symbol === 'XRP' ? 'bg-blue-500/20 text-blue-400' :
          currency.symbol === 'USDT' ? 'bg-green-600/20 text-green-500' :
          currency.symbol === 'DOGE' ? 'bg-yellow-500/20 text-yellow-400' :
          currency.symbol === 'ADA' ? 'bg-cyan-500/20 text-cyan-400' :
          currency.symbol === 'MATIC' ? 'bg-purple-600/20 text-purple-500' :
          'bg-gray-500/20 text-gray-400'
        }`}>
          {currency.icon}
        </div>
        <span className="text-white font-semibold text-sm">{currency.symbol}</span>
      </div>

      {/* Middle: Price */}
      <div className="flex-1 text-center">
        <span className="text-white font-medium text-sm">
          ${currency.price >= 1000 
            ? currency.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : currency.price >= 1
            ? currency.price.toFixed(4)
            : currency.price.toFixed(7)
          }
        </span>
      </div>

      {/* Right: 24h Change */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {isPositive ? (
          <TrendingUp className="w-3 h-3 text-green-400" />
        ) : (
          <TrendingDown className="w-3 h-3 text-red-400" />
        )}
        <span className={`text-xs font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? '+' : ''}{currency.change24h.toFixed(2)}%
        </span>
      </div>
    </div>
  );
}
