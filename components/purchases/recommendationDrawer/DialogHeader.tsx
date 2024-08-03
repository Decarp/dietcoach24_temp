// DialogHeader.tsx
import { DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function DialogHeader({
  session,
  setSession,
  setOpen,
}: {
  session: string;
  setSession: (session: string) => void;
  setOpen: (open: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center justify-left space-x-6">
        <DialogTitle className="text-2xl font-semibold leading-6 text-gray-900">
          Empfehlung erstellen
        </DialogTitle>
        <select
          id="location"
          name="location"
          value={session}
          onChange={(e) => setSession(e.target.value)}
          className="block w-96 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
        >
          <option value="Sitzung #1">Sitzung #1</option>
          <option value="Sitzung #2">Sitzung #2</option>
          <option value="Sitzung #3">Sitzung #3</option>
        </select>
      </div>
      <div className="ml-3 flex h-7 items-center">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <span className="absolute -inset-2.5" />
          <span className="sr-only">Close panel</span>
          <XMarkIcon aria-hidden="true" className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
