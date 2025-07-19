'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react'; // icons for hamburger and close (optional)
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Image from 'next/image';

type UserImage = {
  image_url?: string;
};
const capitalize = (str?: string | null) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};


export const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const pathname = usePathname();
  const {data:session} = useSession();
  const[image,setImage] = useState<UserImage>({});


        const hideSignOut = pathname === "/login" || pathname === "/register" || pathname === "/";
        const hideSessionName = pathname === "/login" || pathname === "/register" || pathname === "/";

      const displayImage = async() => {
        try {
        const res = await axios.post('api/display-image');
        setImage(res.data.fetchedImage);
        } catch (error) {
          console.log("Error while displaying Images. ",error)
          
        }
        
      }

      useEffect(() =>{
      displayImage();
      },[]);
     
   console.log("Fetched Image URL: ",image);
   
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
          
          {!hideSignOut ? (
            <li>
              <button
                onClick={() => signOut()}
                className="text-red-500 hover:text-red-700"
              >
                Sign Out
              </button>
            </li>
            )
            :
            <li><Link href="/login"><span className="hover:text-blue-600">Login</span></Link></li>
          
            }
           {!hideSessionName && session?.user && (
  <li>
    <div className="flex items-center gap-3">
      {/* Profile Image or Initial */}
      {image?.image_url?.trim() ? (
        <Image
          src={image.image_url}
          alt="User image"
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white text-sm font-semibold">
          {session.user.firstname?.charAt(0).toUpperCase() || 'U'}
        </div>
      )}

      {/* Name and Upload Link */}
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-800">
          {capitalize(session.user.firstname)} {capitalize(session.user.lastname)}
        </span>

        {!hideSignOut && !image?.image_url?.trim() && (
          <Link href="/upload-profile-picture">
            <span className="text-xs text-blue-600 hover:underline">Upload Photo</span>
          </Link>
        )}
      </div>
    </div>
  </li>
)}

          
        </ul>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-700" onClick={toggleMenu}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <ul className="md:hidden mt-4 space-y-4 text-gray-700 font-medium text-center">
          <li><Link href="/" onClick={toggleMenu}><span className="hover:text-blue-600">Home</span></Link></li>
          <li><Link href="/analytics" onClick={toggleMenu}><span className="hover:text-blue-600">Analytics</span></Link></li>
          <li><Link href="/jobboard" onClick={toggleMenu}><span className="hover:text-blue-600">Jobs</span></Link></li>
          <li><Link href="/registerjob" onClick={toggleMenu}><span className="hover:text-blue-600">Companies</span></Link></li>
           {!hideSignOut ? (
            <li>
              <button
                onClick={() => signOut()}
                className="text-red-500 hover:text-red-700"
              >
                Sign Out
              </button>
            </li>
          )
          :
          <li><Link href="/login" onClick={toggleMenu}><span className="hover:text-blue-600">Login</span> </Link></li>
         }

          {
              !hideSessionName && (
                <li>
                  <div>
                    {`${capitalize(session?.user?.firstname)} ${capitalize(session?.user?.lastname)}`}
                  </div>
                </li>
              )
            }
        </ul>
      )}
    </nav>
  );
};
