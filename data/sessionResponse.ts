export const sessionResponse = [
  {
    sessionId: 123,
    index: 1,
    timestamp: 1716336000,
    recommendations: [
      {
        recommendationId: 123,
        index: 1,
        rule: {
          variant: "VAR1",
          mode: "Reduzieren",
          nutrient: "Zucker",
          category: "Süssgetränke",
          text: "",
        },
        basketIds: ["basketId1", "basketId2", "basketId3"],
        suggestions: {
          current: [123, 124, 125],
          alternatives: [111, 112],
        },
        notes: "Notes",
      },
      {
        recommendationId: 124,
        index: 1,
        rule: {
          variant: "VAR1",
          mode: "Erhöhen",
          nutrient: "Protein",
          category: "Milch",
          text: "",
        },
        basketIds: ["basketId1", "basketId2", "basketId3"],
        suggestions: {
          current: [123, 124, 125],
          alternatives: [111, 112],
        },
        notes: null,
      },
    ],
    notes: {
      patient: "Notes patient",
      personal: "Notes personal",
    },
  },
  {
    sessionId: 124,
    index: 1,
    timestamp: 1716336000,
    recommendations: [
      {
        recommendationId: 123,
        index: 1,
        rule: {
          variant: "VAR2",
          mode: "Erhöhen",
          nutrient: "Zucker",
          category: "Süssgetränke",
          text: "",
        },
        basketIds: ["basketId1", "basketId2", "basketId3"],
        suggestions: {
          current: [123, 124, 125],
          alternatives: [111, 112],
        },
        notes: "Notes",
      },
    ],
    notes: {
      patient: "Notes patient",
      personal: "Notes personal",
    },
  },
  {
    sessionId: 125,
    index: 1,
    timestamp: 1716336000,
    recommendations: [
      {
        recommendationId: 123,
        index: 1,
        rule: {
          variant: "FREITEXT",
          mode: "Erhöhen",
          nutrient: "Zucker",
          category: "Süssgetränke",
          text: "Weniger von dem",
        },
        basketIds: ["basketId1", "basketId2", "basketId3"],
        suggestions: {
          current: [123, 124, 125],
          alternatives: [111, 112],
        },
        notes: "Notes",
      },
    ],
    notes: {
      patient: "Notes patient",
      personal: "Notes personal",
    },
  },
];
