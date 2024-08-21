"use client";

import PatientCard from "@/components/PatientCard";
import Analysis from "@/components/purchases/analysis/Analysis";
import Baskets from "@/components/purchases/baskets/Baskets";
import Products from "@/components/purchases/products/Products";
import { Patient } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";

export default function PurchasesPage() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const patientId = pathSegments[2];

  const { isLoading, error, data } = useQuery<Patient>({
    queryKey: ["participant"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/dietician/participant`, {
        method: "GET",
        headers: {
          Authentication: process.env.NEXT_PUBLIC_AUTH_TOKEN!,
          "Participant-Id": patientId,
        },
      }).then((res) => res.json()),
  });

  const ffqTimestamp = data?.medicalHistory.ffqDate;

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
