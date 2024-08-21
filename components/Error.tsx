export const Error = ({ message }: { message: string }) => {
  console.log("Baskets error: ", message);
  return (
    <div className="m-4">
      Entschuldigung, ein Fehler ist aufgetreten. Bitte versuchen Sie es später
      erneut.
    </div>
  );
};
