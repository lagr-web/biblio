//src/app/dashboard/admin/component/ModalConfirmDeleteBox.tsx

"use client";


import React, { FormEvent, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from 'next/navigation';
import { API_URL } from "@/config";

const ModalConfirmDeleteBox: React.FC<any> = ({ show, data, onClose }) => {

    if (!show) return null;


    const router = useRouter(); // for use with reloading af deleting

    const okRefElement = useRef<HTMLDivElement>(null);//feeedback after delete

    const [isShown, setIsShown] = useState<boolean>(true);// controlling the display of feedback 


    const isDeleted = (name: string) => {

        setIsShown(false); // show the feedback

        setTimeout(() => {

            router.refresh();

        }, 2000)

    }

    const handleSubmit = async (e: FormEvent) => {

        try {

            const res = await fetch(`${API_URL}/delete/${data._id}`, {
                method: 'DELETE'
            });

            const result = await res.json();

            if (res.ok) {
                console.log("Deleted successfully:", result);

                isDeleted(data.title); // Callback for UI-opdatering

            } else {
                console.log("Delete failed:", result.message);
            }

        } catch (error) {


            console.log(error);
        }


    }


    return (

        <>

            {data &&

                createPortal(
                    <>
                    
                        <div className="fixed z-30 w-full h-full top-[0] bg-[#000] opacity-80"
                            onClick={onClose} ></div> {/* background */}

                        <div className=" grid-row-3 fixed z-40 w-96 p-3 mx-auto bg-white
   text-black top-20 left-1/2 transform -translate-x-1/2 rounded">
                            <div className="w-full text-center mt-10">Vil du slette: <span
                                className="font-bold">{data.title}</span></div>
                            <div className="h-20"></div>
                            <div className="w-full flex justify-end justify-bottom">
                                <button type="submit" onClick={handleSubmit} className="deleteButton"
                                >
                                    Slet
                                </button>
                                <button type="submit" className="cancelButton"
                                    onClick={onClose}
                                >
                                    Anullere
                                </button>
                            </div>


                            <div ref={okRefElement} className={`feedback ${isShown ? "hidden" : "block"}`}>
                                Dine data er slettet
                            </div>


                        </div>

                    </>, document.body
                )//end portal

            }

        </>


    )
}

export default ModalConfirmDeleteBox;