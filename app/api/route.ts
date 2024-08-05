// app/api/route.ts
import { Products } from "@/types/types";
import { NextResponse } from "next/server";
import { z } from "zod";

// Define the schema for validation
const querySchema = z.object({
  retailer: z.string().optional().default("Migros"),
  Page: z.string().optional().default("1"),
  Limit: z.string().optional().default("100"),
  "Search-De": z.string().optional(),
  "DietCoach-Category-L2-De": z.string().optional(),
  "DietCoach-Category-L1-De": z.string().optional(),
  "Nutri-Score-Cutoff": z.string().optional().default("C"),
});

export async function GET(request: Request) {
  const url = new URL(request.url);

  // Parse and validate the query parameters
  const parsed = querySchema.safeParse(Object.fromEntries(url.searchParams));

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query parameters" },
      { status: 400 }
    );
  }

  const queryParams = parsed.data;

  // Construct headers, including only the non-undefined parameters
  const headers: Record<string, string> = {};
  if (queryParams.retailer) headers["retailer"] = queryParams.retailer;
  if (queryParams.Page) headers["Page"] = queryParams.Page;
  if (queryParams.Limit) headers["Limit"] = queryParams.Limit;
  if (queryParams["Search-De"]) headers["Search-De"] = queryParams["Search-De"];
  if (queryParams["DietCoach-Category-L2-De"])
    headers["DietCoach-Category-L2-De"] =
      queryParams["DietCoach-Category-L2-De"];
  if (queryParams["DietCoach-Category-L1-De"])
    headers["DietCoach-Category-L1-De"] =
      queryParams["DietCoach-Category-L1-De"];
  if (queryParams["Nutri-Score-Cutoff"])
    headers["Nutri-Score-Cutoff"] = queryParams["Nutri-Score-Cutoff"];

  try {
    const res = await fetch("http://localhost:8000/products/", {
      headers,
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Error fetching data: ${res.statusText}` },
        { status: res.status }
      );
    }

    const data: Products = await res.json();
    console.log("Data fetched:", data.products.length);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
