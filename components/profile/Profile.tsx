"use client";

import { Patient } from "@/types/types";
import { fetchPatientDetails } from "@/utils/fetchPatientDetails";
import {
  CreditCardIcon,
  HomeIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/solid";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Profile() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const patientId = pathSegments[2];

  const {
    isLoading,
    error,
    data: patient,
  } = useQuery<Patient>({
    queryKey: ["participant", patientId],
    queryFn: () => fetchPatientDetails(patientId, session?.accessToken),
    enabled: !!session?.accessToken,
  });

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="bg-white h-screen -m-8 p-8 border-x border-b border-gray-300 h-[calc(100vh-179px)]">
      <h2 className="text-xl font-semibold">Profil</h2>
      <h3 className="text-xs font-light mb-4 text-gray-500">
        Persönliche Daten und Gesundheitsinformationen
      </h3>

      <hr className="border-gray-300 -mx-8" />

      <div className="py-2">
        <dl className="grid grid-cols-1 sm:grid-cols-2">
          <div className="px-4 py-4 sm:col-span-1 sm:px-0">
            <dt className="text-sm font-normal leading-6 text-gray-500">
              Alter
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
              {patient?.demographics.age}
            </dd>
          </div>
          <div className="px-4 py-4 sm:col-span-1 sm:px-0">
            <dt className="text-sm font-normal leading-6 text-gray-500">
              Geschlecht
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
              {patient?.demographics.gender === "M" ? "Männlich" : "Weiblich"}
            </dd>
          </div>

          <div className="px-4 py-4 sm:col-span-1 sm:px-0">
            <dt className="text-sm font-normal leading-6 text-gray-500">
              Diagnose
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
              {patient?.medicalHistory.diagnosis}
            </dd>
          </div>
          <div className="px-4 py-4 sm:col-span-1 sm:px-0">
            <dt className="text-sm font-normal leading-6 text-gray-500">BMI</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
              {patient?.medicalHistory.bmi}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-6">
        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="relative overflow-hidden rounded-lg bg-white p-6 rounded-md border border-gray-300">
            <dt>
              <div className="absolute rounded-md bg-primary p-3">
                <HomeIcon aria-hidden="true" className="h-6 w-6 text-white" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                Haushaltsgröße
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">
                {patient?.householdSize}{" "}
              </p>
              <p className="ml-2 flex items-baseline text-sm font-medium text-gray-500">
                {patient?.householdSize === 1 ? "Person" : "Personen"}
              </p>
            </dd>
          </div>

          <div className="relative overflow-hidden rounded-lg bg-white p-6 rounded-md border border-gray-300">
            <dt>
              <div className="absolute rounded-md bg-primary p-3">
                <ShoppingCartIcon
                  aria-hidden="true"
                  className="h-6 w-6 text-white"
                />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                Einkaufsfrequenz
              </p>
            </dt>
            <dd className="ml-16 items-baseline">
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">
                  {patient?.shoppingFrequency.migros}{" "}
                </p>
                <p className="ml-2 flex items-baseline text-sm font-medium text-gray-500">
                  Migros
                </p>
              </div>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">
                  {patient?.shoppingFrequency.coop}{" "}
                </p>
                <p className="ml-2 flex items-baseline text-sm font-medium text-gray-500">
                  Coop
                </p>
              </div>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">
                  {patient?.shoppingFrequency.other}{" "}
                </p>
                <p className="ml-2 flex items-baseline text-sm font-medium text-gray-500">
                  Andere Supermärkte
                </p>
              </div>
            </dd>
          </div>

          <div className="relative overflow-hidden rounded-lg bg-white p-6 rounded-md border border-gray-300">
            <dt>
              <div className="absolute rounded-md bg-primary p-3">
                <CreditCardIcon
                  aria-hidden="true"
                  className="h-6 w-6 text-white"
                />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                Nutzung der Treuekarte
              </p>
            </dt>
            <dd className="ml-16 items-baseline">
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">
                  {patient?.loyaltyCardUsage.migros}{" "}
                </p>
                <p className="ml-2 flex items-baseline text-sm font-medium text-gray-500">
                  Migros
                </p>
              </div>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">
                  {patient?.loyaltyCardUsage.coop}{" "}
                </p>
                <p className="ml-2 flex items-baseline text-sm font-medium text-gray-500">
                  Coop
                </p>
              </div>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
