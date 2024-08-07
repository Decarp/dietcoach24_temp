const RecommendationsHeader = ({
  numRecommendations,
}: {
  numRecommendations: number;
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold">Empfehlungen</h2>
      <h3 className="text-sm font-light mb-7 text-gray-500">
        {numRecommendations}{" "}
        {numRecommendations === 1 ? "Empfehlung" : "Empfehlungen"}
      </h3>
    </div>
  );
};

export default RecommendationsHeader;
