import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

const nutriScores = ["A", "B", "C", "D", "E"];

const NutriScoreMenu = ({
  selectedNutriScore,
  setSelectedNutriScore,
}: {
  selectedNutriScore: string;
  setSelectedNutriScore: (score: string) => void;
}) => {
  const handleNutriScoreChange = (score: string) => {
    setSelectedNutriScore(score);
  };

  const isChecked = (score: string) => {
    return (
      nutriScores.indexOf(score) <= nutriScores.indexOf(selectedNutriScore)
    );
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
          NutriScore
          <ChevronDownIcon
            aria-hidden="true"
            className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
          />
        </MenuButton>
      </div>

      <MenuItems className="absolute left-0 z-10 mt-2 w-50 origin-top-left rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in">
        <div className="py-1">
          {nutriScores.map((score) => (
            <MenuItem key={score}>
              {({ active }) => (
                <div className="ml-4 flex items-center">
                  <input
                    type="checkbox"
                    name="nutriScore"
                    value={score}
                    checked={isChecked(score)}
                    onChange={() => handleNutriScoreChange(score)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 cursor-pointer"
                  />
                  <label
                    className="block px-4 py-2 text-sm font-medium text-gray-900 data-[focus]:bg-gray-100"
                    onClick={() => handleNutriScoreChange(score)}
                  >
                    {score}
                  </label>
                </div>
              )}
            </MenuItem>
          ))}
        </div>
      </MenuItems>
    </Menu>
  );
};

export default NutriScoreMenu;
