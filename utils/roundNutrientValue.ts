export const roundNutrientValue = (value: number) => {
  return value % 1 === 0 ? value : value.toFixed(0);
};
