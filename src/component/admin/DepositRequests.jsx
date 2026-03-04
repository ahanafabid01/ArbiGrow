import { useState } from "react";
import { Copy, CheckCircle, XCircle } from "lucide-react";

const mockDeposits = [
  {
    id: "1",
    userName: "John Anderson",
    userEmail: "john@email.com",
    amount: 1000,
    network: "USDT (ERC20)",
    txid: "0x7f3c9a2b8e1d4f6c9a2b8e1d4f6c9a2b8e1d",
    date: "Mar 3, 2026",
    status: "pending",
  },
  {
    id: "2",
    userName: "Sarah Mitchell",
    userEmail: "sarah@email.com",
    amount: 500,
    network: "USDT (TRC20)",
    txid: "0x3e8b7c1a9f2d5e8b7c1a9f2d5e8b7c1a9f2d",
    date: "Mar 2, 2026",
    status: "approved",
  },
];

export default function DepositRequests() {
  const [deposits, setDeposits] = useState(mockDeposits);

  const handleApprove = (id) => {
    setDeposits((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "approved" } : d))
    );
  };

  const handleReject = (id) => {
    setDeposits((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "rejected" } : d))
    );
  };

  const copyTxid = (txid) => {
    navigator.clipboard.writeText(txid);
  };

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

  const truncateTxid = (txid) => {
    return `${txid.substring(0, 10)}...${txid.substring(txid.length - 6)}`;
  };

  return (
    <div className="p-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Deposit{" "}
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Requests
          </span>
        </h1>
        <p className="text-gray-400">
          Manage user deposit requests
        </p>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="border-b border-white/10">

                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                  User
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                  Amount
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                  Network
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                  TXID
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                  Date
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">

              {deposits.map((deposit) => (
                <tr
                  key={deposit.id}
                  className="hover:bg-white/5 transition-colors"
                >

                  {/* User */}
                  <td className="px-6 py-4">
                    <div className="font-semibold text-white">
                      {deposit.userName}
                    </div>
                    <div className="text-xs text-gray-400">
                      {deposit.userEmail}
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-bold text-white">
                      {deposit.amount} USDT
                    </span>
                  </td>

                  {/* Network */}
                  <td className="px-6 py-4 text-gray-300">
                    {deposit.network}
                  </td>

                  {/* TXID */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => copyTxid(deposit.txid)}
                      className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-mono"
                    >
                      {truncateTxid(deposit.txid)}
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 text-gray-300">
                    {deposit.date}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        deposit.status
                      )}`}
                    >
                      {deposit.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">

                    {deposit.status === "pending" ? (
                      <div className="flex gap-2">

                        <button
                          onClick={() => handleApprove(deposit.id)}
                          className="px-3 py-1.5 rounded-lg bg-green-600/20 border border-green-500/30 text-green-400 text-xs font-semibold hover:bg-green-600/30 transition-all"
                        >
                          <CheckCircle className="w-3.5 h-3.5 inline mr-1" />
                          Approve
                        </button>

                        <button
                          onClick={() => handleReject(deposit.id)}
                          className="px-3 py-1.5 rounded-lg bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-600/30 transition-all"
                        >
                          <XCircle className="w-3.5 h-3.5 inline mr-1" />
                          Reject
                        </button>

                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">
                        No actions
                      </span>
                    )}

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