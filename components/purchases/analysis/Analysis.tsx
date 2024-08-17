import AnalysisHeader from "@/components/purchases/analysis/AnalysisHeader";
import { getChartEnergyCategoriesData } from "@/getData/getChartEnergyCategoriesData";
import { getChartEnergyMacroData } from "@/getData/getChartEnergyMacroData";
import { useCounterStore } from "@/providers/useStoreProvider";
import { ArrowLeftIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { NutriScoreTable } from "../../charts/nutriScoreTable/NutriScoreTable";
import { getChartEnergyMacroCategoriesData } from "@/getData/getChartEnergyMacroCategoriesData";
import { getChartEnergyMicroCategoriesData } from "@/getData/getChartEnergyMicroCategoriesData";

const ChartEnergyMacro = dynamic(
  () => import("@/components/charts/ChartEnergyMacro"),
  {
    ssr: false,
  }
);
const ChartEnergyCategories = dynamic(
  () => import("@/components/charts/ChartEnergyCategories"),
  {
    ssr: false,
  }
);
const ChartEnergyMacroCategories = dynamic(
  () => import("@/components/charts/ChartEnergyMacroCategories"),
  {
    ssr: false,
  }
);
const ChartEnergyMicroCategories = dynamic(
  () => import("@/components/charts/ChartEnergyMicroCategories"),
  {
    ssr: false,
  }
);

const Analysis = () => {
  const { selectedBasketIds, currentTab, selectedMacro, selectedMicro } =
    useCounterStore((state) => state);

  const chartEnergyMacroData = useMemo(() => {
    return getChartEnergyMacroData(selectedBasketIds);
  }, [selectedBasketIds]);

  const chartEnergyCategoriesData = useMemo(() => {
    const data = getChartEnergyCategoriesData(selectedBasketIds);
    return data.sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedBasketIds]);

  const chartEnergyMacroCategoriesData = useMemo(() => {
    return getChartEnergyMacroCategoriesData(selectedBasketIds, selectedMacro);
  }, [selectedBasketIds, selectedMacro]);

  const chartEnergyMicroCategoriesData = useMemo(() => {
    return getChartEnergyMicroCategoriesData(selectedBasketIds, selectedMicro);
  }, [selectedBasketIds, selectedMicro]);

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
                    Nährstoffverteilung
                  </h4>
                  <ChartEnergyMacro data={chartEnergyMacroData} />
                  <br />
                  <h4 className="text-lg font-medium mb-2">
                    Energieverteilung aus Lebensmittelkategorien
                  </h4>
                  <ChartEnergyCategories data={chartEnergyCategoriesData} />
                </>
              )}
              {currentTab === "macro" && (
                <>
                  <br />
                  <h4 className="text-lg font-medium mb-2">Makronährstoffe</h4>
                  <ChartEnergyMacroCategories
                    data={chartEnergyMacroCategoriesData}
                  />
                </>
              )}
              {currentTab === "micro" && (
                <>
                  <br />
                  <h4 className="text-lg font-medium mb-2">
                    Weitere Nährstoffe
                  </h4>
                  <ChartEnergyMicroCategories
                    data={chartEnergyMicroCategoriesData}
                  />
                </>
              )}
              {currentTab === "nutri" && (
                <>
                  <br />
                  <h4 className="text-lg font-medium mb-2">Nutri-Score</h4>
                  <NutriScoreTable />
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
