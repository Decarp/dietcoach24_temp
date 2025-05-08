import { DatabaseProducts } from "@/types/types";
import { NextResponse } from "next/server";

// Helper function to create the Basic Auth header
function createBasicAuthHeader(username: string, password: string): string {
  const credentials = `${username}:${password}`;
  return `Basic ${Buffer.from(credentials).toString("base64")}`;
}

export async function GET(request: Request) {
  const DB_URL = process.env.NEXT_PUBLIC_DB_URL;

  const url = new URL(request.url);
  const queryParams = new URLSearchParams(url.searchParams);
  const queryString = queryParams.toString();

  try {
    const authHeader = createBasicAuthHeader(
      process.env.NEXT_PUBLIC_DB_USERNAME || "",
      process.env.NEXT_PUBLIC_DB_PASSWORD || "",
    );

    const res = await fetch(`${DB_URL}/products/?${queryString}`, {
      method: "GET",
      headers: {
        Authorization: authHeader,
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Error fetching data: ${res.statusText}` },
        { status: res.status },
      );
    }

    const data: DatabaseProducts = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
