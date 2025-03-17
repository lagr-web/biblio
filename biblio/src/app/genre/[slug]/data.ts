//src/app/genre/[slug]/data.ts
import { API_URL } from "@/config";
export const genreBySlug = async (slug: string) => {

    const response = await fetch(`${API_URL}/genre/${slug}`);

    if (!response.ok) {
        throw new Error('Failed to fetch data from some data');
    }
    const data = await response.json();
    return data;

}
