import { getSessions } from "@/api/getSessions";
import { format } from "date-fns";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SessionSelector({
  session,
  setSession,
}: {
  session: string;
  setSession: (session: string) => void;
}) {
  const sessionsResponse = getSessions();
  const [sessionsFetched, setSessionsFetched] = useState(sessionsResponse);

  const handleSessionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "new") {
      const newSessionIndex = sessionsFetched.length + 1;
      const newSessionId =
        Math.max(...sessionsFetched.map((s) => s.sessionId)) + 1;
      const newSession = {
        sessionId: newSessionId,
        index: newSessionIndex,
        timestamp: Math.floor(Date.now() / 1000), // current timestamp in seconds
      };
      setSessionsFetched([...sessionsFetched, newSession]);
      setSession(`Sitzung #${newSessionIndex}`);
      toast.success("Neue Sitzung erstellt", { duration: 3000 });
    } else {
      setSession(value);
    }
  };

  // TODO: Add "Keine Sitzungen vorhanden" --> Automatically create one

  return (
    <section className="mt-6">
      <h2 className="mb-4 block text-xl font-medium leading-6 text-gray-900">
        Sitzung auswählen
      </h2>
      <div className="flex items-start justify-between">
        <div className="flex items-center justify-left space-x-6">
          <select
            id="session"
            name="session"
            value={session}
            onChange={handleSessionChange}
            className="block w-96 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6"
          >
            {sessionsFetched.map((session) => (
              <option
                key={session.sessionId}
                value={`Sitzung #${session.index}`}
              >
                {`Sitzung #${session.index} - ${format(
                  new Date(session.timestamp * 1000),
                  "dd.MM.yyyy HH:mm"
                )}`}
              </option>
            ))}
            <option value="new">Neue Sitzung erstellen</option>
          </select>
        </div>
      </div>
    </section>
  );
}
