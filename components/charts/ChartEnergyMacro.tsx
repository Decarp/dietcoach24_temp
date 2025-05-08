import { CustomTooltip } from "@/components/CustomTooltip";
import { useCounterStore } from "@/providers/useStoreProvider";
import { ChartEnergyMacroData } from "@/types/types";
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
  Kohlenhydrate: "#68666f",
  Fette: "#80408d",
  Proteine: "#00979d",
  "Weitere Nährstoffe": "#e87d1e",
};

export default function ChartEnergyMacro({
  data,
  rounded = true,
  className,
}: {
  data: ChartEnergyMacroData[];
  rounded?: boolean;
  className?: string;
}) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const { selectedSortCriteria, setSelectedSortCriteria } = useCounterStore(
    (state) => state,
  );

  useEffect(() => {
    const updatedIndex = data.findIndex(
      (item) => item.name === selectedSortCriteria,
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
