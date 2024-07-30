export const formatDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
  });
};
