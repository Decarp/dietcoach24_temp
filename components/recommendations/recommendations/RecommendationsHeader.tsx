const RecommendationsHeader = ({
  numRecommendations,
}: {
  numRecommendations: number;
}) => {
  return (
    <div className="border-b border-gray-300 -mx-6">
      <div className="mx-6">
        <h2 className="text-xl font-semibold">Empfehlungen</h2>
        <h3 className="text-xs font-light mb-8 text-gray-500">
          {numRecommendations}{" "}
          {numRecommendations === 1 ? "Empfehlung" : "Empfehlungen"}
        </h3>
      </div>
    </div>
  );
};

export default RecommendationsHeader;
