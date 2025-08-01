import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { AuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { JWT } from "next-auth/jwt";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password: string };

        await connectDB();
        const user = await User.findOne({ email });
        if (!user) return null;

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          firstname: user.firstname,
          lastname: user.lastname,
          role: user.role,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.id = user.id;
        token.firstname = user.firstname;
        token.lastname = user.lastname;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.firstname = token.firstname as string;
        session.user.lastname = token.lastname as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};
