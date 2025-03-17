"use client";

import { useRouter } from 'next/navigation';

const page = () => {

    const router = useRouter();

    return (

        <>

            <nav className="bg-[#557d85] text-white grid grid-cols-1 p-2">

                <div className="justify-self-end">
                    <span className='pr-1 text-white'>Du er ikke logget ind</span>
                    <span
                        className="hover:text-gray-200 cursor-pointer ml-2"
                        onClick={() => router.push("/dashboard")}>login</span>
                </div>
            </nav>
        </>
    )
}

export default page;