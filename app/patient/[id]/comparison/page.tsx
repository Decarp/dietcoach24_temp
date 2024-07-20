import PatientCard from "@/components/PatientCard";

export default function Home() {
    return (
        <main className="px-4 py-8 sm:px-6 lg:px-8">
            <PatientCard />
            <h2 className="mt-6 text-xl font-semibold mb-4">Vergleich</h2>
        </main>
    );
}