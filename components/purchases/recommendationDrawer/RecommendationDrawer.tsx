"use client";

import { useCounterStore } from "@/providers/useStoreProvider";
import { Recommendation, Sessions } from "@/types/types";
import { createRecommendation } from "@/utils/createRecommendation";
import { fetchSessions } from "@/utils/fetchSessions";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import NotesSection from "./NotesSection";
import SelectedAlternativesSection from "./SelectedAlternativesSection";
import SelectedProductsSection from "./SelectedProductsSection";
import SessionSelector from "./SessionSelector";
import TabSection from "./tabSection/TabSection";

export default function RecommendationDrawer({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { data: userSession } = useSession();
  const pathname = usePathname();
  const patientId = pathname.split("/")[2];

  // Fetch existing sessions
  const { data: sessions, refetch } = useQuery<Sessions>({
    queryKey: ["sessions", patientId],
    queryFn: () => fetchSessions(patientId, userSession?.accessToken || ""),
  });

  const [currentTab, setCurrentTab] = useState("Nährstoff-spezifisch");
  const [variante1State, setVariante1State] = useState({
    mode: "Erhöhen / Reduzieren",
    nutrient: "Nährstoff",
    category: "Kategorie",
  });
  const [variante2State, setVariante2State] = useState({
    mode: "Erhöhen / Reduzieren",
    category: "Kategorie",
  });
  const [freitextState, setFreitextState] = useState("");
  const [notes, setNotes] = useState<string | null>(null);

  const {
    selectedBasketIds,
    selectedBasketProductsFlat,
    selectedAlternativeProducts,
    selectedSessionId,
  } = useCounterStore((state) => state);

  const mutation = useMutation({
    mutationFn: (
      formData: Omit<Recommendation, "recommendationId" | "index">
    ) =>
      createRecommendation(
        formData,
        userSession?.accessToken || "",
        selectedSessionId?.toString()
      ),
    onSuccess: () => {
      toast.success("Empfehlung erfolgreich erstellt", { duration: 3000 });
      setOpen(false);
      refetch();
    },
    onError: (error: any) => {
      toast.error(`Es ist ein Fehler aufgetreten: ${error.message}`, {
        duration: 3000,
      });
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedSessionId) {
      toast.error("Bitte wähle eine Sitzung aus", { duration: 3000 });
      return;
    }

    let rule;
    if (currentTab === "Nährstoff-spezifisch") {
      rule = {
        variant: "VAR1",
        mode: variante1State.mode,
        nutrient: variante1State.nutrient,
        category: variante1State.category,
        text: null,
      };
    } else if (currentTab === "Nährstoff-unspezifisch") {
      rule = {
        variant: "VAR2",
        mode: variante2State.mode,
        nutrient: null,
        category: variante2State.category,
        text: null,
      };
    } else if (currentTab === "Individuell") {
      rule = {
        variant: "FREITEXT",
        mode: null,
        nutrient: null,
        category: null,
        text: freitextState,
      };
    } else {
      toast.error("Bitte wähle eine Variante aus", { duration: 3000 });
      return;
    }

    const formData: Omit<Recommendation, "recommendationId" | "index"> = {
      rule: rule,
      basketIds: selectedBasketIds,
      suggestions: {
        current: selectedBasketProductsFlat.map((product) => product.gtin),
        alternatives: selectedAlternativeProducts.map(
          (product) => product.gtins[0]
        ),
      },
      notes: notes || "",
    };

    mutation.mutate(formData);
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
              className="pointer-events-auto w-screen max-w-7xl transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <div className="bg-gray-50 flex h-full flex-col divide-y divide-gray-200 shadow-xl">
                <div className="flex min-h-0 flex-1 flex-col overflow-y-scroll py-6">
                  <DialogTitle className="mb-3 px-6 text-2xl font-semibold leading-6 text-gray-900">
                    Empfehlung erstellen
                  </DialogTitle>
                  <hr />

                  <div className="px-6">
                    <SessionSelector />
                    <TabSection
                      currentTab={currentTab}
                      setCurrentTab={setCurrentTab}
                      variante1State={variante1State}
                      setVariante1State={setVariante1State}
                      variante2State={variante2State}
                      setVariante2State={setVariante2State}
                      freitextState={freitextState}
                      setFreitextState={setFreitextState}
                    />
                    <section className="mt-8">
                      <h2 className="mt-8 block text-xl font-medium leading-6 text-gray-900">
                        Alternative Produkte vorschlagen
                      </h2>
                      <div className="grid grid-cols-2 gap-4 mt-4 rounded-lg">
                        <SelectedProductsSection
                          open={open}
                          setOpen={setOpen}
                        />
                        <SelectedAlternativesSection />
                      </div>
                    </section>
                    <NotesSection notes={notes} setNotes={setNotes} />
                  </div>
                </div>
                <div className="flex flex-shrink-0 justify-end px-4 py-4">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                  >
                    Zurück
                  </button>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="ml-4 inline-flex justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    Speichern
                  </button>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
