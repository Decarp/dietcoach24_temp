"use client";

import PatientCard from "@/components/PatientCard";
import Notes from "@/components/recommendations/notes/Notes";
import Recommendations from "@/components/recommendations/recommendations/Recommendations";
import Sessions from "@/components/recommendations/sessions/Sessions";
import { patients } from "@/data/patients";
import { usePathname } from "next/navigation";

export default function RecommendationsPage() {
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
          <Sessions />
          <Recommendations />
        </div>
        <Notes />
      </div>
    </main>
  );
}
