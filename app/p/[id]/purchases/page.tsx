"use client";

import React, { useState, useEffect } from "react";
import PatientCard from "@/components/PatientCard";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { patients } from "@/data/patients";
import Products from "@/components/purchases/products/Products";
import Baskets from "@/components/purchases/baskets/Baskets";
import Analysis from "@/components/purchases/analysis/Analysis";
import { mapBasketsResponse } from "@/utils/mapBasketsResponse";
import { basketsResponse } from "@/data/basketsResponse";
import { getBaskets } from "@/api/getBaskets";
import { getBasketProducts } from "@/api/getBasketProducts";

export type Basket = {
  basketId: number;
  index: number;
  timestamp: number;
  avg_nutriscore: number;
};

export type Product = {
  productId: number;
  name: string;
  nutriscore: number;
  category: {
    de: string;
    en: string;
  };
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
};

export type BasketProduct = {
  basketId: number;
  index: number;
  timestamp: number;
  avg_nutriscore: number;
  products: Product[];
};

export type BasketProductFlat = {
  basketId: number;
  basketIndex: number;
  basketTimestamp: number;
  productId: number;
  name: string;
  nutriscore: number;
  category: {
    de: string;
    en: string;
  };
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
};

export type SelectedBasketIds = number[];

export type SelectedBasketProductId = {
  basketId: number;
  productId: number;
};

export default function Purchases() {
  const baskets = getBaskets();
  const basketsMapped = mapBasketsResponse(basketsResponse);

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathSegments = pathname.split("/");
  const patientId = pathSegments[2];
  const patient = patients.find((p) => p.id === patientId);

  const [currentTab, setCurrentTab] = useState(
    searchParams.get("chart") || "energy"
  );
  const [selectedBasketIds, setSelectedBasketIds] = useState<SelectedBasketIds>(
    []
  );
  const [selectedBasketProductIds, setSelectedBasketProductIds] = useState<
    SelectedBasketProductId[]
  >([]);

  useEffect(() => {
    setCurrentTab(searchParams.get("chart") || "energy");
  }, [searchParams]);

  const handleTabChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTab = event.target.value;
    router.push(`/p/${patientId}/purchases?chart=${selectedTab}`);
  };

  const handleBasketCheckboxChange = (basketId: any) => {
    if (selectedBasketIds.includes(basketId)) {
      // Deselect basket and its products
      setSelectedBasketIds((prevCheckedItems) =>
        prevCheckedItems.filter((item) => item !== basketId)
      );
      setSelectedBasketProductIds((prevCheckedProducts) =>
        prevCheckedProducts.filter((product) => product.basketId !== basketId)
      );
    } else {
      // Select basket
      setSelectedBasketIds((prevCheckedItems) => [
        ...prevCheckedItems,
        basketId,
      ]);
    }
  };

  const handleProductCheckboxChange = (
    selectedBasketProductId: SelectedBasketProductId
  ) => {
    setSelectedBasketProductIds((prevCheckedItems) =>
      prevCheckedItems.some(
        (item) =>
          item.basketId === selectedBasketProductId.basketId &&
          item.productId === selectedBasketProductId.productId
      )
        ? prevCheckedItems.filter(
            (item) =>
              item.basketId !== selectedBasketProductId.basketId ||
              item.productId !== selectedBasketProductId.productId
          )
        : [...prevCheckedItems, selectedBasketProductId]
    );
  };

  const basketProducts = getBasketProducts(selectedBasketIds);
  const filteredBasketProducts = basketProducts.filter((basket) =>
    selectedBasketIds.includes(basket.basketId)
  );
  const filteredBasketProductsFlat = filteredBasketProducts.flatMap(
    (basket) => {
      return basket.products.map((product) => {
        return {
          basketId: basket.basketId,
          basketIndex: basket.index,
          basketTimestamp: basket.timestamp,
          ...product,
        };
      });
    }
  );

  if (!patient) {
    return <p>Patient not found</p>;
  }

  return (
    <main className="px-4 sm:px-6 lg:px-8">
      <PatientCard />
      <div className="mx-auto w-full max-w-7xl lg:flex">
        <div className="flex-1 xl:flex">
          <Baskets
            baskets={basketsMapped}
            selectedBasketIds={selectedBasketIds}
            handleBasketCheckboxChange={handleBasketCheckboxChange}
          />
          <Analysis
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            handleTabChange={handleTabChange}
            selectedBasketIds={selectedBasketIds}
          />
        </div>
        <Products
          filteredBasketProductsFlat={filteredBasketProductsFlat}
          selectedBasketProductIds={selectedBasketProductIds}
          handleProductCheckboxChange={handleProductCheckboxChange}
          selectedBasketIds={selectedBasketIds}
        />
      </div>
    </main>
  );
}
