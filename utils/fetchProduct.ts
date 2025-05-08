import { DatabaseProduct } from '@/types/types';

export async function fetchProduct(gtin: string): Promise<DatabaseProduct> {
    const res = await fetch(`/api/product?gtin=${gtin}`); // Pass gtin as a query parameter

    if (!res.ok) {
        throw new Error(`Error fetching data: ${res.statusText}`);
    }

    const data: DatabaseProduct = await res.json();
    return data;
}
