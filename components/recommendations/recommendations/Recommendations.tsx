import ProductCardDatabase from "@/components/purchases/products/ProductCardDatabase";
import { useCounterStore } from "@/providers/useStoreProvider";
import { DatabaseProduct, Session } from "@/types/types";
import { deleteSession } from "@/utils/deleteSession";
import { fetchProduct } from "@/utils/fetchProduct";
import { fetchSession } from "@/utils/fetchSession";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { TrashIcon } from "@heroicons/react/20/solid";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import RecommendationsHeader from "./RecommendationsHeader";
import { deleteRecommendation } from "@/utils/deleteRecommendation";

const Recommendations = () => {
  const pathname = usePathname();
  const patientId = pathname.split("/")[2];

  const { data: session } = useSession();
  const { selectedSessionId, setSelectedSessionId } = useCounterStore(
    (state) => ({
      selectedSessionId: state.selectedSessionId,
      setSelectedSessionId: state.setSelectedSessionId,
    })
  );

  // Fetch existing sessions
  const { data: consultationSession, refetch } = useQuery<Session>({
    queryKey: ["session", selectedSessionId],
    queryFn: () =>
      fetchSession(selectedSessionId ?? 0, session?.accessToken || ""),
    enabled: selectedSessionId !== null && !!session?.accessToken,
  });

  const queryClient = useQueryClient();

  // Get all product IDs from recommendations
  const alternativeProductIds =
    consultationSession?.recommendations.flatMap(
      (recommendation) => recommendation.suggestions.alternatives
    ) || [];

  const currentProductIds =
    consultationSession?.recommendations.flatMap(
      (recommendation) => recommendation.suggestions.current
    ) || [];

  // Concatenate all product IDs and remove duplicates
  const allProductIds = Array.from(
    new Set([...alternativeProductIds, ...currentProductIds])
  );

  // Fetch all products for the given GTINs
  const { data: fullProducts } = useQuery<DatabaseProduct[]>({
    queryKey: ["products", allProductIds],
    queryFn: () =>
      Promise.all(allProductIds.map((gtin) => fetchProduct(gtin.toString()))),
    enabled: allProductIds.length > 0 && !!session?.accessToken,
  });

  // Map the full product details back to the recommendations
  const enrichedRecommendations = consultationSession?.recommendations.map(
    (recommendation) => {
      const enrichedCurrentProducts = recommendation.suggestions.current.map(
        (gtin) => {
          const product = fullProducts?.find((product) =>
            product.gtins.includes(Number(gtin))
          );
          if (!product) {
            console.warn(`Product not found for GTIN: ${gtin}`);
          }
          return product;
        }
      );

      const enrichedAlternativeProducts =
        recommendation.suggestions.alternatives.map((gtin) => {
          const product = fullProducts?.find((product) =>
            product.gtins.includes(Number(gtin))
          );
          if (!product) {
            console.warn(`Product not found for GTIN: ${gtin}`);
          }
          return product;
        });

      return {
        ...recommendation,
        suggestions: {
          current: enrichedCurrentProducts,
          alternatives: enrichedAlternativeProducts,
        },
      };
    }
  );

  const deleteMutation = useMutation({
    mutationFn: () =>
      deleteSession(selectedSessionId ?? 0, session?.accessToken || ""),
    onSuccess: () => {
      setSelectedSessionId(null);
      queryClient.refetchQueries({ queryKey: ["sessions", patientId] });
      toast.success("Sitzung erfolgreich gelöscht", { duration: 3000 });
    },
  });

  const handleDeleteSession = () => {
    deleteMutation.mutate();
  };

  // DELETE recommendation mutation
  const deleteRecommendationMutation = useMutation({
    mutationFn: (recommendationId: number) =>
      deleteRecommendation(recommendationId, session?.accessToken || ""),
    onSuccess: () => {
      toast.success("Empfehlung erfolgreich gelöscht", { duration: 3000 });
      refetch(); // Refetch the session to update the recommendations list
    },
    onError: () => {
      toast.error("Fehler beim Löschen der Empfehlung", { duration: 3000 });
    },
  });

  // Handle delete recommendation
  const handleDeleteRecommendation = (recommendationId: number) => {
    deleteRecommendationMutation.mutate(recommendationId);
  };

  if (!session) {
    return null;
  }

  if (selectedSessionId === null) {
    return (
      <div className="pt-6 bg-gray-50 flex flex-col flex-1 px-4 sm:px-6 lg:pl-8 xl:pl-6 border-b">
        <RecommendationsHeader numRecommendations={0} />
        <div className="shadow-inner -mx-6">
          <div className="flex-1 max-h-[calc(100vh-314px)] overflow-y-auto pb-6 px-6">
            <div className="text-center">
              <h3 className="mt-6 text-sm font-semibold text-gray-900">
                Keine Sitzung ausgewählt
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Bitte wählen Sie eine Sitzung aus, um Empfehlungen anzuzeigen.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (enrichedRecommendations?.length === 0) {
    return (
      <div className="pt-6 bg-gray-50 flex flex-col flex-1 px-4 sm:px-6 lg:pl-8 xl:pl-6 border-b">
        <RecommendationsHeader numRecommendations={0} />
        <div className="shadow-inner -mx-6">
          <div className="flex-1 max-h-[calc(100vh-314px)] overflow-y-auto pb-6 px-6">
            <div className="text-center">
              <h3 className="mt-6 text-sm font-semibold text-gray-900">
                Keine Empfehlungen vorhanden
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Es wurden keine Empfehlungen für diese Sitzung gefunden.
              </p>
            </div>
          </div>
        </div>
        <div>
          <button
            onClick={handleDeleteSession}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md"
          >
            Sitzung löschen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-6 bg-gray-50 flex flex-col flex-1 px-4 sm:px-6 lg:pl-8 xl:pl-6 border-b">
      <RecommendationsHeader
        numRecommendations={enrichedRecommendations?.length ?? 0}
      />
      <div className="shadow-inner -mx-6">
        <div className="flex-1 max-h-[calc(100vh-287px)] overflow-y-auto px-6">
          <ul className="mt-6 text-gray-500">
            {enrichedRecommendations?.map((recommendation) => (
              <li
                key={recommendation.recommendationId}
                className="bg-white p-4 border rounded-md mb-4"
              >
                <div className="flex items-center">
                  {recommendation.rule.variant === "VAR1" && (
                    <div className="relative flex-1">
                      <div className="flex rounded-md items-center">
                        <span className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary">
                          {recommendation.rule.mode}
                        </span>
                        <span className="inline-flex items-center border rounded-md mx-2 border-gray-300 px-3 text-gray-500 sm:text-xs">
                          der Zufuhr von
                        </span>
                        <span className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary">
                          {recommendation.rule.nutrient}
                        </span>
                        <span className="inline-flex items-center border rounded-md mx-2 border-gray-300 px-3 text-gray-500 sm:text-xs">
                          aus
                        </span>
                        <span className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary">
                          {recommendation.rule.category}
                        </span>
                      </div>
                    </div>
                  )}
                  {recommendation.rule.variant === "VAR2" && (
                    <div className="relative flex-1">
                      <div className="flex rounded-md items-center">
                        <span className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary">
                          {recommendation.rule.mode}
                        </span>
                        <span className="inline-flex items-center border rounded-md mx-2 border-gray-300 px-3 text-gray-500 sm:text-xs">
                          der Zufuhr aus
                        </span>
                        <span className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary">
                          {recommendation.rule.category}
                        </span>
                      </div>
                    </div>
                  )}
                  {recommendation.rule.variant === "FREITEXT" && (
                    <div className="relative flex-1">
                      <div className="flex rounded-md items-center">
                        <span className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary">
                          {recommendation.rule.text}
                        </span>
                      </div>
                    </div>
                  )}
                  <Menu as="div" className="relative inline-block text-left">
                    <div>
                      <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900">
                        <EllipsisVerticalIcon
                          aria-hidden="true"
                          className="-mr-1 h-5 w-5 text-gray-400"
                        />
                      </MenuButton>
                    </div>
                    <MenuItems
                      transition
                      className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                    >
                      <div className="py-1">
                        <MenuItem>
                          <button
                            className="group flex items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                            onClick={() =>
                              handleDeleteRecommendation(
                                recommendation.recommendationId
                              )
                            }
                          >
                            <TrashIcon
                              aria-hidden="true"
                              className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                            />
                            Empfehlung entfernen
                          </button>
                        </MenuItem>
                      </div>
                    </MenuItems>
                  </Menu>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4 rounded-lg">
                  <section className="bg-white border rounded-md">
                    <div className="flex items-center py-2 px-4 border border-0 border-b ">
                      <h3 className="w-full block text-sm font-medium text-gray-500">
                        Gekaufte Produkte
                      </h3>
                      <ShoppingCartIcon className="h-6 w-6 text-red-500" />
                      <ArrowDownIcon className="ml-1 h-4 w-4 text-red-500" />
                    </div>

                    <div className="overflow-y-scroll">
                      {recommendation.suggestions.current.length === 0 && (
                        <div className="text-center">
                          <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-sm font-semibold text-gray-900">
                            Keine Produkte ausgewählt
                          </h3>
                        </div>
                      )}

                      <ul className="p-4 space-y-4">
                        {recommendation.suggestions.current.map((product) => (
                          <ProductCardDatabase
                            product={product}
                            key={product?.gtins[0]}
                          />
                        ))}
                      </ul>
                    </div>
                  </section>

                  <section className="bg-white border rounded-md">
                    <div className="flex items-center py-2 px-4 border border-0 border-b ">
                      <h3 className="w-full block text-sm font-medium text-gray-500">
                        Alternative Produkte
                      </h3>
                      <ShoppingCartIcon className="h-6 w-6 text-primary" />
                      <ArrowUpIcon className="ml-1 h-4 w-4 text-primary" />
                    </div>

                    <div className="overflow-y-scroll">
                      {recommendation.suggestions.alternatives.length === 0 && (
                        <div className="text-center">
                          <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-sm font-semibold text-gray-900">
                            Keine Produkte ausgewählt
                          </h3>
                        </div>
                      )}
                      <ul className="p-4 space-y-4">
                        {recommendation.suggestions.alternatives.map(
                          (product) => (
                            <ProductCardDatabase
                              product={product}
                              key={product?.gtins[0]}
                            />
                          )
                        )}
                      </ul>
                    </div>
                  </section>
                </div>

                <div>
                  {recommendation.notes && (
                    <div className="mt-4">
                      <textarea
                        id="comment"
                        name="comment"
                        rows={4}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                        defaultValue={recommendation.notes}
                      />
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <div>
            <button
              onClick={handleDeleteSession}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md"
            >
              Sitzung löschen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
