//src/app/genre/[slug]/page.tsx

import Link from "next/link";
import { genreBySlug } from "./data";

interface PageProps {
    params: Promise<{ slug: string }>
}

const Page = async (props: PageProps) => {

    const { slug } = await props.params;

    const data = await genreBySlug(slug);

    console.log("hvad", data);

    return (
        <div className="m-2">
            <div className="text-black font-semibold">books</div>

            {data &&

                data.map((item: any, index: number) => (

                    <Link
                        href={{
                            pathname: `/book/${item.slug}`
                        }}
                    >
                        <div key={item._id}>{item.title}</div>

                    </Link>

                ))
            }

        </div>
    );
}

export default Page;