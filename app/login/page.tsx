"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/patients",
    });

    setLoading(false);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Login erfolgreich");
      setTimeout(() => {
        router.push("/patients"); // Redirect to your desired page after login
      }, 500);
    }
  };

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white h-screen -m-8 p-8 border-x border-b border-gray-300 h-[calc(100vh-68px)]">
        <h1 className="text-2xl font-semibold mb-6">Login</h1>
        <hr className="border-gray-300 -mx-8" />
        <br />
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Passwort
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary hover:bg-green-800"
          >
            {loading ? "Einloggen..." : "Einloggen"}
          </button>
        </form>
      </div>
    </main>
  );
}
