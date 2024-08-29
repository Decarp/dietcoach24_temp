import React from "react";
import { classNames } from "@/utils/classNames";
import { useCounterStore } from "@/providers/useStoreProvider";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const tabs = [
  { name: "Energieverteilung", path: "energy" },
  { name: "Makronährstoffe", path: "macro" },
  { name: "Weitere Nährstoffe", path: "micro" },
  { name: "Nutri-Score", path: "nutri" },
];

const AnalysisHeader = () => {
  const {
    currentTab,
    setCurrentTab,
    hideBaskets,
    setHideBaskets,
    hideProducts,
    setHideProducts,
  } = useCounterStore((state) => state);

  const handleTabChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentTab(event.target.value);
  };

  const handleTabClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setCurrentTab(event.currentTarget.value);
  };

  return (
    <div className="flex justify-between items-center min-w-[300px] lg:max-w-[390px] xl:w-full">
      <div className="w-full">
        <div className="relative flex justify-between mb-5">
          {/* Left Arrow */}
          <button
            onClick={() => setHideBaskets(!hideBaskets)}
            className={`-ml-[38px] p-1 bg-white border border-gray-300 rounded-full shadow hover:bg-gray-100 focus:outline-none absolute left-0 transition ease-in-out delay-150 hover:scale-110 hover:bg-gray-50 ${
              !hideBaskets ? "hover:-translate-x-1" : "hover:translate-x-1"
            }`}
          >
            {hideBaskets ? (
              <ChevronRightIcon className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronLeftIcon className="h-4 w-4 text-gray-500" />
            )}
          </button>

          {/* Header Title */}
          <div className="flex-grow text-center">
            <h2 className="text-xl font-semibold">Analyse</h2>
            <h3 className="text-xs font-light text-gray-500">
              Filtere Lebensmittel
            </h3>
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => setHideProducts(!hideProducts)}
            className={`z-10 -mr-[37px] p-1 bg-white border border-gray-300 rounded-full shadow hover:bg-gray-100 focus:outline-none absolute right-0 transition ease-in-out delay-150 hover:scale-110 hover:bg-gray-50 ${
              !hideProducts ? "hover:translate-x-1" : "hover:-translate-x-1"
            }`}
          >
            {hideProducts ? (
              <ChevronLeftIcon className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRightIcon className="h-4 w-4 text-gray-500" />
            )}
          </button>
        </div>

        {/* Tabs */}
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
          <div className="hidden sm:block border-b border-gray-300 -mx-4 sm:-mx-6 lg:-mx-6 lg:-mx-8 xl:-mx-6 overflow-x-auto">
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
    </div>
  );
};

export default AnalysisHeader;
