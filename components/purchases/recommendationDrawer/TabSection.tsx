// TabSection.tsx
import { useState } from "react";

const tabs = [
  { name: "Variante 1" },
  { name: "Variante 2" },
  { name: "Freitext" },
];

export default function TabSection({
  currentTab,
  setCurrentTab,
  variante1State,
  setVariante1State,
  variante2State,
  setVariante2State,
  freitextState,
  setFreitextState,
}: {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  variante1State: { mode: string; nutrient: string; category: string };
  setVariante1State: (state: {
    mode: string;
    nutrient: string;
    category: string;
  }) => void;
  variante2State: { mode: string; category: string };
  setVariante2State: (state: { mode: string; category: string }) => void;
  freitextState: string;
  setFreitextState: (state: string) => void;
}) {
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

  return (
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
            onChange={(e) => setCurrentTab(e.target.value)}
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
                onClick={() => setCurrentTab(tab.name)}
                className={`whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium ${
                  tab.name === currentTab
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
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
              onChange={(e) => handleInputChange(e, "Variante 1", "mode")}
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
              onChange={(e) => handleInputChange(e, "Variante 1", "nutrient")}
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
              onChange={(e) => handleInputChange(e, "Variante 1", "category")}
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
              onChange={(e) => handleInputChange(e, "Variante 2", "mode")}
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
              onChange={(e) => handleInputChange(e, "Variante 2", "category")}
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
              onChange={(e) => handleInputChange(e, "Freitext", "freitext")}
              className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      )}
    </section>
  );
}
