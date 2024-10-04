"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Button from "@/components/Button";
import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/solid";
import { Spinner } from "@/components/Spinner";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false, // Set redirect to false to capture the response
      });

      setLoading(false);

      console.log("login result", result);

      if (result?.error) {
        // Check for specific error types or messages
        if (result.status === 401) {
          toast.error("Email oder Passwort falsch");
        } else if (result.status === 400) {
          toast.error("Nutzer nicht bekannt oder anderer Fehler");
        } else {
          toast.error(result.error); // General error message for other errors
        }
      } else if (result?.ok) {
        toast.success("Login erfolgreich");
        setTimeout(() => {
          router.push("/patients"); // Redirect to your desired page after login
        }, 500);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
      console.error("Login error", error);
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
          <Button
            onClick={() => {}}
            loading={loading}
            icon={<ArrowRightEndOnRectangleIcon className="h-5 w-5" />}
            loadingIcon={<Spinner className="h-5 w-5" />}
          >
            Einloggen
          </Button>
        </form>
      </div>
    </main>
  );
}
