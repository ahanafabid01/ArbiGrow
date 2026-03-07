import { motion } from "motion/react";
import {
  Shield,
  Lock,
  FileCheck,
  Award,
  Database,
  CloudCog,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function SecurityCompliance() {
  const certifications = [
    { icon: Lock, label: "256-bit SSL", sublabel: "Encrypted" },
    { icon: FileCheck, label: "PCI DSS", sublabel: "Compliant" },
    { icon: Shield, label: "GDPR", sublabel: "Protected" },
    { icon: Award, label: "SOC 2 Enabled", sublabel: "Secure Login" },
    { icon: CloudCog, label: "Cold Storage", sublabel: "95% Offline" },
    { icon: Database, label: "Insured", sublabel: "Up to $250k" },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen]);

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-blue-500/3 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-cyan-500/3 rounded-full blur-3xl"></div>
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
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400 font-semibold mb-4">
            Trusted & Certified
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Industry-Leading{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Security & Compliance
            </span>
          </h2>
        </motion.div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 mb-12">
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative p-6 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-cyan-500/30 transition-all duration-500 text-center"
            >
              {/* Glow effect */}
              <div className="absolute -inset-[1px] bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/20 group-hover:to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <cert.icon className="w-8 h-8 text-cyan-400" />
                </div>

                {/* Labels */}
                <div>
                  <h3 className="font-bold text-white mb-1">{cert.label}</h3>
                  <p className="text-xs text-gray-400">{cert.sublabel}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* License Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-l-4 border-cyan-500"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-3">
                Licensed & Regulated Financial Institution
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-2">
                Nevada operates under strict regulatory oversight by the
                Financial Conduct Authority (FCA) with registration number{" "}
                <span className="text-cyan-400 font-semibold">
                  NFK-2818-7814
                </span>
                .
              </p>
              <p className="text-gray-400 text-xs">
                ✓ AML/KYC Compliant | ✓ Regular Audits | ✓ Segregated Client
                Accounts | ✓ Transparent Operations
              </p>
            </div>
            <div>
              <button
                onClick={() => setIsOpen(true)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-105"
              >
                View Certificate
              </button>
            </div>
          </div>
        </motion.div>

        {/* Location Badge */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex items-center gap-2 mt-6 text-sm text-gray-400"
        >
          <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
            <span className="text-xs">🇺🇸</span>
          </div>
          <span>Elena Green from United States</span>
        </motion.div> */}
      </div>
      {/* // pop up modal */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-auto max-w-[90vw] bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl"
          >
            {/* Glow Border */}
            <div className="absolute -inset-[1px] bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-40"></div>

            <div className="relative">
              {/* Certificate Container */}
              <div className="flex justify-center items-center max-h-[80vh] overflow-auto">
                <img
                  src="/certificate-with-sign.jpeg"
                  alt="Certificate"
                  className="max-h-[80vh] w-auto object-contain rounded-xl shadow-2xl"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
