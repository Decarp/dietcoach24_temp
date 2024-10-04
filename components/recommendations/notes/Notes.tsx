import Button from "@/components/Button";
import { useCounterStore } from "@/providers/useStoreProvider";
import { Session } from "@/types/types";
import { createNote } from "@/utils/createNote";
import { fetchSession } from "@/utils/fetchSession";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import NotesHeader from "./NotesHeader";

const Notes = () => {
  const { data: session } = useSession();
  const { selectedSessionId } = useCounterStore((state) => ({
    selectedSessionId: state.selectedSessionId,
  }));
  const [patientNote, setPatientNote] = useState("");

  const { data: consultationSession, refetch } = useQuery<Session>({
    queryKey: ["session", selectedSessionId],
    queryFn: () =>
      fetchSession(selectedSessionId ?? 0, session?.accessToken || ""),
    enabled: selectedSessionId !== null && !!session?.accessToken,
  });

  const mutation = useMutation({
    mutationFn: (note: string) =>
      createNote(note, selectedSessionId ?? 0, session?.accessToken || ""),
    onSuccess: () => {
      refetch();
      toast.success("Notiz gespeichert", {
        duration: 3000,
      });
    },
    onError: (error) => {
      console.log("Notes error", error);
      toast.error("Fehler beim Speichern der Notiz", {
        duration: 3000,
      });
    },
  });

  useEffect(() => {
    if (selectedSessionId !== null) {
      setPatientNote(consultationSession?.notes.patient || "");
      refetch();
    }
  }, [consultationSession, selectedSessionId]);

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPatientNote(e.target.value);
  };

  const handleNoteSubmit = () => {
    mutation.mutate(patientNote);
  };

  return (
    <div className="relative pt-6 -mr-8 bg-white border-x flex flex-col shrink-0 border-t border-b border-gray-300 w-[220px] lg:border-t-0 lg:pr-8 xl:pr-6 h-[calc(100vh-185px)]">
      <NotesHeader />

      <div className="border-t border-gray-300 mt-12 -mr-6 flex-1 overflow-y-auto min-h-0 min-h-80 shadow-inner">
        {selectedSessionId !== null && (
          <div className="mt-2 p-4">
            <textarea
              id="comment"
              name="comment"
              rows={8}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              value={patientNote}
              onChange={handleNoteChange}
            />
            <div className="flex justify-end py-4">
              <Button
                onClick={handleNoteSubmit}
                icon={<CheckCircleIcon className="h-5 w-5" />}
              >
                Speichern
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
