//src/app/book/[bookSlug]/data.ts
import { API_URL } from "@/config";
//const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const BookBySlug = async (bookSlug: string) => {

    const response = await fetch(`${API_URL}/book/${bookSlug}`);

    if (!response.ok) {
        throw new Error('Failed to fetch data from some data');
    }
    const data = await response.json();
    return data;

}
