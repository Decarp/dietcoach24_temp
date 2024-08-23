"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      // Redirect to /patients if the user is authenticated
      router.push("/patients");
    }
  }, [status, router]);

  if (status === "loading") {
    // Optionally, show a loading spinner or nothing while the session is loading
    return <p>Loading...</p>;
  }

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white h-screen -m-8 p-8 border-x border-b border-gray-300 h-[calc(100vh-68px)]">
        <h1 className="text-2xl font-semibold mb-6">Willkommen</h1>
        <hr className="border-gray-300 -mx-8" />
        <br />
        <button
          className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary hover:bg-green-800"
          onClick={() => signIn()}
        >
          Sign in
        </button>
      </div>
    </main>
  );
}
