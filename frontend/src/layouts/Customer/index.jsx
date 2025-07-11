import React from "react";
import HeroSection from "../Customer/Header/index";
import Footer from "../Customer/Footer/index";
import TrustSection from "../../layouts/Customer/TrustSection/TrustSection";

const CustomerLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-roboto">
      {/* Header */}
      <HeroSection />

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="container mx-auto px-6">
          {children}
        </div>
      </main>

      {/* Trust Section */}
      <TrustSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CustomerLayout;