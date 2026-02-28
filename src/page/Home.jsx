import React from "react";
import Navbar from "../component/Navbar";
import { Hero } from "../component/Hero";
import ExecutiveSummary from "../component/ExecutiveSummary";
import TechnicalArchitecture from "../component/TechnicalArchitecture";
import CoreFeatures from "../component/CoreFeatures";
import SecurityAudit from "../component/SecurityAudit";
import Roadmap from "./Roadmap.jsx";
import Legal from "../component/Legal";
import Founders from "../component/Founder";
import Privacy from "../component/Privachy";
import FAQ from "../component/FAQ";
import Footer from "../component/Footer";
import { SecurityCompliance } from "../component/SecurityCompliance";
import { TradingAnalytics } from "../component/TradingAnalytics";
import { WhyChooseUs } from "../component/WhyChooseUs";
import { MemberBenefits } from "../component/MemberBenefits";
import { OurInvestors } from "../component/OurInvestors";

const Home = () => {
  return (
    <div className="relative z-10">
      <Navbar />
      <div id="home">
        <Hero />
      </div>
      <ExecutiveSummary />
      <SecurityCompliance />
      {/* <TradingAnalytics /> */}
      <WhyChooseUs />
      <MemberBenefits />
      <div id="architecture">
        <TechnicalArchitecture />
      </div>
      <div id="features">
        <CoreFeatures />
      </div>
      <div id="security">
        <SecurityAudit />
      </div>
      <div id="roadmap">
        <Roadmap />
      </div>
      <Legal />
      <div id="about">
        <Founders />
        <OurInvestors />
      </div>
      <Privacy />
      <div id="faq">
        <FAQ />
      </div>

      <Footer />
    </div>
  );
};

export default Home;
