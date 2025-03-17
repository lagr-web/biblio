//src/app/book/[bookSlug]/page.tsx

import { BookBySlug } from "./data";
import Image from 'next/image';
import { API_URL } from "@/config";

interface PageBookProps {
    params: Promise<{ bookSlug: string }>
}

const Page = async (props: PageBookProps) => {

    const { bookSlug } = await props.params;

    const data = await BookBySlug(bookSlug);

    // hvis man vil vise billede
    const imageSrc = {
        src: `${API_URL}/images/${data.image}`
    };

    console.log(data);// {book: {title: "Harry Potter", author: "J.K. Rowling", genre: "Fantasy", _id: "60f4b1b1b3b3b3b3b3b3b3b3"}}

    return (
        <>
            <div className="m-2">
                <div> {data.title}</div>
                <div> {data.description}</div>
            
            </div>

        </>
    )
}

export default Page;