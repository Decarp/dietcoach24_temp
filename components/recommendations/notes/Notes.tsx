import { useState } from "react";
import NotesHeader from "./NotesHeader";
import { classNames } from "@/utils/classNames";

const tabs = ["Persönlich", "Privat"];

const Notes = () => {
  const [currentTab, setCurrentTab] = useState("Persönlich");

  const handleTabChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentTab(event.target.value);
  };

  const handleTabClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setCurrentTab(event.currentTarget.value);
  };

  return (
    <div className="relative pt-6 -mr-8 bg-white border-x flex flex-col shrink-0 border-t border-b border-gray-300 lg:w-64 lg:border-t-0 lg:pr-8 xl:pr-6 h-[calc(100vh-185px)]">
      <NotesHeader />
      <div className="ml-6">
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
              <option key={tab} value={tab}>
                {tab}
              </option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block border-b -mx-4 sm:-mx-6 lg:-mx-6 lg:-ml-8 xl:-ml-6">
          <nav className="-mb-px flex space-x-8 px-4 sm:px-5 lg:px-7 xl:px-5">
            {tabs.map((tab) => (
              <button
                key={tab}
                value={tab}
                onClick={handleTabClick}
                className={classNames(
                  tab === currentTab
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                  "mt-3 whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium"
                )}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="-mr-6 flex-1 overflow-y-auto min-h-0 min-h-80 shadow-inner">
        <div className="mt-2 p-4">
          <textarea
            id="comment"
            name="comment"
            rows={4}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
            defaultValue={"[ Not yet implemented ]"}
          />
        </div>
      </div>
    </div>
  );
};

export default Notes;
