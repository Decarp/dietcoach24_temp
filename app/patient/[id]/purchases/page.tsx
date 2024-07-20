import PatientCard from "@/components/PatientCard";
import dynamic from 'next/dynamic';

const EnergyChartMacro = dynamic(() => import('@/components/purchases/analysis/EnergyChartMacro'), {
    ssr: false
});
const EnergyChartCategories = dynamic(() => import('@/components/purchases/analysis/EnergyChartCategories'), {
    ssr: false
});

export default function Purchases() {
    return (
        <main className="px-4 py-8 sm:px-6 lg:px-8">
            <PatientCard />

            {/* 3 column wrapper */}
            <div className="flex-1 mx-auto w-full max-w-7xl lg:flex">
                <div className="flex-1 xl:flex">
                    {/* Column 1 */}
                    <div className="flex flex-col border-b border-gray-200 py-6 xl:w-64 xl:shrink-0 xl:border-b-0 xl:border-r">
                        <h2 className="text-xl font-semibold">Einkäufe</h2>
                        <h3 className="text-sm font-light mb-4 text-gray-500">Wähle aus n Einkäufen</h3>
                        {/* Add content here */}
                    </div>

                    {/* Column 2 */}
                    <div className="bg-gray-50 flex flex-col flex-1 px-4 py-6 sm:px-6 lg:pl-8 xl:pl-6">
                        <h2 className="text-xl font-semibold">Analyse</h2>
                        <h3 className="text-sm font-light mb-4 text-gray-500">Selektiere gewünschte Analysen</h3>
                        <div className="flex-1">
                            <h4 className="text-lg font-medium mb-2">Energiegehalt aus Makronährstoffen</h4>
                            <EnergyChartMacro />
                            <br />
                            <h4 className="text-lg font-medium mb-2">Energiegehalt aus Lebensmittelkategorien</h4>
                            <EnergyChartCategories />
                        </div>
                    </div>
                </div>

                {/* Column 3 */}
                <div className="flex flex-col shrink-0 border-t border-gray-200 px-4 py-6 sm:px-6 lg:w-96 lg:border-l lg:border-t-0 lg:pr-8 xl:pr-6">
                    <h2 className="text-xl font-semibold">Artikel</h2>
                    <h3 className="text-sm font-light mb-4 text-gray-500">Zeige n Artikel</h3>
                    {/* Add content here */}
                </div>
            </div>
        </main>
    );
}
