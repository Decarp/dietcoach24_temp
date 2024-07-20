'use client';

import React, { useState, useEffect } from "react";
import PatientCard from "@/components/PatientCard";
import dynamic from 'next/dynamic';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { classNames } from "@/utils/classNames";
import { patients } from "@/data/patients";

const EnergyChartMacro = dynamic(() => import('@/components/purchases/analysis/EnergyChartMacro'), {
    ssr: false
});
const EnergyChartCategories = dynamic(() => import('@/components/purchases/analysis/EnergyChartCategories'), {
    ssr: false
});

export default function Purchases() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathSegments = pathname.split("/");
    const patientId = pathSegments[2];

    const tabs = [
        { name: 'Energiegehalt', path: 'energy' },
        { name: 'Makronährstoffe', path: 'macro' },
        { name: 'Mikronährstoffe', path: 'micro' },
        { name: 'Nutri-Score', path: 'nutri' },
    ];

    const queryTab = searchParams.get('chart');
    const [currentTab, setCurrentTab] = useState(queryTab || 'energy');

    useEffect(() => {
        setCurrentTab(queryTab || 'energy');
    }, [queryTab]);

    const patient = patients.find((p) => p.id === patientId);

    if (!patient) {
        return <p>Patient not found</p>;
    }

    const handleTabChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedTab = event.target.value;
        router.push(`/patient/${patientId}/purchases?chart=${selectedTab}`);
    };

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
                        <div>
                            <div className="sm:hidden">
                                <label htmlFor="current-tab" className="sr-only">
                                    Select a tab
                                </label>
                                <select
                                    id="current-tab"
                                    name="current-tab"
                                    defaultValue={currentTab}
                                    onChange={handleTabChange}
                                    className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary"
                                >
                                    {tabs.map((tab) => (
                                        <option key={tab.path} value={tab.path}>{tab.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="hidden sm:block border-b -mx-4 sm:-mx-6 lg:-mx-6 lg:-ml-8 xl:-ml-6">
                                <nav className="-mb-px flex space-x-8 px-4 sm:px-5 lg:px-7 xl:px-5">
                                    {tabs.map((tab) => (
                                        <a
                                            key={tab.path}
                                            href={`/patient/${patientId}/purchases?chart=${tab.path}`}
                                            aria-current={tab.path === currentTab ? 'page' : undefined}
                                            className={classNames(
                                                tab.path === currentTab
                                                    ? 'border-primary text-primary'
                                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                                'whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium',
                                            )}
                                        >
                                            {tab.name}
                                        </a>
                                    ))}
                                </nav>
                            </div>
                        </div>
                        <div className="flex-1">
                            {currentTab === 'energy' && (
                                <>
                                    <br />
                                    <h4 className="text-lg font-medium mb-2">Energiegehalt aus Makronährstoffen</h4>
                                    <EnergyChartMacro />
                                    <br />
                                    <h4 className="text-lg font-medium mb-2">Energiegehalt aus Lebensmittelkategorien</h4>
                                    <EnergyChartCategories />
                                </>
                            )}
                            {currentTab === 'macro' && (
                                <>
                                    <br />
                                    <h4 className="text-lg font-medium mb-2">Makronährstoffe</h4>
                                    <div className="border rounded-lg p-4 bg-white h-96 bg-white" />
                                </>
                            )}
                            {currentTab === 'micro' && (
                                <>
                                    <br />
                                    <h4 className="text-lg font-medium mb-2">Mikronährstoffe</h4>
                                    <div className="border rounded-lg p-4 bg-white h-96 bg-white" />
                                </>
                            )}
                            {currentTab === 'nutri' && (
                                <>
                                    <br />
                                    <h4 className="text-lg font-medium mb-2">Nutri-Score</h4>
                                    <div className="border rounded-lg p-4 bg-white h-96 bg-white" />
                                </>
                            )}
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
