// app/api/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const headers = {
    retailer: url.searchParams.get("retailer") || "Migros",
    Page: url.searchParams.get("Page") || "1",
    Limit: url.searchParams.get("Limit") || "110",
    // "Search-De": url.searchParams.get("Search-De") || "Linsen",
    "DietCoach-Category-L2-De":
      url.searchParams.get("DietCoach-Category-L2-De") ||
      "Fleisch- & Fischalternativen",
    "DietCoach-Category-L1-De":
      url.searchParams.get("DietCoach-Category-L1-De") ||
      "Pflanzliche Proteinquellen",
    "Nutri-Score-Cutoff": url.searchParams.get("Nutri-Score-Cutoff") || "C",
  };

  return fetch("http://localhost:8000/products/", {
    headers,
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
    .then((data) => {
      console.log("Data fetched:", data.products.length);
      return NextResponse.json(data);
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    });
}
