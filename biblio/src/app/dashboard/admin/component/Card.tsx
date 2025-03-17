//src/dashboard/admin/component/Card.tsx

"use client";

import React, { useState } from 'react';
import UpdateFormModal from './UpdateFormModal';
import ModalConfirmDeleteBox from './ModalConfirmDeleteBox';
import Image from 'next/image';
import { API_URL } from '@/config';

const Card: React.FC<Props> = (props) => { //props er data fra allbookData.tsx og typerne er defineret i src/types.d.ts

    const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);

    const [showConfirmDeletebox, setshowConfirmDeletebox] = useState<boolean>(false);

    // finder billedet i mappen images
    const imageSrc = {
        src: `${API_URL}/images/${props.data.image}`
    };

    return (

        <>
            <article className="grid-row-2 shadow-[0px_0px_6px_1px_rgba(0,_0,_0,_0.25)] rounded-lg bg-white">

                <section className="bg-[#557d85] text-white p-1 rounded-t-lg grid grid-cols-2">

                    <h2 className="p-1 font-bold w-96">{props.data.title}</h2>

                    <div className="flex justify-end items-center p-1">
                        <img
                            src="/assets/close.svg"
                            className="w-5 h-5 cursor-pointer"
                            onClick={() => setshowConfirmDeletebox(true)}
                        />

                    </div>

                </section>


                <section className="grid grid-cols-2">

                    <div className='relative w-42 h-42 bg-[#cccccc] m-2'>

                        <Image
                            {...imageSrc}
                            alt={props.data.title}
                            fill
                             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover"
                        />


                    </div>

                    <div className="grid grid-row-6 mt-1 mr-2 mb-2 md:mb-2 lg:mb-2">
                        <h3 className="font-bold">forfatter</h3>
                        <p className="h-10">{props.data.author}</p>
                        <h3 className="font-bold">Genre</h3>
                        <p>{props.data.genre}</p>
                        <p className="mb-6"></p>
                        <div className="text-left">
                            <button
                                className="btn-read"
                                onClick={() => setShowUpdateModal(true)}

                            >Opdater</button>
                        </div>
                    </div>

                </section>

            </article>

            <UpdateFormModal
                id={props.data._id}
                show={showUpdateModal}
                onClose={() => setShowUpdateModal(false)}
            />

            <ModalConfirmDeleteBox
                show={showConfirmDeletebox}
                data={props.data}
                onClose={() => setshowConfirmDeletebox(false)}
            />



        </>


    )
}

export default Card;