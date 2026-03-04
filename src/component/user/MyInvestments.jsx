import { useState } from 'react';
import { InvestmentSummaryCards } from './InvestmentSummaryCards';
import { InvestmentCard } from './InvestmentCard';
import { InvestmentEmptyState } from './InvestmentEmptyState';
import { InvestmentDetailsModal } from './InvestmentDetailsModal';
// import { InvestmentSummaryCards } from './InvestmentSummaryCards';
// import { InvestmentCard } from './InvestmentCard';
// import { InvestmentDetailsModal } from './InvestmentDetailsModal';
// import { InvestmentEmptyState } from './InvestmentEmptyState';

export function MyInvestments({ investments, onNavigateToPackages }) {
  const [selectedInvestment, setSelectedInvestment] = useState(null);

  // Calculate summary statistics
  const activeInvestments = investments.filter(inv => inv.status === 'active');
  const totalInvested = investments.reduce((sum, inv) => sum + inv.investedAmount, 0);
  const totalExpectedProfit = investments.reduce((sum, inv) => sum + inv.expectedProfit, 0);
  const totalProfitEarned = investments.reduce((sum, inv) => sum + inv.profitEarned, 0);

  return (
    <>
      <div className="p-4 md:p-6 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              My Investments
            </span>
          </h1>
          <p className="text-sm text-gray-400">
            Track your active investment packages and earnings
          </p>
        </div>

        {/* Portfolio Summary Cards */}
        <InvestmentSummaryCards
          totalInvested={totalInvested}
          totalExpectedProfit={totalExpectedProfit}
          totalProfitEarned={totalProfitEarned}
          activeInvestmentsCount={activeInvestments.length}
        />

        {/* Investment Cards Grid */}
        {investments.length > 0 ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
            {investments.map((investment, index) => (
              <InvestmentCard
                key={investment.id}
                investment={investment}
                index={index}
                onViewDetails={setSelectedInvestment}
              />
            ))}
          </div>
        ) : (
          <InvestmentEmptyState onBrowsePackages={onNavigateToPackages} />
        )}
      </div>

      {/* Investment Details Modal */}
      <InvestmentDetailsModal
        investment={selectedInvestment}
        onClose={() => setSelectedInvestment(null)}
      />
    </>
  );
}