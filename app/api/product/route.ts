import { DatabaseProducts } from "@/types/types";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { pathname } = new URL(request.url);
  const productId = pathname.split("/").pop(); // Extract the product ID from the request URL

  //  = GTIN

  try {
    // Fetch data from the external API using the product ID
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DB_URL}/products/${productId}`,
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

    // Return only the product that matches the given ID (if there's more than one in the response)
    const product = data.products.find(
      (p) => p.productId === Number(productId)
    );

    if (!product) {
      return NextResponse.json(
        { error: `Product with ID ${productId} not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
