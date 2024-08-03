import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return fetch("http://localhost:8000/products/", {
    headers: {
      retailer: "Migros",
      Page: "1",
      Limit: "110",
      "Search-De": "Linsen",
      "DietCoach-Category-L2-De": "Fleisch- & Fischalternativen",
      "DietCoach-Category-L1-De": "Pflanzliche Proteinquellen",
      "Nutri-Score-Cutoff": "C",
    },
  })
    .then((res) => {
      if (!res.ok) {
        return NextResponse.json(
          { error: `Error fetching data: ${res.statusText}` },
          { status: res.status }
        );
      }
      return res.json();
    })
    .then((data) => NextResponse.json(data))
    .catch((error) => {
      console.error("Fetch error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    });
}
