"use client";

import { usePathname, useRouter } from "next/navigation";
import { patients } from "@/data/patients";
import { classNames } from "@/utils/classNames";

const tabs = [
  { name: "Profil", path: "profile" },
  { name: "Einkäufe", path: "purchases" },
  { name: "Empfehlungen", path: "recommendations" },
  { name: "Fortschritt", path: "progress" },
  // { name: "Vergleich", path: "comparison" },
  // { name: "Modifikation", path: "modification" },
];

export default function PatientCard() {
  const pathname = usePathname();
  const router = useRouter();
  const pathSegments = pathname.split("/");
  const patientId = pathSegments[2];
  const currentTab = pathSegments[3] || "profile";

  const patient = patients.find((p) => p.id === patientId);

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
            {patient.firstName} {patient.lastName}
          </h1>
          {/* <div className="mt-3 flex md:top-3 md:mt-0">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary hover:bg-green-700"
            >
              FFQ ansehen
            </button>
          </div> */}
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
