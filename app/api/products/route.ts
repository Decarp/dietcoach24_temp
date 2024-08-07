import { Products } from "@/types/types";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // const baseUrl = "http://nutristorage.ch/";
  const baseUrl = "http://localhost:8000/";

  const url = new URL(request.url);
  const queryParams = new URLSearchParams(url.searchParams);

  const queryString = queryParams.toString();

  try {
    const res = await fetch(`${baseUrl}/products/?${queryString}`, {
      method: "GET",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Error fetching data: ${res.statusText}` },
        { status: res.status }
      );
    }

    const data: Products = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
