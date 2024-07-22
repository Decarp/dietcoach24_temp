import React from "react";
import dynamic from "next/dynamic";
import AnalysisHeader from "@/components/purchases/analysis/AnalysisHeader";

const ChartMacro = dynamic(
  () => import("@/components/purchases/analysis/ChartMacro"),
  {
    ssr: false,
  }
);
const ChartMacroCategories = dynamic(
  () => import("@/components/purchases/analysis/ChartMacroCategories"),
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

  return (
    <div className="pt-6 bg-gray-50 flex flex-col flex-1 px-4 sm:px-6 lg:pl-8 xl:pl-6 border-b">
      <AnalysisHeader
        currentTab={currentTab}
        handleTabChange={handleTabChange}
        tabs={tabs}
      />
      <div className="shadow-inner -mx-6">
        <div className="flex-1 max-h-[calc(100vh-314px)] overflow-y-auto pb-6 px-6">
          {checkedBaskets.length > 0 ? (
            <>
              {currentTab === "energy" && (
                <>
                  <br />
                  <h4 className="text-lg font-medium mb-2">
                    Energiegehalt aus Makronährstoffen
                  </h4>
                  <ChartMacro />
                  <br />
                  <h4 className="text-lg font-medium mb-2">
                    Energiegehalt aus Lebensmittelkategorien
                  </h4>
                  <ChartMacroCategories />
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
            </>
          ) : (
            <p className="mt-6 text-gray-500">
              Bitte wählen Sie mindestens einen Einkauf aus, um die Analyse
              anzuzeigen.
            </p>
          )}
        </div>

        {/* DEBUG: Selected basketIds */}
        {/* <p className="mt-4">
        [DEBUG] Selected basketIds: {checkedBaskets.join(", ")}
      </p> */}
      </div>
    </div>
  );
};

export default Analysis;
