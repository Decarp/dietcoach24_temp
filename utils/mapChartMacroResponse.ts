export type ChartMacroResponse = {
  name: {
    de: string;
    en: string;
  };
  values: {
    kcal: number;
    g: number;
  };
};

export type ChartMacroData = {
  name: string;
  value: number;
  metric: string;
};

export type MetricOptions = "kcal" | "g";

export type LanguageOptions = "en" | "de";

export const mapChartMacroResponse = (
  chartMacroResponse: ChartMacroResponse[],
  selectedMetric: MetricOptions,
  language: LanguageOptions = "de"
): ChartMacroData[] => {
  return chartMacroResponse.map((item) => ({
    name: item.name[language],
    value: item.values[selectedMetric],
    metric: selectedMetric,
  }));
};
