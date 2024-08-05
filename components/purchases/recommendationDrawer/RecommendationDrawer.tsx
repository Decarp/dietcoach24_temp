// RecommendationDrawer.tsx
"use client";

import { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import DialogHeader from "./DialogHeader";
import TabSection from "./TabSection";
import SelectedProductsSection from "./SelectedProductsSection";
import SelectedAlternativesSection from "./SelectedAlternativesSection";
import NotesSection from "./NotesSection";
import { useCounterStore } from "@/providers/useStoreProvider";

// Replace with useStore state
const selectedAlternatives = [
  {
    id: 4,
    name: "Erdnüsse",
    category: "Nüsse",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 5,
    name: "Haselnüsse",
    category: "Nüsse",
    image: "https://via.placeholder.com/150",
  },
];

export default function RecommendationDrawer({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [session, setSession] = useState("Sitzung #1");
  const [currentTab, setCurrentTab] = useState("Variante 1");
  const [variante1State, setVariante1State] = useState({
    mode: "",
    nutrient: "",
    category: "",
  });
  const [variante2State, setVariante2State] = useState({
    mode: "",
    category: "",
  });
  const [freitextState, setFreitextState] = useState("");
  const [notes, setNotes] = useState("");

  const { selectedBasketProductsFlat } = useCounterStore((state) => state);

  const handleSave = () => {
    let recommendation;
    switch (currentTab) {
      case "Variante 1":
        recommendation = {
          variant: "VAR1",
          mode: variante1State.mode,
          nutrient: variante1State.nutrient,
          category: variante1State.category,
          text: null,
        };
        break;
      case "Variante 2":
        recommendation = {
          variant: "VAR2",
          mode: variante2State.mode,
          nutrient: null,
          category: variante2State.category,
          text: null,
        };
        break;
      case "Freitext":
        recommendation = {
          variant: "FREITEXT",
          mode: null,
          nutrient: null,
          category: null,
          text: freitextState,
        };
        break;
      default:
        recommendation = {};
    }

    const selectedProductIds = selectedBasketProductsFlat.map(
      (product) => product.productId
    );
    const selectedAlternativeIds = selectedAlternatives.map(
      (product) => product.id
    );
    const data = {
      sessionId: session,
      recommendation: recommendation,
      basketIds: ["basketId1", "basketId2", "basketId3"],
      productSuggestions: {
        current: selectedProductIds,
        alternatives: selectedAlternativeIds,
      },
      notes: notes,
    };
    console.log("Data to send to API:", data);
    setOpen(false);
  };

  return (
    <>
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
                className="pointer-events-auto w-screen max-w-6xl transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
              >
                <div className="bg-gray-50 flex h-full flex-col divide-y divide-gray-200 shadow-xl">
                  <div className="flex min-h-0 flex-1 flex-col overflow-y-scroll py-6">
                    <div className="px-4 sm:px-6">
                      <DialogHeader
                        session={session}
                        setSession={setSession}
                        setOpen={setOpen}
                      />
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
                          Alternative Artikel vorschlagen
                        </h2>
                        <div className="grid grid-cols-2 gap-4 mt-4 rounded-lg">
                          <SelectedProductsSection />
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
                      type="button"
                      onClick={handleSave}
                      className="ml-4 inline-flex justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      Log Data
                    </button>
                    <button
                      type="submit"
                      onClick={handleSave}
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
    </>
  );
}
