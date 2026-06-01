import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  // Ensures NextAuth can sign/verify JWTs consistently.
  // For production, set NEXTAUTH_SECRET in environment variables.
  secret: process.env.NEXTAUTH_SECRET ?? "dev-secret-fallback",
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours
    // In production, ensure cookies are secure and SameSite=None for cross‑origin login flows
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
        try {
          if (!credentials?.username || !credentials?.password) {
            throw new Error("Credentials required");
          }

          const user = await prisma.user.findUnique({
            where: { username: credentials.username },
          });

          if (!user) {
            // Returning null signals authentication failure without throwing
            return null;
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          // Log error for debugging in production logs
          console.error("Auth authorize error:", error);
          return null;
        }
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
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};
