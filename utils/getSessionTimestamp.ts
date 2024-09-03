import { Patient, Sessions } from "@/types/types";
import { addWeeks, fromUnixTime, getUnixTime } from "date-fns";

export const getSessionTimestamp = (
  patient?: Patient,
  sessions?: Sessions
): { sessionId: number; timestamp: number }[] => {
  const ffqTimestamp = patient?.medicalHistory.ffqDate || 0;
  const sessionTimestamps: { sessionId: number; timestamp: number }[] = [];

  if (sessions && sessions.length > 0) {
    sessions.forEach((session, index) => {
      let timestamp;
      if (index === 0) {
        timestamp = ffqTimestamp; // First session: FFQ timestamp
      } else if (index === 1) {
        timestamp = getUnixTime(addWeeks(fromUnixTime(ffqTimestamp), 8)); // Second session: FFQ + 8 weeks
      } else {
        timestamp = session.timestamp; // Subsequent sessions: original timestamp
      }
      sessionTimestamps.push({ sessionId: session.sessionId, timestamp });
    });
  }

  return sessionTimestamps;
};
