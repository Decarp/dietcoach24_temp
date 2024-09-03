"use client";

import PatientCard from "@/components/PatientCard";
import Analysis from "@/components/progress/Analysis";

export default function PurchasesPage() {
  return (
    <main className="px-4 sm:px-6 lg:px-8">
      <PatientCard />
      <div className="mx-auto w-full lg:flex">
        <Analysis />
      </div>
    </main>
  );
}
