"use client";

import PatientCard from "@/components/PatientCard";
import Analysis from "@/components/purchases/analysis/Analysis";
import Baskets from "@/components/purchases/baskets/Baskets";
import Products from "@/components/purchases/products/Products";
import { patients } from "@/data/patients";
import { useCounterStore } from "@/providers/useStoreProvider";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export type Basket = {
  basketId: number;
  index: number;
  timestamp: number;
  avgNutriScore: string;
  avgFsaScore: number;
};

export type Nutrients = {
  nutriScore: string;
  fsaScore: number;
  kcal: number;
  proteins: number;
  fats: number;
  carbohydrates: number;
  fibers: number;
  salt: number;
};

export type Product = {
  productId: number;
  name: string;
  quantity: number;
  nutrients: Nutrients;
  dietCoachCategoryL1: {
    de: string;
    en: string;
  };
  dietCoachCategoryL2: {
    de: string;
    en: string;
  };
  imageUrl: string;
};

export type BasketProduct = {
  basketId: number;
  index: number;
  timestamp: number;
  avgNutriScore: string;
  avgFsaScore: number;
  products: Product[];
};

export type BasketProductFlat = {
  basketId: number;
  basketIndex: number;
  basketTimestamp: number;
  productId: number;
  name: string;
  quantity: number;
  nutrients: Nutrients;
  dietCoachCategoryL1: {
    de: string;
    en: string;
  };
  dietCoachCategoryL2: {
    de: string;
    en: string;
  };
  imageUrl: string;
};

export type SelectedBasketIds = number[];

export type SelectedBasketProductId = {
  basketId: number;
  productId: number;
};

export default function Purchases() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pathSegments = pathname.split("/");
  const patientId = pathSegments[2];
  const patient = patients.find((p) => p.id === patientId);

  const { setCurrentTab } = useCounterStore((state) => state);

  useEffect(() => {
    setCurrentTab(searchParams.get("chart") || "energy");
  }, [searchParams, setCurrentTab]);

  if (!patient) {
    return <p>Patient not found</p>;
  }

  return (
    <main className="px-4 sm:px-6 lg:px-8">
      <PatientCard />
      <div className="mx-auto w-full max-w-7xl lg:flex">
        <div className="flex-1 xl:flex">
          <Baskets />
          <Analysis />
        </div>
        <Products />
      </div>
    </main>
  );
}
