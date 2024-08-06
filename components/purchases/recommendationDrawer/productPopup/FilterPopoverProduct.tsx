import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

const FilterPopoverProduct = ({
  categoriesWithSub,
  selectedCategories,
  updateCategories,
}: {
  categoriesWithSub: {
    major: string;
    subs: string[];
  }[];
  selectedCategories: {
    major: string[];
    sub: string[];
  };
  updateCategories: (category: string, type: "major" | "sub") => void;
}) => {
  return (
    <Popover className="relative inline-block text-left">
      <div>
        <PopoverButton className="group inline-flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
          <span>Filter</span>
          <ChevronDownIcon
            aria-hidden="true"
            className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
          />
        </PopoverButton>
      </div>

      <PopoverPanel
        transition
        className="absolute left-0 h-96 overflow-y-scroll z-80 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <form className="space-y-4">
          {categoriesWithSub.map((category) => (
            <div key={category.major}>
              <div className="flex items-center">
                <input
                  value={category.major}
                  type="checkbox"
                  checked={selectedCategories.major.includes(category.major)}
                  onChange={() => updateCategories(category.major, "major")}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label className="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900">
                  {category.major}
                </label>
              </div>
              <div className="ml-7">
                {category.subs.map((subCategory) => (
                  <div key={subCategory} className="flex items-center">
                    <input
                      value={subCategory}
                      type="checkbox"
                      checked={selectedCategories.sub.includes(subCategory)}
                      onChange={() => updateCategories(subCategory, "sub")}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label className="ml-3 whitespace-nowrap pr-6 text-sm text-gray-900">
                      {subCategory}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </form>
      </PopoverPanel>
    </Popover>
  );
};

export default FilterPopoverProduct;
