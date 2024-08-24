export const createNote = async (
  newNote: string,
  sessionId: number,
  accessToken: string
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/dietician/session-note`,
    {
      method: "POST",
      headers: {
        Authentication: accessToken,
        "Session-Id": sessionId.toString(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notes: {
          patient: newNote,
          personal: "", // not used for now
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to post the note");
  }

  return response;
};
