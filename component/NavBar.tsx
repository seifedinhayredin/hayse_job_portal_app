"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import io from "socket.io-client";

type UserImage = { image_url?: string };

const capitalize = (str?: string | null) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

export const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [image, setImage] = useState<UserImage>({});
  const [unseenCount, setUnseenCount] = useState(0);

  const { data: session } = useSession();
  const pathname = usePathname();
  const role = session?.user?.role; // ✅ Use role directly from session

  const hideAuthOptions =
    pathname === "/" || pathname === "/login" || pathname === "/register";

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  // ✅ Fetch user profile image
  useEffect(() => {
    axios
      .post("/api/display-image")
      .then((res) => setImage(res.data.fetchedImage))
      .catch((err) => console.error("Error loading profile image:", err));
  }, []);

 useEffect(() => {
  if (!session?.user?.id) return;

  axios
    .get(`/api/chat/unseen-count?userId=${session.user.id}`)
    .then((res) => setUnseenCount(res.data.count))
    .catch((err) => console.error("Error fetching unseen messages:", err));

  const socket = io({ path: "/api/chat/socket" });

  socket.on("newMessage", (msg) => {
    if (msg.senderId !== session.user.id) {
      setUnseenCount((prev) => prev + 1);
    }
  });

  return () => {
    socket.disconnect(); // ✅ now cleanup returns void
  };
}, [session?.user?.id]);

  // ✅ Reset unseen count when visiting /chat
  useEffect(() => {
    if (pathname === "/chat") {
      setUnseenCount(0);
    }
  }, [pathname]);

  const NavLinks = [
    { href: "/", label: "Home" },
    //{href:"/displayAllUsers",label:"Users"},
    { href: "/analytics", label: "Analytics" },
    { href: "/jobboard", label: "Jobs" },
    //{ href: "/registerjob", label: "Post Jobs" },
  ];

  return (
    <nav className="bg-white shadow-md px-6 py-4">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-blue-600">HeyJobs</h2>

        {/* ✅ Desktop Menu */}
        <ul className="hidden md:flex space-x-6 text-gray-700 font-medium">
          {NavLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:text-blue-600">
                {link.label}
              </Link>
            </li>
          ))}

      {!hideAuthOptions && (
        <ul className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <li>
              <Link href="/displayAllUsers" className="hover:text-blue-600">
                Users
              </Link>
            </li>
        </ul>
      )}
          {/* ✅ Role-based links */}
         {!hideAuthOptions && role === "client" && (
            <li className="relative group">
              <button className="hover:text-blue-600">Jobs Actions▾</button>
              <ul className="absolute hidden group-hover:block bg-white shadow-md rounded-md mt-2 w-40 text-left">
                <li>
                  <Link href="/registerjob" className="block px-4 py-2 hover:bg-gray-100">
                    Post Jobs
                  </Link>
                </li>
                <li>
                  <Link href="/showApplicants" className="block px-4 py-2 hover:bg-gray-100">
                    Show Applicants
                  </Link>
                </li>
                <li>
                  <Link href="/yourPostedJobs" className="block px-4 py-2 hover:bg-gray-100">
                    Your Posted Jobs
                  </Link>
                </li>
                <li>
                  <Link href="/addQuize" className="block px-4 py-2 hover:bg-gray-100">
                    Add Quize                  
                    </Link>
                </li>
              </ul>
            </li>
          )}


          {!hideAuthOptions && role === "user" && (
            <li>
              <Link href="/showYourAppliedJobs" className="hover:text-blue-600">
                Applied Jobs
              </Link>
            </li>
          )}

          {!hideAuthOptions && role === "user" && (
            <li>
              <Link href="/quiz_questions" className="hover:text-blue-600">
                Take Quize
              </Link>
            </li>
          )}

          {/* ✅ Chat Button */}
         {session?.user?.id && (
  <li className="relative">
    <Link
      href="/chat"
      className="flex items-center gap-2 px-2  rounded-md hover:bg-gray-100 transition"
    >
      <span className="text-lg">💬</span>
      <span className="hidden sm:inline font-medium">Chat</span>

      {unseenCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow">
          {unseenCount}
        </span>
      )}
    </Link>
  </li>
)}



          {!hideAuthOptions ? (
            <li>
              <button
                onClick={() => signOut()}
                className="text-red-500 hover:text-red-700"
              >
                Sign Out
              </button>
            </li>
          ) : (
            <li>
              <Link href="/login" className="hover:text-blue-600">
                Login
              </Link>
            </li>
          )}

          {!hideAuthOptions && session?.user && (
            <li>
              <div className="flex items-center gap-3">
                {image?.image_url ? (
                  <Image
                    src={image.image_url}
                    alt="User"
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white text-sm font-semibold">
                    {session.user.firstname?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-800">
                    {capitalize(session.user.firstname)}{" "}
                    {capitalize(session.user.lastname)}
                  </span>
                  {!image?.image_url && (
                    <Link href="/upload-profile-picture">
                      <span className="text-xs text-blue-600 hover:underline">
                        Upload Photo
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            </li>
          )}
        </ul>

        {/* ✅ Mobile Menu Button */}
        <button className="md:hidden text-gray-700" onClick={toggleMenu}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* ✅ Mobile Dropdown */}
      {menuOpen && (
        <ul className="md:hidden mt-4 space-y-4 text-gray-700 font-medium text-center">
          {NavLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={toggleMenu}
                className="hover:text-blue-600"
              >
                {link.label}
              </Link>
            </li>
          ))}

           {!hideAuthOptions && (
            <li>
              <Link
                href="/displayAllUsers"
                onClick={toggleMenu}
                className="hover:text-blue-600"
              >
                Users
              </Link>
            </li>
          )}

          {/* ✅ Role-based buttons in Mobile Menu */}
         {!hideAuthOptions && role === "client" && (
              <li>
                <details className="cursor-pointer">
                  <summary className="hover:text-blue-600">Jobs Actions▾</summary>
                  <ul className="pl-4 space-y-2 mt-1">
                    <li>
                      <Link href="/registerjob" onClick={toggleMenu} className="hover:text-blue-600">
                        Post Jobs
                      </Link>
                    </li>
                    <li>
                      <Link href="/showApplicants" onClick={toggleMenu} className="hover:text-blue-600">
                        Show Applicants
                      </Link>
                    </li>
                    <li>
                      <Link href="/yourPostedJobs" onClick={toggleMenu} className="hover:text-blue-600">
                        Your Jobs
                      </Link>
                    </li>
                    <li>
                      <Link href="/addQuize" onClick={toggleMenu} className="hover:text-blue-600">
                        Add Quize
                      </Link>
                    </li>
                  </ul>
                </details>
              </li>
            )}


          {!hideAuthOptions && role === "user" && (
            <li>
              <Link
                href="/showYourAppliedJobs"
                onClick={toggleMenu}
                className="hover:text-blue-600"
              >
                Show Your Applications
              </Link>
            </li>
          )}

          {session?.user?.id && (
  <li className="relative">
    <Link
      href="/chat"
      onClick={toggleMenu}
      className=" rounded-md hover:bg-gray-100 transition"
    >
      <span className="text-lg">💬</span>
      <span className="font-medium">Chat</span>

      {unseenCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow">
          {unseenCount}
        </span>
      )}
    </Link>
  </li>
)}


          {!hideAuthOptions ? (
            <li>
              <button
                onClick={() => signOut()}
                className="text-red-500 hover:text-red-700"
              >
                Sign Out
              </button>
            </li>
          ) : (
            <li>
              <Link
                href="/login"
                onClick={toggleMenu}
                className="hover:text-blue-600"
              >
                Login
              </Link>
            </li>
          )}

          {!hideAuthOptions && session?.user && (
            <li>
              <div className="flex flex-col items-center gap-2">
                {image?.image_url ? (
                  <Image
                    src={image.image_url}
                    alt="User"
                    width={40}
                    height={40}
                    className="rounded-full object-cover w-10 h-10"
                  />
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white text-sm font-semibold">
                    {session.user.firstname?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <div className="text-center">
                  <span className="text-sm font-medium text-gray-800 block">
                    {capitalize(session.user.firstname)}{" "}
                    {capitalize(session.user.lastname)}
                  </span>
                  {!image?.image_url && (
                    <Link href="/upload-profile-picture">
                      <span className="text-xs text-blue-600 hover:underline">
                        Upload Photo
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            </li>
          )}
        </ul>
      )}
    </nav>
  );
};
