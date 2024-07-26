"use client";

import { ChartMacroData } from "@/api/getChartMacroData";
import { useCounterStore } from "@/providers/useStoreProvider";
import { renderActiveChartShape } from "@/utils/renderActiveChartShape";
import { renderCustomizedChartLabel } from "@/utils/renderCustomizedChartLabel";
import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function ChartMacro({ data }: { data: ChartMacroData[] }) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const { selectedSortCriteria, setSelectedSortCriteria } = useCounterStore(
    (state) => state
  );

  useEffect(() => {
    const updatedIndex = data.findIndex(
      (item) => item.name === selectedSortCriteria
    );
    setActiveIndex(updatedIndex !== -1 ? updatedIndex : undefined);
  }, [selectedSortCriteria, data]);

  const handleClick = (index: number) => {
    if (activeIndex === index) {
      setActiveIndex(undefined);
      setSelectedSortCriteria("Einkaufsdatum");
    } else {
      setActiveIndex(index);
      setSelectedSortCriteria(data[index]?.name);
    }
  };

  return (
    <div className="bg-white border p-4 rounded-lg" style={{ height: "310px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            activeIndex={activeIndex}
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
                opacity={activeIndex === index ? 1 : 1}
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
