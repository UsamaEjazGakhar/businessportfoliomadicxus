import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Ensure NEXTAUTH_URL is set for Vercel deployments
if (!process.env.NEXTAUTH_URL) {
  if (process.env.VERCEL_URL) {
    process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
  } else {
    // Fallback to the custom production domain
    process.env.NEXTAUTH_URL = "https://businessportfoliomadicxus-2pfm.vercel.app";
  }
}

export const authOptions: NextAuthOptions = {
  // Secret for JWT signing
  secret: process.env.NEXTAUTH_SECRET || "d8f4a1c9e7b23f6a4d8c1e5f9b7a2c4d6e8f1a3b5c7d9e2f4a6b8c1d3e5f7a9",
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours
    ...(process.env.NODE_ENV === "production" && {
      cookie: {
        secure: true,
        sameSite: "none",
      },
    }),
  },
  providers: [
    CredentialsProvider({
      name: "Medicxus Control Portal",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }
        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });
        if (!user) return null;
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;
        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        // Cast role to any to satisfy TypeScript's Role enum requirement
        session.user.role = token.role as any;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};
