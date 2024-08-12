import { nutriScoreTableResponse } from "@/data/nutriScoreTableResponse";
import { NutriScoreTableResponse } from "@/types/types";

const fetchData = (
  startTimestamp: number = 1000000, // default: 1970
  endTimestamp: number = 10000000 // default: right now
): NutriScoreTableResponse[] => {
  const authentication = ""; // via local storage
  const participantId = ""; // via url param
  return nutriScoreTableResponse;
};

export const getNutriScoreTableData = (
  startTimestamp: number = 1000000, // default: 1970
  endTimestamp: number = 10000000 // default: right now
): NutriScoreTableResponse[] => {
  const data = fetchData(startTimestamp, endTimestamp);
  return data;
};
