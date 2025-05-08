import { NutrientTableItem, NutrientTableResponseItem } from "@/types/types";

export const mapNutriScoreTableResponse = (
  data: NutrientTableResponseItem[],
): NutrientTableItem[] => {
  const sortedByMajorCategory = data.sort((a, b) =>
    a.MajorCategory.de.localeCompare(b.MajorCategory.de),
  );

  const filtered = sortedByMajorCategory.filter(
    (item) => item.MajorCategory.de !== "Ausgeschlossen",
  );

  // Filter out rows where all values are null
  const nonEmptyRows = filtered.filter((item) => {
    return (
      item.EnergyShare !== null ||
      item.Quantity !== null ||
      item.EnergyKJ !== null ||
      item.Sugars !== null ||
      item.Salt !== null ||
      item.Saturates !== null ||
      item.Fibres !== null ||
      item.FVL !== null ||
      item.Proteins !== null
    );
  });

  const mapped = nonEmptyRows.map((item) => {
    const category: [string] | [string, string] = item.MinorCategory
      ? [item.MajorCategory.de, item.MinorCategory.de]
      : [item.MajorCategory.de];

    return {
      Category: category,
      EnergyShare: item.EnergyShare,
      Quantity: item.Quantity,
      EnergyKJ: item.EnergyKJ,
      Sugars: item.Sugars,
      Salt: item.Salt,
      Saturates: item.Saturates,
      Fibres: item.Fibres,
      FVL: item.FVL,
      Proteins: item.Proteins,
      MajorCategory: item.MajorCategory,
    };
  });

  return mapped;
};
