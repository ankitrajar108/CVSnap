import React from "react";
import dynamic from "next/dynamic";
import Logo from "@/components/Logo";

const FooterList = dynamic(() => import("./FooterList"), { ssr: false });

const FooterLogo: React.FC = () => (
  <div className="flex items-center gap-3">
    <Logo className="w-8 h-8 text-white" />
    <span className="font-sans font-bold tracking-wider text-white text-2xl uppercase">
      CVSNAP
    </span>
  </div>
);

const FooterContent: React.FC = () => (
  <div className="text-center md:text-left mt-6">
    <p className="text-gray-300 text-base leading-relaxed max-w-sm">
      AI-powered headshots, turning your selfies into professional studio-quality photos in minutes.
    </p>
    <div className="flex flex-col sm:flex-row items-center md:items-start gap-4 mt-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-gray-400 text-sm">AI Powered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          <span className="text-gray-400 text-sm">Studio Quality</span>
        </div>
      </div>
    </div>
  </div>
);

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  return (
    <footer className={`bg-gradient-to-b from-gray-900 to-black text-white pt-20 pb-10 ${className}`}>
      <div className="container mx-auto max-w-section px-section">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1 flex flex-col items-center lg:items-start">
            <FooterLogo />
            <FooterContent />
          </div>
          
          {/* Links Section */}
          <div className="lg:col-span-2 flex justify-center lg:justify-end">
            <FooterList />
          </div>
        </div>
        
        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 CVSNAP. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-gray-500 text-xs">Made with ❤️</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-gray-500 text-xs">AI Service Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
