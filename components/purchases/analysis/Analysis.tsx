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

      const availableCategories = {
        major: Array.from(
          new Set(
            basketProductsFlat.map((product) => product.dietCoachCategoryL1.de)
          )
        ),
        sub: Array.from(
          new Set(
            basketProductsFlat.map((product) => product.dietCoachCategoryL2.de)
          )
        ),
      };

      setAvailableCategories(availableCategories);
      setSelectedCategories(availableCategories);
      setSelectedSortCriteria("Kohlenhydrate");
    }
  }, [basketProducts, setBasketProducts, currentBasketProducts]);

  const allAvailableCategoriesAreSelected = useMemo(() => {
    if (!availableCategories.major.length || !selectedCategories.major.length) {
      return false;
    }
    return (
      availableCategories.major.length === selectedCategories.major.length &&
      availableCategories.sub.length === selectedCategories.sub.length
    );
  }, [availableCategories, selectedCategories]);

  const handleSelectAllCategories = () => {
    if (allAvailableCategoriesAreSelected) {
      setSelectedCategories({ major: [], sub: [] });
    } else {
      setSelectedCategories(availableCategories);
    }
  };

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

  return (
    <div className="pt-6 bg-gray-50 flex flex-col flex-1 px-4 sm:px-6 lg:pl-8 xl:pl-6 border-b">
      <AnalysisHeader />
      <div className="shadow-inner -mx-6">
        <div className="flex-1 max-h-[calc(100vh-316px)] overflow-y-auto pb-6 px-6">
          {isLoading && <Spinner />}
          {!isLoading && selectedBasketIds.length > 0 ? (
            <>
              {currentTab === "energy" && (
                <>
                  <br />
                  <h4 className="text-lg font-medium mb-2">
                    Energieverteilung aus Makronährstoffen
                  </h4>
                  <ChartEnergyMacro data={chartEnergyMacroData} />
                  <br />
                  <div className="flex">
                    <h4 className="text-lg font-medium mb-2">
                      Energieverteilung aus Lebensmittelkategorien
                    </h4>
                    <button
                      className="ml-auto text-sm font-semibold text-gray-500"
                      onClick={handleSelectAllCategories}
                    >
                      {allAvailableCategoriesAreSelected
                        ? "Alle abwählen"
                        : "Alle auswählen"}
                    </button>
                  </div>
                  <ChartEnergyCategories data={chartEnergyCategoriesData} />
                </>
              )}
              {currentTab === "macro" && (
                <>
                  <br />
                  <div className="flex">
                    <h4 className="text-lg font-medium mb-2">
                      Makronährstoffe
                    </h4>
                    <button
                      className="ml-auto text-sm font-semibold text-gray-500"
                      onClick={handleSelectAllCategories}
                    >
                      {allAvailableCategoriesAreSelected
                        ? "Alle abwählen"
                        : "Alle auswählen"}
                    </button>
                  </div>
                  <ChartEnergyMacroCategories
                    data={chartEnergyMacroCategoriesData}
                  />
                </>
              )}
              {currentTab === "micro" && (
                <>
                  <br />
                  <div className="flex">
                    <h4 className="text-lg font-medium mb-2">
                      Weitere Nährstoffe
                    </h4>
                    <button
                      className="ml-auto text-sm font-semibold text-gray-500"
                      onClick={handleSelectAllCategories}
                    >
                      {allAvailableCategoriesAreSelected
                        ? "Alle abwählen"
                        : "Alle auswählen"}
                    </button>
                  </div>
                  <ChartEnergyMicroCategories
                    data={chartEnergyMicroCategoriesData}
                  />
                </>
              )}
              {currentTab === "nutri" && (
                <>
                  <br />
                  <div className="flex">
                    <h4 className="text-lg font-medium mb-2">Nutri-Score</h4>
                    <button
                      className="ml-auto text-sm font-semibold text-gray-500"
                      onClick={handleSelectAllCategories}
                    >
                      {allAvailableCategoriesAreSelected
                        ? "Alle abwählen"
                        : "Alle auswählen"}
                    </button>
                  </div>
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
