"use client";
import Image from "next/image";
import {
  UsersIcon,
  BriefcaseIcon,
  SearchIcon,
  DollarSignIcon,
} from "lucide-react";
import { useState } from "react";
import Footer from "@/component/Footer";
import { ImageUploadForm } from "@/component/ImageUploadForm";



const hoverMessages: Record<string, string> = {
    join: "Discover a space where professionals like you come together to share experiences, advice, and opportunities. By joining your work community, you gain access to real conversations about industries, roles, and companies. It's a chance to connect with others on the same path and build valuable relationships. Whether you're just starting out or climbing the ladder, having a supportive network can make all the difference. Stay updated, stay inspired, and grow with your tribe.",
    apply: "Access a wide range of job listings tailored to your skills, interests, and location. From entry-level positions to executive roles, HayseJob makes it easy to find opportunities that match your career goals. You can filter, save, and apply to jobs seamlessly with just a few clicks. With built-in resume tools and smart job suggestions, your path to employment is smoother than ever. Start applying today and take the next step in your professional journey.",
    search: "Learn what it’s really like to work at a company—before you even apply. Our community-powered reviews offer honest insights into company culture, leadership, work-life balance, and salary expectations. Whether you're considering a startup or a large enterprise, transparent feedback helps you make informed decisions. Browse detailed reviews, ratings, and employee testimonials to find the workplace that aligns with your values and goals.",
    compare: "Know your worth in today’s job market by comparing salaries across roles, companies, and locations. HayseJob’s salary comparison tool is designed to give you a clear view of compensation trends based on real employee data. Find out how your current pay stacks up, what to expect when switching jobs, and how to negotiate with confidence. Make smarter financial decisions by having the right salary insights at your fingertips.",
  };

export default function Home() {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  return (
    <>
      <main className="bg-gradient-to-br from-blue-50 to-white px-4 py-8 flex flex-col items-center justify-center text-center">
        {/* Heading */}
        <div className="mb-8 max-w-3xl">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-700 mb-4">
            Hey, Get started with Hayse Jobs
          </h2>
          <p className="text-md sm:text-lg md:text-xl text-gray-700">
            Your gateway to better opportunities and brighter careers. Smart job discovery, personalized for your career journey.
          </p>
        </div>

        {/* Feature Buttons */}
        <div className="w-full max-w-5xl">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                id: "join",
                icon: UsersIcon,
                label: "Join your work community",
                bg: "bg-blue-500",
                hover: "hover:bg-blue-600",
              },
              {
                id: "apply",
                icon: BriefcaseIcon,
                label: "Find and apply to jobs",
                bg: "bg-green-500",
                hover: "hover:bg-green-600",
              },
              {
                id: "search",
                icon: SearchIcon,
                label: "Search company reviews",
                bg: "bg-yellow-500",
                hover: "hover:bg-yellow-600",
              },
              {
                id: "compare",
                icon: DollarSignIcon,
                label: "Compare salaries",
                bg: "bg-purple-500",
                hover: "hover:bg-purple-600",
              },
            ].map(({ id, icon: Icon, label, bg, hover }) => (
              <li key={id}>
                <button
                  onMouseEnter={() => setHoveredButton(id)}
                  onMouseLeave={() => setHoveredButton(null)}
                  className={`flex flex-col items-center space-y-2 text-white ${bg} ${hover} px-4 py-5 rounded-xl shadow-md transition text-sm sm:text-base`}
                >
                  <Icon className="w-8 h-8" />
                  <span className="font-medium text-center">{label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Description Box */}
        {hoveredButton && (
          <div className="mt-6 w-full max-w-3xl bg-white text-gray-800 px-6 py-4 rounded-xl shadow-lg border border-gray-200 text-left transition-all duration-300">
            <p className="text-sm sm:text-base leading-relaxed">
              {hoverMessages[hoveredButton]}
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <div className="bg-gradient-to-br from-blue-50 to-white px-4 mt-20">
        <Footer />

    
      </div>
      <ImageUploadForm />
    </>
  );
}
