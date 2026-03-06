import { useCallback, useEffect, useState } from "react";
import useUserStore from "../../store/userStore.js";
import {
  applyAdminRoiToAll,
  getAdminRoiSetting,
  updateAdminRoiSetting,
} from "../../api/admin.api.js";

const getErrorMessage = (error) =>
  error?.response?.data?.detail ||
  error?.response?.data?.message ||
  error?.message ||
  "Something went wrong";

export default function RoiManagement() {
  const token = useUserStore((state) => state.token);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [applying, setApplying] = useState(false);
  const [percentage, setPercentage] = useState("3");
  const [currentPercentage, setCurrentPercentage] = useState("3");
  const [updatedAt, setUpdatedAt] = useState("");
  const [applySummary, setApplySummary] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadSetting = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");
      const data = await getAdminRoiSetting(token);
      const value = Number(data?.percentage ?? 3);
      const asText = value.toString();
      setCurrentPercentage(asText);
      setPercentage(asText);
      setUpdatedAt(data?.updated_at || "");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadSetting();
  }, [loadSetting]);

  const handleSave = async () => {
    const numeric = Number(percentage);
    if (Number.isNaN(numeric) || numeric < 1 || numeric > 5) {
      setErrorMessage("ROI percentage must be between 1 and 5.");
      return;
    }

    try {
      setSaving(true);
      setApplying(true);
      setErrorMessage("");
      setSuccessMessage("");
      const response = await updateAdminRoiSetting(token, numeric);
      const next = Number(response?.percentage ?? numeric).toString();
      setCurrentPercentage(next);
      setPercentage(next);
      setUpdatedAt(response?.updated_at || "");

      const applyResponse = await applyAdminRoiToAll(token);
      setApplySummary({
        appliedPercentage: applyResponse?.applied_percentage,
        processed: applyResponse?.processed ?? 0,
        credited: applyResponse?.credited ?? 0,
        completedNow: applyResponse?.completed_now ?? 0,
        skipped: applyResponse?.skipped ?? 0,
      });
      setSuccessMessage(
        `Global ROI set to ${next}% and automatically applied to active users.`,
      );
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setSaving(false);
      setApplying(false);
    }
  };

  const handleApply = async () => {
    try {
      setApplying(true);
      setErrorMessage("");
      setSuccessMessage("");
      setApplySummary(null);

      const response = await applyAdminRoiToAll(token);
      setApplySummary({
        appliedPercentage: response?.applied_percentage,
        processed: response?.processed ?? 0,
        credited: response?.credited ?? 0,
        completedNow: response?.completed_now ?? 0,
        skipped: response?.skipped ?? 0,
      });
      setSuccessMessage(
        `ROI ${response?.applied_percentage}% applied to active investments.`,
      );
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          ROI{" "}
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Management
          </span>
        </h1>
        <p className="text-gray-400">
          Set global ROI (1%-5%) and apply it to all active users/investments
        </p>
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-gray-400">Current Global ROI</p>
          <p className="text-3xl font-bold text-cyan-400 mt-1">
            {currentPercentage}%
          </p>
          {updatedAt && (
            <p className="text-xs text-gray-500 mt-2">
              Updated: {new Date(updatedAt).toLocaleString()}
            </p>
          )}
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <label className="text-sm text-gray-400 block mb-2">
            Set ROI Percentage (1 to 5)
          </label>
          <input
            type="number"
            min="1"
            max="5"
            step="0.01"
            value={percentage}
            onChange={(event) => setPercentage(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#0A122C] px-4 py-3 text-white"
          />
          <button
            type="button"
            onClick={handleSave}
            disabled={loading || saving}
            className="mt-4 w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving & Applying..." : "Save ROI And Apply To All"}
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-6">
        <h3 className="text-xl font-bold text-white mb-2">Apply ROI to All</h3>
        <p className="text-sm text-gray-400 mb-4">
          This will distribute the current global ROI percentage to all active
          investments at once.
        </p>
        <button
          type="button"
          onClick={handleApply}
          disabled={loading || applying}
          className="rounded-xl border border-cyan-500/40 bg-cyan-500/20 px-6 py-3 font-semibold text-cyan-300 hover:text-white hover:bg-cyan-500/30 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
        >
          {applying ? "Applying..." : "Apply ROI To All Active Users"}
        </button>

        {applySummary && (
          <div className="mt-5 grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="rounded-lg border border-white/10 bg-white/5 p-3">
              <p className="text-xs text-gray-400">Applied %</p>
              <p className="text-base font-semibold text-cyan-300">
                {applySummary.appliedPercentage}%
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-3">
              <p className="text-xs text-gray-400">Processed</p>
              <p className="text-base font-semibold text-white">
                {applySummary.processed}
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-3">
              <p className="text-xs text-gray-400">Credited</p>
              <p className="text-base font-semibold text-green-400">
                {applySummary.credited}
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-3">
              <p className="text-xs text-gray-400">Completed</p>
              <p className="text-base font-semibold text-blue-400">
                {applySummary.completedNow}
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-3">
              <p className="text-xs text-gray-400">Skipped</p>
              <p className="text-base font-semibold text-yellow-300">
                {applySummary.skipped}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
