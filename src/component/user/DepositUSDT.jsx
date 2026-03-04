import { useState } from "react";
import { Copy, Check, ChevronDown, AlertTriangle, Send } from "lucide-react";
import { motion } from "motion/react";

const depositNetworks = [
  {
    id: "erc20",
    displayName: "USDT (ERC20)",
    walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
    warningText:
      "Only send Tether (ERC20) assets to this address. Other assets will be lost forever.",
  },
  {
    id: "trc20",
    displayName: "USDT (TRC20)",
    walletAddress: "TXYZabcd1234567890ABCDEFGHIJKLMNOP",
    warningText:
      "Only send Tether (TRC20) assets to this address. Other assets will be lost forever.",
  },
];

const mockDeposits = [
  {
    id: "1",
    date: "Mar 3, 2026",
    amount: 1000,
    network: "USDT (ERC20)",
    txid: "0x7f3c9a2b8e1d4f6c9a2b8e1d4f6c9a2b8e1d",
    status: "pending",
  },
  {
    id: "2",
    date: "Mar 1, 2026",
    amount: 500,
    network: "USDT (TRC20)",
    txid: "0x3e8b7c1a9f2d5e8b7c1a9f2d5e8b7c1a9f2d",
    status: "approved",
  },
];

export default function DepositPage() {
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [amount, setAmount] = useState("");
  const [txid, setTxid] = useState("");

  const network = depositNetworks.find((n) => n.id === selectedNetwork);

  const copyAddress = () => {
    if (!network) return;
    navigator.clipboard.writeText(network.walletAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const submitDeposit = () => {
    if (!selectedNetwork || !amount || !txid) {
      alert("Please fill all fields");
      return;
    }

    alert("Deposit request submitted");
    setAmount("");
    setTxid("");
  };

  const truncateTxid = (txid) =>
    `${txid.substring(0, 10)}...${txid.substring(txid.length - 6)}`;

  const copyTxid = (txid) => navigator.clipboard.writeText(txid);

  const getStatusColor = (status) => {
    switch (status) {
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

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Deposit USDT
          </span>
        </h1>
        <p className="text-gray-400 text-sm">Add funds to your account</p>
      </div>

      {/* Select Network */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-xl"
      >
        <h3 className="text-lg font-semibold mb-4">Select Network</h3>

        <div className="relative">
          <select
            value={selectedNetwork}
            onChange={(e) => setSelectedNetwork(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#0A122C] border border-white/10 text-white appearance-none"
          >
            <option value="">Select network</option>
            {depositNetworks.map((n) => (
              <option key={n.id} value={n.id}>
                {n.displayName}
              </option>
            ))}
          </select>

          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        {network && (
          <div className="mt-4 space-y-4">

            <div>
              <label className="text-sm text-gray-400">Deposit Address</label>

              <div className="flex gap-2 mt-1">
                <div className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 font-mono text-sm break-all">
                  {network.walletAddress}
                </div>

                <button
                  onClick={copyAddress}
                  className="px-4 py-3 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400"
                >
                  {copiedAddress ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </div>

            <div className="flex gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
              <AlertTriangle className="text-yellow-400 w-5 h-5" />
              <p className="text-sm text-yellow-200">{network.warningText}</p>
            </div>

          </div>
        )}
      </motion.div>

      {/* Deposit Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-xl"
      >
        <h3 className="text-lg font-semibold mb-4">Submit Deposit</h3>

        <div className="space-y-4">

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10"
            placeholder="Amount"
          />

          <input
            value={txid}
            onChange={(e) => setTxid(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10"
            placeholder="Transaction ID"
          />

          <button
            onClick={submitDeposit}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex items-center justify-center gap-2"
          >
            <Send size={18} />
            Submit Deposit
          </button>

        </div>
      </motion.div>

      {/* Deposit History */}
      <div className="rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 overflow-hidden">

        <div className="p-6 border-b border-white/10">
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
              {mockDeposits.map((deposit) => (
                <tr key={deposit.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-4 text-gray-400">{deposit.date}</td>
                  <td className="p-4 font-semibold">{deposit.amount} USDT</td>
                  <td className="p-4 text-gray-400">{deposit.network}</td>

                  <td className="p-4">
                    <button
                      onClick={() => copyTxid(deposit.txid)}
                      className="flex items-center gap-2 text-blue-400 font-mono"
                    >
                      {truncateTxid(deposit.txid)}
                      <Copy size={14} />
                    </button>
                  </td>

                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(deposit.status)}`}>
                      {deposit.status}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>

    </div>
  );
}