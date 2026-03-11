import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Check, ChevronDown, Copy, Send } from "lucide-react";
import {
  createDepositRequest,
  getActiveDepositNetworks,
  getMyDeposits,
} from "../../api/user.api.js";
import StatusFeedbackModal from "../StatusFeedbackModal.jsx";

const getErrorMessage = (error) =>
  error?.response?.data?.detail ||
  error?.response?.data?.message ||
  error?.message ||
  "Something went wrong";

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

const INITIAL_FIELD_ERRORS = {
  network: "",
  amount: "",
  txid: "",
};

const getApiFieldErrors = (error) => {
  const details = error?.response?.data?.detail;
  if (!Array.isArray(details)) return null;

  const mapped = { ...INITIAL_FIELD_ERRORS };
  let hasMappedError = false;

  details.forEach((item) => {
    const field = item?.loc?.[item.loc.length - 1];
    const message = typeof item?.msg === "string" ? item.msg : "Invalid value";

    switch (field) {
      case "network_name":
        mapped.network = message;
        hasMappedError = true;
        break;
      case "amount":
        mapped.amount = message;
        hasMappedError = true;
        break;
      case "txid":
        mapped.txid = message;
        hasMappedError = true;
        break;
      default:
        break;
    }
  });

  return hasMappedError ? mapped : null;
};

export default function DepositPage() {
  const [networks, setNetworks] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedNetworkId, setSelectedNetworkId] = useState("");
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [amount, setAmount] = useState("");
  const [txid, setTxid] = useState("");
  const [fieldErrors, setFieldErrors] = useState(INITIAL_FIELD_ERRORS);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (!feedback) return undefined;

    const timer = setTimeout(() => {
      setFeedback(null);
    }, 4000);

    return () => clearTimeout(timer);
  }, [feedback]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        const [networksRes, depositsRes] = await Promise.all([
          getActiveDepositNetworks(),
          getMyDeposits(),
        ]);

        setNetworks(networksRes?.data?.data || []);
        setDeposits(depositsRes?.data?.data || []);
      } catch (error) {
        setFeedback({
          type: "error",
          message: getErrorMessage(error),
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const network = useMemo(
    () => networks.find((n) => String(n.id) === selectedNetworkId),
    [networks, selectedNetworkId],
  );

  const networkDisplayMap = useMemo(
    () =>
      new Map(
        networks.map((item) => [item.network_name, item.display_name]),
      ),
    [networks],
  );

  const copyAddress = () => {
    if (!network) return;
    navigator.clipboard.writeText(network.wallet_address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const copyTxid = (value) => navigator.clipboard.writeText(value);

  const truncateTxid = (value) =>
    `${value.substring(0, 10)}...${value.substring(value.length - 6)}`;

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

  const handleSubmitDeposit = async (event) => {
    event.preventDefault();
    setFeedback(null);
    const nextFieldErrors = { ...INITIAL_FIELD_ERRORS };

    const normalizedAmount = amount.trim();
    const amountNumber = Number(normalizedAmount);
    const normalizedTxid = txid.trim();

    if (!selectedNetworkId) {
      nextFieldErrors.network = "Field required";
    }

    if (!normalizedAmount) {
      nextFieldErrors.amount = "Field required";
    } else if (Number.isNaN(amountNumber) || amountNumber <= 0) {
      nextFieldErrors.amount = "Amount must be greater than 0.";
    }

    if (!normalizedTxid) {
      nextFieldErrors.txid = "Field required";
    } else if (normalizedTxid.length < 5) {
      nextFieldErrors.txid = "Must be at least 5 characters.";
    }

    if (Object.values(nextFieldErrors).some(Boolean)) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    setFieldErrors(INITIAL_FIELD_ERRORS);

    try {
      setIsSubmitting(true);

      const response = await createDepositRequest({
        network_name: network.network_name,
        amount: normalizedAmount,
        txid: normalizedTxid,
      });

      const createdDeposit = response?.data?.data;
      if (createdDeposit) {
        setDeposits((prev) => [createdDeposit, ...prev]);
      } else {
        const depositsRes = await getMyDeposits();
        setDeposits(depositsRes?.data?.data || []);
      }

      setFeedback({
        type: "success",
        message: "Deposit request submitted successfully.",
      });
      setFieldErrors(INITIAL_FIELD_ERRORS);
      setAmount("");
      setTxid("");
    } catch (error) {
      const apiFieldErrors = getApiFieldErrors(error);
      if (apiFieldErrors) {
        setFieldErrors(apiFieldErrors);
        return;
      }

      setFeedback({
        type: "error",
        message: getErrorMessage(error),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Deposit USDT
          </span>
        </h1>
        <p className="text-sm text-gray-400">Add funds to your account</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-xl">
        <h3 className="mb-4 text-lg font-semibold">Select Network</h3>

        <div className="relative">
          <select
            value={selectedNetworkId}
            onChange={(event) => {
              setSelectedNetworkId(event.target.value);
              setFieldErrors((prev) => ({ ...prev, network: "" }));
            }}
            disabled={isLoading || networks.length === 0}
            className={`w-full appearance-none rounded-xl border bg-[#0A122C] px-4 py-3 text-white disabled:cursor-not-allowed disabled:opacity-60 ${
              fieldErrors.network ? "border-red-500/60" : "border-white/10"
            }`}
          >
            <option
              value=""
              style={{ color: "#0f172a", backgroundColor: "#ffffff" }}
            >
              {isLoading ? "Loading networks..." : "Select network"}
            </option>
            {networks.map((item) => (
              <option
                key={item.id}
                value={String(item.id)}
                style={{ color: "#0f172a", backgroundColor: "#ffffff" }}
              >
                {item.display_name}
              </option>
            ))}
          </select>

          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        {fieldErrors.network && (
          <p className="mt-2 text-xs text-red-300">{fieldErrors.network}</p>
        )}

        {!isLoading && networks.length === 0 && (
          <p className="mt-3 text-sm text-yellow-300">
            No active deposit network found. Please contact support.
          </p>
        )}

        {network && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm text-gray-400">Deposit Address</label>

              <div className="mt-1 flex gap-2">
                <div className="flex-1 break-all rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm">
                  {network.wallet_address}
                </div>

                <button
                  onClick={copyAddress}
                  type="button"
                  className="rounded-xl border border-blue-500/30 bg-blue-600/20 px-4 py-3 text-blue-400"
                >
                  {copiedAddress ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </div>

            <div className="flex gap-3 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <p className="text-sm text-yellow-200">
                Only send {network.display_name} assets to this address. Other
                assets may be lost.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-xl">
        <h3 className="mb-4 text-lg font-semibold">Submit Deposit</h3>

        <form className="space-y-4" onSubmit={handleSubmitDeposit}>
          <input
            type="number"
            step="any"
            min="0"
            value={amount}
            onChange={(event) => {
              setAmount(event.target.value);
              setFieldErrors((prev) => ({ ...prev, amount: "" }));
            }}
            className={`w-full rounded-xl border bg-white/5 px-4 py-3 ${
              fieldErrors.amount ? "border-red-500/60" : "border-white/10"
            }`}
            placeholder="Amount"
          />
          {fieldErrors.amount && (
            <p className="-mt-2 text-xs text-red-300">{fieldErrors.amount}</p>
          )}

          <input
            value={txid}
            onChange={(event) => {
              setTxid(event.target.value);
              setFieldErrors((prev) => ({ ...prev, txid: "" }));
            }}
            className={`w-full rounded-xl border bg-white/5 px-4 py-3 ${
              fieldErrors.txid ? "border-red-500/60" : "border-white/10"
            }`}
            placeholder="Transaction ID"
          />
          {fieldErrors.txid && (
            <p className="-mt-2 text-xs text-red-300">{fieldErrors.txid}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || isLoading || networks.length === 0}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send size={18} />
            {isSubmitting ? "Submitting..." : "Submit Deposit"}
          </button>
        </form>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl">
        <div className="border-b border-white/10 p-6">
          <h3 className="text-lg font-semibold">Deposit History</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-4 text-left text-sm text-gray-400">Date</th>
                <th className="p-4 text-left text-sm text-gray-400">Amount</th>
                <th className="p-4 text-left text-sm text-gray-400">Network</th>
                <th className="p-4 text-left text-sm text-gray-400">TXID</th>
                <th className="p-4 text-left text-sm text-gray-400">Status</th>
              </tr>
            </thead>

            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-400">
                    Loading deposit history...
                  </td>
                </tr>
              )}

              {!isLoading && deposits.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-400">
                    No deposit history found.
                  </td>
                </tr>
              )}

              {!isLoading &&
                deposits.map((deposit) => {
                  const networkLabel =
                    networkDisplayMap.get(deposit.network_name) ||
                    deposit.network_name;

                  return (
                    <tr
                      key={deposit.id}
                      className="border-b border-white/5 hover:bg-white/5"
                    >
                      <td className="p-4 text-gray-400">
                        {formatDate(deposit.created_at)}
                      </td>
                      <td className="p-4 font-semibold">
                        {formatAmount(deposit.amount)} USDT
                      </td>
                      <td className="p-4 text-gray-400">{networkLabel}</td>

                      <td className="p-4">
                        <button
                          onClick={() => copyTxid(deposit.txid)}
                          className="flex items-center gap-2 font-mono text-blue-400"
                          type="button"
                        >
                          {truncateTxid(deposit.txid)}
                          <Copy size={14} />
                        </button>
                      </td>

                      <td className="p-4">
                        <span
                          className={`rounded-full border px-2 py-1 text-xs ${getStatusColor(deposit.status)}`}
                        >
                          {deposit.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      <StatusFeedbackModal feedback={feedback} onClose={() => setFeedback(null)} />
    </div>
  );
}
