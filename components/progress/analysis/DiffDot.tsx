import SVGLine from "@/components/SVGLine";

export default function DiffDot({
  percentageDifference,
}: {
  percentageDifference: number | null;
}) {
  return (
    <>
      <SVGLine />
      <div className="flex-shrink-0 mx-4 mx-auto h-16 w-16 bg-white flex items-center justify-center border border-gray-300 rounded-full">
        {percentageDifference !== null ? (
          <p className="text-center font-medium">
            {percentageDifference > 0 ? "+" : ""}
            {percentageDifference}%
          </p>
        ) : (
          <p className="text-center">N/A</p>
        )}
      </div>
      <SVGLine />
    </>
  );
}
