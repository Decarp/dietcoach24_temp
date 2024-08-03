// app/api/products/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("http://localhost:8000/products/", {
      method: "GET",
      headers: {
        retailer: "Migros",
        Page: "1",
        Limit: "110",
        "Search-De": "Linsen",
        "DietCoach-Category-L2-De": "Fleisch- & Fischalternativen",
        "DietCoach-Category-L1-De": "Pflanzliche Proteinquellen",
        "Nutri-Score-Cutoff": "C",
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.error();
  }
}
