import { createSession } from "@/utils/createSession";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";

const SessionsHeader = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const patientId = pathname.split("/")[2];
  const queryClient = useQueryClient();

  // Create new session
  const mutation = useMutation({
    mutationFn: () => createSession(patientId, session?.accessToken || ""),
    onSuccess: (newSession) => {
      toast.success("Neue Sitzung erstellt", { duration: 3000 });
      queryClient.invalidateQueries({ queryKey: ["sessions", patientId] });
    },
    onError: () => {
      toast.error("Fehler beim Erstellen der Sitzung", { duration: 3000 });
    },
  });

  const handleCreateSession = () => {
    mutation.mutate();
  };

  return (
    <div className="border-b border-gray-300">
      <div className="flex justify-between items-center mb-8 pl-8 pr-5">
        <div>
          <h2 className="text-xl font-semibold">Sitzungen</h2>
          <h3 className="text-xs font-light text-gray-500">Alle Sitzungen</h3>
        </div>
        <PlusCircleIcon
          onClick={handleCreateSession}
          className="h-10 w-10 text-primary hover:text-green-800 hover:cursor-pointer"
        />
      </div>
    </div>
  );
};

export default SessionsHeader;
