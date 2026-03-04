import { useState } from "react";
import { Edit2, Trash2, Plus } from "lucide-react";

const initialNetworks = [
  {
    id: "1",
    networkName: "erc20",
    displayName: "USDT (ERC20)",
    walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
    status: "active",
  },
  {
    id: "2",
    networkName: "trc20",
    displayName: "USDT (TRC20)",
    walletAddress: "TXYZabcd1234567890ABCDEFGHIJKLMNOP",
    status: "active",
  },
];

export default function DepositNetworks() {
  const [networks, setNetworks] = useState(initialNetworks);

  const deleteNetwork = (id) => {
    setNetworks(networks.filter((n) => n.id !== id));
  };

  const getStatusColor = (status) => {
    return status === "active"
      ? "text-green-400 bg-green-500/10 border-green-500/30"
      : "text-gray-400 bg-gray-500/10 border-gray-500/30";
  };

  return (
    <div className="p-6">

      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Deposit{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Networks
            </span>
          </h1>

          <p className="text-gray-400">
            Configure available deposit networks
          </p>
        </div>

        <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Network
        </button>

      </div>

      {/* Table */}
      <div className="rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="border-b border-white/10">

                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                  Network Name
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                  Display Name
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                  Wallet Address
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

              {networks.map((network) => (
                <tr
                  key={network.id}
                  className="hover:bg-white/5 transition-colors"
                >

                  {/* Network */}
                  <td className="px-6 py-4 text-gray-300">
                    {network.networkName}
                  </td>

                  {/* Display Name */}
                  <td className="px-6 py-4 font-semibold text-white">
                    {network.displayName}
                  </td>

                  {/* Wallet */}
                  <td className="px-6 py-4 font-mono text-sm text-gray-300 max-w-xs truncate">
                    {network.walletAddress}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">

                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        network.status
                      )}`}
                    >
                      {network.status}
                    </span>

                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">

                    <div className="flex gap-2">

                      <button className="p-2 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600/30 transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => deleteNetwork(network.id)}
                        className="p-2 rounded-lg bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600/30 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>

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