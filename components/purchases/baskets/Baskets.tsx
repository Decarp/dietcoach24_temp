"use client";

import { Error } from "@/components/Error";
import { Spinner } from "@/components/Spinner";
import { useCounterStore } from "@/providers/useStoreProvider";
import { Basket, Patient, Sessions } from "@/types/types";
import { classNames } from "@/utils/classNames";
import { fetchBaskets } from "@/utils/fetchBaskets";
import { fetchPatientDetails } from "@/utils/fetchPatientDetails";
import { fetchSessions } from "@/utils/fetchSessions";
import { formatDate } from "@/utils/formatDate";
import { getBasketTimestamps } from "@/utils/getBasketTimestamps";
import { mapBasketsResponse } from "@/utils/mapBasketsResponse";
import { useQuery } from "@tanstack/react-query";
import { fromUnixTime, isAfter, max, subWeeks } from "date-fns";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import BasketsHeader from "./BasketsHeader";
import { nutriScoreColorMap } from "@/data/nutriScoreColorMap";

const Baskets = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const patientId = pathname.split("/")[2];
  const initialized = useRef(false);
  const weeksToSelect = 8;

  const {
    hideBaskets,
    selectedBasketIds,
    setSelectedBasketIds,
    selectedBasketProductIds,
    setSelectedBasketProductIds,
  } = useCounterStore((state) => state);

  const { data: patient } = useQuery<Patient>({
    queryKey: ["participant", patientId],
    queryFn: () => fetchPatientDetails(patientId, session?.accessToken || ""),
    enabled: !!session?.accessToken,
  });

  const { data: sessions, isLoading: isLoadingSpinner } = useQuery<Sessions>({
    queryKey: ["sessions", patientId],
    queryFn: () => fetchSessions(patientId, session?.accessToken || ""),
    enabled: !!session?.accessToken,
  });

  const { startTimestamp, endTimestamp } = getBasketTimestamps(
    patient,
    sessions
  );

  const { isLoading, error, data } = useQuery<Basket[]>({
    queryKey: ["baskets", patientId, startTimestamp, endTimestamp],
    queryFn: () =>
      fetchBaskets(
        patientId,
        startTimestamp,
        endTimestamp || "",
        session?.accessToken || ""
      ),
    enabled: !!session?.accessToken && !!startTimestamp && !!endTimestamp,
  });

  const baskets = data ? mapBasketsResponse(data) : {};

  const selectLastNWeeks = useCallback(() => {
    if (Object.keys(baskets).length > 0) {
      const allDates = Object.values(baskets)
        .flat()
        .map((basket: Basket) => fromUnixTime(basket.timestamp));

      const latestDate = max(allDates);
      const earliestDate = subWeeks(latestDate, weeksToSelect);

      const selectedBaskets = Object.values(baskets)
        .flat()
        .filter((basket: Basket) =>
          isAfter(fromUnixTime(basket.timestamp), earliestDate)
        )
        .map((basket: Basket) => basket.basketId);

      if (
        selectedBaskets.length === selectedBasketIds.length &&
        selectedBaskets.every((id) => selectedBasketIds.includes(id))
      ) {
        setSelectedBasketIds([]);
      } else {
        setSelectedBasketIds(selectedBaskets);
      }
    }
  }, [baskets, selectedBasketIds, setSelectedBasketIds, weeksToSelect]);

  const areLastNWeeksSelected = useCallback(() => {
    if (Object.keys(baskets).length === 0) return false;

    const allDates = Object.values(baskets)
      .flat()
      .map((basket: Basket) => fromUnixTime(basket.timestamp));

    const latestDate = max(allDates);
    const earliestDate = subWeeks(latestDate, weeksToSelect);

    const expectedSelectedBaskets = Object.values(baskets)
      .flat()
      .filter((basket: Basket) =>
        isAfter(fromUnixTime(basket.timestamp), earliestDate)
      )
      .map((basket: Basket) => basket.basketId);

    return (
      expectedSelectedBaskets.length === selectedBasketIds.length &&
      expectedSelectedBaskets.every((id) => selectedBasketIds.includes(id))
    );
  }, [baskets, selectedBasketIds, weeksToSelect]);

  useEffect(() => {
    if (!initialized.current && Object.keys(baskets).length > 0) {
      selectLastNWeeks();
      initialized.current = true;
    }
  }, [baskets, selectLastNWeeks]);

  const handleBasketCheckboxChange = (basketId: string) => {
    if (selectedBasketIds.includes(basketId)) {
      setSelectedBasketIds(
        selectedBasketIds.filter((item) => item !== basketId)
      );
      setSelectedBasketProductIds(
        selectedBasketProductIds.filter(
          (product) => product.basketId !== basketId
        )
      );
    } else {
      setSelectedBasketIds([...selectedBasketIds, basketId]);
    }
  };

  const handleSelectAllChange = (letter: string, selectAll: boolean) => {
    const basketIds = baskets[letter].map((basket: any) => basket.basketId);
    if (selectAll) {
      setSelectedBasketIds([
        ...selectedBasketIds,
        ...basketIds.filter((id: string) => !selectedBasketIds.includes(id)),
      ]);
    } else {
      setSelectedBasketIds(
        selectedBasketIds.filter((id) => !basketIds.includes(id))
      );
    }
  };

  return (
    <div
      className={`pt-6 -ml-8 bg-white border-l flex flex-col border-b border-gray-300 min-w-64 xl:w-64 xl:shrink-0 h-[calc(100vh-185px)] ${
        hideBaskets ? "hidden" : ""
      }`}
    >
      <BasketsHeader
        baskets={baskets}
        areLastNWeeksSelected={areLastNWeeksSelected}
        selectLastNWeeks={selectLastNWeeks}
      />

      <div className="bg-white flex-1 overflow-y-auto min-h-0 min-h-8 shadow-inner">
        {(isLoading || isLoadingSpinner) && <Spinner className="mt-4" />}
        {error && <Error message={error.message} />}
        {data && (
          <nav aria-label="Baskets List" className="overflow-y-auto">
            {Object.keys(baskets).map((letter) => {
              const allSelected = baskets[letter].every((basket: any) =>
                selectedBasketIds.includes(basket.basketId)
              );

              return (
                <div key={letter} className="relative">
                  <div className="pl-8 sticky top-0 z-10 border-y border-b-gray-200 border-t-gray-100 bg-gray-50 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900">
                    <div className="flex justify-between items-center">
                      <h3>{letter}</h3>
                      <input
                        type="checkbox"
                        className="mr-4 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                        checked={allSelected}
                        onChange={(e) =>
                          handleSelectAllChange(letter, e.target.checked)
                        }
                      />
                    </div>
                  </div>
                  <ul role="list" className="divide-y divide-gray-100">
                    {baskets[letter].map((basket) => (
                      <li
                        key={basket.basketId}
                        className={classNames(
                          "pl-8 flex items-center gap-x-4 px-3 py-5",
                          selectedBasketIds.includes(basket.basketId)
                            ? "bg-primary text-white"
                            : ""
                        )}
                      >
                        <div className="relative flex-none">
                          <Image
                            src="/migros-logo-square.png"
                            alt="Migros logo"
                            width={48}
                            height={48}
                            className={classNames(
                              "border border-gray-300 h-12 w-12 p-2 flex-none rounded-md",
                              selectedBasketIds.includes(basket.basketId)
                                ? "bg-white text-primary"
                                : "bg-gray-50 text-primary"
                            )}
                          />
                          <div
                            className={classNames(
                              "shadow absolute top-0 -m-2 right-0 inline-flex items-center rounded-md px-1 text-xs font-medium",
                              (basket.avgNutriScore &&
                                nutriScoreColorMap[basket.avgNutriScore]) ||
                                "bg-gray-200 text-gray-700 border border-gray-300"
                            )}
                          >
                            {basket.avgNutriScore ? basket.avgNutriScore : "-"}
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className={classNames(
                              "text-base font-semibold leading-6 flex-0",
                              selectedBasketIds.includes(basket.basketId)
                                ? "text-white"
                                : "text-gray-900"
                            )}
                          >
                            Einkauf {basket.index + 1}
                          </p>

                          <p
                            className={classNames(
                              "truncate text-sm leading-5",
                              selectedBasketIds.includes(basket.basketId)
                                ? "text-white"
                                : "text-gray-500"
                            )}
                          >
                            {formatDate(basket.timestamp)}
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          className="h-4 w-4 mr-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                          checked={selectedBasketIds.includes(basket.basketId)}
                          onChange={() =>
                            handleBasketCheckboxChange(basket.basketId)
                          }
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </nav>
        )}
      </div>
    </div>
  );
};

export default Baskets;
