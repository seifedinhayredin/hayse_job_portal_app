import React from 'react'
import Link from 'next/link'


export const NavBar = () => {
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
      {/* Logo or Image Placeholder */}
      <h2 className="text-2xl font-bold text-blue-600">Hayse Job</h2>

      {/* Navigation Links */}
      <ul className="flex space-x-6 text-gray-700 font-medium">
        <li>
          <Link href="/"><span className="hover:text-blue-600">Home</span></Link>
        </li>
        <li>
          <Link href="/about"><span className="hover:text-blue-600">Communities</span></Link>
        </li>
        <li>
          <Link href="/jobboard"><span className="hover:text-blue-600">Jobs</span></Link>
        </li>
        <li>
          <Link href="/registerjob"><span className="hover:text-blue-600">Companies</span></Link>
        </li>

        <li>
          <Link href="/register"><span className="hover:text-blue-600">Register</span></Link>
        </li>

        <li>
          <Link href="/login"><span className="hover:text-blue-600">Login</span></Link>
        </li>
      </ul>
    </nav>
  );
};

