"use client";

import { getChartEnergyMicroCategoriesData } from "@/getData/getChartEnergyMicroCategoriesData";
import { CustomTooltip } from "@/components/CustomTooltip";
import { useCounterStore } from "@/providers/useStoreProvider";
import { ChartEnergyCategoriesData, MicroCategory } from "@/types/types";
import React, { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CustomLabel = ({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  percent = 0,
}: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  percent?: number;
}) => {
  return (
    <text
      x={x + width + 5}
      y={y + height / 2}
      fill="#666"
      textAnchor="start"
      dominantBaseline="middle"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function ChartEnergyMicroCategories({
  data,
  className,
}: {
  data: ChartEnergyCategoriesData[];
  className?: string;
}) {
  const { selectedMicro, setSelectedMicro } = useCounterStore((state) => state);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);

  const { selectedCategories, updateCategories } = useCounterStore(
    (state) => state
  );

  const totalValue = useMemo(() => {
    return data.reduce((sum, item) => sum + item.value, 0);
  }, [data]);

  useEffect(() => {
    const updatedIndices = data
      .map((item, index) =>
        selectedCategories.major.includes(item.name) ? index : -1
      )
      .filter((index) => index !== -1);
    setActiveIndices(updatedIndices);
  }, [selectedCategories, data]);

  const handleMicroChange = (micro: MicroCategory) => {
    setSelectedMicro(micro);
    setActiveIndices([]); // Clear active indices when macro changes
  };

  const handleClick = (index: number) => {
    const category = data[index].name;
    updateCategories(category, "major");

    setActiveIndices((prevIndices) =>
      prevIndices.includes(index)
        ? prevIndices.filter((i) => i !== index)
        : [...prevIndices, index]
    );
  };

  return (
    <div
      className={`bg-white rounded-lg p-4 border border-gray-300 w-full ${className}`}
      style={{ height: "550px" }}
    >
      <div className="flex items-center justify-between space-x-4">
        {["Salz", "Zucker", "Gesättigte Fettsäuren"].map((micro) => (
          <button
            key={micro}
            onClick={() => handleMicroChange(micro as MicroCategory)}
            className={`w-full rounded-md px-3 py-2 text-sm font-semibold text-gray-500 shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary hover:text-white ${
              selectedMicro === micro ? "bg-primary text-white" : "bg-gray-200"
            }`}
          >
            {micro}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 100, left: 70, bottom: 80 }}
          onClick={(e) => handleClick(e.activeTooltipIndex!)}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" fill="#9ca3af">
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={activeIndices.includes(index) ? "#009900" : "#9ca3af"}
                opacity={activeIndices.includes(index) ? 1 : 1}
              />
            ))}
            <LabelList
              dataKey="value"
              position="right"
              content={({ x = 0, y = 0, width = 0, height = 0, value = 0 }) => (
                <CustomLabel
                  x={Number(x)}
                  y={Number(y)}
                  width={Number(width)}
                  height={Number(height)}
                  percent={totalValue ? Number(value) / totalValue : 0}
                />
              )}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
