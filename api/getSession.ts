import { sessionResponse } from "@/data/sessionResponse";
import { Session } from "@/types/types";

const fetchData = (sessionId: number): Session => {
  const authentication = ""; // via local storage
  const participantId = ""; // via url param
  return sessionResponse.filter(
    (session) => session.sessionId === sessionId
  )[0];
};

export const getSession = (sessionId: number): Session => {
  const data = fetchData(sessionId);
  return data;
};
