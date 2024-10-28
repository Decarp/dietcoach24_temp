"use client";

import { Spinner } from "@/components/Spinner";
import { useCounterStore } from "@/providers/useStoreProvider";
import { Patient, Sessions } from "@/types/types";
import { classNames } from "@/utils/classNames";
import { fetchPatientDetails } from "@/utils/fetchPatientDetails";
import { fetchSessions } from "@/utils/fetchSessions";
import { formatDateLong } from "@/utils/formatDateLong";
import { getSessionTimestamp } from "@/utils/getSessionTimestamp";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import SessionsHeader from "./SessionsHeader";
import { deleteSession } from "@/utils/deleteSession";
import toast from "react-hot-toast";
import { useState, useEffect, useRef } from "react";
import DeleteModal from "@/components/DeleteModal";

const SessionsComp = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const patientId = pathname.split("/")[2];

  const { data: patient } = useQuery<Patient>({
    queryKey: ["participant", patientId],
    queryFn: () => fetchPatientDetails(patientId, session?.accessToken),
    enabled: !!session?.accessToken,
  });

  const { data: sessions, isLoading } = useQuery<Sessions>({
    queryKey: ["sessions", patientId],
    queryFn: () => fetchSessions(patientId, session?.accessToken),
  });

  const {
    selectedSessionId,
    selectedSessionIndex,
    setSelectedSessionId,
    setSelectedSessionIndex,
  } = useCounterStore((state) => state);

  const sessionTimestamps = getSessionTimestamp(patient, sessions);
  const queryClient = useQueryClient();

  const previousSessionCount = useRef(sessionTimestamps.length);

  // Automatically select the newest session if none is selected
  useEffect(() => {
    if (sessionTimestamps.length > 0 && selectedSessionId === null) {
      const newestSession = sessionTimestamps[sessionTimestamps.length - 1];
      setSelectedSessionId(newestSession.sessionId);
      setSelectedSessionIndex(newestSession.index);
    }
  }, [sessionTimestamps, selectedSessionId, setSelectedSessionId]);

  // Automatically reselect the next newest session if the latest one was deleted
  useEffect(() => {
    if (
      selectedSessionId !== null &&
      !sessionTimestamps.some((s) => s.sessionId === selectedSessionId)
    ) {
      if (sessionTimestamps.length > 0) {
        const newestSession = sessionTimestamps[sessionTimestamps.length - 1];
        setSelectedSessionId(newestSession.sessionId);
        setSelectedSessionIndex(newestSession.index);
      } else {
        setSelectedSessionId(null); // If no sessions left
        setSelectedSessionIndex(null);
      }
    }
  }, [
    sessionTimestamps,
    selectedSessionId,
    setSelectedSessionId,
    setSelectedSessionIndex,
  ]);

  // Automatically select the newly created session
  useEffect(() => {
    if (sessionTimestamps.length > previousSessionCount.current) {
      // New session detected, select the latest one
      const newestSession = sessionTimestamps[sessionTimestamps.length - 1];
      setSelectedSessionId(newestSession.sessionId);
      setSelectedSessionIndex(newestSession.index);
    }

    // Update the previous session count
    previousSessionCount.current = sessionTimestamps.length;
  }, [sessionTimestamps, setSelectedSessionId, setSelectedSessionIndex]);

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

  const handleDeleteSession = () => {
    if (sessionToDelete !== null) {
      deleteMutation.mutate(sessionToDelete);
    }
    closeModal();
  };

  const handleSessionClick = (sessionId: number) => {
    setSelectedSessionId(sessionId);
    setSelectedSessionIndex(
      sessionTimestamps.findIndex((s) => s.sessionId === sessionId)
    );
  };

  // State for DeleteModal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<number | null>(null);

  const openModal = (sessionId: number) => {
    setSessionToDelete(sessionId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSessionToDelete(null);
  };

  return (
    <div className="pt-6 -ml-8 bg-white flex flex-col border-b border-x border-gray-300 w-[300px] h-[calc(100vh-185px)]">
      <SessionsHeader />

      <div className="bg-white flex-1 overflow-y-auto min-h-0 shadow-inner">
        {isLoading && <Spinner className="mt-4" />}
        <ul aria-label="Sessions List" className="overflow-y-auto">
          {[...sessionTimestamps]
            .reverse()
            .map(({ sessionId, timestamp }, index) => (
              <li
                key={sessionId}
                className={classNames(
                  "pl-8 flex items-center justify-between gap-x-4 px-3 py-5 cursor-pointer hover:scale-105 transition-transform",
                  selectedSessionId === sessionId ? "bg-primary text-white" : ""
                )}
              >
                <div
                  className="flex items-center gap-x-4 flex-1"
                  onClick={() => handleSessionClick(sessionId)}
                >
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

                <TrashIcon
                  className={classNames(
                    "h-6 w-6 flex-shrink-0 cursor-pointer mr-2",
                    selectedSessionId === sessionId
                      ? "text-white hover:text-red-500 hover:scale-110 transition-transform"
                      : "text-gray-500 hover:text-red-500 hover:scale-110 transition-transform"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(sessionId);
                  }}
                />
              </li>
            ))}
        </ul>
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <DeleteModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          onConfirm={handleDeleteSession}
        />
      )}
    </div>
  );
};

export default SessionsComp;
