"use client";

import PatientCard from "@/components/PatientCard";
import Analysis from "@/components/purchases/analysis/Analysis";
import Baskets from "@/components/purchases/baskets/Baskets";
import Products from "@/components/purchases/products/Products";

export default function PurchasesPage() {
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
