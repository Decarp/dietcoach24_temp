import SVGLine from "@/components/SVGLine";
import { useCounterStore } from "@/providers/useStoreProvider";

const sortColors: { [key: string]: string } = {
  Kohlenhydrate: "#68666f",
  Fette: "#80408d",
  Proteine: "#00979d",
  "Weitere Nährstoffe": "#e87d1e",
};

const categoryMultiColors: { [key: string]: string } = {
  Getränke: "#e80538",
  Gemüse: "#c29d00",
  "Fett, Öle & Nüsse": "#e87d1e",
  "Milchprodukte & Alternativen": "#52a52e",
  Snacks: "#00979d",
  "Getreideprodukte & Kartoffeln": "#6578b4",
  "Fleisch, Fisch & Eier": "#80408d",
  Fertiggerichte: "#c9006b",
  "Pflanzliche Proteinquellen": "#68666f",
  Früchte: "#000000",
};

const categorySingleColor = "#009900"; // Default color for bar charts

export default function DiffDot({
  percentageDifference,
  variant = "default",
}: {
  percentageDifference: number | null;
  variant?: "default" | "sort" | "categoryMultiColor" | "categorySingleColor";
}) {
  const { selectedSortCriteria, selectedCategories } = useCounterStore(
    (state) => state,
  );

  const selectedCategory = selectedCategories.major[0];

  const defaultColor = "#ffffff"; // white as default

  const color = (() => {
    switch (variant) {
      case "sort":
        return sortColors[selectedSortCriteria] || defaultColor;
      case "categoryMultiColor":
        return categoryMultiColors[selectedCategory] || defaultColor;
      case "categorySingleColor":
        return categorySingleColor;
      default:
        return defaultColor;
    }
  })();

  return (
    <>
      <SVGLine color={color} />
      <div
        className="flex-shrink-0 mx-4 mx-auto h-16 w-16 flex items-center justify-center border border-gray-300 rounded-full"
        style={{ backgroundColor: color }} // Apply color directly via inline style
      >
        {percentageDifference !== null ? (
          <p className="text-center font-medium text-white">
            {percentageDifference > 0 ? "+" : ""}
            {percentageDifference}%
          </p>
        ) : (
          <p className="text-center text-white">N/A</p>
        )}
      </div>
      <SVGLine color={color} />
    </>
  );
}
