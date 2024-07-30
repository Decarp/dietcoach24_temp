import { basketsResponse } from "@/data/basketsResponse";

const fetchData = (
  startTimestamp: number = 1000000, // default: 1970
  endTimestamp: number = 10000000 // default: right now
) => {
  const authentication = ""; // via local storage
  const participantId = ""; // via url param
  return basketsResponse;
};

export const getBaskets = (
  startTimestamp: number = 1000000, // default: 1970
  endTimestamp: number = 10000000 // default: right now
) => {
  const data = fetchData(startTimestamp, endTimestamp);
  return data;
};
