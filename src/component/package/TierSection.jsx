import { motion } from "framer-motion";
import { tierGroups } from "../../constants/strategyData";
import Logo from "../../assets/Arbigrow-Logo.png";

export default function TierSection({ onSelect }) {
  return (
    <section className="px-6 pb-20">
      <div className="mx-auto max-w-7xl space-y-16">
        {tierGroups.map((tier, tierIndex) => (
          <div key={`${tier.name}-${tier.id}`}>
            {/* Tier Header */}
            <div className="mb-8">
              <div className="mb-3 flex items-center gap-3">
                <h2 className="text-2xl font-semibold text-white sm:text-3xl">
                  {tier.name}
                </h2>
                <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300">
                  {tier.range}
                </span>
              </div>
              <p className="text-gray-400">{tier.description}</p>
            </div>

            {/* Package Cards Grid */}
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {tier.packages.map((pkg, pkgIndex) => (
                <motion.button
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: tierIndex * 0.1 + pkgIndex * 0.05,
                  }}
                  // for future: modal disabled but need to
                  onClick={() => onSelect(pkg)}
                  className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-[#0d1428] to-[#0a0e27] p-6 text-left transition-all hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10"
                >
                  {/* Circuit Pattern Background */}
                  <div className="absolute inset-0 opacity-5">
                    <svg
                      className="size-full"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <pattern
                          id={`circuit-${pkg.id}`}
                          x="0"
                          y="0"
                          width="40"
                          height="40"
                          patternUnits="userSpaceOnUse"
                        >
                          <circle cx="5" cy="5" r="1" fill="#00d4ff" />
                          <circle cx="35" cy="35" r="1" fill="#00d4ff" />
                          <path
                            d="M5 5 L35 5 L35 35"
                            stroke="#00d4ff"
                            strokeWidth="0.5"
                            fill="none"
                          />
                        </pattern>
                      </defs>
                      <rect
                        width="100%"
                        height="100%"
                        fill={`url(#circuit-${pkg.id})`}
                      />
                    </svg>
                  </div>

                  {/* Card Content */}
                  <div className="relative">
                    {/* Top Row */}
                    <div className="mb-6 flex items-start justify-between">
                      {/* Logo */}
                      <div className="flex size-12  items-center justify-center rounded-full bg-gradient-to-br">
                        <img
                          src={Logo}
                          alt="My Logo"
                          className="w-12 h-12 object-contain"
                        />
                      </div>

                      {/* Chip */}
                      <div className="size-10 rounded-md bg-gradient-to-br from-yellow-200 to-yellow-400 p-1">
                        <div className="size-full rounded-sm bg-gradient-to-br from-yellow-300 to-yellow-500 opacity-80" />
                      </div>
                    </div>

                    {/* Package Name */}
                    <div className="mb-4">
                      <p className="mb-1 text-xs text-gray-400">
                        STRATEGY ACCESS LEVEL
                      </p>
                      <h3 className="text-xl font-semibold text-white">
                        {pkg.name}
                      </h3>
                    </div>

                    {/* Allocation */}
                    <div className="mb-6">
                      <p className="text-4xl font-bold tracking-tight text-white">
                        ${pkg.amount.toLocaleString()}
                      </p>
                      <p className="mt-1 text-sm text-gray-400">
                        Capital Allocation
                      </p>
                    </div>

                    {/* Bottom Row */}
                    <div className="flex items-center justify-between">
                      <div className="rounded-md bg-cyan-500/10 px-3 py-1">
                        <p className="text-xs font-medium text-cyan-300">
                          {pkg.accessLevel}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-1">
                        <div className="size-2 rounded-full bg-blue-400" />
                        <span className="text-xs text-blue-300">Arbitrum</span>
                      </div>
                    </div>
                  </div>

                  {/* Hover Line */}
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 transition-opacity group-hover:opacity-100" />
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
