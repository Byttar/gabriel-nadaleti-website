import React from "react";

const Footer: React.FC = () => (
  <footer className="w-full flex justify-between text-center py-4 border-t border-stone-800 mt-12">
    <p className="text-stone-500 text-xs">
      © {new Date().getFullYear()} Gabriel Nadaleti
    </p>
    <div className="flex items-center gap-2">
      <span className="text-xs text-stone-500">online</span> <span className="text-primary animate-pulse">•</span>
    </div>
  </footer>
);

export default Footer;
