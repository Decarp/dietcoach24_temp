import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { CounterStoreProvider } from "@/providers/useStoreProvider";
import ClientWrapper from "@/components/ClientWrapper";
import { Toaster } from "react-hot-toast";
import "dotenv/config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DietCoach",
  description:
    "Analyze your patient's food shopping data and provide personalized recommendations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={inter.className + " h-full"}>
        <Header>
          <CounterStoreProvider>
            <ClientWrapper>
              {children}
              <Toaster position="bottom-center" />
            </ClientWrapper>
          </CounterStoreProvider>
        </Header>
      </body>
    </html>
  );
}
