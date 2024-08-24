import { useCounterStore } from "@/providers/useStoreProvider";
import { Sessions } from "@/types/types";
import { classNames } from "@/utils/classNames";
import { fetchSessions } from "@/utils/fetchSessions";
import { formatDate } from "@/utils/formatDate";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import SessionsHeader from "./SessionsHeader";
import { createSession } from "@/utils/createSession";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

const SessionsComp = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const patientId = pathname.split("/")[2];

  // Fetch existing sessions
  const { data: sessions, refetch } = useQuery<Sessions>({
    queryKey: ["sessions", patientId],
    queryFn: () => fetchSessions(patientId, session?.accessToken),
  });

  const { selectedSessionId, setSelectedSessionId } = useCounterStore(
    (state) => state
  );

  // Create new session
  const mutation = useMutation({
    mutationFn: () => createSession(patientId, session?.accessToken || ""),
    onSuccess: (newSession) => {
      toast.success("Neue Sitzung erstellt", { duration: 3000 });
      refetch();
    },
    onError: () => {
      toast.error("Fehler beim Erstellen der Sitzung", { duration: 3000 });
    },
  });

  const handleBasketCheckboxChange = (sessionId: number) => {
    setSelectedSessionId(sessionId);
  };

  const handleCreateSession = () => {
    mutation.mutate();
  };

  return (
    <div className="pt-6 -ml-8 bg-white border-x flex flex-col border-b border-gray-300 xl:w-64 xl:shrink-0 h-[calc(100vh-185px)]">
      <SessionsHeader />

      <div className="bg-white flex-1 overflow-y-auto min-h-0 min-h-8 shadow-inner">
        <ul aria-label="Sessions List" className="overflow-y-auto">
          {sessions?.map((session) => (
            <li
              key={session.sessionId}
              className={classNames(
                "pl-8 flex items-center gap-x-4 px-3 py-5",
                selectedSessionId === session.sessionId
                  ? "bg-primary text-white"
                  : ""
              )}
            >
              <PencilSquareIcon
                className={classNames(
                  "border border-gray-300 h-12 w-12 p-2 flex-none rounded-md",
                  selectedSessionId === session.sessionId
                    ? "bg-white text-primary"
                    : "bg-gray-50 text-primary"
                )}
              />
              <div className="min-w-0 flex-1">
                <p
                  className={classNames(
                    "text-base font-semibold leading-6",
                    selectedSessionId === session.sessionId
                      ? "text-white"
                      : "text-gray-900"
                  )}
                >
                  Sitzung {session.index}
                </p>
                <p
                  className={classNames(
                    "truncate text-sm leading-5",
                    selectedSessionId === session.sessionId
                      ? "text-white"
                      : "text-gray-500"
                  )}
                >
                  {formatDate(session.timestamp)}
                </p>
              </div>
              <input
                type="checkbox"
                className="h-4 w-4 mr-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={selectedSessionId === session.sessionId}
                onChange={() => handleBasketCheckboxChange(session.sessionId)}
              />
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={handleCreateSession}
          className="ml-4 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary hover:bg-green-700"
        >
          Neue Sitzung erstellen
        </button>
      </div>
    </div>
  );
};

export default SessionsComp;
