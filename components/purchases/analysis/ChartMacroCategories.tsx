"use client";

import { useCounterStore } from "@/providers/useStoreProvider";
import { ChartMacroCategoriesData } from "@/types/types";
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
  const { selectedCategories, setSelectedCategories, basketProductsFlat } =
    useCounterStore((state) => state);

  useEffect(() => {
    const updatedIndices = data
      .map((item, index) =>
        selectedCategories.major.includes(item.name) ? index : -1
      )
      .filter((index) => index !== -1);
    setActiveIndices(updatedIndices);
  }, [selectedCategories, data]);

  const handleClick = (index: number) => {
    let updatedIndices;
    const majorCategory = data[index].name;
    const newSelectedCategories = { ...selectedCategories };

    if (activeIndices.includes(index)) {
      updatedIndices = activeIndices.filter((i) => i !== index);
      // Deselect the major category and all its sub-categories
      newSelectedCategories.major = newSelectedCategories.major.filter(
        (cat) => cat !== majorCategory
      );
      newSelectedCategories.sub = newSelectedCategories.sub.filter(
        (sub) =>
          !basketProductsFlat.some(
            (product) =>
              product.dietCoachCategoryL1.de === majorCategory &&
              product.dietCoachCategoryL2.de === sub
          )
      );
    } else {
      updatedIndices = [...activeIndices, index];
      // Select the major category and all its sub-categories
      newSelectedCategories.major.push(majorCategory);
      newSelectedCategories.sub.push(
        ...basketProductsFlat
          .filter((product) => product.dietCoachCategoryL1.de === majorCategory)
          .map((product) => product.dietCoachCategoryL2.de)
      );
    }

    setActiveIndices(updatedIndices);
    setSelectedCategories(newSelectedCategories);
  };

  return (
    <div className="bg-white p-4 border rounded-lg" style={{ height: "380px" }}>
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
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
