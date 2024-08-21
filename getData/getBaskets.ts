import { basketsResponse } from "@/data/basketsResponse";
import { Basket } from "@/types/types";
import { config } from "dotenv";

config();

const MOCK = true;

const fetchData = (
  startTimestamp: number = 1000000, // default: 1970
  endTimestamp: number = 10000000 // default: right now
): Basket[] => {
  if (MOCK) {
    const authentication = process.env.AUTHENTICATION;
    const participantId = process.env.PARTICIPANT_ID;
  } else {
    const authentication = ""; // via local storage
    const participantId = ""; // via url param
  }

  //
  return basketsResponse;
};

export const getBaskets = (
  startTimestamp: number = 1000000, // default: 1970
  endTimestamp: number = 10000000 // default: right now
): Basket[] => {
  const data = fetchData(startTimestamp, endTimestamp);
  return data;
};
