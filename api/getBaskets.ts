import { basketsResponse } from "@/data/basketsResponse";
import { Basket } from "@/types/types";

const fetchData = (
  startTimestamp: number = 1000000, // default: 1970
  endTimestamp: number = 10000000 // default: right now
): Basket[] => {
  const authentication = ""; // via local storage
  const participantId = ""; // via url param
  return basketsResponse;
};

export const getBaskets = (
  startTimestamp: number = 1000000, // default: 1970
  endTimestamp: number = 10000000 // default: right now
): Basket[] => {
  const data = fetchData(startTimestamp, endTimestamp);
  return data;
};
