import { useState } from "react";

import { tierGroups } from "./components/data/strategyData";

import Navbar from "../../component/Navbar";
import Footer from "../../component/Footer";
import TierSection from "./components/TierSection";
import ComplianceSection from "./components/ComplianceSection";
import PackageModal from "./components/PackageModal";
import HeroSection from "./components/HeroSection";

export default function StrategyTiersPage() {
  const [selectedPackage, setSelectedPackage] = useState(null);

  return (
    <div className="min-h-screen bg-[#0a0e27]">
      <Navbar />
      <main className="pt-20 px-6 max-w-7xl mx-auto">
        <HeroSection />
        
        {/* Pass the entire tierGroups array once, not mapping */}
        <TierSection 
          tierGroups={tierGroups} 
          onSelect={setSelectedPackage} 
        />

        <ComplianceSection />
      </main>
      <Footer />
      <PackageModal
        selectedPackage={selectedPackage}
        setSelectedPackage={setSelectedPackage} 
      />
    </div>
  );
}