//src/app/dashbord/admin/component/Forms.tsx

"use client";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from 'next/navigation';
import { getAllGenreData } from "../allbookData";
import { API_URL } from "@/config";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// interface for form data
interface FormData {
    title: string;
    author: string;
    genre: string;
    description: string
}

// yup schema
const schema = yup.object().shape({
    title: yup.string().required("Titel er påkrævet"),
    author: yup.string().required("Forfatter er påkrævet"),
    genre: yup.string().required("Vælg en genre"),
    description: yup.string().required("Beskrivelse er påkrævet").min(10, "Beskrivelsen skal være mindst 10 tegn lang"),
});


const PostFormData = () => {

    console.log('starting posting...');

    const [genreData, setGenreData] = useState<any>(null); // State til at gemme genre data
    const router = useRouter(); //

    const okRefElement = useRef<HTMLDivElement>(null); // Ref til at vise en besked om data er blevet gemt

    const [fileName, setFileName] = useState<string | null>(""); // State til at gemme filnavn


    // ✅ react-hook-form integration
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

// ustate  som bruger interfa
    const [formData, setFormData] = useState<FormData>({
        title: '',
        author: '',
        genre: '',
        description: ''
    })

    // ✅ Funktion til at håndtere ændringer i input-felter
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type, files } = e.target as HTMLInputElement;

        if (type === "file") {
            const file = files?.[0]; // Tjekker om der er en fil valgt
            setFileName(file ? file.name : ""); // Opdaterer filnavnet
        } else {
            setFormData((prevData: FormData) => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    // ✅ Funktion til at vise en besked om data er blevet gemt
    const isPosted = (feedback: boolean) => {

        if (okRefElement.current) {
            //ternary operator
            okRefElement.current.textContent = feedback
                ? "Din data blev gemt"
                : "Der opstod en fejl";
        }

        setTimeout(() => {
            router.refresh(); //refresh af bog data
        }, 2000)
    }

    // ✅ Funktion til at håndtere form submit
    const onSubmit = async (data: FormData) => {

        try {

            const formData = new FormData();

            // Tilføj tekstfelter til formData
            formData.append("title", data.title);
            formData.append("author", data.author);
            formData.append("genre", data.genre);
            formData.append("description", data.description);

            // Hent filen fra input-feltet
            const fileInput = document.querySelector<HTMLInputElement>('input[name="image"]');
            
            if (fileInput?.files?.length) {
                formData.append("image", fileInput.files[0]); // Kun én fil
            }


            const res = await fetch(`${API_URL}/addbook`, {
                cache: "no-store",
                method: "POST",
                body: formData
            });

            if (res.ok) {
                isPosted(true);
                reset(); // ✅ Nulstil formularen efter succes
            } else {
                isPosted(false);
            }


        } catch (error) {
            console.log(error);

            isPosted(false);
        }
    };

    // ✅ useEffect hook til at hente genre data
    useEffect(() => {

        (async () => {

            try {
                const genre = await getAllGenreData();
                setGenreData(genre);
            } catch (error) {
                console.error('Error fetching data:', error);
            }


        })()

    }, [])


    return (

        <form onSubmit={handleSubmit(onSubmit)}>

            <div className="mb-4">
                <label className="text-[#3C6973]">Titel</label>
                <input {...register("title")} />
                <p className="text-[#F05523] font-semibold">{errors.title?.message}</p>
            </div>

            <div className="mb-4">
                <label className="text-[#3C6973]">Forfatter</label>
                <input {...register("author")} />
                <p className="text-[#F05523] font-semibold">{errors.author?.message}</p>
            </div>

            <div className="mb-4">
                <label className="text-[#3C6973]">Genre</label>
                <select {...register("genre")}>
                    <option value="">Vælg en genre</option>
                    {genreData &&
                        genreData.map((genre:any) => (
                            <option key={genre._id} value={genre.slug}>
                                {genre.slug}
                            </option>
                        ))}
                </select>
                <p className="text-[#F05523] font-semibold">{errors.genre?.message}</p>
            </div>

            <div className="mb-4">
                <label className="text-[#3C6973]">billede</label>

                <label className="flex items-center justify-center w-full px-4 py-2 bg-[#557d85] text-white rounded shadow-md cursor-pointer hover:bg-[#7AB3BF]">
                    <span>Vælg en fil</span>
                    <input type="file" name="image" accept="image/*" className="hidden" onChange={handleChange} />
                </label>

                {fileName && <p className="text-sm text-gray-700 mt-2">{fileName}</p>}
            </div>

            <div className="mb-4">
                <label className="text-[#3C6973]">Beskrivelse</label>
                <textarea {...register("description")} rows={4}></textarea>
                <p className="text-[#F05523] font-semibold">{errors.description?.message}</p>
            </div>

            <div ref={okRefElement} className=" text-black font-bold mb-4" ></div>

            <div className="flex justify-end">
                <button type="submit"
                    className=" bg-[#557d85] hover:bg-[#7AB3BF] text-white font-bold

py-2
px-4
w-full
rounded" >
                    Send
                </button>
            </div>
        </form>
    )

}

export default PostFormData;