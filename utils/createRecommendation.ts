import axios from "axios";
import { Omit } from "lodash";
import { Recommendation } from "@/types/types";

export const createRecommendation = async (
  data: Omit<Recommendation, "recommendationId" | "index">
): Promise<Recommendation> => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/dietician/recommendation`,
    {
      rule: data.rule,
      basketIds: data.basketIds,
      suggestions: data.suggestions,
      notes: data.notes,
    },
    {
      headers: {
        Authentication: process.env.NEXT_PUBLIC_AUTH_TOKEN!,
        "Session-Id": "1",
        "Content-Type": "application/json",
      },
    }
  );

  if (response.status !== 201) {
    throw new Error(`Failed to create recommendation: ${response.statusText}`);
  }

  return response.data;
};
