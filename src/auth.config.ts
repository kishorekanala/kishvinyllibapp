import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authConfig: any = {
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Dynamically import Prisma to avoid circular dependencies
          const { PrismaClient } = await import("@prisma/client");
          const prisma = new PrismaClient();

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            await prisma.$disconnect();
            return null;
          }

          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );

          await prisma.$disconnect();

          if (!passwordMatch) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};
