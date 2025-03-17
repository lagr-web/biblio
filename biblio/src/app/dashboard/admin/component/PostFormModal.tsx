//src/app/dashboard/admin/component/insertDataModal.tsx
"use client";

import React from 'react';
import { createPortal } from 'react-dom';
import PostFormData from './PostFormData';


const PostFormModal: React.FC<PostFormModalProps> = ({ show, onClose }) => {

    if (!show) return null;

    return (

        <>
        {
            createPortal(
            <>
                <div className="fixed z-30 w-full h-full top-[0] bg-[#000] opacity-80" onClick={onClose}></div>
                <div className="fixed z-40 w-96 p-10 mx-auto bg-white text-black top-20 left-1/2  transform -translate-x-1/2 rounded-md">

                    <PostFormData />

                </div>
            </>
            ,document.body

            )
        }
        </>

    );//end return
};//end ModalData

export default PostFormModal;
