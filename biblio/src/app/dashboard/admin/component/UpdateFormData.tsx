//src/app/dashboard/admin/component/UpdateFormData.tsx
"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from 'next/navigation';
import { getEditableDataById } from "../allbookData";
import { API_URL } from "@/config";



const UpdateFormData: React.FC<UpdateFormDataProps> = ({ id }) => {

    const router = useRouter();

    const okRefElement = useRef<HTMLDivElement>(null);

    const [editableData, setEditableData] = useState<any>(null);
    const [isShown, setIsShown] = useState<boolean>(true);
    const [fileName, setFileName] = useState<string | null>("");

    const [formData, setFormData] = useState<FormUpdateData>({
        title: '',
        author: '',
        genre: '',
        description: '',
        image: null
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {

        const { name, value } = e.target;

        if (e.target.type === "file") {
            const fileInput = e.target as HTMLInputElement;

            if (fileInput.files && fileInput.files.length > 0) {
                const file = fileInput.files[0];
                setFormData(prevState => ({
                    ...prevState,
                    [name]: file
                }));
                setFileName(file.name); // viser det billede man har valgt 
            }

        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const isPosted = (feedback: boolean) => {

        setIsShown(false);

        setTimeout(() => {
            setIsShown(true);
            router.refresh();
        }, 1500);

    };

    const onSubmit = async (e: FormEvent) => {

        e.preventDefault();

        const formDataToSend = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null) {
                formDataToSend.append(key, value);
            }
        });

        try {

            const res = await fetch(`${API_URL}/update/${id}`, {
                method: "PUT",
                body: formDataToSend,
            });

            if (res.ok) {
                isPosted(true);
            } else {
                isPosted(false);
            }
        } catch (error) {
            console.log(error);
            isPosted(false);
        }
    };

    const fetched = useRef(false);

    useEffect(() => {

        if (fetched.current) return;
        fetched.current = true;

        (async () => {
            try {
                const editData = await getEditableDataById(id);
                setEditableData(editData);
            } catch (error) {
                console.error('Kunne ikke finde data:', error);
            }
        })();

    }, []);

    useEffect(() => {

        if (editableData) {

            setFormData({
                title: editableData.book.title || '',
                author: editableData.book.author || '',
                genre: editableData.book.genre || '',
                description: editableData.description || '',
                image: null
            });

        }
    }, [editableData]);

    return (
        <>
            <form onSubmit={onSubmit}>
                <div className="mb-4">
                    <label className="text-[#3C6973]">Title</label>
                    <input name="title" value={formData.title} onChange={handleChange} required />
                </div>

                <div className="mb-4">
                    <label className="text-[#3C6973]">Author</label>
                    <input name="author" value={formData.author} onChange={handleChange} required />
                </div>

                <div className="mb-4">
                    <label className="text-[#3C6973]">Genre</label>
                    {editableData?.genres ? (
                        <select name="genre" value={formData.genre} onChange={handleChange} required>
                            {editableData.genres.map((genre: any, index: number) => (
                                <option key={genre._id || index} value={genre.slug}>
                                    {genre}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <p>Henter genrer...</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="text-[#3C6973]">Billede</label>
                    <label className="flex items-center justify-center w-full px-4 py-2 bg-[#557d85] text-white rounded shadow-md cursor-pointer hover:bg-[#7AB3BF]">
                        <span>Vælg en fil</span>
                        <input type="file" name="image" accept="image/*" className="hidden" onChange={handleChange} />
                    </label>
                    {fileName && <p className="text-sm text-gray-700 mt-2">{fileName}</p>}
                </div>

                <div className="mb-4">
                    <label className="text-[#3C6973]">Description</label>
                    <textarea name="description" rows={4} value={formData.description} onChange={handleChange} required></textarea>
                </div>

                <div ref={okRefElement} className={`feedback mb-3 ${isShown ? "hidden" : "block"}`}>
                    Dine data blev opdateret
                </div>

                <div className="flex justify-end">
                    <button type="submit" className="bg-[#557d85] hover:bg-[#7AB3BF] text-white font-bold py-2 px-4 w-full rounded">
                        Opdater
                    </button>
                </div>
            </form>
        </>
    );
};

export default UpdateFormData;