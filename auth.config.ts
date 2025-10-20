import type { NextAuthConfig } from "next-auth";

// Minimal, edge-safe config for middleware. No providers/adapters here.
const authConfig: NextAuthConfig = {
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
        // @ts-expect-error custom props may be present on token
        session.user.id = token?.id as any;
        // @ts-expect-error custom props may be present on token
        session.user.role = token?.role as any;
      }
      return session;
    },
  },
};

export default authConfig;


