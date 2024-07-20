import PatientCard from "@/components/PatentCard";

export default function Home() {
    return (
        <>
            <PatientCard />
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <h2 className="text-xl font-semibold mb-4">Einkäufe</h2>
            </main>
        </>
    );
}