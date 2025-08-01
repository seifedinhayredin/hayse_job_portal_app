"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { User } from "lucide-react";

interface User {
  _id:string;
  firstname: string;
  middlename?: string;
  lastname: string;
  email: string;
  role: string;
  image_url?: string;
  createdAt:Date;
}

export const LoadAllRegisteredUser = () => {
  const [userData, setUserData] = useState<User[]>([]);
    const { data: session } = useSession();
  
    const loggedInUserId = session?.user?.id;

  const FetchAllUsers = async () => {
    try {
      const response = await axios.post("/api/users/loadAllUsers");
      setUserData(response.data.allUsers || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    FetchAllUsers();
  }, []);

    // ✅ Function to Start Chat
     const handleChat = async (applicantId: string) => {
       try {
         const res = await axios.post("/api/chat/conversations", {
           user1: loggedInUserId,
           user2: applicantId,
         });
   
         const conversation = res.data;
         window.location.href = `/chat/${conversation._id}`; // ✅ Redirect to chat page
       } catch (err) {
         console.error("Error starting chat:", err);
       }
     };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Registered Users</h1>

      {userData.length === 0 ? (
        <p className="text-center text-gray-500">No users found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {userData
          .filter((data) => data._id !== loggedInUserId)
          .map((data, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center hover:shadow-xl transition-shadow"
            >
              <div className="w-24 h-24 mb-3 relative rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {data.image_url ? (
                    <Image
                      src={data.image_url}
                      alt={`${data.firstname} ${data.lastname}`}
                      fill
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <User className="text-gray-400" size={50} />
                  )}
              </div>

              <h2 className="text-lg font-semibold text-gray-800">
                {data.firstname} {data.middlename} {data.lastname}
              </h2>

              <p className="text-gray-500 text-sm">{data.email}</p>

              <p className="text-sm text-gray-800">
                Joined since {new Date(data.createdAt).toLocaleDateString()}
              </p>
              <span className="mt-2 px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700 font-medium">
                {data.role}
              </span>

            {/* ✅ Chat Button */}
                     <button
                    onClick={() => handleChat(data._id)}
                    className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 hover:border-gray-400 transition shadow-sm text-sm sm:text-base"
                  >
                    💬 Chat
                  </button>


              
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
