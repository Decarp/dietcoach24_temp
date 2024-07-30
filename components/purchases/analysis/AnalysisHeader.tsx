import React from "react";
import { useRouter } from "next/navigation";
import { classNames } from "@/utils/classNames";
import { useCounterStore } from "@/providers/useStoreProvider";

const tabs = [
  { name: "Energiegehalt", path: "energy" },
  { name: "Makronährstoffe", path: "macro" },
  { name: "Mikronährstoffe", path: "micro" },
  { name: "Nutri-Score", path: "nutri" },
];

const AnalysisHeader = () => {
  const router = useRouter();
  const { currentTab, patientId } = useCounterStore((state) => state);

  const handleTabChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTab = event.target.value;
    router.push(`/p/${patientId}/purchases?chart=${selectedTab}`);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold">Analyse</h2>
      <h3 className="text-sm font-light mb-4 text-gray-500">Filtere Artikel</h3>
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
        <div className="hidden sm:block border-b -mx-4 sm:-mx-6 lg:-mx-6 lg:-ml-8 xl:-ml-6">
          <nav className="-mb-px flex space-x-8 px-4 sm:px-5 lg:px-7 xl:px-5">
            {tabs.map((tab) => (
              <a
                key={tab.path}
                href={`?chart=${tab.path}`}
                aria-current={tab.path === currentTab ? "page" : undefined}
                className={classNames(
                  tab.path === currentTab
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                  "whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium"
                )}
              >
                {tab.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default AnalysisHeader;
