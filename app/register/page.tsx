"use client";

import { register } from "@/utils/register";
import { createPatient } from "@/utils/createPatient"; // Import the createPatient function
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { createSession } from "@/utils/createSession";
import Button from "@/components/Button";
import { UserPlusIcon } from "@heroicons/react/24/solid";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if the invite code is "HSG2024"
    if (inviteCode !== "HSG2024") {
      toast.error("Falscher Einladungscode. Bitte versuchen Sie es erneut.");
      return;
    }

    try {
      const response = await register({
        email,
        password,
        firstName,
        lastName,
      });

      if (response.ok) {
        const responseData = await response.json();

        // Registration successful, show success toast
        setTimeout(() => {
          toast.success("Registrierung erfolgreich.", {
            duration: 4000,
          });
        }, 1000);

        // Randomly select patient ID (1, 2, or 3)
        const patientIds = ["76567b0b", "36de8918", "52fb7ef2"];
        const patientId =
          patientIds[Math.floor(Math.random() * patientIds.length)];

        // Call the createPatient API with the selected patient ID and token from the response
        const createPatientResponse = await createPatient(
          patientId,
          responseData.token,
        );

        // check if 201 response
        if (createPatientResponse.status === 201) {
          setTimeout(() => {
            toast.success("Studien-Patient erfolgreich zugewiesen.", {
              duration: 4000,
            });
          }, 2000);
        }

        // Initialize a first consultation session
        const createSessionResponse = await createSession(
          patientId,
          responseData.token,
        );

        if (createSessionResponse.ok) {
          setTimeout(() => {
            toast.success("Erste Studien-Konsultation erfolgreich erstellt.", {
              duration: 4000,
            });
          }, 3000);
        }

        // Redirect to sign-in page after a short delay
        setTimeout(() => {
          router.push("/api/auth/signin");
        }, 0); // Delay to allow users to see the toast
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Registrierung fehlgeschlagen.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
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
          <Button
            onClick={() => {}}
            icon={<UserPlusIcon className="h-5 w-5" />}
          >
            Registrieren
          </Button>
        </form>
      </div>
    </main>
  );
}
