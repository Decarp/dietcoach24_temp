import { Spinner } from "@/components/Spinner";
import { useCounterStore } from "@/providers/useStoreProvider";
import { Patient, Sessions } from "@/types/types";
import { classNames } from "@/utils/classNames";
import { fetchPatientDetails } from "@/utils/fetchPatientDetails";
import { fetchSessions } from "@/utils/fetchSessions";
import { formatDateLong } from "@/utils/formatDateLong";
import { getSessionTimestamp } from "@/utils/getSessionTimestamp";
import {
  PencilSquareIcon,
  TrashIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import SessionsHeader from "./SessionsHeader";
import { deleteSession } from "@/utils/deleteSession";
import toast from "react-hot-toast";
import { useState, useEffect, useRef } from "react";

const SessionsComp = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const patientId = pathname.split("/")[2];

  const { data: patient } = useQuery<Patient>({
    queryKey: ["participant", patientId],
    queryFn: () => fetchPatientDetails(patientId, session?.accessToken),
    enabled: !!session?.accessToken,
  });

  const {
    data: sessions,
    isLoading,
    refetch,
  } = useQuery<Sessions>({
    queryKey: ["sessions", patientId],
    queryFn: () => fetchSessions(patientId, session?.accessToken),
  });

  const { selectedSessionId, setSelectedSessionId } = useCounterStore(
    (state) => state
  );

  const sessionTimestamps = getSessionTimestamp(patient, sessions);
  const queryClient = useQueryClient();

  // Automatically select the newest session if none is selected
  useEffect(() => {
    if (sessionTimestamps.length > 0 && selectedSessionId === null) {
      const newestSession =
        sessionTimestamps[sessionTimestamps.length - 1].sessionId;
      setSelectedSessionId(newestSession);
    }
  }, [sessionTimestamps, selectedSessionId, setSelectedSessionId]);

  // Automatically reselect the next newest session if the latest one was deleted
  useEffect(() => {
    if (
      selectedSessionId !== null &&
      !sessionTimestamps.some((s) => s.sessionId === selectedSessionId)
    ) {
      if (sessionTimestamps.length > 0) {
        const newestSession =
          sessionTimestamps[sessionTimestamps.length - 1].sessionId;
        setSelectedSessionId(newestSession);
      } else {
        setSelectedSessionId(null); // If no sessions left
      }
    }
  }, [sessionTimestamps, selectedSessionId, setSelectedSessionId]);

  // Delete session mutation
  const deleteMutation = useMutation({
    mutationFn: (sessionId: number) =>
      deleteSession(sessionId, session?.accessToken || ""),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["sessions", patientId] });
      toast.success("Sitzung erfolgreich gelöscht", { duration: 3000 });
    },
    onError: () => {
      toast.error("Fehler beim Löschen der Sitzung", { duration: 3000 });
    },
  });

  const handleDeleteSession = (sessionId: number) => {
    deleteMutation.mutate(sessionId);
  };

  const handleSessionClick = (sessionId: number) => {
    setSelectedSessionId(sessionId);
  };

  const [menuPosition, setMenuPosition] = useState("bottom");
  const menuRef = useRef<HTMLDivElement>(null);

  // Ensure the menu is fully visible and not cut off
  const handleMenuButtonClick = () => {
    const menuElement = menuRef.current;
    if (menuElement) {
      const { bottom } = menuElement.getBoundingClientRect();
      if (bottom > window.innerHeight) {
        setMenuPosition("top");
      } else {
        setMenuPosition("bottom");
      }
    }
  };

  return (
    <div className="pt-6 -ml-8 bg-white flex flex-col border-b border-x border-gray-300 w-[300px] h-[calc(100vh-185px)]">
      <SessionsHeader />

      <div className="bg-white flex-1 overflow-y-auto min-h-0 shadow-inner">
        {isLoading && <Spinner />}
        <ul aria-label="Sessions List" className="overflow-y-auto">
          {[...sessionTimestamps]
            .reverse()
            .map(({ sessionId, timestamp }, index) => (
              <li
                key={sessionId}
                onClick={() => handleSessionClick(sessionId)}
                className={classNames(
                  "pl-8 flex items-center justify-between gap-x-4 px-3 py-5 cursor-pointer",
                  selectedSessionId === sessionId ? "bg-primary text-white" : ""
                )}
              >
                <div className="flex items-center gap-x-4">
                  <PencilSquareIcon
                    className={classNames(
                      "border border-gray-300 h-12 w-12 p-2 flex-none rounded-md",
                      selectedSessionId === sessionId
                        ? "bg-white text-primary"
                        : "bg-gray-50 text-primary"
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={classNames(
                        "text-base font-semibold leading-6",
                        selectedSessionId === sessionId
                          ? "text-white"
                          : "text-gray-900"
                      )}
                    >
                      Sitzung {sessionTimestamps.length - index}
                    </p>
                    <p
                      className={classNames(
                        "truncate text-sm leading-5",
                        selectedSessionId === sessionId
                          ? "text-white"
                          : "text-gray-500"
                      )}
                    >
                      {formatDateLong(timestamp)}
                    </p>
                  </div>
                </div>

                {/* Menu for delete option */}
                <Menu
                  as="div"
                  className="relative inline-block text-left"
                  ref={menuRef}
                >
                  <div>
                    <MenuButton
                      className="flex items-center rounded-full text-gray-400 hover:text-gray-600 hover:scale-110"
                      onClick={handleMenuButtonClick}
                    >
                      <EllipsisVerticalIcon
                        aria-hidden="true"
                        className={classNames(
                          "h-6 w-6",
                          selectedSessionId === sessionId
                            ? "text-white hover:text-gray-300"
                            : ""
                        )}
                      />
                    </MenuButton>
                  </div>
                  <MenuItems
                    className={classNames(
                      "fixed z-50 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
                      menuPosition === "top" ? "bottom-full mb-2" : "mt-2"
                    )}
                  >
                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={() => handleDeleteSession(sessionId)}
                          className={classNames(
                            "group flex items-center w-full px-4 py-2 text-sm text-gray-700",
                            active ? "bg-gray-100" : "",
                            "rounded-md" // Ensure rounded-md applies even on hover
                          )}
                        >
                          <TrashIcon
                            className="mr-3 h-5 w-5 text-gray-400 group-hover:text-red-500"
                            aria-hidden="true"
                          />
                          Sitzung löschen
                        </button>
                      )}
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default SessionsComp;
