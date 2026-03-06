// Market page header component
import { TrendingUp } from 'lucide-react';

export function MarketHeader() {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Market
            </span>
          </h1>
          <p className="text-gray-400 text-sm">Live cryptocurrency prices</p>
        </div>
      </div>
    </div>
  );
}
