import { DatabaseProducts } from '@/types/types';

export async function fetchProducts(queryParams: URLSearchParams): Promise<DatabaseProducts> {
    const DB_URL = process.env.DB_URL;

    const queryString = queryParams.toString();

    const res = await fetch(`/api/products?${queryString}`);

    if (!res.ok) {
        throw new Error(`Error fetching data: ${res.statusText}`);
    }

    const data: DatabaseProducts = await res.json();
    return data;
}
