import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import type { DefaultSession, NextAuthOptions } from "next-auth";
import { getServerSession as getNextAuthServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        const passwordHash = (user as any)?.passwordHash as string | undefined;
        
        if (!user || !passwordHash) {
          return null;
        }
        
        const isValid = await bcrypt.compare(credentials.password, passwordHash);
        
        if (!isValid) {
          return null;
        }
        
        return { id: user.id, email: user.email, name: user.name, role: user.role } as any;
      },
    }),
  ],
  callbacks: {
    async session({ session, user, token }) {
      if (session.user) {
        (session.user as any).id = (user as any)?.id ?? (token as any)?.id;
        (session.user as any).role = (user as any)?.role ?? (token as any)?.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        (token as any).id = (user as any).id;
        (token as any).role = (user as any).role;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
    verifyRequest: "/login/verify",
    error: "/login/error",
  },
  session: {
    strategy: "jwt",
  },
};

export async function getServerSession() {
  return await getNextAuthServerSession(authOptions);
}

export function isAdmin(session: { user: { role: Role } } | null): boolean {
  return session?.user?.role === Role.ADMIN;
}

export function isStaffOrAdmin(session: { user: { role: Role } } | null): boolean {
  return session?.user?.role === Role.STAFF || session?.user?.role === Role.ADMIN;
}
