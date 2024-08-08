import { PaperClipIcon } from "@heroicons/react/24/outline";
import {
  CreditCardIcon,
  HomeIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/solid";

export default function Profile() {
  const patientDetails = {
    id: "2o4mgm92",
    householdSize: 1,
    shoppingFrequency: ">80%",
    loyaltyCardUsage: ">80%",
    groceryData: "269 Artikel (IS) + 285 Artikel (FS)",
    ffqDate: "11. April 2024",
    bmi: 50.9,
    diagnosis: "Dyslipidämie",
    age: "?",
    gender: "F",
  };

  return (
    <div className="bg-white h-screen -m-8 p-8 border-x border-b h-[calc(100vh-176px)]">
      <h2 className="text-xl font-semibold">Profil</h2>
      <h3 className="text-sm font-light mb-4 text-gray-500">
        Persönliche Daten und Gesundheitsinformationen
      </h3>

      <hr className="border-gray-300 -mx-8" />

      <div className="">
        <dl className="grid grid-cols-1 sm:grid-cols-2">
          <div className="px-4 py-6 sm:col-span-1 sm:px-0">
            <dt className="text-sm font-normal leading-6 text-gray-500">
              Alter
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
              {patientDetails.age}
            </dd>
          </div>
          <div className="px-4 py-6 sm:col-span-1 sm:px-0">
            <dt className="text-sm font-normal leading-6 text-gray-500">
              Geschlecht
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
              {patientDetails.gender === "M" ? "Männlich" : "Weiblich"}
            </dd>
          </div>

          <div className="px-4 py-6 sm:col-span-1 sm:px-0">
            <dt className="text-sm font-normal leading-6 text-gray-500">
              Diagnose
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
              {patientDetails.diagnosis}
            </dd>
          </div>
          <div className="px-4 py-6 sm:col-span-1 sm:px-0">
            <dt className="text-sm font-normal leading-6 text-gray-500">BMI</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
              {patientDetails.bmi}
            </dd>
          </div>
        </dl>
      </div>

      <hr className="border-gray-300 -mx-8" />

      <div className="my-6 mt-6 mt-2 text-sm text-gray-900 border border-gray-300 rounded-md flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
        <div className="flex w-0 flex-1 items-center">
          <PaperClipIcon
            aria-hidden="true"
            className="h-5 w-5 flex-shrink-0 text-gray-400"
          />
          <div className="ml-4 flex min-w-0 flex-1 gap-2">
            <span className="truncate font-medium">FFQ.pdf</span>
            <span className="flex-shrink-0 text-gray-400">
              {patientDetails.ffqDate}
            </span>
          </div>
        </div>
        <div className="ml-4 flex-shrink-0">
          <a href="#" className="font-medium text-primary hover:text-primary">
            Ansehen
          </a>
        </div>
      </div>

      <hr className="border-gray-300 -mx-8" />

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
                {patientDetails.householdSize}{" "}
              </p>
              <p className="ml-2 flex items-baseline text-sm font-medium text-gray-500">
                {patientDetails.householdSize === 1 ? "Person" : "Personen"}
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
                Einkaufsfrequenz (Migros / Coop)
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">
                {patientDetails.shoppingFrequency}{" "}
              </p>
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
                Nutzung der Treuekarte (Migros / Coop)
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">
                {patientDetails.loyaltyCardUsage}{" "}
              </p>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
