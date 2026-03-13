import { motion, AnimatePresence } from "motion/react";
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Wallet,
  FileText,
  Users,
} from "lucide-react";

export default function UserDetailModal({
  selectedUser,
  onClose,
  userStatus,
  setUserStatus,
  userIssueNote,
  setUserIssueNote,
  handleStatusChange,
  isUpdating,
  updateMessage,
  walletForm,
  onWalletFieldChange,
  onWalletUpdate,
  isWalletUpdating,
  walletUpdateMessage,
  hasWalletChanges,
}) {
  // console.log("user from modal", selectedUser);

  const documentImages = [
    selectedUser?.kyc?.front_image_url,
    selectedUser?.kyc?.back_image_url,
  ].filter(Boolean);
  const normalizeStatus = (value) => {
    const normalized = String(value || "pending").toLowerCase();
    return ["pending", "approved", "rejected", "issue"].includes(normalized)
      ? normalized
      : "pending";
  };
  const currentUserStatus = normalizeStatus(
    selectedUser?.status || selectedUser?.kyc?.status,
  );
  const currentIssueNote = String(selectedUser?.issue_note || "");
  const normalizedSelectedStatus = normalizeStatus(userStatus);
  const hasIssueNoteChanged =
    normalizedSelectedStatus === "issue" &&
    String(userIssueNote || "").trim() !== currentIssueNote.trim();
  const shouldDisableStatusUpdate =
    isUpdating ||
    (normalizedSelectedStatus === currentUserStatus && !hasIssueNoteChanged);

  const depositHistory = Array.isArray(selectedUser?.deposit_history)
    ? selectedUser.deposit_history
    : [];
  const withdrawalHistory = Array.isArray(selectedUser?.withdrawal_history)
    ? selectedUser.withdrawal_history
    : [];
  const formatDateTime = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleString();
  };

  return (
    <AnimatePresence>
      {selectedUser && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-[#0d1137] to-[#0a0e27] border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-br from-[#0d1137] to-[#0a0e27] border-b border-white/10 p-6 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-white">User Details</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <InfoCard
                  icon={User}
                  label="Full Name"
                  value={selectedUser?.full_name || "N/A"}
                />
                <InfoCard
                  icon={User}
                  label="Username"
                  value={selectedUser?.username || "N/A"}
                />
                <InfoCard
                  icon={Mail}
                  label="Email"
                  value={selectedUser?.email || "N/A"}
                  breakAll
                />
                <InfoCard
                  icon={Phone}
                  label="Phone"
                  value={selectedUser?.kyc?.phone_number || "N/A"}
                />
                <InfoCard
                  icon={MapPin}
                  label="Country"
                  value={selectedUser?.kyc?.country || "N/A"}
                />
                <InfoCard
                  icon={FileText}
                  label="Document Type"
                  value={
                    selectedUser?.kyc?.document_type?.toUpperCase() || "N/A"
                  }
                />
              </div>

              {/* Wallets */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-cyan-400" />
                  Wallets
                </h3>

                <div className="grid gap-3">
                  {[
                    {
                      key: "main_wallet",
                      label: "Main Wallet",
                    },
                    {
                      key: "deposit_wallet",
                      label: "Deposit Wallet",
                    },
                    {
                      key: "withdraw_wallet",
                      label: "Withdraw Wallet",
                    },
                    {
                      key: "referral_wallet",
                      label: "Referral Wallet",
                    },
                    {
                      key: "generation_wallet",
                      label: "Generation Wallet",
                    },
                    {
                      key: "arbx_wallet",
                      label: "ARBX Wallet",
                    },
                    {
                      key: "arbx_mining_wallet",
                      label: "ARBX Mining Wallet",
                    },
                  ].map((wallet, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-white/5 border border-white/10"
                    >
                      <div className="text-xs text-gray-400 mb-1">
                        {wallet.label}
                      </div>
                      <input
                        type="number"
                        min="0"
                        step="0.00000000000001"
                        value={walletForm?.[wallet.key] ?? ""}
                        onChange={(e) =>
                          onWalletFieldChange?.(wallet.key, e.target.value)
                        }
                        className="w-full rounded-lg border border-white/10 bg-[#0C1035] px-3 py-2 text-sm text-white font-mono focus:border-cyan-500/50 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-col md:flex-row md:items-center gap-3">
                  <button
                    type="button"
                    onClick={onWalletUpdate}
                    disabled={isWalletUpdating || !hasWalletChanges}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isWalletUpdating ? "Updating Wallets..." : "Update Wallets"}
                  </button>
                  {walletUpdateMessage && (
                    <div className="text-sm text-cyan-300">{walletUpdateMessage}</div>
                  )}
                </div>
              </div>

              {/* Referrers */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  Referrer Hierarchy (5 Levels)
                </h3>

                <div className="space-y-2">
                  {selectedUser?.referrers?.length > 0 ? (
                    selectedUser.referrers.map((ref) => (
                      <div
                        key={ref.level}
                        className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center gap-4"
                      >
                        <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-sm flex-shrink-0">
                          L{ref.level}
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-semibold">
                            {ref.username || "N/A"}
                          </div>
                          <div className="text-xs text-gray-400">
                            {ref.email || "N/A"}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400">No referrers available</div>
                  )}
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4">
                  Document Images
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {documentImages.length > 0 ? (
                    documentImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl overflow-hidden border border-white/10"
                      >
                        <img
                          src={img}
                          alt={`Document ${idx + 1}`}
                          className="w-full h-64 object-cover"
                        />
                        <div className="p-2 bg-white/5 text-center text-sm text-gray-400">
                          {selectedUser?.documentType === "passport"
                            ? "Passport"
                            : idx === 0
                              ? "NID Front"
                              : "NID Back"}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400">No documents uploaded</div>
                  )}
                </div>
              </div>

              {/* Status Update */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30">
                <h3 className="text-lg font-bold text-white mb-4">
                  Update Status
                </h3>

                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <select
                    value={userStatus}
                    onChange={(e) => setUserStatus(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl  bg-[#0C1035] border border-white/20 text-white focus:border-cyan-500/50 focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="issue">Issue</option>
                  </select>
                  {normalizedSelectedStatus === "issue" && (
                    <textarea
                      value={userIssueNote}
                      onChange={(e) => setUserIssueNote(e.target.value)}
                      placeholder="Write the issue details for this user..."
                      className="flex-1 min-h-24 px-4 py-3 rounded-xl bg-[#0C1035] border border-white/20 text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none"
                    />
                  )}
                  <button
                    onClick={handleStatusChange}
                    disabled={shouldDisableStatusUpdate}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isUpdating ? "Updating..." : "Update Status"}
                  </button>

                  {updateMessage && (
                    <div className="mt-3 text-sm text-green-400">
                      {updateMessage}
                    </div>
                  )}
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="rounded-xl border border-white/15 bg-white/5 p-4">
                    <h4 className="mb-3 text-sm font-semibold text-cyan-300">
                      Deposit History
                    </h4>
                    <div className="max-h-56 space-y-2 overflow-y-auto">
                      {depositHistory.length === 0 ? (
                        <div className="text-sm text-gray-400">
                          No deposit history found.
                        </div>
                      ) : (
                        depositHistory.map((item) => (
                          <div
                            key={`dep-${item.id}`}
                            className="rounded-lg border border-white/10 bg-[#0C1035] p-3 text-sm"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-semibold text-white">
                                {item.amount} USDT
                              </span>
                              <span className="text-xs uppercase text-gray-400">
                                {item.status}
                              </span>
                            </div>
                            <div className="mt-1 text-xs text-gray-400">
                              {item.network_name || "-"} | {formatDateTime(item.created_at)}
                            </div>
                            <div className="mt-1 break-all font-mono text-[11px] text-gray-500">
                              {item.txid || "-"}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/15 bg-white/5 p-4">
                    <h4 className="mb-3 text-sm font-semibold text-cyan-300">
                      Withdrawal History
                    </h4>
                    <div className="max-h-56 space-y-2 overflow-y-auto">
                      {withdrawalHistory.length === 0 ? (
                        <div className="text-sm text-gray-400">
                          No withdrawal history found.
                        </div>
                      ) : (
                        withdrawalHistory.map((item) => (
                          <div
                            key={`wdw-${item.id}`}
                            className="rounded-lg border border-white/10 bg-[#0C1035] p-3 text-sm"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-semibold text-white">
                                {item.amount} USDT
                              </span>
                              <span className="text-xs uppercase text-gray-400">
                                {item.status}
                              </span>
                            </div>
                            <div className="mt-1 text-xs text-gray-400">
                              {item.source_wallet || "-"} |{" "}
                              {item.network_name || "-"}
                            </div>
                            <div className="mt-1 break-all text-[11px] text-gray-500">
                              {item.destination_address || "-"}
                            </div>
                            <div className="mt-1 text-xs text-gray-500">
                              {formatDateTime(item.created_at)}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* Small internal reusable card component (UI identical) */
function InfoCard({ icon: Icon, label, value, breakAll }) {
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
      <div className="flex items-center gap-3 mb-2">
        <Icon className="w-5 h-5 text-cyan-400" />
        <span className="text-sm text-gray-400">{label}</span>
      </div>
      <div
        className={`text-white font-semibold ${breakAll ? "break-all" : ""}`}
      >
        {value || "N/A"}
      </div>
    </div>
  );
}
