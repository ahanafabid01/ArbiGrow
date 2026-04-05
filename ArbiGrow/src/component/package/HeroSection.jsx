import { Shield } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 py-16 sm:py-24">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 backdrop-blur-sm">
          <Shield className="size-4 text-cyan-300" />
          <span className="text-sm text-cyan-300">
            Smart Contract Secured Allocations
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl lg:text-6xl">
          Strategy Participation{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Tiers
          </span>
        </h1>

        {/* Subtext */}
        <p className="mx-auto mb-8 max-w-2xl text-base text-gray-300 sm:text-lg">
          Select your capital allocation tier to participate in automated AI-driven
          trading strategies on Arbitrum Layer-2. All allocations are non-custodial
          and secured by smart contracts.
        </p>
      </div>
    </section>
  );
}