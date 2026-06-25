import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { ApprovalStatus } from "@prisma/client";

// Ensure NEXTAUTH_URL is set for Vercel deployments
// NEXTAUTH_URL will be supplied via Vercel environment variables.
// No hard‑coded fallback is needed.

export const authOptions: NextAuthOptions = {
  // Secret for JWT signing
  secret: process.env.NEXTAUTH_SECRET,
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
        if (user.isDeleted) return null;
        if (user.approvalStatus === ApprovalStatus.PENDING || user.approvalStatus === ApprovalStatus.RESTRICTED) {
          return null;
        }
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;
        return { id: user.id, email: user.email, name: user.name, role: user.role, approvalStatus: user.approvalStatus };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.approvalStatus = (user as any).approvalStatus;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        // Cast role to any to satisfy TypeScript's Role enum requirement
        session.user.role = token.role as any;
        (session.user as any).approvalStatus = token.approvalStatus;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};
