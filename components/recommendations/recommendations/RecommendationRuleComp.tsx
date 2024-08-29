import { RecommendationRule } from "@/types/types";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { TrashIcon } from "@heroicons/react/20/solid";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";

export default function RecommendationRuleComp({
  rule,
}: {
  rule: RecommendationRule;
}) {
  return (
    <div className="flex items-center">
      {rule.variant === "VAR1" && (
        <div className="relative flex-1">
          <div className="flex rounded-md items-center">
            <span className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary">
              {rule.mode}
            </span>
            <span className="inline-flex items-center border rounded-md mx-2 border-gray-300 px-3 text-gray-500 sm:text-xs">
              der Zufuhr von
            </span>
            <span className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary">
              {rule.nutrient}
            </span>
            <span className="inline-flex items-center border rounded-md mx-2 border-gray-300 px-3 text-gray-500 sm:text-xs">
              aus
            </span>
            <span className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary">
              {rule.category}
            </span>
          </div>
        </div>
      )}
      {rule.variant === "VAR2" && (
        <div className="relative flex-1">
          <div className="flex rounded-md items-center">
            <span className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary">
              {rule.mode}
            </span>
            <span className="inline-flex items-center border rounded-md mx-2 border-gray-300 px-3 text-gray-500 sm:text-xs">
              der Zufuhr von
            </span>
            <span className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary">
              {rule.category}
            </span>
          </div>
        </div>
      )}
      {rule.variant === "FREITEXT" && (
        <div className="relative flex-1">
          <div className="flex rounded-md items-center">
            <span className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary">
              {rule.text}
            </span>
          </div>
        </div>
      )}
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900">
            <EllipsisVerticalIcon
              aria-hidden="true"
              className="-mr-1 h-5 w-5 text-gray-400"
            />
          </MenuButton>
        </div>

        <MenuItems
          transition
          className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
        >
          <div className="py-1">
            <MenuItem>
              <a
                href="#"
                className="group flex items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
              >
                <TrashIcon
                  aria-hidden="true"
                  className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                />
                Empfehlung entfernen
              </a>
            </MenuItem>
          </div>
        </MenuItems>
      </Menu>
    </div>
  );
}
