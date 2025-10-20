import type { NextAuthOptions } from "next-auth";

// Minimal, edge-safe config for middleware. No providers/adapters here.
const authConfig: Partial<NextAuthOptions> = {
  pages: {
    signIn: "/login",
    verifyRequest: "/login/verify",
    error: "/login/error",
  },
  session: {
    strategy: "database",
  },
  callbacks: {
    async jwt({ token }) {
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // Pass through custom fields if present on the token
        session.user.id = token?.id as any;
        session.user.role = token?.role as any;
      }
      return session;
    },
  },
};

export default authConfig;


