import PatientCard from "@/components/PatentCard";
import dynamic from 'next/dynamic';

const EnergyChart = dynamic(() => import('@/components/purchases/analysis/EnergyChart'), {
    ssr: false
});

export default function Purchases() {
    return (
        <>
            <PatientCard />
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <h2 className="text-xl font-semibold mb-4">Einkäufe</h2>

                <EnergyChart />

                {/* 3 column wrapper */}
                {/* <div className="mx-auto w-full max-w-7xl grow lg:flex xl:px-2">
                    <div className="flex-1 xl:flex">
                        <div className="border-b border-gray-200 px-4 py-6 sm:px-6 lg:pl-8 xl:w-64 xl:shrink-0 xl:border-b-0 xl:border-r xl:pl-6">
                            1
                        </div>

                        <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
                            2
                        </div>
                    </div>

                    <div className="shrink-0 border-t border-gray-200 px-4 py-6 sm:px-6 lg:w-96 lg:border-l lg:border-t-0 lg:pr-8 xl:pr-6">
                        3
                    </div>
                </div> */}
            </main>
        </>
    );
}