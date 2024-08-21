import { DatabaseProducts } from "@/types/types";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const DB_URL = process.env.DB_URL;

  const url = new URL(request.url);
  const queryParams = new URLSearchParams(url.searchParams);

  const queryString = queryParams.toString();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DB_URL}/products/?${queryString}`,
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

    const data: DatabaseProducts = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
