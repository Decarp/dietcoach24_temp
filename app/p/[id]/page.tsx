import PatientCard from "@/components/PatientCard";
import Profile from "@/components/profile/Profile";

export default function HomePage() {
  return (
    <main className="px-4 sm:px-6 lg:px-8">
      <PatientCard />
      <h2 className="mt-6 text-xl font-semibold mb-4">
        <Profile />
      </h2>
    </main>
  );
}
