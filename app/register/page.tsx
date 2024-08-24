"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if the invite code is "Bern"
    if (inviteCode !== "Bern") {
      toast.error("Falscher Einladungscode. Bitte versuchen Sie es erneut.");
      return;
    }

    try {
      const response = await fetch(
        "https://diet-coach.interactions.ics.unisg.ch/temp//dietcoach/backend/dietician/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            firstName,
            lastName,
          }),
        }
      );

      if (response.ok) {
        // Registration successful, show success toast and redirect to sign-in page
        toast.success("Registrierung erfolgreich.");
        setTimeout(() => {
          router.push("/api/auth/signin");
        }, 500); // Delay to allow users to see the toast
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Registrierung fehlgeschlagen.");
      }
    } catch (error) {
      toast.error("Ein Error ist aufgetreten. Bitte versuchen Sie es erneut.");
    }
  };

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white h-screen -m-8 p-8 border-x border-b border-gray-300 h-[calc(100vh-68px)]">
        <h1 className="text-2xl font-semibold mb-6">Registrierung</h1>
        <hr className="border-gray-300 -mx-8" />
        <br />
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              Vorname
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700"
            >
              Nachname
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              required
            />
          </div>
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
          <div>
            <label
              htmlFor="inviteCode"
              className="block text-sm font-medium text-gray-700"
            >
              Einladungscode
            </label>
            <input
              type="text"
              id="inviteCode"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary hover:bg-green-800"
          >
            Registrieren
          </button>
        </form>
      </div>
    </main>
  );
}
