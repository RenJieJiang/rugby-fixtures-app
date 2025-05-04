'use client';

import Link from "next/link";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function MobileNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="sm:hidden flex items-center p-2 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
        onClick={toggleMenu}
        aria-expanded={isMenuOpen}
        aria-controls="mobile-menu"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
        ) : (
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        )}
      </button>
            
      {/* Mobile Menu */}
      <div 
        id="mobile-menu" 
        className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden transition-all duration-300 ease-in-out absolute left-0 right-0 top-full bg-blue-900 z-10 shadow-lg`}
      >
        <div className="flex flex-col space-y-4 px-4 pt-2 pb-3">
          <Link 
            href="/" 
            className="hover:bg-blue-800 px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            href="/fixtures" 
            className="hover:bg-blue-800 px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Fixtures
          </Link>
          <Link 
            href="/upload" 
            className="hover:bg-blue-800 px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Upload Data
          </Link>
        </div>
      </div>
    </>
  );
}