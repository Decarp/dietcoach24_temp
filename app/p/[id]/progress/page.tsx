"use client";

import PatientCard from "@/components/PatientCard";
import Analysis from "@/components/progress/analysis/Analysis";
import Baskets from "@/components/progress/baskets/Baskets";

export default function PurchasesPage() {
  return (
    <main className="px-4 sm:px-6 lg:px-8">
      <PatientCard />
      <div className="mx-auto w-full lg:flex">
        <div className="flex-1 xl:flex">
          <Baskets />
          <Analysis />
        </div>
      </div>
    </main>
  );
}
