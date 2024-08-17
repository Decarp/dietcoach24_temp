"use client";

import { getChartEnergyCategoriesData } from "@/getData/getChartEnergyCategoriesData";
import { CustomTooltip } from "@/components/CustomTooltip";
import { useCounterStore } from "@/providers/useStoreProvider";
import { ChartEnergyCategoriesData } from "@/types/types";
import { renderActiveChartShape } from "@/utils/renderActiveChartShape";
import { renderCustomizedChartLabel } from "@/utils/renderCustomizedChartLabel";
import React, { useEffect, useMemo, useState } from "react";
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

export default function ChartEnergyCategories({
  data,
  replace = false,
  className,
}: {
  data: ChartEnergyCategoriesData[];
  replace?: boolean;
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
      className={`bg-white rounded-lg p-4 border border-gray-300 w-full ${className}`}
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
