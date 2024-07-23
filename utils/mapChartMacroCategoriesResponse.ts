export type ChartMacroCategoriesResponse = {
  name: {
    de: string;
    en: string;
  };
  values: {
    kcal: number;
    g: number;
  };
};

export type ChartMacroCategoriesData = {
  name: string;
  value: number;
  metric: string;
};

export type MetricOptions = "kcal" | "g";

export type LanguageOptions = "en" | "de";

export const mapChartMacroCategoriesResponse = (
  chartMacroCategoriesResponse: ChartMacroCategoriesResponse[],
  selectedMetric: MetricOptions,
  language: LanguageOptions = "de"
): ChartMacroCategoriesData[] => {
  return chartMacroCategoriesResponse.map((item) => ({
    name: item.name[language],
    value: item.values[selectedMetric],
    metric: selectedMetric,
  }));
};
