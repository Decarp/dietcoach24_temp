"use client";

import { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import {
  ArrowLeftIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const tabs = [
  { name: "Variante 1" },
  { name: "Variante 2" },
  { name: "Freitext" },
];

const selectedProducts = [
  {
    id: 1,
    name: "Mandeln",
    category: "Nüsse",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    name: "Walnüsse",
    category: "Nüsse",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    name: "Cashewkerne",
    category: "Nüsse",
    image: "https://via.placeholder.com/150",
  },
];

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

const availableProducts = [
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
  {
    id: 6,
    name: "Pistazien",
    category: "Nüsse",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 7,
    name: "Paranüsse",
    category: "Nüsse",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 8,
    name: "Macadamianüsse",
    category: "Nüsse",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 9,
    name: "Sonnenblumenkerne",
    category: "Samen",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 10,
    name: "Kürbiskerne",
    category: "Samen",
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

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    tab: string,
    field: string
  ) => {
    const value = e.target.value;
    if (tab === "Variante 1") {
      setVariante1State({ ...variante1State, [field]: value });
    } else if (tab === "Variante 2") {
      setVariante2State({ ...variante2State, [field]: value });
    } else if (tab === "Freitext") {
      setFreitextState(value);
    }
  };

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

    const selectedProductIds = selectedProducts.map((product) => product.id);
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
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
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
                    <div className="flex items-start justify-between">
                      <div className="flex items-center justify-left space-x-6">
                        <DialogTitle className="text-2xl font-semibold leading-6 text-gray-900">
                          Empfehlung erstellen
                        </DialogTitle>

                        <select
                          id="location"
                          name="location"
                          value={session}
                          onChange={(e) => setSession(e.target.value)}
                          className="block w-96 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        >
                          <option value="Sitzung #1">Sitzung #1</option>
                          <option value="Sitzung #2">Sitzung #2</option>
                          <option value="Sitzung #3">Sitzung #3</option>
                        </select>
                      </div>

                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                        </button>
                      </div>
                    </div>
                    <section className="mt-8">
                      <h2 className="block text-xl font-medium leading-6 text-gray-900">
                        Regel festlegen
                      </h2>

                      <div className="mt-4">
                        <div className="sm:hidden">
                          <label htmlFor="current-tab" className="sr-only">
                            Select a tab
                          </label>
                          <select
                            id="current-tab"
                            name="current-tab"
                            value={currentTab}
                            onChange={(e) => handleTabChange(e.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary"
                          >
                            {tabs.map((tab) => (
                              <option key={tab.name} value={tab.name}>
                                {tab.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="hidden sm:block">
                          <nav className="-mb-px flex space-x-8">
                            {tabs.map((tab) => (
                              <button
                                key={tab.name}
                                onClick={() => handleTabChange(tab.name)}
                                className={classNames(
                                  tab.name === currentTab
                                    ? "border-primary text-primary"
                                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                                  "whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium"
                                )}
                              >
                                {tab.name}
                              </button>
                            ))}
                          </nav>
                        </div>
                      </div>

                      {currentTab === "Variante 1" && (
                        <div className="relative mt-6 flex-1">
                          <div className="mt-2 flex rounded-md shadow-sm">
                            <input
                              id="variante1-mode"
                              name="variante1-mode"
                              type="text"
                              placeholder="Erhöhen / Reduktion"
                              value={variante1State.mode}
                              onChange={(e) =>
                                handleInputChange(e, "Variante 1", "mode")
                              }
                              className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                            />
                            <span className="inline-flex items-center border border-r-0 border-gray-300 px-3 text-gray-500 sm:text-sm">
                              von
                            </span>
                            <input
                              id="variante1-nutrient"
                              name="variante1-nutrient"
                              type="text"
                              placeholder="Nährstoff"
                              value={variante1State.nutrient}
                              onChange={(e) =>
                                handleInputChange(e, "Variante 1", "nutrient")
                              }
                              className="block w-full min-w-0 flex-1 rounded-none border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                            />
                            <span className="inline-flex items-center border border-r-0 border-gray-300 px-3 text-gray-500 sm:text-sm">
                              aus
                            </span>
                            <input
                              id="variante1-category"
                              name="variante1-category"
                              type="text"
                              placeholder="Lebensmittelkategorie"
                              value={variante1State.category}
                              onChange={(e) =>
                                handleInputChange(e, "Variante 1", "category")
                              }
                              className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                      )}

                      {currentTab === "Variante 2" && (
                        <div className="relative mt-6 flex-1">
                          <div className="mt-2 flex rounded-md shadow-sm">
                            <input
                              id="variante2-mode"
                              name="variante2-mode"
                              type="text"
                              placeholder="Erhöhen / Reduktion"
                              value={variante2State.mode}
                              onChange={(e) =>
                                handleInputChange(e, "Variante 2", "mode")
                              }
                              className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                            />
                            <span className="inline-flex items-center border border-r-0 border-gray-300 px-3 text-gray-500 sm:text-sm">
                              von
                            </span>
                            <input
                              id="variante2-category"
                              name="variante2-category"
                              type="text"
                              placeholder="Lebensmittelkategorie"
                              value={variante2State.category}
                              onChange={(e) =>
                                handleInputChange(e, "Variante 2", "category")
                              }
                              className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                      )}

                      {currentTab === "Freitext" && (
                        <div className="relative mt-6 flex-1">
                          <div className="mt-2 flex rounded-md shadow-sm">
                            <input
                              id="freitext"
                              name="freitext"
                              type="text"
                              placeholder="Freitext"
                              value={freitextState}
                              onChange={(e) =>
                                handleInputChange(e, "Freitext", "freitext")
                              }
                              className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                      )}
                    </section>

                    <section className="mt-8">
                      <h2 className="mt-8 block text-xl font-medium leading-6 text-gray-900">
                        Alternative Artikel vorschlagen
                      </h2>

                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="bg-white p-4 border rounded-md h-[420px] overflow-y-scroll space-y-4">
                          <h3 className="block text-md font-base text-gray-500">
                            Selektierte gekaufte Artikel
                          </h3>
                          {selectedProducts.map((product) => (
                            <div
                              key={product.id}
                              className="flex items-center space-x-4 justify-between"
                            >
                              <div className="flex items-center space-x-4">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-16 h-16 rounded-md"
                                />
                                <div>
                                  <h4 className="text-gray-900 font-semibold">
                                    {product.name}
                                  </h4>
                                  <p className="text-gray-500">
                                    {product.category}
                                  </p>
                                </div>
                              </div>
                              <TrashIcon className="h-6 w-6 text-gray-500 hover:text-red-500 cursor-pointer" />
                            </div>
                          ))}
                        </div>

                        <div className="col-span-2 bg-white border rounded-md h-[420px] grid grid-cols-2">
                          <div className="space-y-4 overflow-y-scroll p-4 pr-4 border-r mr-4">
                            <h3 className="block text-md font-base text-gray-500">
                              Selektierte alternative Artikel
                            </h3>
                            {selectedAlternatives.map((product) => (
                              <div
                                key={product.id}
                                className="flex items-center space-x-4 justify-between"
                              >
                                <div className="flex items-center space-x-4">
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-16 h-16 rounded-md"
                                  />
                                  <div>
                                    <h4 className="text-gray-900 font-semibold">
                                      {product.name}
                                    </h4>
                                    <p className="text-gray-500">
                                      {product.category}
                                    </p>
                                  </div>
                                </div>
                                <TrashIcon className="h-6 w-6 text-gray-500 hover:text-red-500 cursor-pointer" />
                              </div>
                            ))}
                          </div>
                          <div className="space-y-4 overflow-y-scroll p-4">
                            <h3 className="block text-md font-base text-gray-500">
                              Artikelauswahl für Alternativen
                            </h3>
                            ADD BUTTON IF SEARCHING WITH TEXT INPUT
                            {availableProducts.map((product) => (
                              <div
                                key={product.id}
                                className="flex items-center space-x-4"
                              >
                                <ArrowLeftIcon className="h-6 w-6 text-gray-500 hover:text-primary cursor-pointer" />
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-16 h-16 rounded-md"
                                />
                                <div>
                                  <h4 className="text-gray-900 font-semibold">
                                    {product.name}
                                  </h4>
                                  <p className="text-gray-500">
                                    {product.category}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </section>

                    <section className="mt-8">
                      <h2 className="block text-xl font-medium leading-6 text-gray-900">
                        Weitere Notizen hinzufügen (optional)
                      </h2>

                      <div className="mt-4">
                        <textarea
                          id="comment"
                          name="comment"
                          rows={4}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                        />
                      </div>
                    </section>
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
  );
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
