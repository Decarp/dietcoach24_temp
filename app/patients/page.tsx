import Patients from "@/components/patients/Patients";

export default function PatientsPage() {
  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white h-screen -m-8 p-8 border-x border-b border-gray-300 h-[calc(100vh-67px)]">
        <Patients />
      </div>
    </main>
  );
}
