"use client";

import PatientCard from "@/components/PatientCard";
import Notes from "@/components/recommendations/notes/Notes";
import Recommendations from "@/components/recommendations/recommendations/Recommendations";
import SessionsComp from "@/components/recommendations/sessions/Sessions";

export default function RecommendationsPage() {
  return (
    <main className="px-4 sm:px-6 lg:px-8">
      <PatientCard />
      <div className="mx-auto w-full max-w-7xl lg:flex">
        <div className="flex-1 xl:flex">
          <SessionsComp />
          <Recommendations />
        </div>
        <Notes />
      </div>
    </main>
  );
}
