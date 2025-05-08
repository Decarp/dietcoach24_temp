import ModeDropdown from './ModeDropdown';
import NutrientDropdown from './NutrientDropdown';
import CategoryDropdown from './CategoryDropdown';
import { useCounterStore } from '@/providers/useStoreProvider';
import { useEffect } from 'react';

const tabs = [{ name: 'Nährstoff-spezifisch' }, { name: 'Nährstoff-unspezifisch' }, { name: 'Individuell' }];

type Variante1State = {
    mode: string;
    nutrient: string;
    category: string;
};

type Variante2State = {
    mode: string;
    category: string;
};

export default function TabSection({
    currentTab,
    setCurrentTab,
    variante1State,
    setVariante1State,
    variante2State,
    setVariante2State,
    freitextState,
    setFreitextState,
}: {
    currentTab: string;
    setCurrentTab: (tab: string) => void;
    variante1State: Variante1State;
    setVariante1State: (state: Variante1State | ((prevState: Variante1State) => Variante1State)) => void;
    variante2State: Variante2State;
    setVariante2State: (state: Variante2State | ((prevState: Variante2State) => Variante2State)) => void;
    freitextState: string;
    setFreitextState: (state: string) => void;
}) {
    const { selectedCategories, selectedSortCriteria, setSelectedCategories, setSelectedSortCriteria } =
        useCounterStore((state) => state);

    useEffect(() => {
        // Preselect NutrientDropdown with selectedSortCriteria if available
        if (selectedSortCriteria && currentTab === 'Nährstoff-spezifisch') {
            setVariante1State((prevState: Variante1State) => ({
                ...prevState,
                nutrient: selectedSortCriteria,
            }));
        }

        // Preselect CategoryDropdown with major or minor category if available
        if (currentTab !== 'Individuell') {
            const majorCategory = selectedCategories.major[0];
            const subCategory = selectedCategories.sub[0];

            setVariante1State((prevState: Variante1State) => ({
                ...prevState,
                category: subCategory || majorCategory || prevState.category,
            }));

            setVariante2State((prevState: Variante2State) => ({
                ...prevState,
                category: subCategory || majorCategory || prevState.category,
            }));
        }
    }, [selectedSortCriteria, selectedCategories, currentTab, setVariante1State, setVariante2State]);

    return (
        <section className="mt-6">
            <div className="mt-4">
                <div className="sm:hidden">
                    <label htmlFor="current-tab" className="sr-only">
                        Select a tab
                    </label>
                    <select
                        id="current-tab"
                        name="current-tab"
                        value={currentTab}
                        onChange={(e) => setCurrentTab(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary"
                    >
                        {tabs.map((tab) => (
                            <option key={tab.name} value={tab.name}>
                                {tab.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="hidden sm:block">
                    <nav className="-mb-px flex space-x-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.name}
                                onClick={() => setCurrentTab(tab.name)}
                                className={`whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium ${
                                    tab.name === currentTab
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                }`}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {currentTab === 'Nährstoff-spezifisch' && (
                <div className="relative mt-6 flex-1">
                    <div className="mt-2 flex rounded-md items-center">
                        <ModeDropdown
                            selectedOption={variante1State.mode}
                            setSelectedOption={(option) => setVariante1State({ ...variante1State, mode: option })}
                        />
                        <span className="h-7 inline-flex items-center border rounded-md mx-2 border-gray-300 px-3 text-gray-500 sm:text-xs">
                            der Zufuhr von
                        </span>
                        <NutrientDropdown
                            selectedOption={variante1State.nutrient}
                            setSelectedOption={(option) => setVariante1State({ ...variante1State, nutrient: option })}
                        />
                        <span className="h-7 inline-flex items-center border rounded-md mx-2 border-gray-300 px-3 text-gray-500 sm:text-xs">
                            aus
                        </span>
                        <CategoryDropdown
                            selectedOption={variante1State.category}
                            setSelectedOption={(option) => setVariante1State({ ...variante1State, category: option })}
                        />
                    </div>
                </div>
            )}

            {currentTab === 'Nährstoff-unspezifisch' && (
                <div className="relative mt-6 flex-1">
                    <div className="mt-2 flex rounded-md items-center">
                        <ModeDropdown
                            selectedOption={variante2State.mode}
                            setSelectedOption={(option) => setVariante2State({ ...variante2State, mode: option })}
                        />
                        <span className="h-7 inline-flex items-center border rounded-md mx-2 border-gray-300 px-3 text-gray-500 sm:text-xs">
                            der Zufuhr von
                        </span>
                        <CategoryDropdown
                            selectedOption={variante2State.category}
                            setSelectedOption={(option) => setVariante2State({ ...variante2State, category: option })}
                        />
                    </div>
                </div>
            )}

            {currentTab === 'Individuell' && (
                <div className="relative mt-6 flex-1">
                    <div className="mt-2 flex rounded-md">
                        <input
                            id="freitext"
                            name="freitext"
                            type="text"
                            placeholder="Freitext"
                            value={freitextState}
                            onChange={(e) => setFreitextState(e.target.value)}
                            className="block w-full min-w-0 flex-1 rounded-none rounded-l-md rounded-r-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>
            )}
        </section>
    );
}
