import { sessionsResponse } from "@/data/sessionsResponse";
import { SessionOverview } from "@/types/types";

const fetchData = (): SessionOverview[] => {
  const authentication = ""; // via local storage
  const participantId = ""; // via url param
  return sessionsResponse;
};

export const getSessions = (): SessionOverview[] => {
  const data = fetchData();
  return data;
};
