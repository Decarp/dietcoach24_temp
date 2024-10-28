"use client";

import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { useCounterStore } from "@/providers/useStoreProvider";
import Button from "@/components/Button";
import { DocumentTextIcon } from "@heroicons/react/24/solid";
import { PlusIcon } from "@heroicons/react/24/outline";

const surveyLinks = [
  { name: "Fragebogen 1", href: "https://forms.office.com/e/wb6ze3KLEv" },
  { name: "Fragebogen 2", href: "https://forms.office.com/e/d9EH53ct82" },
];

export default function CompletedPopup({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { selectedSessionIndex } = useCounterStore((state) => state);

  // Function to dynamically link to survey 1 or 2 depending on selectedSessionIndex
  const openSurvey = () => {
    if (selectedSessionIndex === 1) {
      window.open(surveyLinks[0].href, "_blank");
    } else if (selectedSessionIndex === 2) {
      window.open(surveyLinks[1].href, "_blank");
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-2xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckIcon
                  aria-hidden="true"
                  className="h-6 w-6 text-primary"
                />
              </div>
              <div className="mt-3 text-center sm:mt-5">
                <DialogTitle
                  as="h3"
                  className="text-base font-semibold leading-6 text-gray-900"
                >
                  Empfehlung erfolgreich erstellt
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Vielen Dank für die Erstellung der Empfehlung. Sie können
                    nun entweder eine weitere Empfehlung erstellen oder den
                    Fragebogen ausfüllen.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-6 flex items-center space-x-3">
              <button
                type="button"
                data-autofocus
                onClick={() => setOpen(false)}
                className="text-gray-800 mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0 hover:scale-105 transition-transform"
              >
                <span className="mr-2">
                  <PlusIcon className="h-5 w-5" />
                </span>
                Weitere Empfehlung erstellen
              </button>

              {(selectedSessionIndex === 1 || selectedSessionIndex === 2) && (
                <Button
                  onClick={openSurvey}
                  icon={<DocumentTextIcon className="h-5 w-5" />}
                  className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:col-start-2"
                >
                  Fragebogen {selectedSessionIndex} ausfüllen
                </Button>
              )}
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
