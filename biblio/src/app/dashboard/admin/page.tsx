//src/app/dashboard/admin/page.tsx

import React, { useEffect, useState } from 'react';
import Card from './component/Card';
import { getAllBookData } from './allbookData';
import Menu from './component/Menu';
import { cookies } from 'next/headers';
import NotLogged from './component/NotLogged';

const Page: React.FC = async () => {

    const result = await getAllBookData();//get all book data

    const cookieStore = await cookies();//get cookie
    const session = cookieStore.get('biblio-session');//get session cookie

    return (
        <>
            {session ? (//if session is true
                <>
                    <Menu isMenuItemShown={true} /> {/*Menu component*/}

                    <section className="z-0 container mx-auto my-10">
                        <div className="grid grid-cols-1 mx-5 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-4 md:mx-2 lg:mx-40">

                            {result &&//if result is true

                                result.map((item: any) => (
                                    <Card key={item._id} data={item} />
                                ))

                            }

                        </div>
                    </section>

                </>

            ) : (
                <NotLogged />//if session is false
            )}
        </>
    );
};

export default Page;