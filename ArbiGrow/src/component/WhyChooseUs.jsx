import { motion } from 'motion/react';
import { Shield, Smartphone, Headphones, Zap } from 'lucide-react';

export function WhyChooseUs() {
  const features = [
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Our system is fully protected with bank-grade encryption and multi-layer security protocols.',
    },
    {
      icon: Smartphone,
      title: 'Easy Interface',
      description: 'Anyone can use it effortlessly with our intuitive design and user-friendly navigation.',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'We are always here to assist you with dedicated support team available around the clock.',
    },
    {
      icon: Zap,
      title: 'Fast Transactions',
      description: 'Instant deposit and smooth withdrawal with lightning-fast processing times.',
    },
  ];

  return (
    <section className="relative py-24 px-2 sm:px-4 lg:px-6 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-cyan-500/3 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-blue-500/3 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Why{' '}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Choose Us?
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Experience the perfect blend of security, simplicity, and performance
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
  {features.map((feature, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative"
    >
      {/* Glass card */}
      <div className="relative h-full p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-cyan-500/30 transition-all duration-500 hover:-translate-y-2">

        <div className="relative flex flex-col items-center text-center md:items-start md:text-left">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 mb-6 group-hover:scale-110 transition-transform duration-300">
            <feature.icon className="w-8 h-8 text-cyan-400" />
          </div>

          {/* Content */}
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
            {feature.title}
          </h3>
          <p className="text-gray-400 leading-relaxed text-sm">
            {feature.description}
          </p>

          {/* Decorative element */}
          <div className="mt-6 h-1 w-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full group-hover:w-20 transition-all duration-300"></div>
        </div>

      </div>
    </motion.div>
  ))}
</div>
      </div>
    </section>
  );
}
