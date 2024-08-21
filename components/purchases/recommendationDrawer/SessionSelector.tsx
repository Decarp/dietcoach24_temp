"use client";

import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchSessions } from "@/utils/fetchSessions";
import { Sessions } from "@/types/types";
import { format } from "date-fns";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { createSession } from "@/utils/createSession";

export default function SessionSelector({
  onSelectSession,
}: {
  onSelectSession: (sessionId: number | null) => void;
}) {
  const pathname = usePathname();
  const patientId = pathname.split("/")[2];

  // Fetch existing sessions
  const { data: sessions, refetch } = useQuery<Sessions>({
    queryKey: ["sessions", patientId],
    queryFn: () => fetchSessions(patientId),
  });

  // UseMutation for creating a new session
  const mutation = useMutation({
    mutationFn: () => createSession(patientId),
    onSuccess: (newSession) => {
      toast.success("Neue Sitzung erstellt", { duration: 3000 });
      refetch(); // Refetch sessions to include the newly created session
    },
    onError: () => {
      toast.error("Fehler beim Erstellen der Sitzung", { duration: 3000 });
    },
  });

  const handleCreateSession = () => {
    mutation.mutate(); // Trigger session creation
  };

  const handleSessionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSessionId = parseInt(e.target.value, 10);
    if (isNaN(selectedSessionId)) {
      onSelectSession(null); // No session selected
    } else {
      onSelectSession(selectedSessionId); // Send selected session ID back to parent
    }
  };

  // Trigger the initial selection when sessions are loaded
  useEffect(() => {
    if (sessions && sessions.length > 0) {
      onSelectSession(sessions[0].sessionId);
    } else {
      onSelectSession(null);
    }
  }, [sessions, onSelectSession]);

  return (
    <section className="mt-6">
      <h2 className="mb-4 block text-xl font-medium leading-6 text-gray-900">
        Sitzung auswählen
      </h2>
      <div className="flex">
        <div className="flex items-center">
          <select
            id="session"
            name="session"
            onChange={handleSessionChange}
            className="block w-96 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6"
          >
            {sessions && sessions.length > 0 ? (
              sessions.map((session) => (
                <option
                  key={session.sessionId}
                  value={session.sessionId.toString()} // Set the sessionId as the value
                >
                  {`Sitzung #${session.index} - ${format(
                    new Date(session.timestamp * 1000),
                    "dd.MM.yyyy HH:mm"
                  )}`}
                </option>
              ))
            ) : (
              <option value="none">Keine Sitzung verfügbar</option>
            )}
          </select>
        </div>
        <button
          type="button"
          onClick={handleCreateSession}
          className="ml-4 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary hover:bg-green-700"
        >
          Neue Sitzung erstellen
        </button>
      </div>
    </section>
  );
}
