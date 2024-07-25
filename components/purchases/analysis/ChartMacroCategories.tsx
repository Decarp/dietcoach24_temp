"use client";

import { ChartMacroCategoriesData } from "@/api/getChartMacroCategoriesData";
import { useCounterStore } from "@/providers/useStoreProvider";
import { renderActiveChartShape } from "@/utils/renderActiveChartShape";
import { renderCustomizedChartLabel } from "@/utils/renderCustomizedChartLabel";
import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28DFE",
  "#FEA28D",
  "#8DFFF4",
  "#FFD700",
];

export default function ChartMacroCategories({
  data,
}: {
  data: ChartMacroCategoriesData[];
}) {
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const { selectedCats, setSelectedCats } = useCounterStore((state) => state);

  // TODO: There can be orphans left in selectedCats if a basket was deselected

  useEffect(() => {
    const updatedIndices = data
      .map((item, index) => (selectedCats.includes(item.name) ? index : -1))
      .filter((index) => index !== -1);
    setActiveIndices(updatedIndices);
  }, [selectedCats, data]);

  const handleClick = (index: number) => {
    let updatedIndices;
    if (activeIndices.includes(index)) {
      updatedIndices = activeIndices.filter((i) => i !== index);
    } else {
      updatedIndices = [...activeIndices, index];
    }
    setActiveIndices(updatedIndices);

    const selectedCategories = updatedIndices.map((i) => data[i]?.name);
    setSelectedCats(selectedCategories);
  };

  return (
    <div className="bg-white p-4 border rounded-lg" style={{ height: "350px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            activeIndex={activeIndices}
            activeShape={renderActiveChartShape}
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedChartLabel}
            innerRadius={0}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            animationDuration={1000}
            onClick={(e, index) => handleClick(index)}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                opacity={activeIndices.includes(index) ? 1 : 1} // Bug: If I change opactiy to 0.5, and click on a section, the labels disappear for 1 second
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
