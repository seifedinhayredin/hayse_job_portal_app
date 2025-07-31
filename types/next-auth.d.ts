import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string; // ✅ add this
      firstname: string; // ✅ add this
      lastname: string; // ✅ add this
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    role: string;
    firstname: string;
    lastname: string;
  }
}
