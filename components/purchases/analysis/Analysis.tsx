import React from "react";
import dynamic from "next/dynamic";
import AnalysisHeader from "@/components/purchases/analysis/AnalysisHeader";
import { useCounterStore } from "@/providers/useStoreProvider";
import { ArrowLeftIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";

const ChartEnergyMacro = dynamic(
  () => import("@/components/purchases/analysis/ChartEnergyMacro"),
  {
    ssr: false,
  }
);
const ChartEnergyCategories = dynamic(
  () => import("@/components/purchases/analysis/ChartEnergyCategories"),
  {
    ssr: false,
  }
);
const ChartEnergyMacroCategories = dynamic(
  () => import("@/components/purchases/analysis/ChartEnergyMacroCategories"),
  {
    ssr: false,
  }
);

const Analysis = () => {
  const { selectedBasketIds, currentTab } = useCounterStore((state) => state);

  return (
    <div className="pt-6 bg-gray-50 flex flex-col flex-1 px-4 sm:px-6 lg:pl-8 xl:pl-6 border-b">
      <AnalysisHeader />
      <div className="shadow-inner -mx-6">
        <div className="flex-1 max-h-[calc(100vh-314px)] overflow-y-auto pb-6 px-6">
          {selectedBasketIds.length > 0 ? (
            <>
              {currentTab === "energy" && (
                <>
                  <br />
                  <h4 className="text-lg font-medium mb-2">
                    Energiegehalt aus Makronährstoffen
                  </h4>
                  <ChartEnergyMacro />
                  <br />
                  <h4 className="text-lg font-medium mb-2">
                    Energiegehalt aus Lebensmittelkategorien
                  </h4>
                  <ChartEnergyCategories />
                </>
              )}
              {currentTab === "macro" && (
                <>
                  <br />
                  <h4 className="text-lg font-medium mb-2">Makronährstoffe</h4>
                  <ChartEnergyMacroCategories />
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
            <div className="flex mt-6 px-4">
              <ArrowLeftIcon className="ml-3 h-12 w-12 text-gray-400 mr-6 flex-shrink-0" />
              <div className="text-center">
                <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">
                  Keine Einkäufe ausgewählt
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Bitte wählen Sie mindestens einen Einkauf aus, um Analysen
                  anzuzeigen.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analysis;
