"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { MetricOptions } from "@/types/types";
import { useCounterStore } from "@/providers/useStoreProvider";
import { getChartEnergyMacroCategoriesData } from "@/api/getChartEnergyMacroCategoriesData";

type MacroCategory = "Kohlenhydrate" | "Fette" | "Proteine" | "Nahrungsfasern";

const CustomLabel = ({
  x = 0,
  y = 0,
  value = 0,
  width = 0,
  height = 0,
  selectedMetric,
}: {
  x: any;
  y: any;
  value: any;
  width: any;
  height: any;
  selectedMetric: string;
}) => {
  return (
    <text
      x={x + width + 5}
      y={y + height / 2}
      fill="#666"
      textAnchor="start"
      dominantBaseline="middle"
    >
      {`${value}${selectedMetric}`}
    </text>
  );
};

const ChartEnergyMacroCategories: React.FC = () => {
  const [selectedMacro, setSelectedMetric] =
    useState<MacroCategory>("Kohlenhydrate");
  const [selectedMetric, setSelectedMetricType] = useState<MetricOptions>("g");
  const [activeIndices, setActiveIndices] = useState<number[]>([]);

  const { selectedBasketIds, selectedCategories, updateCategories } =
    useCounterStore((state) => state);

  const [data, setData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = getChartEnergyMacroCategoriesData(
        selectedBasketIds,
        selectedMacro,
        selectedMetric
      );
      setData(result);
    };
    fetchData();
  }, [selectedBasketIds, selectedMacro, selectedMetric]);

  const handleMacroChange = (macro: MacroCategory) => {
    setSelectedMetric(macro);
    setActiveIndices([]); // Clear active indices when macro changes
  };

  const handleMetricChange = (metric: MetricOptions) => {
    setSelectedMetricType(metric);
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

  useEffect(() => {
    const updatedIndices = data
      .map((item, index) =>
        selectedCategories.major.includes(item.name) ? index : -1
      )
      .filter((index) => index !== -1);
    setActiveIndices(updatedIndices);
  }, [selectedCategories, data]);

  return (
    <div className="bg-white p-4 border rounded-lg" style={{ height: "550px" }}>
      <div className="flex items-center justify-between space-x-4">
        <div className="grid grid-cols-2 gap-2">
          {["Kohlenhydrate", "Fette", "Proteine", "Nahrungsfasern"].map(
            (macro) => (
              <button
                key={macro}
                onClick={() => handleMacroChange(macro as MacroCategory)}
                className={`rounded-md px-3 py-2 text-sm font-semibold text-gray-500 shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary hover:text-white ${
                  selectedMacro === macro
                    ? "bg-primary text-white"
                    : "bg-gray-200"
                }`}
              >
                {macro}
              </button>
            )
          )}
        </div>
        <div className="border-l my-3 h-10" />
        <div className="flex space-x-2">
          {["g", "kcal"].map((metric) => (
            <button
              key={metric}
              onClick={() => handleMetricChange(metric as MetricOptions)}
              className={`rounded-md px-3 py-2 text-sm font-semibold text-gray-500 shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary hover:text-white h-10 ${
                selectedMetric === metric
                  ? "bg-primary text-white"
                  : "bg-gray-200"
              }`}
            >
              {metric}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 60, left: 70, bottom: 80 }}
          onClick={(e) => handleClick(e.activeTooltipIndex!)}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend
            formatter={(value) => `${selectedMetric == "g" ? "Gramm" : "Kcal"}`}
          />
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
              content={({ x, y, width, height, value }) => (
                <CustomLabel
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  value={value}
                  selectedMetric={selectedMetric}
                />
              )}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartEnergyMacroCategories;
