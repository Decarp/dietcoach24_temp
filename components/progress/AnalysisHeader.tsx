import { useCounterStore } from "@/providers/useStoreProvider";
import { classNames } from "@/utils/classNames";
import React from "react";

const tabs = [
  { name: "Energieverteilung", path: "energy" },
  { name: "Makronährstoffe", path: "macro" },
  { name: "Weitere Nährstoffe", path: "micro" },
];

const AnalysisHeader = () => {
  const { currentTab, setCurrentTab } = useCounterStore((state) => state);

  const handleTabChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentTab(event.target.value);
  };

  const handleTabClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setCurrentTab(event.currentTarget.value);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold">Fortschritt</h2>
      <h3 className="text-xs font-light mb-5 text-gray-500">
        Fortschritt zwischen zwei Zeitfenstern
      </h3>
      <div>
        <div className="sm:hidden">
          <label htmlFor="current-tab" className="sr-only">
            Select a tab
          </label>
          <select
            id="current-tab"
            name="current-tab"
            defaultValue={currentTab}
            onChange={handleTabChange}
            className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary"
          >
            {tabs.map((tab) => (
              <option key={tab.path} value={tab.path}>
                {tab.name}
              </option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block border-b -mx-8 px-2">
          <nav className="-mb-px flex space-x-8 px-4 sm:px-5 lg:px-7 xl:px-5">
            {tabs.map((tab) => (
              <button
                key={tab.path}
                value={tab.path}
                onClick={handleTabClick}
                className={classNames(
                  tab.path === currentTab
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
    </div>
  );
};

export default AnalysisHeader;
