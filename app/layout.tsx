// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { CounterStoreProvider } from "@/providers/useStoreProvider";
import ClientWrapper from "@/components/ClientWrapper";
import { Toaster } from "react-hot-toast";
import Provider from "@/utils/Providers";
import "dotenv/config";
import { getServerSession } from "next-auth";
import SessionProvider from "@/providers/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DietCoach",
  description:
    "Analyze your patient's food shopping data and provide personalized recommendations.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <html lang="en" className="h-full">
      <body className={inter.className + " h-full"}>
        <SessionProvider session={session}>
          <Provider>
            <CounterStoreProvider>
              <ClientWrapper>
                <Header>{children}</Header>
                <Toaster position="bottom-center" />
              </ClientWrapper>
            </CounterStoreProvider>
          </Provider>
        </SessionProvider>
      </body>
    </html>
  );
}
