import { NutriScoreTable } from "@/components/charts/NutriScoreTable";
import AnalysisHeader from "@/components/purchases/analysis/AnalysisHeader";
import { Spinner } from "@/components/Spinner";
import { getChartEnergyCategoriesData } from "@/getData/getChartEnergyCategoriesData";
import { getChartEnergyMacroCategoriesData } from "@/getData/getChartEnergyMacroCategoriesData";
import { getChartEnergyMacroData } from "@/getData/getChartEnergyMacroData";
import { getChartEnergyMicroCategoriesData } from "@/getData/getChartEnergyMicroCategoriesData";
import { useCounterStore } from "@/providers/useStoreProvider";
import { BasketProduct } from "@/types/types";
import { fetchBasketProducts } from "@/utils/fetchBasketProducts";
import { ArrowLeftIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";

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
    hideBaskets,
    hideProducts,
    selectedBasketIds,
    currentTab,
    selectedMacro,
    selectedMicro,
    basketProducts: currentBasketProducts,
    basketProductsFlat: currentBasketProductsFlat,
    selectedCategories,
    availableCategories,
    setBasketProducts,
    setBasketProductsFlat,
    setSelectedCategories,
    setSelectedSortCriteria,
    setAvailableCategories,
  } = useCounterStore((state) => state);

  const { isLoading, error, data } = useQuery<BasketProduct[]>({
    queryKey: ["basketProducts", selectedBasketIds],
    queryFn: () =>
      fetchBasketProducts(
        patientId,
        selectedBasketIds,
        session?.accessToken || ""
      ),
    enabled: selectedBasketIds.length > 0 && !!session?.accessToken,
  });

  const basketProducts = data || [];

  useEffect(() => {
    if (
      basketProducts.length > 0 &&
      JSON.stringify(basketProducts) !== JSON.stringify(currentBasketProducts)
    ) {
      setBasketProducts(basketProducts);
      const basketProductsFlat = basketProducts.flatMap((basket) => {
        return basket.products.map((product) => ({
          basketId: basket.basketId,
          basketIndex: basket.index,
          basketTimestamp: basket.timestamp,
          ...product,
        }));
      });
      setBasketProductsFlat(basketProductsFlat);
      setAvailableCategories(availableCategories);
      setSelectedCategories(availableCategories);
      setSelectedSortCriteria("Kohlenhydrate");
    }
  }, [basketProducts, setBasketProducts, currentBasketProducts]);

  const chartEnergyMacroData = useMemo(() => {
    return getChartEnergyMacroData(basketProducts);
  }, [basketProducts]);

  const chartEnergyCategoriesData = useMemo(() => {
    const data = getChartEnergyCategoriesData(basketProducts);
    return data.sort((a, b) => a.name.localeCompare(b.name));
  }, [basketProducts]);

  const chartEnergyMacroCategoriesData = useMemo(() => {
    return getChartEnergyMacroCategoriesData(basketProducts, selectedMacro);
  }, [basketProducts, selectedMacro]);

  const chartEnergyMicroCategoriesData = useMemo(() => {
    return getChartEnergyMicroCategoriesData(basketProducts, selectedMicro);
  }, [basketProducts, selectedMicro]);

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

  return (
    <div
      className={`pt-6 bg-gray-50 flex flex-col flex-1 px-6 border-gray-300 border-b border-x ${
        hideProducts || hideBaskets ? "bg-white " : " "
      } ${hideBaskets ? "-ml-8 " : " "} ${hideProducts ? "-mr-8 " : " "}
      `}
    >
      <AnalysisHeader />
      <div className="shadow-inner -mx-6">
        <div className="flex-1 h-[calc(100vh-311px)] overflow-y-auto pb-6 px-6">
          {isLoading && <Spinner />}
          {!isLoading && selectedBasketIds.length > 0 ? (
            <>
              {currentTab === "energy" && (
                <>
                  <br />
                  <h4 className="text-lg font-medium mb-2">
                    Energieverteilung aus Lebensmittelkategorien
                  </h4>
                  <ChartEnergyCategories
                    data={chartEnergyCategoriesData}
                    replace={true}
                    className={`${
                      hideProducts || hideBaskets ? "bg-gray-50" : "bg-white"
                    }`}
                  />

                  <br />
                  <h4 className="text-lg font-medium mb-2">
                    Energieverteilung aus Makronährstoffen
                  </h4>
                  <ChartEnergyMacro
                    data={chartEnergyMacroData}
                    className={`${
                      hideProducts || hideBaskets ? "bg-gray-50" : "bg-white"
                    }`}
                  />
                </>
              )}
              {currentTab === "macro" && (
                <>
                  <br />
                  <h4 className="text-lg font-medium mb-2">Makronährstoffe</h4>
                  <ChartEnergyMacroCategories
                    data={chartEnergyMacroCategoriesData}
                    replace={true}
                    className={`${
                      hideProducts || hideBaskets ? "bg-gray-50" : "bg-white"
                    }`}
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
                    replace={true}
                    className={`${
                      hideProducts || hideBaskets ? "bg-gray-50" : "bg-white"
                    }`}
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
            !isLoading && (
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
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Analysis;
