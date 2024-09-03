"use client";

import { classNames } from "@/utils/classNames";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useMemo } from "react";
import { MdOutlineSupervisedUserCircle } from "react-icons/md";

const navigation = [
  { name: "Patienten", href: "/patients" },
  { name: "(Fragebogen 1)", href: "https://forms.office.com/e/wb6ze3KLEv" },
  { name: "(Fragebogen 2)", href: "https://forms.office.com/e/wb6ze3KLEv" },
];

export default function Header({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  const currentPath = usePathname();

  const updatedNavigation = useMemo(
    () =>
      navigation.map((item) => ({
        ...item,
        current: currentPath.includes(item.href),
      })),
    [currentPath]
  );

  const handleUserAction = () => {
    if (session) {
      signOut();
    } else {
      signIn();
    }
  };

  const userNavigation = useMemo(
    () => [
      {
        name: session ? "Abmelden" : "Anmelden",
        action: handleUserAction,
      },
    ],
    [session]
  );

  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav">
          <div className="bg-white border-x border-b border-t border-gray-300 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <Link className="flex flex-shrink-0 items-center" href="/">
                  <p className="text-primary font-base text-2xl font-sans">
                    DietCoach
                  </p>
                  {/* <BsPersonArmsUp className="block h-7 w-auto text-primary" /> */}
                  <MdOutlineSupervisedUserCircle className="ml-2 block h-8 w-auto text-primary" />
                </Link>
                <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                  {status === "authenticated" &&
                    updatedNavigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        aria-current={item.current ? "page" : undefined}
                        className={classNames(
                          item.current
                            ? "border-primary text-primary"
                            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                          "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium"
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <MenuButton className="relative flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      {session?.user?.image ? (
                        <Image
                          alt=""
                          src={session.user.image}
                          className="h-8 w-8 rounded-full"
                          width={32}
                          height={32}
                        />
                      ) : (
                        <UserCircleIcon className="h-8 w-8 rounded-full text-primary" />
                      )}
                    </MenuButton>
                  </div>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                    {status === "authenticated" &&
                      userNavigation.map((item) => (
                        <MenuItem key={item.name}>
                          <button
                            onClick={item.action}
                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100"
                          >
                            {item.name}
                          </button>
                        </MenuItem>
                      ))}
                  </MenuItems>
                </Menu>
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon
                    aria-hidden="true"
                    className="block h-6 w-6 group-data-[open]:hidden"
                  />
                  <XMarkIcon
                    aria-hidden="true"
                    className="hidden h-6 w-6 group-data-[open]:block"
                  />
                </DisclosureButton>
              </div>
            </div>
          </div>

          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {status === "authenticated" &&
                updatedNavigation.map((item) => (
                  <DisclosureButton
                    key={item.name}
                    as="a"
                    href={item.href}
                    aria-current={item.current ? "page" : undefined}
                    className={classNames(
                      item.current
                        ? "border-primary bg-green-50 text-green-700"
                        : "border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800",
                      "block border-l-4 py-2 pl-3 pr-4 text-base font-medium"
                    )}
                  >
                    {item.name}
                  </DisclosureButton>
                ))}
            </div>
            <div className="border-t border-gray-300 pb-3 pt-4">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  {session?.user?.image ? (
                    <Image
                      alt=""
                      src={session.user.image}
                      className="h-10 w-10 rounded-full"
                      width={40}
                      height={40}
                    />
                  ) : (
                    <Image
                      alt=""
                      src="https://via.placeholder.com/40"
                      className="h-10 w-10 rounded-full"
                      width={40}
                      height={40}
                    />
                  )}
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {session?.user?.name || "Guest"}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {session?.user?.email || "guest@example.com"}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                {status === "authenticated" &&
                  userNavigation.map((item) => (
                    <DisclosureButton
                      key={item.name}
                      as="button"
                      onClick={item.action}
                      className="block w-full px-4 py-2 text-left text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                    >
                      {item.name}
                    </DisclosureButton>
                  ))}
              </div>
            </div>
          </DisclosurePanel>
        </Disclosure>

        <div className="mx-auto max-w-7xl">{children}</div>
      </div>
    </>
  );
}
