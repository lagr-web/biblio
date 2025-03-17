//src/app/dashboard/admin/allBookData.tsx
import { API_URL } from "@/config";
//const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAllBookData = async () => {

    const res = await fetch(`${API_URL}/books`);

    if (!res.ok) {
        throw new Error('Failed to fetch data from some data');
    }
    return res.json();

}

export const getAllGenreData = async () => {

    const res = await fetch(`${API_URL}/genres`);

    if (!res.ok) {
        throw new Error('Failed to fetch data from some data');
    }
    return res.json();

}

export const getEditableDataById = async (id: any) => {
    try {
        const res = await fetch(`${API_URL}/edit/${id}`);

        if (!res.ok) {
            throw new Error('Failed to fetch data from some data');
        }

        const data = await res.json();
        
        return data;

    } catch (error) {
        console.error("Fetch error:", error);
        return null; // Eller en tomt objekt {} for at undgå fejl længere nede
    }
};
