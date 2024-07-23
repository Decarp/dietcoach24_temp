"use client";

import React, { useState, useEffect } from "react";
import PatientCard from "@/components/PatientCard";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { patients } from "@/data/patients";
import Products from "@/components/purchases/products/Products";
import Baskets from "@/components/purchases/baskets/Baskets";
import Analysis from "@/components/purchases/analysis/Analysis";
import { mapBasketsResponse } from "@/utils/mapBasketsResponse";
import { mapProductsResponse } from "@/utils/mapProductsResponse";
import { productsResponse } from "@/data/productsResponse";
import { basketsResponse } from "@/data/basketsResponse";

export type CheckedBaskets = number[];
export type CheckedProducts = string[]; // ["basketId,productId"]

export default function Purchases() {
  const baskets = mapBasketsResponse(basketsResponse);
  const products = mapProductsResponse(productsResponse, basketsResponse);

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathSegments = pathname.split("/");
  const patientId = pathSegments[2];
  const patient = patients.find((p) => p.id === patientId);

  const [currentTab, setCurrentTab] = useState(
    searchParams.get("chart") || "energy"
  );
  const [checkedBaskets, setCheckedBaskets] = useState<CheckedBaskets>([]);
  const [checkedProducts, setCheckedProducts] = useState<CheckedProducts>([]);

  useEffect(() => {
    setCurrentTab(searchParams.get("chart") || "energy");
  }, [searchParams]);

  const handleTabChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTab = event.target.value;
    router.push(`/p/${patientId}/purchases?chart=${selectedTab}`);
  };

  const handleBasketCheckboxChange = (basketId: any) => {
    if (checkedBaskets.includes(basketId)) {
      // Deselect basket and its products
      setCheckedBaskets((prevCheckedItems) =>
        prevCheckedItems.filter((item) => item !== basketId)
      );
      setCheckedProducts((prevCheckedProducts) =>
        prevCheckedProducts.filter(
          (productId) =>
            !Object.values(products)
              .flat()
              .some(
                (product: any) =>
                  product.basketId === basketId &&
                  `${product.basketId},${product.productId}` ===
                    productId.toString()
              )
        )
      );
    } else {
      // Select basket
      setCheckedBaskets((prevCheckedItems) => [...prevCheckedItems, basketId]);
    }
  };

  const handleProductCheckboxChange = (uniqueId: any) => {
    setCheckedProducts((prevCheckedItems) =>
      prevCheckedItems.includes(uniqueId)
        ? prevCheckedItems.filter((item) => item !== uniqueId)
        : [...prevCheckedItems, uniqueId]
    );
  };

  const filteredProducts = Object.keys(products).reduce((acc: any, key) => {
    acc[key] = products[key].filter((product: any) =>
      checkedBaskets.includes(product.basketId)
    );
    return acc;
  }, {});

  if (!patient) {
    return <p>Patient not found</p>;
  }

  return (
    <main className="px-4 sm:px-6 lg:px-8">
      <PatientCard />
      <div className="mx-auto w-full max-w-7xl lg:flex">
        <div className="flex-1 xl:flex">
          <Baskets
            baskets={baskets}
            checkedBaskets={checkedBaskets}
            handleBasketCheckboxChange={handleBasketCheckboxChange}
          />
          <Analysis
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            handleTabChange={handleTabChange}
            checkedBaskets={checkedBaskets}
            baskets={baskets}
            filteredProducts={filteredProducts}
          />
        </div>
        <Products
          filteredProducts={filteredProducts}
          checkedProducts={checkedProducts}
          handleProductCheckboxChange={handleProductCheckboxChange}
          checkedBaskets={checkedBaskets}
        />
      </div>
    </main>
  );
}
