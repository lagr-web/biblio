//src/app/(home)/data.ts
import { API_URL } from "@/config";

export const getAllGenreData = async () => {

    const res = await fetch(`${API_URL}/genres`);

    if (!res.ok) {
        throw new Error('Failed to fetch data from some data');
    }
    return res.json();

}