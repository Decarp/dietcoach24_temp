import AnalysisHeader from "@/components/purchases/analysis/AnalysisHeader";
import { getChartEnergyCategoriesData } from "@/getData/getChartEnergyCategoriesData";
import { getChartEnergyMacroData } from "@/getData/getChartEnergyMacroData";
import { useCounterStore } from "@/providers/useStoreProvider";
import { ArrowLeftIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { getChartEnergyMacroCategoriesData } from "@/getData/getChartEnergyMacroCategoriesData";
import { getChartEnergyMicroCategoriesData } from "@/getData/getChartEnergyMicroCategoriesData";
import { NutriScoreTable } from "@/components/charts/nutriScoreTable/NutriScoreTable";
import SVGLine from "@/components/SVGLine";
import DiffDot from "./DiffDot";

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
  const {
    selectedBasketIds,
    selectedComparisonBasketIds,
    currentTab,
    selectedMacro,
    selectedMicro,
    selectedSortCriteria,
    setSelectedSortCriteria,
    selectedCategories,
    setSelectedCategories,
  } = useCounterStore((state) => state);

  const [percentageDifferencePrimary, setPercentageDifferencePrimary] =
    useState<number | null>(null);

  const [percentageDifferenceSecondary, setPercentageDifferenceSecondary] =
    useState<number | null>(null);

  const chartEnergyMacroData = useMemo(() => {
    return getChartEnergyMacroData(selectedBasketIds);
  }, [selectedBasketIds]);

  const chartComparisonEnergyMacroData = useMemo(() => {
    return getChartEnergyMacroData(selectedComparisonBasketIds);
  }, [selectedComparisonBasketIds]);

  const chartEnergyCategoriesData = useMemo(() => {
    const data = getChartEnergyCategoriesData(selectedBasketIds);
    return data.sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedBasketIds]);

  const chartComparisonEnergyCategoriesData = useMemo(() => {
    const data = getChartEnergyCategoriesData(selectedComparisonBasketIds);
    return data.sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedComparisonBasketIds]);

  const chartEnergyMacroCategoriesData = useMemo(() => {
    return getChartEnergyMacroCategoriesData(selectedBasketIds, selectedMacro);
  }, [selectedBasketIds, selectedMacro]);

  const chartComparisonEnergyMacroCategoriesData = useMemo(() => {
    return getChartEnergyMacroCategoriesData(
      selectedComparisonBasketIds,
      selectedMacro
    );
  }, [selectedComparisonBasketIds, selectedMacro]);

  const chartEnergyMicroCategoriesData = useMemo(() => {
    return getChartEnergyMicroCategoriesData(selectedBasketIds, selectedMicro);
  }, [selectedBasketIds, selectedMicro]);

  const chartComparisonEnergyMicroCategoriesData = useMemo(() => {
    return getChartEnergyMicroCategoriesData(
      selectedComparisonBasketIds,
      selectedMicro
    );
  }, [selectedComparisonBasketIds, selectedMicro]);

  useEffect(() => {
    if (currentTab === "energy" && selectedSortCriteria) {
      // Check if the selected sort criteria is still available
      if (
        !chartEnergyMacroData.find((item) => item.name === selectedSortCriteria)
      ) {
        setSelectedSortCriteria("Kohlenhydrate");
      }
      // Calculate the percentage difference primary
      const comparisonItem = chartComparisonEnergyMacroData.find(
        (item) => item.name === selectedSortCriteria
      );

      if (comparisonItem) {
        const selectedItem = chartEnergyMacroData.find(
          (item) => item.name === selectedSortCriteria
        );

        if (selectedItem) {
          const difference =
            ((selectedItem.value - comparisonItem.value) /
              comparisonItem.value) *
            100;
          setPercentageDifferencePrimary(parseInt(difference.toFixed(0)));
        } else {
          setPercentageDifferencePrimary(null);
        }
      } else {
        setPercentageDifferencePrimary(null);
      }
    }
  }, [
    chartEnergyMacroData,
    chartComparisonEnergyMacroData,
    currentTab,
    selectedSortCriteria,
    setSelectedSortCriteria,
  ]);

  useEffect(() => {
    // TODO: Auto set a category
    // TODO: Restrict to only select one category
    if (currentTab === "energy") {
      if (chartEnergyCategoriesData.length > 0) {
        if (selectedCategories.major.length == 1) {
          const selectedItem = chartEnergyCategoriesData.find(
            (item) => item.name === selectedCategories.major[0]
          );

          const comparisonItem = chartComparisonEnergyCategoriesData.find(
            (item) => item.name === selectedCategories.major[0]
          );

          if (selectedItem && comparisonItem) {
            const difference =
              ((selectedItem.value - comparisonItem.value) /
                comparisonItem.value) *
              100;
            setPercentageDifferenceSecondary(parseInt(difference.toFixed(0)));
          } else {
            setPercentageDifferenceSecondary(null);
          }
        } else {
          setPercentageDifferenceSecondary(null);
        }
      }
    } else if (currentTab === "macro") {
      if (chartEnergyMacroCategoriesData.length > 0) {
        if (selectedCategories.major.length == 1) {
          const selectedItem = chartEnergyMacroCategoriesData.find(
            (item) => item.name === selectedCategories.major[0]
          );

          const comparisonItem = chartComparisonEnergyMacroCategoriesData.find(
            (item) => item.name === selectedCategories.major[0]
          );

          if (selectedItem && comparisonItem) {
            const difference =
              ((selectedItem.value - comparisonItem.value) /
                comparisonItem.value) *
              100;
            setPercentageDifferenceSecondary(parseInt(difference.toFixed(0)));
          } else {
            setPercentageDifferenceSecondary(null);
          }
        } else {
          setPercentageDifferenceSecondary(null);
        }
      }
    } else if (currentTab === "micro") {
      if (chartEnergyMicroCategoriesData.length > 0) {
        if (selectedCategories.major.length == 1) {
          const selectedItem = chartEnergyMicroCategoriesData.find(
            (item) => item.name === selectedCategories.major[0]
          );

          const comparisonItem = chartComparisonEnergyMicroCategoriesData.find(
            (item) => item.name === selectedCategories.major[0]
          );

          if (selectedItem && comparisonItem) {
            const difference =
              ((selectedItem.value - comparisonItem.value) /
                comparisonItem.value) *
              100;
            setPercentageDifferenceSecondary(parseInt(difference.toFixed(0)));
          } else {
            setPercentageDifferenceSecondary(null);
          }
        } else {
          setPercentageDifferenceSecondary(null);
        }
      }
    }
  }, [
    chartEnergyCategoriesData,
    chartComparisonEnergyCategoriesData,
    currentTab,
    selectedCategories,
    setSelectedCategories,
    chartEnergyMacroCategoriesData,
    chartEnergyMicroCategoriesData,
  ]);

  return (
    <div className="-mr-8 border-x border-gray-300 pt-6 bg-gray-50 flex flex-col flex-1 px-4 sm:px-6 lg:pl-8 xl:pl-6 border-b">
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

                  <div className="flex items-center justify-between">
                    <ChartEnergyMacro
                      data={chartComparisonEnergyMacroData}
                      className="border-secondary border-4"
                    />
                    <DiffDot
                      percentageDifference={percentageDifferencePrimary}
                    />
                    <ChartEnergyMacro
                      data={chartEnergyMacroData}
                      className="border-primary border-4"
                    />
                  </div>

                  <br />
                  <h4 className="text-lg font-medium mb-2">
                    Energieverteilung aus Lebensmittelkategorien
                  </h4>
                  <div className="flex items-center justify-between">
                    <ChartEnergyCategories
                      data={chartComparisonEnergyCategoriesData}
                      className="border-secondary border-4"
                    />
                    <DiffDot
                      percentageDifference={percentageDifferenceSecondary}
                    />
                    <ChartEnergyCategories
                      data={chartEnergyCategoriesData}
                      className="border-primary border-4"
                    />
                  </div>
                </>
              )}
              {currentTab === "macro" && (
                <>
                  <br />
                  <h4 className="text-lg font-medium mb-2">Makronährstoffe</h4>
                  <div className="flex items-center justify-between">
                    <ChartEnergyMacroCategories
                      data={chartComparisonEnergyMacroCategoriesData}
                      className="border-secondary border-4"
                    />
                    <DiffDot
                      percentageDifference={percentageDifferenceSecondary}
                    />
                    <ChartEnergyMacroCategories
                      data={chartEnergyMacroCategoriesData}
                      className="border-primary border-4"
                    />
                  </div>
                </>
              )}
              {currentTab === "micro" && (
                <>
                  <br />
                  <h4 className="text-lg font-medium mb-2">
                    Weitere Nährstoffe
                  </h4>
                  <div className="flex items-center justify-between">
                    <ChartEnergyMicroCategories
                      data={chartComparisonEnergyMicroCategoriesData}
                      className="border-secondary border-4"
                    />
                    <DiffDot
                      percentageDifference={percentageDifferenceSecondary}
                    />
                    <ChartEnergyMicroCategories
                      data={chartEnergyMicroCategoriesData}
                      className="border-primary border-4"
                    />
                  </div>
                </>
              )}
              {currentTab === "nutri" && (
                <>
                  <br />
                  <h4 className="text-lg font-medium mb-2">Nutri-Score</h4>
                  <div className="flex items-center justify-between">
                    <NutriScoreTable />
                    <DiffDot
                      percentageDifference={percentageDifferenceSecondary}
                    />
                    <NutriScoreTable />
                  </div>
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
