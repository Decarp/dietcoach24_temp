import { DatabaseProduct } from "@/types/types";

export async function fetchProduct(
  productId: number
): Promise<DatabaseProduct> {
  const res = await fetch(`/api/product/${productId}`);

  if (!res.ok) {
    throw new Error(`Error fetching data: ${res.statusText}`);
  }

  const data: DatabaseProduct = await res.json();
  return data;
}
