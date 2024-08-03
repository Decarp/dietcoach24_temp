"use client";

import { getChartEnergyMacroData } from "@/api/getChartEnergyMacroData";
import { useCounterStore } from "@/providers/useStoreProvider";
import { ChartEnergyMacroData, MetricOptions } from "@/types/types";
import { renderActiveChartShape } from "@/utils/renderActiveChartShape";
import { renderCustomizedChartLabel } from "@/utils/renderCustomizedChartLabel";
import React, { useState, useEffect, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function ChartEnergyMacro() {
  const selectedMetric: MetricOptions = "kcal";

  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const { selectedBasketIds, selectedSortCriteria, setSelectedSortCriteria } =
    useCounterStore((state) => state);

  const data: ChartEnergyMacroData[] = useMemo(() => {
    return getChartEnergyMacroData(selectedBasketIds, selectedMetric);
  }, [selectedBasketIds, selectedMetric]);

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
