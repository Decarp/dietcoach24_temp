import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

async function getUser(token: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/dietician/profile`,
    {
      method: "GET",
      headers: {
        Authentication: token,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch user profile");
  }

  const user = await res.json();
  return user;
}

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
        // Step 1: Log in the user and get the token
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

        // Step 3: Return a User object
        return {
          id: loginData.email, // Using email as a unique identifier (ID)
          email: loginData.email,
          token,
          type: loginData.type,
        } as User; // Cast to User type
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log("ROUTE jwt user:", user);
      if (user) {
        const u = user as User; // Explicitly cast user to your User type
        token.accessToken = u.token;
        token.type = u.type;
      }
      console.log("ROUTE jwt token:", token);
      return token;
    },
    async session({ session, token }) {
      console.log("ROUTE token:", token);
      session.accessToken = token.accessToken;
      session.firstName = token.firstName;
      session.lastName = token.lastName;
      session.type = token.type;
      console.log("ROUTE Session:", session);
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
