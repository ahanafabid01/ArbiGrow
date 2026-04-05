import { motion } from 'motion/react';
import { useInView } from 'react-intersection-observer';
import { ShieldCheck, FileCheck, AlertTriangle, StopCircle } from 'lucide-react';

export default function SecurityAudit() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const securityFeatures = [
    {
      icon: ShieldCheck,
      title: 'Smart Contract Audit',
      description: 'Comprehensive third-party security audits by leading blockchain security firms',
      status: 'Verified'
    },
    {
      icon: AlertTriangle,
      title: 'Anti-Liquidation Mechanism',
      description: 'Intelligent position management to prevent forced liquidations during volatility',
      status: 'Active'
    },
    {
      icon: FileCheck,
      title: 'Risk Hedging System',
      description: 'Automated portfolio balancing and dynamic hedging strategies',
      status: 'Operational'
    },
    {
      icon: StopCircle,
      title: 'Stop-Loss Automation',
      description: 'Configurable risk parameters with automatic position closure protocols',
      status: 'Enabled'
    }
  ];

  return (
    <section ref={ref} className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 mb-6">
            <span className="text-sm font-semibold text-green-400 uppercase tracking-wider">Security & Audit</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Institutional-Grade</span> Security Standards
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Multi-layered security architecture designed to protect user assets and ensure platform integrity
          </p>
        </motion.div>

        {/* Main Security Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative p-10 rounded-3xl bg-gradient-to-br from-green-900/20 to-blue-900/20 backdrop-blur-xl border border-green-500/30 mb-12"
        >
          {/* Animated shield background */}
          <div className="absolute top-10 right-10 w-64 h-64 opacity-5">
            <ShieldCheck className="w-full h-full" />
          </div>

          <div className="relative z-10 grid md:grid-cols-2 gap-8">
            {securityFeatures.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + idx * 0.1 }}
                className="flex md:flex-row flex-col md:items-start items-center gap-4 p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-green-500/20 border border-green-500/40 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-green-400" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex md:flex-row flex-col md:items-center items-center justify-between mb-2 md:gap-0 gap-2">
                    <h3 className="font-bold text-white">{feature.title}</h3>
                    <span className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                      {feature.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Security Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid md:grid-cols-3 gap-6"
        >
          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-center">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-2">100%</div>
            <div className="text-sm text-gray-400">Non-Custodial Architecture</div>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-center">
            <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center mx-auto mb-4">
              <FileCheck className="w-8 h-8 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-2">Audited</div>
            <div className="text-sm text-gray-400">Third-Party Verified</div>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-2">Real-time</div>
            <div className="text-sm text-gray-400">Risk Monitoring</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
