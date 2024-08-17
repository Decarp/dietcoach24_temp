"use client";

import PatientCard from "@/components/PatientCard";
import Analysis from "@/components/progress/analysis/Analysis";
import Baskets from "@/components/progress/baskets/Baskets";
import { patients } from "@/data/patients";
import { usePathname } from "next/navigation";

export default function PurchasesPage() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const patientId = pathSegments[2];
  const patient = patients.find((p) => p.id === patientId);

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
      </div>
    </main>
  );
}
