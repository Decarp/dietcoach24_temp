"use client";

import { usePathname, useRouter } from "next/navigation";
import { classNames } from "@/utils/classNames";
import { useQuery } from "@tanstack/react-query";
import { Patient, Sessions } from "@/types/types";
import { fetchSessions } from "@/utils/fetchSessions";
import { useSession } from "next-auth/react";
import { fetchPatientDetails } from "@/utils/fetchPatientDetails";

export default function PatientCard() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const pathSegments = pathname.split("/");
  const patientId = pathSegments[2];
  const currentTab = pathSegments[3] || "profile";

  const { data: sessions } = useQuery<Sessions>({
    queryKey: ["sessions", patientId],
    queryFn: () => fetchSessions(patientId, session?.accessToken),
    enabled: !!session?.accessToken,
  });

  let tabs;
  if (sessions?.length === 0 || sessions?.length === 1) {
    tabs = [
      { name: "Profil", path: "profile" },
      { name: "Einkäufe", path: "purchases" },
      { name: "Empfehlungen", path: "recommendations" },
    ];
  } else {
    tabs = [
      { name: "Profil", path: "profile" },
      { name: "Einkäufe", path: "purchases" },
      { name: "Empfehlungen", path: "recommendations" },
      { name: "Fortschritt", path: "progress" },
    ];
  }

  const { isLoading, error, data } = useQuery<Patient>({
    queryKey: ["participant", patientId],
    queryFn: () => fetchPatientDetails(patientId, session?.accessToken || ""),
    enabled: !!session?.accessToken,
  });

  const patient = data;

  if (isLoading) {
    // Pulsing loading skeleton
    return (
      <header className="pt-8 bg-white border-x relative -mx-4 sm:-mx-6 lg:-mx-8 border-b border-gray-300 pb-5 sm:pb-0">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="w-48 h-8 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
          <div className="mt-3 mb-2.5">
            <div className="sm:hidden">
              <div className="w-full h-10 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
            <div className="hidden sm:block">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <div
                    key={tab.path}
                    className="w-20 h-8 bg-gray-200 rounded-md animate-pulse"
                  ></div>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </header>
    );
  }

  if (!patient) {
    return <p>Patient not found</p>;
  }

  const handleTabChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTab = event.target.value;
    router.push(`/p/${patientId}/${selectedTab}`);
  };

  return (
    <header className="pt-8 bg-white border-x relative -mx-4 sm:-mx-6 lg:-mx-8 border-b border-gray-300 pb-5 sm:pb-0">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <h1 className="text-2xl font-semibold">
            {patient.profile.firstName} {patient.profile.lastName}
          </h1>
        </div>
        <div className="mt-4">
          <div className="sm:hidden">
            <label htmlFor="current-tab" className="sr-only">
              Select a tab
            </label>
            <select
              id="current-tab"
              name="current-tab"
              defaultValue={currentTab}
              onChange={handleTabChange}
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              {tabs.map((tab) => (
                <option key={tab.path} value={tab.path}>
                  {tab.name}
                </option>
              ))}
            </select>
          </div>
          <div className="hidden sm:block">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <a
                  key={tab.path}
                  href={`/p/${patientId}/${tab.path}`}
                  aria-current={tab.path === currentTab ? "page" : undefined}
                  className={classNames(
                    tab.path === currentTab
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                    "whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium"
                  )}
                >
                  {tab.name}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
