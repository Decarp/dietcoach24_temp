"use client";

import { CustomTooltip } from "@/components/CustomTooltip";
import { useCounterStore } from "@/providers/useStoreProvider";
import { ChartEnergyCategoriesData } from "@/types/types";
import { renderActiveChartShape } from "@/utils/renderActiveChartShape";
import { renderCustomizedChartLabel } from "@/utils/renderCustomizedChartLabel";
import { useEffect, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const categoryColors = {
  Getränke: "#e80538",
  Gemüse: "#c29d00",
  "Fett, Öle & Nüsse": "#e87d1e",
  "Milchprodukte & Alternativen": "#52a52e",
  Snacks: "#00979d",
  "Getreideprodukte & Kartoffeln": "#6578b4",
  "Fleisch, Fisch & Eier": "#80408d",
  Fertiggerichte: "#c9006b",
  "Pflanzliche Proteinquellen": "#68666f",
  Früchte: "#000",
};

export default function ChartEnergyCategories({
  data,
  replace = false,
  rounded = true,
  className,
}: {
  data: ChartEnergyCategoriesData[];
  replace?: boolean;
  rounded?: boolean;
  className?: string;
}) {
  const [activeIndices, setActiveIndices] = useState<number[]>([]);

  const { selectedCategories, updateCategories } = useCounterStore(
    (state) => state
  );

  useEffect(() => {
    const updatedIndices = data
      .map((item, index) =>
        selectedCategories.major.includes(item.name) ? index : -1
      )
      .filter((index) => index !== -1);
    setActiveIndices(updatedIndices);
  }, [selectedCategories, data]);

  const handleClick = (index: number) => {
    const majorCategory = data[index].name;
    updateCategories(majorCategory, "major", replace);
  };

  return (
    <div
      className={`rounded-lg p-4 border border-gray-300 w-full ${className}`}
      style={{ height: "380px" }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            activeIndex={activeIndices}
            activeShape={renderActiveChartShape}
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(props) => renderCustomizedChartLabel({ ...props, rounded })}
            innerRadius={0}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            animationDuration={1000}
            onClick={(e, index) => handleClick(index)}
            cursor="pointer"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  categoryColors[entry.name as keyof typeof categoryColors] ||
                  "#CCCCCC"
                }
                opacity={activeIndices.includes(index) ? 1 : 1}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
