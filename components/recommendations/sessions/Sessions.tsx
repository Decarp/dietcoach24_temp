import { useCounterStore } from "@/providers/useStoreProvider";
import { Sessions } from "@/types/types";
import { classNames } from "@/utils/classNames";
import { fetchSessions } from "@/utils/fetchSessions";
import { formatDate } from "@/utils/formatDate";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import SessionsHeader from "./SessionsHeader";
import { Spinner } from "@/components/Spinner";

const SessionsComp = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const patientId = pathname.split("/")[2];

  // Fetch existing sessions
  const { data: sessions, isLoading } = useQuery<Sessions>({
    queryKey: ["sessions", patientId],
    queryFn: () => fetchSessions(patientId, session?.accessToken),
  });

  const { selectedSessionId, setSelectedSessionId } = useCounterStore(
    (state) => state
  );

  const handleSessionClick = (sessionId: number) => {
    setSelectedSessionId(sessionId);
  };

  return (
    <div className="pt-6 -ml-8 bg-white border-l flex flex-col border-b border-gray-300 min-w-56 xl:w-64 xl:shrink-0 h-[calc(100vh-185px)]">
      <SessionsHeader />

      <div className="bg-white flex-1 overflow-y-auto min-h-0 min-h-8 shadow-inner">
        {isLoading && <Spinner />}
        <ul aria-label="Sessions List" className="overflow-y-auto">
          {sessions?.map((session) => (
            <li
              key={session.sessionId}
              onClick={() => handleSessionClick(session.sessionId)}
              className={classNames(
                "pl-8 flex items-center gap-x-4 px-3 py-5 cursor-pointer",
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
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SessionsComp;
