"use client";

import PatientCard from "@/components/PatientCard";
import Analysis from "@/components/purchases/analysis/Analysis";
import Baskets from "@/components/purchases/baskets/Baskets";
import Products from "@/components/purchases/products/Products";
import { patients } from "@/data/patients";
import { useCounterStore } from "@/providers/useStoreProvider";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

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
