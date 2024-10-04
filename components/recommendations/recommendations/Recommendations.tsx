import { useCounterStore } from "@/providers/useStoreProvider";
import {
  DatabaseProduct,
  EnrichedRecommendation,
  Session,
} from "@/types/types";
import { deleteRecommendation } from "@/utils/deleteRecommendation";
import { fetchProduct } from "@/utils/fetchProduct";
import { fetchSession } from "@/utils/fetchSession";
import { TrashIcon } from "@heroicons/react/24/outline";
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/solid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import RecommendationsHeader from "./RecommendationsHeader";
import RecommendedAlternativesSection from "./RecommendedAlternativesSection";
import RecommendedProductsSection from "./RecommendedProductsSection";
import { useState } from "react";
import DeleteModal from "@/components/DeleteModal";

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
  const enrichedRecommendations: EnrichedRecommendation[] =
    consultationSession?.recommendations.map((recommendation) => {
      const enrichedCurrentProducts = recommendation.suggestions.current
        .map((gtin) => {
          return fullProducts?.find((product) =>
            product.gtins.includes(Number(gtin))
          );
        })
        .filter((product): product is DatabaseProduct => product !== undefined); // Filter out undefined

      const enrichedAlternativeProducts =
        recommendation.suggestions.alternatives
          .map((gtin) => {
            return fullProducts?.find((product) =>
              product.gtins.includes(Number(gtin))
            );
          })
          .filter(
            (product): product is DatabaseProduct => product !== undefined
          ); // Filter out undefined

      return {
        ...recommendation,
        suggestions: {
          current: enrichedCurrentProducts,
          alternatives: enrichedAlternativeProducts,
        },
      };
    }) || [];

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recommendationToDelete, setRecommendationToDelete] = useState<
    number | null
  >(null);

  const openModal = (recommendationId: number) => {
    setRecommendationToDelete(recommendationId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setRecommendationToDelete(null);
  };

  const handleDeleteRecommendation = () => {
    if (recommendationToDelete !== null) {
      deleteRecommendationMutation.mutate(recommendationToDelete);
    }
    closeModal();
  };

  if (!session) {
    return null;
  }

  if (selectedSessionId === null) {
    return (
      <div className="pt-6 bg-gray-50 flex flex-col flex-1 px-4 sm:px-6 lg:pl-8 xl:pl-6 border-b border-gray-300">
        <RecommendationsHeader
          numRecommendations={0}
          sessionData={consultationSession}
          enrichedRecommendations={enrichedRecommendations}
        />
        <div className="shadow-inner -mx-6">
          <div className="flex-1 mt-12 max-h-[calc(100vh-314px)] overflow-y-auto pb-6 px-6">
            <div className="text-center">
              <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-6 text-sm font-semibold text-gray-900">
                Keine Sitzung ausgewählt
              </h3>
              <p className="mt-2 text-sm text-gray-500">
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
      <div className="pt-6 bg-gray-50 flex flex-col flex-1 px-4 sm:px-6 lg:pl-8 xl:pl-6 border-b border-gray-300">
        <RecommendationsHeader
          numRecommendations={0}
          sessionData={consultationSession}
          enrichedRecommendations={enrichedRecommendations}
        />
        <div className="shadow-inner -mx-6">
          <div className="flex-1 mt-12 max-h-[calc(100vh-314px)] overflow-y-auto pb-6 px-6">
            <div className="text-center">
              <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-6 text-sm font-semibold text-gray-900">
                Keine Empfehlungen vorhanden
              </h3>
              <p className="mt-2 mb-12 text-sm text-gray-500">
                Es wurden keine Empfehlungen für diese Sitzung gefunden.
              </p>
              <Link
                href={`/p/${patientId}/purchases`}
                className="inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm hover:scale-105 transition-transform bg-primary text-white hover:bg-green-700"
              >
                <MagnifyingGlassIcon
                  aria-hidden="true"
                  className="-ml-0.5 mr-2 h-5 w-5 text-white"
                />
                Einkäufe analysieren und Empfehlungen erstellen
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-6 bg-gray-50 flex flex-col flex-1 px-4 sm:px-6 lg:pl-8 xl:pl-6 border-b border-gray-300">
      <RecommendationsHeader
        numRecommendations={enrichedRecommendations?.length ?? 0}
        sessionData={consultationSession}
        enrichedRecommendations={enrichedRecommendations}
      />
      <div className="shadow-inner -mx-6">
        <div className="flex-1 max-h-[calc(100vh-287px)] overflow-y-auto px-6">
          <ul className="mt-6 text-gray-500">
            {enrichedRecommendations?.map((recommendation) => (
              <li
                key={recommendation.recommendationId}
                className="bg-white p-4 border rounded-md mb-4 border-gray-300"
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
                  <TrashIcon
                    className="ml-3 h-6 w-6 flex-shrink-0 cursor-pointer text-gray-500 hover:text-red-500 hover:scale-110 transition-transform"
                    onClick={() => openModal(recommendation.recommendationId)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4 rounded-lg">
                  <RecommendedProductsSection
                    products={recommendation.suggestions.current}
                  />
                  <RecommendedAlternativesSection
                    products={recommendation.suggestions.alternatives}
                  />
                </div>

                <div>
                  {recommendation.notes && (
                    <div className="mt-4">
                      <textarea
                        id="comment"
                        name="comment"
                        rows={2}
                        className="block w-full rounded-md border-0 border-gray-300 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                        defaultValue={recommendation.notes}
                      />
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <DeleteModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          onConfirm={handleDeleteRecommendation}
        />
      )}
    </div>
  );
};

export default Recommendations;
