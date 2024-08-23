"use client";

import { useCounterStore } from "@/providers/useStoreProvider";
import { Basket, Patient, Sessions } from "@/types/types";
import { classNames } from "@/utils/classNames";
import { fetchBaskets } from "@/utils/fetchBaskets";
import { fetchPatientDetails } from "@/utils/fetchPatientDetails";
import { fetchSessions } from "@/utils/fetchSessions";
import { formatDate } from "@/utils/formatDate";
import { getBasketTimestamps } from "@/utils/getBasketTimestamps";
import { mapBasketsResponse } from "@/utils/mapBasketsResponse";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { fromUnixTime, isAfter, max, subWeeks } from "date-fns";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import BasketsHeader from "./BasketsHeader";

const Baskets = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const patientId = pathname.split("/")[2];
  const initialized = useRef(false);
  const weeksToSelect = 8;

  const {
    selectedBasketIds,
    setSelectedBasketIds,
    selectedBasketProductIds,
    setSelectedBasketProductIds,
    selectedComparisonBasketIds,
    setSelectedComparisonBasketIds,
  } = useCounterStore((state) => state);

  const { data: patient } = useQuery<Patient>({
    queryKey: ["participant", patientId],
    queryFn: () => fetchPatientDetails(patientId),
  });

  const { data: sessions } = useQuery<Sessions>({
    queryKey: ["sessions", patientId],
    queryFn: () => fetchSessions(patientId),
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
      const dateMinus8Weeks = subWeeks(latestDate, weeksToSelect);
      const dateMinus16Weeks = subWeeks(latestDate, weeksToSelect * 2);

      const selectedBaskets = Object.values(baskets)
        .flat()
        .filter((basket: Basket) =>
          isAfter(fromUnixTime(basket.timestamp), dateMinus8Weeks)
        )
        .map((basket: Basket) => basket.basketId);

      const comparisonBaskets = Object.values(baskets)
        .flat()
        .filter(
          (basket: Basket) =>
            isAfter(fromUnixTime(basket.timestamp), dateMinus16Weeks) &&
            !isAfter(fromUnixTime(basket.timestamp), dateMinus8Weeks)
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

      setSelectedComparisonBasketIds(comparisonBaskets);
    }
  }, [
    baskets,
    selectedBasketIds,
    setSelectedBasketIds,
    setSelectedComparisonBasketIds,
    weeksToSelect,
  ]);

  useEffect(() => {
    if (!initialized.current && Object.keys(baskets).length > 0) {
      selectLastNWeeks();
      initialized.current = true;
    }
  }, [baskets, selectLastNWeeks]);

  const handleBasketCheckboxChange = (basketId: string) => {
    if (selectedBasketIds.includes(basketId)) {
      // Deselect basket
      setSelectedBasketIds(
        selectedBasketIds.filter((item) => item !== basketId)
      );
      setSelectedBasketProductIds(
        selectedBasketProductIds.filter(
          (product) => product.basketId !== basketId
        )
      );
    } else {
      // If it's in comparison list, remove it from there
      setSelectedComparisonBasketIds(
        selectedComparisonBasketIds.filter((item) => item !== basketId)
      );
      // Select basket
      setSelectedBasketIds([...selectedBasketIds, basketId]);
    }
  };

  const handleComparisonCheckboxChange = (basketId: string) => {
    if (selectedComparisonBasketIds.includes(basketId)) {
      // Deselect basket for comparison
      setSelectedComparisonBasketIds(
        selectedComparisonBasketIds.filter((item) => item !== basketId)
      );
    } else {
      // If it's in selected basket list, remove it from there
      setSelectedBasketIds(
        selectedBasketIds.filter((item) => item !== basketId)
      );
      // Select basket for comparison
      setSelectedComparisonBasketIds([
        ...selectedComparisonBasketIds,
        basketId,
      ]);
    }
  };

  const handleSelectAllChange = (letter: string, selectAll: boolean) => {
    const basketIds = baskets[letter].map((basket: any) => basket.basketId);
    if (selectAll) {
      // Deselect from comparison list if in there
      setSelectedComparisonBasketIds(
        selectedComparisonBasketIds.filter((id) => !basketIds.includes(id))
      );
      // Select all baskets in the section
      setSelectedBasketIds([
        ...selectedBasketIds,
        ...basketIds.filter((id: string) => !selectedBasketIds.includes(id)),
      ]);
    } else {
      // Deselect all baskets in the section
      setSelectedBasketIds(
        selectedBasketIds.filter((id) => !basketIds.includes(id))
      );
    }
  };

  const handleSelectAllForComparisonChange = (
    letter: string,
    selectAll: boolean
  ) => {
    const basketIds = baskets[letter].map((basket: any) => basket.basketId);
    if (selectAll) {
      // Deselect from selected list if in there
      setSelectedBasketIds(
        selectedBasketIds.filter((id) => !basketIds.includes(id))
      );
      // Select all baskets in the section for comparison
      setSelectedComparisonBasketIds([
        ...selectedComparisonBasketIds,
        ...basketIds.filter(
          (id: string) => !selectedComparisonBasketIds.includes(id)
        ),
      ]);
    } else {
      // Deselect all baskets in the section for comparison
      setSelectedComparisonBasketIds(
        selectedComparisonBasketIds.filter((id) => !basketIds.includes(id))
      );
    }
  };

  const tabs = ["Woche -16 bis -8", "Woche -8 bis heute"];

  const [currentTab, setCurrentTab] = useState("Persönlich");

  const handleTabChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentTab(event.target.value);
  };

  const handleTabClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setCurrentTab(event.currentTarget.value);
  };

  return (
    <div className="pt-6 -ml-8 bg-white border-l flex flex-col border-b border-gray-300 xl:w-64 xl:shrink-0 h-[calc(100vh-184px)]">
      <BasketsHeader baskets={baskets} />

      <div className="ml-6">
        <div className="sm:hidden">
          <label htmlFor="current-tab" className="sr-only">
            Select a tab
          </label>
          <select
            id="current-tab"
            name="current-tab"
            defaultValue={currentTab}
            onChange={handleTabChange}
            className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary"
          >
            {tabs.map((tab) => (
              <option key={tab} value={tab}>
                {tab}
              </option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block border-b -mx-4 sm:-mx-6 lg:-mx-6 lg:-ml-8 xl:-ml-6">
          <nav className="-mb-px flex space-x-8 px-4 sm:px-5 lg:px-7 xl:px-5">
            {tabs.map((tab) => (
              <button
                key={tab}
                value={tab}
                onClick={handleTabClick}
                className={classNames(
                  tab === currentTab
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                  "mt-3 whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium"
                )}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="bg-white flex-1 overflow-y-auto min-h-0 min-h-8 shadow-inner">
        <nav aria-label="Baskets List" className="overflow-y-auto">
          {Object.keys(baskets).map((letter) => {
            const allSelected = baskets[letter].every((basket: any) =>
              selectedBasketIds.includes(basket.basketId)
            );
            const allSelectedForComparison = baskets[letter].every(
              (basket: any) =>
                selectedComparisonBasketIds.includes(basket.basketId)
            );

            return (
              <div key={letter} className="relative">
                <div className="pl-8 sticky top-0 z-10 border-y border-b-gray-200 border-t-gray-100 bg-gray-50 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900">
                  <div className="flex justify-between items-center">
                    <h3>{letter}</h3>
                    <div className="flex flex-row gap-x-2">
                      <input
                        type="radio"
                        className="h-4 w-4 rounded-full border-secondary border-2 text-secondary focus:ring-primary"
                        checked={allSelectedForComparison}
                        onChange={(e) =>
                          handleSelectAllForComparisonChange(
                            letter,
                            e.target.checked
                          )
                        }
                      />
                      <input
                        type="radio"
                        className="h-4 w-4 rounded-full border-primary border-2 text-primary focus:ring-primary"
                        checked={allSelected}
                        onChange={(e) =>
                          handleSelectAllChange(letter, e.target.checked)
                        }
                      />
                    </div>
                  </div>
                </div>

                <ul role="list" className="divide-y divide-gray-100">
                  {baskets[letter].map((person: any) => {
                    const isSelected = selectedBasketIds.includes(
                      person.basketId
                    );
                    const isSelectedForComparison =
                      selectedComparisonBasketIds.includes(person.basketId);
                    return (
                      <li
                        key={person.basketId}
                        className={classNames(
                          "pl-8 flex items-center gap-x-4 px-3 py-5",
                          isSelected
                            ? "bg-primary text-white"
                            : isSelectedForComparison
                            ? "bg-secondary text-white"
                            : ""
                        )}
                      >
                        <ShoppingCartIcon
                          className={classNames(
                            "border border-gray-300 h-12 w-12 p-2 flex-none rounded-md",
                            isSelected
                              ? "bg-white text-primary"
                              : isSelectedForComparison
                              ? "bg-white text-secondary"
                              : "bg-gray-50 text-primary"
                          )}
                        />
                        <div className="min-w-0 flex-1">
                          <p
                            className={classNames(
                              "text-base font-semibold leading-6",
                              isSelected || isSelectedForComparison
                                ? "text-white"
                                : "text-gray-900"
                            )}
                          >
                            Einkauf {person.index}
                          </p>
                          <p
                            className={classNames(
                              "truncate text-sm leading-5",
                              isSelected || isSelectedForComparison
                                ? "text-white"
                                : "text-gray-500"
                            )}
                          >
                            {formatDate(person.timestamp)}
                          </p>
                        </div>
                        <div className="flex flex-row gap-x-2">
                          <input
                            type="radio"
                            className="h-4 w-4 rounded-full border-secondary border-2 text-secondary focus:ring-secondary"
                            checked={isSelectedForComparison}
                            onChange={() =>
                              handleComparisonCheckboxChange(person.basketId)
                            }
                          />
                          <input
                            type="radio"
                            className="h-4 w-4 rounded-full border-primary border-2 text-primary focus:ring-primary"
                            checked={isSelected}
                            onChange={() =>
                              handleBasketCheckboxChange(person.basketId)
                            }
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Baskets;
