import { NextRequest, NextResponse } from "next/server";
import { DatabaseProduct } from "@/types/types";

// Helper function to create the Basic Auth header
function createBasicAuthHeader(username: string, password: string): string {
  const credentials = `${username}:${password}`;
  return `Basic ${Buffer.from(credentials).toString("base64")}`;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const gtin = searchParams.get("gtin");

  if (!gtin) {
    return NextResponse.json(
      { error: "gtin query parameter is required" },
      { status: 400 },
    );
  }

  // Attention: The query is currently hardcoded to MIGROS products, as per the environment variable.
  // This is because we only have MIGROS products in the study, and the backend API changed during the development.
  // If in the future we want to support other supermarkets, somethings needs to be changed here,
  // and potentially in other places, depending on the GTIN logic.

  try {
    const authHeader = createBasicAuthHeader(
      process.env.NEXT_PUBLIC_DB_USERNAME || "",
      process.env.NEXT_PUBLIC_DB_PASSWORD || "",
    );

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DB_URL}/products/${process.env.NEXT_PUBLIC_DB_MIGROS_IDENTIFIER}/${gtin}`,
      {
        method: "GET",
        headers: {
          Authorization: authHeader,
        },
      },
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: `Error fetching data: ${res.statusText}` },
        { status: res.status },
      );
    }

    const data: DatabaseProduct = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
