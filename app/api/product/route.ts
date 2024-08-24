import { NextRequest, NextResponse } from "next/server";
import { DatabaseProduct } from "@/types/types";

export async function GET(request: NextRequest) {
  // Extract the 'gtin' query parameter from the URL
  const searchParams = request.nextUrl.searchParams;
  const gtin = searchParams.get("gtin");

  if (!gtin) {
    return NextResponse.json(
      { error: "gtin query parameter is required" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DB_URL}/products/${gtin}`,
      {
        method: "GET",
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: `Error fetching data: ${res.statusText}` },
        { status: res.status }
      );
    }

    const data: DatabaseProduct = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
