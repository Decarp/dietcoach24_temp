"use client";

import { getChartEnergyMacroData } from "@/getData/getChartEnergyMacroData";
import { CustomTooltip } from "@/components/CustomTooltip";
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

const COLORS = ["#68666f", "#80408d", "#00979d", "#e87d1e"];

export default function ChartEnergyMacro({
  data,
  className,
}: {
  data: ChartEnergyMacroData[];
  className?: string;
}) {
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
      setSelectedSortCriteria("Kohlenhydrate");
    } else {
      setActiveIndex(index);
      setSelectedSortCriteria(data[index]?.name);
    }
  };

  return (
    <div
      className={`rounded-lg p-4 border border-gray-300 w-full ${className}`}
      style={{ height: "350px" }}
    >
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
            cursor="pointer"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                opacity={activeIndex === index ? 1 : 1}
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
