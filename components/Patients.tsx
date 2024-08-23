"use client";

import { Patient } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { fetchPatients } from "@/utils/fetchPatients";

export default function Patients() {
  const { data: session } = useSession();

  const {
    isLoading,
    error,
    data: patients,
  } = useQuery<Patient[]>({
    queryKey: ["participants"],
    queryFn: () => fetchPatients(session?.accessToken),
    enabled: !!session?.accessToken,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading patients</p>;

  return (
    <ul
      role="list"
      className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-1 lg:grid-cols-3"
    >
      {patients?.map((person) => (
        <li
          key={person.externalId}
          className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white rounded-md border border-gray-300 hover:bg-gray-50"
        >
          <Link href={`/p/${person.externalId}`}>
            <div className="flex w-full items-center justify-between space-x-6 p-6">
              <div className="flex-1 truncate">
                <div className="flex items-center space-x-3">
                  <h3 className="truncate text-sm font-medium text-gray-900">
                    {person.profile.firstName} {person.profile.lastName}
                  </h3>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  <p>
                    Geschlecht:{" "}
                    <span className="font-medium text-gray-700">
                      {person.demographics.gender === "F"
                        ? "Weiblich"
                        : "Männlich"}
                    </span>
                  </p>
                  <p>
                    Alter:{" "}
                    <span className="font-medium text-gray-700">
                      {person.demographics.age}
                    </span>
                  </p>
                </div>
              </div>
              {person.profile.imageUrl ? (
                <Image
                  alt="Patient image"
                  src={person.profile.imageUrl}
                  className="h-16 w-16 flex-shrink-0 rounded-full bg-gray-300"
                  width={64}
                  height={64}
                />
              ) : (
                <div className="h-16 w-16 flex-shrink-0 rounded-full bg-gray-300">
                  <span className="h-16 w-16 flex items-center justify-center text-lg font-medium text-gray-600">
                    {person.profile.firstName[0]}
                    {person.profile.firstName[0]}
                  </span>
                </div>
              )}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
