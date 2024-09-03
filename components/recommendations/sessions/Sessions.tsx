import { Spinner } from "@/components/Spinner";
import { useCounterStore } from "@/providers/useStoreProvider";
import { Patient, Sessions } from "@/types/types";
import { classNames } from "@/utils/classNames";
import { fetchPatientDetails } from "@/utils/fetchPatientDetails";
import { fetchSessions } from "@/utils/fetchSessions";
import { formatDateLong } from "@/utils/formatDateLong";
import { getSessionTimestamp } from "@/utils/getSessionTimestamp";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import SessionsHeader from "./SessionsHeader";

const SessionsComp = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const patientId = pathname.split("/")[2];

  const { data: patient } = useQuery<Patient>({
    queryKey: ["participant", patientId],
    queryFn: () => fetchPatientDetails(patientId, session?.accessToken),
    enabled: !!session?.accessToken,
  });

  // Fetch existing sessions
  const { data: sessions, isLoading } = useQuery<Sessions>({
    queryKey: ["sessions", patientId],
    queryFn: () => fetchSessions(patientId, session?.accessToken),
  });

  const { selectedSessionId, setSelectedSessionId } = useCounterStore(
    (state) => state
  );

  const sessionTimestamps = getSessionTimestamp(patient, sessions);

  const handleSessionClick = (sessionId: number) => {
    setSelectedSessionId(sessionId);
  };

  return (
    <div className="pt-6 -ml-8 bg-white border-l flex flex-col border-b border-gray-300 min-w-56 xl:w-64 xl:shrink-0 h-[calc(100vh-185px)]">
      <SessionsHeader />

      <div className="bg-white flex-1 overflow-y-auto min-h-0 min-h-8 shadow-inner">
        {isLoading && <Spinner />}
        <ul aria-label="Sessions List" className="overflow-y-auto">
          {[...sessionTimestamps]
            .reverse()
            .map(({ sessionId, timestamp }, index) => (
              <li
                key={sessionId}
                onClick={() => handleSessionClick(sessionId)}
                className={classNames(
                  "pl-8 flex items-center gap-x-4 px-3 py-5 cursor-pointer",
                  selectedSessionId === sessionId ? "bg-primary text-white" : ""
                )}
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
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default SessionsComp;
