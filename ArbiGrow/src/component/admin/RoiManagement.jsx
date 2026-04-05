import { useEffect, useState } from "react";
import useUserStore from "../../store/userStore.js";
import {
  applyRoiByTier,
  applyRoiByPackage,
  getScheduledRoi,
} from "../../api/admin.api.js";
import { tierGroups } from "../../constants/strategyData.js";

const CATEGORIES = tierGroups.map((t) => t.name);
const ALL_PACKAGES = "all";

const getErrorMessage = (error) =>
  error?.response?.data?.detail ||
  error?.response?.data?.message ||
  error?.message ||
  "Something went wrong";

function SummaryCards({ summary }) {
  if (!summary) return null;
  return (
    <div className="mt-5 grid grid-cols-2 md:grid-cols-5 gap-3">
      <div className="rounded-lg border border-white/10 bg-white/5 p-3">
        <p className="text-xs text-gray-400">Applied %</p>
        <p className="text-base font-semibold text-cyan-300">
          {summary.appliedPercentage}%
        </p>
      </div>
      <div className="rounded-lg border border-white/10 bg-white/5 p-3">
        <p className="text-xs text-gray-400">Processed</p>
        <p className="text-base font-semibold text-white">{summary.processed}</p>
      </div>
      <div className="rounded-lg border border-white/10 bg-white/5 p-3">
        <p className="text-xs text-gray-400">Credited</p>
        <p className="text-base font-semibold text-green-400">{summary.credited}</p>
      </div>
      <div className="rounded-lg border border-white/10 bg-white/5 p-3">
        <p className="text-xs text-gray-400">Completed</p>
        <p className="text-base font-semibold text-blue-400">{summary.completedNow}</p>
      </div>
      <div className="rounded-lg border border-white/10 bg-white/5 p-3">
        <p className="text-xs text-gray-400">Skipped</p>
        <p className="text-base font-semibold text-yellow-300">{summary.skipped}</p>
      </div>
    </div>
  );
}

export default function RoiManagement() {
  const token = useUserStore((state) => state.token);

  // ── Category / package ROI state ────────────────────────────────────────────
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [selectedPackageName, setSelectedPackageName] = useState(ALL_PACKAGES);
  const [categoryPercentage, setCategoryPercentage] = useState("3");
  const [applyingCategory, setApplyingCategory] = useState(false);
  const [categorySummary, setCategorySummary] = useState(null);
  const [scheduledRates, setScheduledRates] = useState({});

  // ── Messages ────────────────────────────────────────────────────────────────
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Derived
  const selectedTier = tierGroups.find((t) => t.name === selectedCategory);

  // Reset selections when category changes
  useEffect(() => {
    setSelectedPackageName(ALL_PACKAGES);
    setCategorySummary(null);
    setSuccessMessage("");
    setErrorMessage("");
  }, [selectedCategory]);

  // Load currently saved scheduled rates from backend
  useEffect(() => {
    const loadScheduled = async () => {
      try {
        const data = await getScheduledRoi(token);
        if (data?.scheduled) {
          const rates = {};
          Object.entries(data.scheduled).forEach(([pkg, info]) => {
            rates[pkg] = info.percentage;
          });
          setScheduledRates(rates);
        }
      } catch {
        // Non-critical — UI still usable without pre-loaded rates
      }
    };
    if (token) loadScheduled();
  }, [token]);

  const handleApplyToSelection = async () => {
    const numeric = Number(categoryPercentage);
    if (Number.isNaN(numeric) || numeric <= 0 || numeric > 25) {
      setErrorMessage("ROI percentage must be between 0.01 and 25.");
      return;
    }
    try {
      setApplyingCategory(true);
      setErrorMessage("");
      setSuccessMessage("");

      if (selectedPackageName === ALL_PACKAGES) {
        await applyRoiByTier(token, selectedCategory, numeric);
        const tier = tierGroups.find((t) => t.name === selectedCategory);
        setScheduledRates((prev) => {
          const updated = { ...prev };
          tier?.packages.forEach((pkg) => { updated[pkg.name] = numeric; });
          return updated;
        });
        setSuccessMessage(
          `Saved ${numeric}% daily ROI for all "${selectedCategory}" packages — applies tonight at 12:00 AM UTC.`,
        );
      } else {
        await applyRoiByPackage(token, selectedPackageName, numeric);
        setScheduledRates((prev) => ({ ...prev, [selectedPackageName]: numeric }));
        setSuccessMessage(
          `Saved ${numeric}% daily ROI for "${selectedPackageName}" — applies tonight at 12:00 AM UTC.`,
        );
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setApplyingCategory(false);
    }
  };

  const applyButtonLabel = () => {
    if (applyingCategory) return "Saving...";
    if (selectedPackageName === ALL_PACKAGES)
      return `Save ${categoryPercentage}% Daily Rate for All "${selectedCategory}" Packages`;
    return `Save ${categoryPercentage}% Daily Rate for "${selectedPackageName}"`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          ROI{" "}
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Management
          </span>
        </h1>
        <p className="text-gray-400">
          Set daily ROI rates per package — profits are distributed automatically at 12:00 AM UTC every day
        </p>
      </div>

      {/* Scheduled notice */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-200/80">
        <span className="mt-0.5 shrink-0 text-amber-400">⏰</span>
        <span>
          Rates saved here are{" "}
          <strong className="text-amber-300">not applied immediately</strong>. The
          system automatically distributes profits to all active investments once
          daily at{" "}
          <strong className="text-amber-300">12:00 AM UTC</strong>.
        </span>
      </div>

      {/* Alerts */}
      {errorMessage && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-200">
          {successMessage}
        </div>
      )}

      {/* ── Category & Package ROI Distribution ─────────────────────────────── */}
      <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-6 space-y-5">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">
            Distribute Profit by Category &amp; Package
          </h3>
          <p className="text-sm text-gray-400">
            Select a category, then pick a specific package or leave on{" "}
            <span className="text-cyan-300 font-medium">All Packages</span> to
            set the rate for the entire category. Saved rates are applied once
            automatically at{" "}
            <span className="text-cyan-300 font-medium">12:00 AM UTC</span> every day.
          </p>
        </div>

        {/* Row 1: Category + Package selects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400 block mb-2">
              Select Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0A122C] px-4 py-3 text-white appearance-none cursor-pointer focus:outline-none focus:border-cyan-500/50"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-[#0A122C] text-white">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-400 block mb-2">
              Select Package
            </label>
            <select
              value={selectedPackageName}
              onChange={(e) => setSelectedPackageName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0A122C] px-4 py-3 text-white appearance-none cursor-pointer focus:outline-none focus:border-cyan-500/50"
            >
              <option value={ALL_PACKAGES} className="bg-[#0A122C] text-cyan-300">
                All Packages in {selectedCategory}
              </option>
              {selectedTier?.packages.map((pkg) => (
                <option key={pkg.id} value={pkg.name} className="bg-[#0A122C] text-white">
                  {pkg.name} — ${pkg.amount.toLocaleString()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: ROI % input */}
        <div>
          <label className="text-sm text-gray-400 block mb-2">
            Daily ROI Percentage (%)
          </label>
          <input
            type="number"
            min="0.01"
            max="25"
            step="0.01"
            value={categoryPercentage}
            onChange={(e) => setCategoryPercentage(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#0A122C] px-4 py-3 text-white"
          />
        </div>

        {/* Package cards — clickable to select */}
        {selectedTier && (
          <div>
            <p className="text-sm text-gray-400 mb-3">
              Packages in{" "}
              <span className="text-white font-medium">{selectedTier.name}</span>
              {" · "}
              <span className="text-cyan-300">{selectedTier.range}</span>
              {" · "}
              <span className="text-green-300">ROI {selectedTier.roiText}</span>
              <span className="text-gray-500 ml-2 text-xs">(click a card to select)</span>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {/* "All" card */}
              <button
                type="button"
                onClick={() => setSelectedPackageName(ALL_PACKAGES)}
                className={`rounded-xl border p-4 flex flex-col gap-1 text-left transition-all ${
                  selectedPackageName === ALL_PACKAGES
                    ? "border-cyan-500/60 bg-cyan-500/10 ring-1 ring-cyan-500/40"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  All
                </p>
                <p className="text-base font-bold text-white">All Packages</p>
                <p className="text-xs text-cyan-400 mt-auto">Entire category</p>
              </button>

              {selectedTier.packages.map((pkg) => {
                const isSelected = selectedPackageName === pkg.name;
                return (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => setSelectedPackageName(pkg.name)}
                    className={`rounded-xl border p-4 flex flex-col gap-1 text-left transition-all ${
                      isSelected
                        ? "border-cyan-500/60 bg-cyan-500/10 ring-1 ring-cyan-500/40"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                      {pkg.name}
                    </p>
                    <p className="text-lg font-bold text-white">
                      ${pkg.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-cyan-400 mt-auto">
                      {scheduledRates[pkg.name] != null
                        ? `Daily: ${scheduledRates[pkg.name]}%`
                        : "Not set"}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <button
            type="button"
            onClick={handleApplyToSelection}
            disabled={applyingCategory}
            className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 transition-opacity"
          >
            {applyButtonLabel()}
          </button>
        </div>

        {/* Result summary */}
        <SummaryCards summary={categorySummary} />
      </div>
    </div>
  );
}
