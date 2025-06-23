'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react'; // icons for hamburger and close (optional)

export const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-white shadow-md px-6 py-4">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <h2 className="text-2xl font-bold text-blue-600">Hayse Job</h2>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <li><Link href="/"><span className="hover:text-blue-600">Home</span></Link></li>
          <li><Link href="/analytics"><span className="hover:text-blue-600">Analytics</span></Link></li>
          <li><Link href="/jobboard"><span className="hover:text-blue-600">Jobs</span></Link></li>
          <li><Link href="/registerjob"><span className="hover:text-blue-600">Companies</span></Link></li>
          <li><Link href="/register"><span className="hover:text-blue-600">Register</span></Link></li>
          <li><Link href="/login"><span className="hover:text-blue-600">Login</span></Link></li>
        </ul>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-700" onClick={toggleMenu}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <ul className="md:hidden mt-4 space-y-4 text-gray-700 font-medium text-center">
          <li><Link href="/" onClick={toggleMenu}>Home</Link></li>
          <li><Link href="/analytics" onClick={toggleMenu}>Analytics</Link></li>
          <li><Link href="/jobboard" onClick={toggleMenu}>Jobs</Link></li>
          <li><Link href="/registerjob" onClick={toggleMenu}>Companies</Link></li>
          <li><Link href="/register" onClick={toggleMenu}>Register</Link></li>
          <li><Link href="/login" onClick={toggleMenu}>Login</Link></li>
        </ul>
      )}
    </nav>
  );
};
