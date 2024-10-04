"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPatient } from "@/utils/createPatient";
import { useSession } from "next-auth/react";

export default function AddPatientDrawer({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { data: sessionData } = useSession();
  const [patientId, setPatientId] = useState("");
  const [version, setVersion] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newPatientId: string) =>
      createPatient(newPatientId, sessionData?.accessToken || ""),
    onSuccess: () => {
      toast.success("Patient erfolgreich hinzugefügt", { duration: 3000 });
      queryClient.invalidateQueries({ queryKey: ["participants"] });
      setOpen(false);
    },
    onError: (error: any) => {
      console.log(error);
      toast.error(`Patient konnte nicht hinzugefügt werden: ${error.message}`, {
        duration: 3000,
      });
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!patientId.trim()) {
      toast.error("Bitte valide Patienten-ID nutzen", { duration: 3000 });
      return;
    }

    if (version !== "A" && version !== "B") {
      toast.error("Bitte valide Version nutzen", { duration: 3000 });
      return;
    }

    mutation.mutate(patientId.trim());
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      className="relative z-50"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <div className="bg-gray-50 flex h-full flex-col divide-y divide-gray-200 shadow-xl">
                <div className="flex min-h-0 flex-1 flex-col overflow-y-scroll py-6">
                  <DialogTitle className="mb-3 px-6 text-2xl font-semibold leading-6 text-gray-900">
                    Neuen Patienten hinzufügen
                  </DialogTitle>
                  <hr />

                  <div className="px-6">
                    <form onSubmit={handleSubmit}>
                      <label
                        htmlFor="patientId"
                        className="mt-6 block text-sm font-medium text-gray-700"
                      >
                        Patienten-ID
                      </label>
                      <input
                        type="text"
                        id="patientId"
                        value={patientId}
                        onChange={(e) => setPatientId(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        required
                      />

                      <label
                        htmlFor="version"
                        className="mt-6 block text-sm font-medium text-gray-700"
                      >
                        Version
                      </label>
                      <input
                        type="text"
                        id="version"
                        value={version}
                        onChange={(e) => setVersion(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        required
                      />

                      <div className="flex justify-end mt-6">
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          className="hover:scale-105 transition transform rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                        >
                          Zurück
                        </button>
                        <button
                          type="submit"
                          className="hover:scale-105 transition transform ml-4 inline-flex justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                          Patient hinzufügen
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
