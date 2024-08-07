import Patients from "@/components/Patients";

export default function PatientsPage() {
  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white h-screen -m-8 p-8 border-x border-b max-h-[calc(100vh-70px)]">
        <h1 className="text-2xl font-semibold mb-6">Patienten</h1>
        <hr className="border-gray-200 -mx-8" />
        <Patients />
      </div>
    </main>
  );
}
