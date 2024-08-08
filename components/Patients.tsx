import { patients } from "@/data/patients";
import Link from "next/link";
import { format, formatDate } from "date-fns";
import { de } from "date-fns/locale";
import Image from "next/image";

export default function Patients() {
  const formatDate = (timestamp: number) =>
    format(new Date(timestamp * 1000), "d. MMMM yyyy", { locale: de });

  return (
    <div className="mt-8">
      <ul
        role="list"
        className="grid grid-cols-1 gap-6 sm:grid-cols-1 lg:grid-cols-2"
      >
        {patients.map((person) => (
          <li
            key={person.id}
            className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white rounded-md border border-gray-300 hover:bg-gray-50"
          >
            <Link href={`/p/${person.id}`}>
              <div className="flex w-full items-center justify-between space-x-6 p-6">
                <div className="flex-1 truncate">
                  <div className="flex items-center space-x-3">
                    <h3 className="truncate text-sm font-medium text-gray-900">
                      {person.firstName} {person.lastName}
                    </h3>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>
                      Gender:{" "}
                      <span className="font-medium text-gray-700">
                        {person.gender}
                      </span>
                    </p>
                    <p>
                      Birthday:{" "}
                      <span className="font-medium text-gray-700">
                        {format(new Date(person.birthday), "yyyy-MM-dd")}
                      </span>
                    </p>
                    <p>
                      Height:{" "}
                      <span className="font-medium text-gray-700">
                        {person.height} cm
                      </span>
                    </p>
                    <p>
                      Weight:{" "}
                      <span className="font-medium text-gray-700">
                        {person.weight} kg
                      </span>
                    </p>
                    <p>
                      Household Size:{" "}
                      <span className="font-medium text-gray-700">
                        {person.householdSize}
                      </span>
                    </p>
                    <p>
                      Last Purchase:{" "}
                      <span className="font-medium text-gray-700">
                        {formatDate(person.lastPurchase)}
                      </span>
                    </p>
                    <p>
                      Last Session:{" "}
                      <span className="font-medium text-gray-700">
                        {formatDate(person.lastSession)}
                      </span>
                    </p>
                    <p>
                      Shopping Frequency Migros:{" "}
                      <span className="font-medium text-gray-700">
                        {person.shoppingFrequencyMigros[0]}-
                        {person.shoppingFrequencyMigros[1]}%
                      </span>
                    </p>
                    <p>
                      Shopping Frequency Coop:{" "}
                      <span className="font-medium text-gray-700">
                        {person.shoppingFrequencyCoop[0]}-
                        {person.shoppingFrequencyCoop[1]}%
                      </span>
                    </p>
                    <p>
                      Loyalty Card Usage Migros:{" "}
                      <span className="font-medium text-gray-700">
                        {person.loyaltyCardUsageMigros[0]}-
                        {person.loyaltyCardUsageMigros[1]}%
                      </span>
                    </p>
                    <p>
                      Loyalty Card Usage Coop:{" "}
                      <span className="font-medium text-gray-700">
                        {person.loyaltyCardUsageCoop[0]}-
                        {person.loyaltyCardUsageCoop[1]}%
                      </span>
                    </p>
                  </div>
                </div>
                {person.imageUrl ? (
                  <Image
                    alt="Patient image"
                    src={person.imageUrl}
                    className="h-16 w-16 flex-shrink-0 rounded-full bg-gray-300"
                    width={64}
                    height={64}
                  />
                ) : (
                  <div className="h-16 w-16 flex-shrink-0 rounded-full bg-gray-300">
                    <span className="h-16 w-16 flex items-center justify-center text-lg font-medium text-gray-600">
                      {person.firstName[0]}
                      {person.lastName[0]}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
