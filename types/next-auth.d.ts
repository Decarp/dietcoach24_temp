// next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    token: string;
    firstName: string;
    lastName: string;
    type: string;
  }

  interface Session {
    accessToken?: string;
    firstName?: string;
    lastName?: string;
    type?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    firstName?: string;
    lastName?: string;
    type?: string;
  }
}
