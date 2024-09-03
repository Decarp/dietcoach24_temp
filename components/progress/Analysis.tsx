import DiffDot from "@/components/charts/DiffDot";
import AnalysisHeader from "@/components/progress/AnalysisHeader";
import { Spinner } from "@/components/Spinner";
import { getChartEnergyCategoriesData } from "@/getData/getChartEnergyCategoriesData";
import { getChartEnergyMacroCategoriesData } from "@/getData/getChartEnergyMacroCategoriesData";
import { getChartEnergyMacroData } from "@/getData/getChartEnergyMacroData";
import { getChartEnergyMicroCategoriesData } from "@/getData/getChartEnergyMicroCategoriesData";
import { useCounterStore } from "@/providers/useStoreProvider";
import { BasketProduct, Sessions } from "@/types/types";
import { fetchBasketProducts } from "@/utils/fetchBasketProducts";
import { fetchSessions } from "@/utils/fetchSessions";
import {
  CalendarDateRangeIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import DateRangePickerComp from "./DateRangePickerComp";

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
  const { data: session } = useSession();
  const pathname = usePathname();
  const patientId = pathname.split("/")[2];

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

  const {
    isLoading: isLoadingBasketProductsComparisonNew,
    data: basketProductsComparisonNew,
  } = useQuery<BasketProduct[]>({
    queryKey: ["basketProductsComparisonNew", selectedBasketIds],
    queryFn: () =>
      fetchBasketProducts(
        patientId,
        selectedBasketIds,
        session?.accessToken || ""
      ),
    enabled: selectedBasketIds.length > 0 && !!session?.accessToken,
  });

  const {
    isLoading: isLoadingBasketProductsComparisonOld,
    data: basketProductsComparisonOld,
  } = useQuery<BasketProduct[]>({
    queryKey: ["basketProductsComparisonOld", selectedComparisonBasketIds],
    queryFn: () =>
      fetchBasketProducts(
        patientId,
        selectedComparisonBasketIds,
        session?.accessToken || ""
      ),
    enabled: selectedComparisonBasketIds.length > 0 && !!session?.accessToken,
  });

  const [isProcessing, setIsProcessing] = useState(true);

  const [percentageDifferencePrimary, setPercentageDifferencePrimary] =
    useState<number | null>(null);

  const [percentageDifferenceSecondary, setPercentageDifferenceSecondary] =
    useState<number | null>(null);

  const chartEnergyMacroData = useMemo(() => {
    return getChartEnergyMacroData(basketProductsComparisonNew || []);
  }, [basketProductsComparisonNew]);

  const chartComparisonEnergyMacroData = useMemo(() => {
    return getChartEnergyMacroData(basketProductsComparisonOld || []);
  }, [basketProductsComparisonOld]);

  const chartEnergyCategoriesData = useMemo(() => {
    const data = getChartEnergyCategoriesData(
      basketProductsComparisonNew || []
    );
    return data.sort((a, b) => a.name.localeCompare(b.name));
  }, [basketProductsComparisonNew]);

  const chartComparisonEnergyCategoriesData = useMemo(() => {
    const data = getChartEnergyCategoriesData(
      basketProductsComparisonOld || []
    );
    return data.sort((a, b) => a.name.localeCompare(b.name));
  }, [basketProductsComparisonOld]);

  const chartEnergyMacroCategoriesData = useMemo(() => {
    return getChartEnergyMacroCategoriesData(
      basketProductsComparisonNew || [],
      selectedMacro
    );
  }, [basketProductsComparisonNew, selectedMacro]);

  const chartComparisonEnergyMacroCategoriesData = useMemo(() => {
    return getChartEnergyMacroCategoriesData(
      basketProductsComparisonOld || [],
      selectedMacro
    );
  }, [basketProductsComparisonOld, selectedMacro]);

  const chartEnergyMicroCategoriesData = useMemo(() => {
    return getChartEnergyMicroCategoriesData(
      basketProductsComparisonNew || [],
      selectedMicro
    );
  }, [basketProductsComparisonNew, selectedMicro]);

  const chartComparisonEnergyMicroCategoriesData = useMemo(() => {
    return getChartEnergyMicroCategoriesData(
      basketProductsComparisonOld || [],
      selectedMicro
    );
  }, [basketProductsComparisonOld, selectedMicro]);

  useEffect(() => {
    if (currentTab === "energy" && selectedCategories.major.length === 0) {
      if (chartEnergyCategoriesData.length > 0) {
        // Find the category with the highest value
        const defaultCategory = chartEnergyCategoriesData.reduce(
          (max, category) => (category.value > max.value ? category : max)
        ).name;

        setSelectedCategories({ major: [defaultCategory], sub: [] });
      }
    } else if (
      currentTab === "macro" &&
      selectedCategories.major.length === 0
    ) {
      if (chartEnergyMacroCategoriesData.length > 0) {
        // Find the category with the highest value
        const defaultCategory = chartEnergyMacroCategoriesData.reduce(
          (max, category) => (category.value > max.value ? category : max)
        ).name;
        setSelectedCategories({ major: [defaultCategory], sub: [] });
      }
    } else if (
      currentTab === "micro" &&
      selectedCategories.major.length === 0
    ) {
      if (chartEnergyMicroCategoriesData.length > 0) {
        // Find the category with the highest value
        const defaultCategory = chartEnergyMicroCategoriesData.reduce(
          (max, category) => (category.value > max.value ? category : max)
        ).name;
        setSelectedCategories({ major: [defaultCategory], sub: [] });
      }
    }
  }, [
    chartEnergyCategoriesData,
    chartEnergyMacroCategoriesData,
    chartEnergyMicroCategoriesData,
    currentTab,
    selectedCategories,
    setSelectedCategories,
  ]);

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

  useEffect(() => {
    // Check if all processing is finished
    if (
      !isLoadingBasketProductsComparisonNew &&
      !isLoadingBasketProductsComparisonOld &&
      chartEnergyMacroData &&
      chartComparisonEnergyMacroData &&
      chartEnergyCategoriesData &&
      chartComparisonEnergyCategoriesData &&
      chartEnergyMacroCategoriesData &&
      chartComparisonEnergyMacroCategoriesData &&
      chartEnergyMicroCategoriesData &&
      chartComparisonEnergyMicroCategoriesData
    ) {
      setIsProcessing(false);
    }
  }, [
    isLoadingBasketProductsComparisonNew,
    isLoadingBasketProductsComparisonOld,
    chartEnergyMacroData,
    chartComparisonEnergyMacroData,
    chartEnergyCategoriesData,
    chartComparisonEnergyCategoriesData,
    chartEnergyMacroCategoriesData,
    chartComparisonEnergyMacroCategoriesData,
    chartEnergyMicroCategoriesData,
    chartComparisonEnergyMicroCategoriesData,
  ]);

  const { data: sessions } = useQuery<Sessions>({
    queryKey: ["sessions", patientId],
    queryFn: () => fetchSessions(patientId, session?.accessToken || ""),
  });

  if (sessions && sessions.length < 2) {
    return (
      <div className="bg-white -ml-8 -mr-8 border-x border-gray-300 pt-6 bg-gray-50 flex flex-col flex-1 px-8 border-b h-[calc(100vh-184px)]">
        <AnalysisHeader />
        <div className="-mx-8 flex-1 max-h-[calc(100vh-320px)] overflow-y-auto pb-6 px-8">
          <div className="flex mt-6 px-4 justify-center w-full">
            <div className="text-center">
              <CalendarDateRangeIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                Keine zweite Sitzung
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Ansicht des Fortschritt ist erst ab zwei Sitzungen möglich.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white -ml-8 -mr-8 border-x border-gray-300 pt-6 bg-gray-50 flex flex-col flex-1 px-8 border-b h-[calc(100vh-184px)]">
      <AnalysisHeader />
      <div className="-mx-8 flex-1 max-h-[calc(100vh-320px)] overflow-y-auto pb-6 px-8">
        <DateRangePickerComp />
        <div>
          {(isLoadingBasketProductsComparisonNew ||
            isLoadingBasketProductsComparisonOld ||
            isProcessing) && <Spinner />}
          {!isLoadingBasketProductsComparisonNew &&
          !isLoadingBasketProductsComparisonOld &&
          !isProcessing &&
          selectedBasketIds.length > 0 ? (
            <>
              {currentTab === "energy" && (
                <>
                  <br />
                  <h4 className="text-lg font-medium mb-2">
                    Energieverteilung aus Lebensmittelkategorien
                  </h4>
                  <div className="flex items-center justify-between">
                    <ChartEnergyCategories
                      data={chartComparisonEnergyCategoriesData}
                      replace={true}
                    />
                    <DiffDot
                      percentageDifference={percentageDifferenceSecondary}
                      variant="categoryMultiColor"
                    />
                    <ChartEnergyCategories
                      data={chartEnergyCategoriesData}
                      replace={true}
                    />
                  </div>

                  <br />
                  <h4 className="text-lg font-medium mb-2">
                    Energieverteilung aus Makronährstoffen
                  </h4>

                  <div className="flex items-center justify-between">
                    <ChartEnergyMacro data={chartComparisonEnergyMacroData} />
                    <DiffDot
                      percentageDifference={percentageDifferencePrimary}
                      variant="sort"
                    />
                    <ChartEnergyMacro data={chartEnergyMacroData} />
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
                      replace={true}
                    />
                    <DiffDot
                      percentageDifference={percentageDifferenceSecondary}
                      variant="categorySingleColor"
                    />
                    <ChartEnergyMacroCategories
                      data={chartEnergyMacroCategoriesData}
                      replace={true}
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
                      replace={true}
                    />
                    <DiffDot
                      percentageDifference={percentageDifferenceSecondary}
                      variant="categorySingleColor"
                    />
                    <ChartEnergyMicroCategories
                      data={chartEnergyMicroCategoriesData}
                      replace={true}
                    />
                  </div>
                </>
              )}
            </>
          ) : (
            !isLoadingBasketProductsComparisonNew &&
            !isLoadingBasketProductsComparisonOld &&
            !isProcessing && (
              <div className="flex mt-10 px-4 justify-center w-full">
                <div className="text-center">
                  <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">
                    Keine Einkäufe ausgewählt
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Bitte wählen Sie mindestens zwei Einkäufe aus, um Analysen
                    anzuzeigen.
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Selektieren Sie dazu ein entsprechendes Zeitfenster.
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Analysis;
