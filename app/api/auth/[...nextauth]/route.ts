import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "email@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          }
        );

        if (!res.ok) {
          return null;
        }

        const loginData = await res.json();
        const token = loginData.token;

        if (!token) {
          return null;
        }

        return {
          id: loginData.email,
          email: loginData.email,
          token,
          type: loginData.type,
        } as User;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as User;
        token.accessToken = u.token;
        token.type = u.type;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.firstName = token.firstName;
      session.lastName = token.lastName;
      session.type = token.type;
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
