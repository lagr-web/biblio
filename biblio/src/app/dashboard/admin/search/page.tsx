//src/app/dashboard/admin/search/page.tsx
"use client";

import { FormEvent, useState } from "react";
import Menu from "../component/Menu";
import Card from "../component/Card";
import{API_URL} from "@/config";

const Page = () => {

    const [searchString, setSearchString] = useState<any>('');
    const [result, setResult] = useState<any[]>([]);
    const [searched, setSearched] = useState<boolean>(false);

    const handleSubmit = async (e: FormEvent) => {

        e.preventDefault();

        setSearched(true); // Sæt searched til true, når der er blevet søgt

        try {

            const response = await fetch(`${API_URL}/search?query=${searchString}`);

            if (!response.ok) throw new Error('http error');

            const data = await response.json();

            setResult(data);


        } catch (error) {

            console.log(error);

        }

    }

    return (

        <>

            <Menu isMenuItemShown={false} />

            <section className="flex items-center justify-center w-full mt-10 gap-2">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={searchString}
                        onChange={(e) => setSearchString(e.target.value)}
                        required
                        className="w-96"
                        placeholder="Søg efter en bog..."
                    />

                    <button type="submit" className="searchButton">
                        Søg
                    </button>
                </form>
            </section>

            <section className="z-0 container mx-auto my-10">
                <div className="grid grid-cols-1 mx-5 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-4 md:mx-2 lg:mx-40">

                    {searched && result.length === 0 ? (
                        <div>Ingen resultater fundet</div>
                    ) : (
                        result.map((item: any) => (
                            <Card key={item._id} data={item} />
                        ))
                    )}

                </div>
            </section>

        </>

    )
}

export default Page;