import { useState } from 'react';
import { generateMockInvestments } from '../../constants/mockdata';
import { InvestmentStatsCards } from './InvestmentStatsCards';
import { InvestmentFilters } from './InvestmentFilters';
import { InvestmentsTable } from './InvestmentsTable';
import { InvestmentPagination } from './InvestmentPagination';
import { AddProfitModal } from './AddProfitModal';
import { InvestmentDetailsModal } from './InvestmentDetailsModal';
// import { InvestmentStatsCards } from './InvestmentStatsCards';
// import { InvestmentFilters } from './InvestmentFilters';
// import { InvestmentsTable } from './InvestmentsTable';
// import { InvestmentPagination } from './InvestmentPagination';
// import { InvestmentDetailsModal } from './InvestmentDetailsModal';

// import { generateMockInvestments } from './mockData';

const ITEMS_PER_PAGE = 10;

export function InvestmentsManagement() {
  const [investments, setInvestments] = useState(generateMockInvestments());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [packageFilter, setPackageFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [showAddProfitModal, setShowAddProfitModal] = useState(false);
  const [newProfitAmount, setNewProfitAmount] = useState('');

  // Calculate statistics
  const investmentStats = {
    total: investments.length,
    active: investments.filter(i => i.status === 'active').length,
    completed: investments.filter(i => i.status === 'completed').length,
    totalInvested: investments.reduce((sum, i) => sum + i.amount, 0),
    totalProfitPaid: investments.reduce((sum, i) => sum + i.profitPaid, 0),
  };

  // Get unique packages
  const uniquePackages = Array.from(new Set(investments.map(i => i.packageName)));

  // Filter investments
  const filteredInvestments = investments.filter(inv => {
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    const matchesPackage = packageFilter === 'all' || inv.packageName === packageFilter;

    const matchesSearch =
      inv.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.packageName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesPackage && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredInvestments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentInvestments = filteredInvestments.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = (filterType, value) => {
    setCurrentPage(1);

    if (filterType === 'status') setStatusFilter(value);
    if (filterType === 'package') setPackageFilter(value);
    if (filterType === 'search') setSearchQuery(value);
  };

  // Handle add profit
  const handleAddProfit = () => {
    if (!selectedInvestment || !newProfitAmount || parseFloat(newProfitAmount) <= 0) return;

    const profitAmount = parseFloat(newProfitAmount);
    const remainingProfit = selectedInvestment.expectedProfit - selectedInvestment.profitPaid;

    if (profitAmount > remainingProfit) {
      alert('Profit amount exceeds remaining profit!');
      return;
    }

    const newProfit = {
      id: `p${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      amount: profitAmount,
    };

    const updatedInvestment = {
      ...selectedInvestment,
      profitPaid: selectedInvestment.profitPaid + profitAmount,
      profitHistory: [...selectedInvestment.profitHistory, newProfit],
      status:
        selectedInvestment.profitPaid + profitAmount >= selectedInvestment.expectedProfit
          ? 'completed'
          : selectedInvestment.status,
    };

    setInvestments(
      investments.map(inv =>
        inv.id === selectedInvestment.id ? updatedInvestment : inv
      )
    );

    setSelectedInvestment(updatedInvestment);
    setShowAddProfitModal(false);
    setNewProfitAmount('');
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-1">
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Investment Management
          </span>
        </h1>
        <p className="text-gray-400 text-sm">
          Monitor and manage all user investment packages
        </p>
      </div>

      {/* Summary Statistics */}
      <InvestmentStatsCards stats={investmentStats} />

      {/* Filters and Search */}
      <InvestmentFilters
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        packageFilter={packageFilter}
        uniquePackages={uniquePackages}
        onSearchChange={(value) => handleFilterChange('search', value)}
        onStatusChange={(value) => handleFilterChange('status', value)}
        onPackageChange={(value) => handleFilterChange('package', value)}
      />

      {/* Investments Table */}
      <div>
        <InvestmentsTable
          investments={currentInvestments}
          onViewDetails={setSelectedInvestment}
        />

        <InvestmentPagination
          currentPage={currentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={filteredInvestments.length}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Investment Details Modal */}
      {selectedInvestment && (
        <InvestmentDetailsModal
          investment={selectedInvestment}
          onClose={() => setSelectedInvestment(null)}
          onAddProfit={() => setShowAddProfitModal(true)}
        />
      )}

      {/* Add Profit Modal */}
      <AddProfitModal
        isOpen={showAddProfitModal}
        investment={selectedInvestment}
        profitAmount={newProfitAmount}
        onClose={() => {
          setShowAddProfitModal(false);
          setNewProfitAmount('');
        }}
        onAmountChange={setNewProfitAmount}
        onConfirm={handleAddProfit}
      />
    </div>
  );
}