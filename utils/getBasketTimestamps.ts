import { Patient, Sessions } from "@/types/types";
import { addWeeks, fromUnixTime, getUnixTime, subWeeks } from "date-fns";

export const getBasketTimestamps = (patient?: Patient, sessions?: Sessions) => {
  const ffqTimestamp = patient?.medicalHistory.ffqDate;

  const ffqTimestampMinus8Weeks = getUnixTime(
    subWeeks(fromUnixTime(ffqTimestamp || 0), 8)
  );

  const ffqTimestampPlus8Weeks = getUnixTime(
    addWeeks(fromUnixTime(ffqTimestamp || 0), 8)
  );

  const startTimestamp = ffqTimestampMinus8Weeks.toString();

  if (
    sessions?.length === 0 ||
    sessions?.length === 1 ||
    sessions === undefined
  ) {
    return { startTimestamp, endTimestamp: ffqTimestamp?.toString() };
  } else {
    return { startTimestamp, endTimestamp: ffqTimestampPlus8Weeks.toString() };
  }
};
