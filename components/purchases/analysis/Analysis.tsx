import React from "react";
import { classNames } from "@/utils/classNames";
import dynamic from "next/dynamic";

const EnergyChartMacro = dynamic(
  () => import("@/components/purchases/analysis/EnergyChartMacro"),
  {
    ssr: false,
  }
);
const EnergyChartCategories = dynamic(
  () => import("@/components/purchases/analysis/EnergyChartCategories"),
  {
    ssr: false,
  }
);

const Analysis = ({
  currentTab,
  setCurrentTab,
  handleTabChange,
  checkedBaskets,
  baskets,
}: {
  currentTab: string;
  setCurrentTab: any;
  handleTabChange: any;
  checkedBaskets: number[];
  baskets: any;
}) => {
  const tabs = [
    { name: "Energiegehalt", path: "energy" },
    { name: "Makronährstoffe", path: "macro" },
    { name: "Mikronährstoffe", path: "micro" },
    { name: "Nutri-Score", path: "nutri" },
  ];

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="bg-gray-50 flex flex-col flex-1 px-4 py-6 sm:px-6 lg:pl-8 xl:pl-6">
      <h2 className="text-xl font-semibold">Analyse</h2>
      <h3 className="text-sm font-light mb-4 text-gray-500">
        Selektiere gewünschte Analysen
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

      <div className="flex-1">
        {currentTab === "energy" && (
          <>
            <br />
            <h4 className="text-lg font-medium mb-2">
              Energiegehalt aus Makronährstoffen
            </h4>
            <EnergyChartMacro />
            <br />
            <h4 className="text-lg font-medium mb-2">
              Energiegehalt aus Lebensmittelkategorien
            </h4>
            <EnergyChartCategories />
          </>
        )}
        {currentTab === "macro" && (
          <>
            <br />
            <h4 className="text-lg font-medium mb-2">Makronährstoffe</h4>
            <div className="border rounded-lg p-4 bg-white h-96 bg-white" />
          </>
        )}
        {currentTab === "micro" && (
          <>
            <br />
            <h4 className="text-lg font-medium mb-2">Mikronährstoffe</h4>
            <div className="border rounded-lg p-4 bg-white h-96 bg-white" />
          </>
        )}
        {currentTab === "nutri" && (
          <>
            <br />
            <h4 className="text-lg font-medium mb-2">Nutri-Score</h4>
            <div className="border rounded-lg p-4 bg-white h-96 bg-white" />
          </>
        )}
      </div>

      {/* DEBUG: Selected basketIds */}
      <pre className="mt-4">
        [DEBUG] Selected basketIds: {checkedBaskets.join(", ")}
      </pre>
    </div>
  );
};

export default Analysis;
