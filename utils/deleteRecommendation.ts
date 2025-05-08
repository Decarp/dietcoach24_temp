export const deleteRecommendation = async (
  recommendationId: number,
  token: string,
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/dietician/recommendation`,
    {
      method: "DELETE",
      headers: {
        Authentication: token,
        "Recommendation-Id": recommendationId.toString(),
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to delete recommendation");
  }

  return response;
};
