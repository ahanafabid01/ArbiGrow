import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ChevronDown, Copy, Send } from "lucide-react";
import useUserStore from "../../store/userStore.js";
import {
  createWithdrawalRequest,
  getMyWithdrawals,
  refreshUserStore,
} from "../../api/user.api.js";

const MIN_WITHDRAW_AMOUNT = 10;

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatAmount = (value) => {
  const amount = Number(value);
  if (Number.isNaN(amount)) return value;
  return amount % 1 === 0 ? String(amount) : amount.toFixed(2);
};

const toNumber = (value) => Number(value ?? 0);

const getStatusColor = (status) => {
  switch ((status || "").toLowerCase()) {
    case "approved":
      return "text-green-400 bg-green-500/10 border-green-500/30";
    case "pending":
      return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";
    case "rejected":
      return "text-red-400 bg-red-500/10 border-red-500/30";
    default:
      return "text-gray-400 bg-gray-500/10 border-gray-500/30";
  }
};

const getErrorMessage = (error) =>
  error?.response?.data?.detail ||
  error?.response?.data?.message ||
  error?.message ||
  "Something went wrong";

export default function WithdrawPage() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [selectedWalletKey, setSelectedWalletKey] = useState("");
  const [amount, setAmount] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [withdrawals, setWithdrawals] = useState([]);

  const walletOptions = useMemo(
    () => [
      {
        key: "main_wallet",
        label: "Main Wallet",
        balance: toNumber(user?.main_wallet),
      },
      {
        key: "arbx_wallet",
        label: "ARBX Wallet",
        balance: toNumber(user?.arbx_wallet),
      },
      {
        key: "deposit_wallet",
        label: "Deposit Wallet",
        balance: toNumber(user?.deposit_wallet),
      },
      {
        key: "withdraw_wallet",
        label: "Withdraw Wallet",
        balance: toNumber(user?.withdraw_wallet),
      },
      {
        key: "referral_wallet",
        label: "Referral Wallet",
        balance: toNumber(user?.referral_wallet),
      },
      {
        key: "generation_wallet",
        label: "Generation Wallet",
        balance: toNumber(user?.generation_wallet),
      },
    ],
    [user],
  );

  const selectedWallet = useMemo(
    () => walletOptions.find((wallet) => wallet.key === selectedWalletKey),
    [walletOptions, selectedWalletKey],
  );

  const walletLabelMap = useMemo(
    () => new Map(walletOptions.map((wallet) => [wallet.key, wallet.label])),
    [walletOptions],
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const [userResponse, withdrawalsResponse] = await Promise.all([
          refreshUserStore(),
          getMyWithdrawals(),
        ]);

        if (userResponse?.data?.user) {
          setUser(userResponse.data.user);
        }

        setWithdrawals(withdrawalsResponse?.data?.data || []);
      } catch (error) {
        setErrorMessage(getErrorMessage(error));
        setWithdrawals([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [setUser]);

  const handleSubmitWithdraw = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!selectedWallet) {
      setErrorMessage("Please select a wallet.");
      return;
    }

    const amountNumber = Number(amount.trim());

    if (Number.isNaN(amountNumber) || amountNumber <= 0) {
      setErrorMessage("Please enter a valid amount.");
      return;
    }

    if (amountNumber < MIN_WITHDRAW_AMOUNT) {
      setErrorMessage(
        `Minimum withdrawal amount is ${MIN_WITHDRAW_AMOUNT} USDT.`,
      );
      return;
    }

    if (amountNumber > selectedWallet.balance) {
      setErrorMessage(
        `Insufficient balance in ${selectedWallet.label}. Available: ${selectedWallet.balance.toFixed(7)}.`,
      );
      return;
    }

    const normalizedAddress = destinationAddress.trim();
    if (!normalizedAddress) {
      setErrorMessage("Please enter destination wallet address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createWithdrawalRequest({
        source_wallet: selectedWallet.key,
        amount: amount.trim(),
        destination_address: normalizedAddress,
        note: note.trim(),
      });

      const created = response?.data?.data;
      if (created) {
        setWithdrawals((prev) => [created, ...prev]);
      } else {
        const withdrawalsResponse = await getMyWithdrawals();
        setWithdrawals(withdrawalsResponse?.data?.data || []);
      }

      setSuccessMessage(
        "Withdrawal request submitted. It is now pending admin review.",
      );
      setAmount("");
      setDestinationAddress("");
      setNote("");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyAddress = (value) => navigator.clipboard.writeText(value);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Withdraw Funds
          </span>
        </h1>
        <p className="text-sm text-gray-400">
          Submit a withdrawal request from your wallet balances
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

      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-xl">
        <h3 className="mb-4 text-lg font-semibold">Select Wallet</h3>

        <div className="relative">
          <select
            value={selectedWalletKey}
            onChange={(event) => setSelectedWalletKey(event.target.value)}
            className="w-full appearance-none rounded-xl border border-white/10 bg-[#0A122C] px-4 py-3 text-white"
          >
            <option
              value=""
              style={{ color: "#0f172a", backgroundColor: "#ffffff" }}
            >
              Select wallet
            </option>
            {walletOptions.map((wallet) => (
              <option
                key={wallet.key}
                value={wallet.key}
                style={{ color: "#0f172a", backgroundColor: "#ffffff" }}
              >
                {wallet.label} ({wallet.balance.toFixed(7)})
              </option>
            ))}
          </select>

          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        {selectedWallet && (
          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-sm text-gray-400">Available Balance</p>
              <p className="text-lg font-semibold text-cyan-400">
                {selectedWallet.balance.toFixed(7)} USDT
              </p>
            </div>

            <div className="flex gap-3 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <p className="text-sm text-yellow-200">
                Minimum withdrawal amount is {MIN_WITHDRAW_AMOUNT} USDT.
                Requests are subject to admin approval.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-xl">
        <h3 className="mb-4 text-lg font-semibold">Submit Withdrawal</h3>

        <form className="space-y-4" onSubmit={handleSubmitWithdraw}>
          <input
            type="number"
            step="any"
            min={MIN_WITHDRAW_AMOUNT}
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3"
            placeholder={`Amount (min ${MIN_WITHDRAW_AMOUNT} USDT)`}
          />

          <input
            value={destinationAddress}
            onChange={(event) => setDestinationAddress(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3"
            placeholder="Destination wallet address"
          />

          <input
            value={note}
            onChange={(event) => setNote(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3"
            placeholder="Note (optional)"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send size={18} />
            {isSubmitting ? "Submitting..." : "Submit Withdrawal Request"}
          </button>
        </form>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl">
        <div className="border-b border-white/10 p-6">
          <h3 className="text-lg font-semibold">Withdrawal History</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-4 text-left text-sm text-gray-400">Date</th>
                <th className="p-4 text-left text-sm text-gray-400">Amount</th>
                <th className="p-4 text-left text-sm text-gray-400">Wallet</th>
                <th className="p-4 text-left text-sm text-gray-400">Address</th>
                <th className="p-4 text-left text-sm text-gray-400">Status</th>
              </tr>
            </thead>

            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-400">
                    Loading withdrawal history...
                  </td>
                </tr>
              )}

              {!isLoading && withdrawals.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-400">
                    No withdrawal history found.
                  </td>
                </tr>
              )}

              {withdrawals.map((withdrawal) => {
                const address = withdrawal.destination_address || "-";
                const isLongAddress = address.length > 20;
                const label = isLongAddress
                  ? `${address.slice(0, 10)}...${address.slice(-6)}`
                  : address;

                return (
                  <tr
                    key={withdrawal.id}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <td className="p-4 text-gray-400">
                      {formatDate(withdrawal.created_at)}
                    </td>
                    <td className="p-4 font-semibold">
                      {formatAmount(withdrawal.amount)} USDT
                    </td>
                    <td className="p-4 text-gray-400">
                      {walletLabelMap.get(withdrawal.source_wallet) ||
                        withdrawal.source_wallet}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => copyAddress(address)}
                        className="flex items-center gap-2 font-mono text-blue-400"
                        type="button"
                      >
                        {label}
                        <Copy size={14} />
                      </button>
                    </td>
                    <td className="p-4">
                      <span
                        className={`rounded-full border px-2 py-1 text-xs ${getStatusColor(withdrawal.status)}`}
                      >
                        {withdrawal.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
