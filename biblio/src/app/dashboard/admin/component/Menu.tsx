//src/app/dashboard/admin/component/Menu.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import PostFormModal from "./PostFormModal";
import useTabPrevention from "@/hooks/useTabPrevention";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_URL } from "@/config";

const Menu: React.FC<any> = ({ isMenuItemShown }) => {

    const [showModal, setShowModal] = useState(false);

    const ParentMenuItems = useRef<HTMLDivElement>(null);

    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch(`${API_URL}/logout`, {
                method: "POST",
                credentials: "include",
            });
            console.log("Logget ud");
            router.push("/dashboard"); // Send brugeren tilbage til login-siden
        } catch (error) {
            console.error("Fejl ved logout:", error);
        }
    };

    useEffect(() => {

        if (ParentMenuItems.current) {

            if (!isMenuItemShown) ParentMenuItems.current.style.display = "none";

        }

    }, []);

    if (isMenuItemShown) useTabPrevention(showModal);

    return (
        <>
            <nav className="bg-[#557d85] text-white p-2 grid grid-cols-2">

                <div>Bøger</div>
                <div ref={ParentMenuItems} className="flex justify-end items-center">
                    <span className="hover:text-gray-200 cursor-pointer mr-2">
                        <Link href="admin/search">Søg</Link>
                    </span>
                    <span className="hover:text-gray-200 cursor-pointer"
                        onClick={() => setShowModal(true)}>
                        Opret en ny bog
                    </span>
                    <span className="hover:text-gray-200 cursor-pointer ml-2"
                        onClick={handleLogout} >
                        Log ud
                    </span>
                </div>
            </nav>

            {isMenuItemShown &&
                <PostFormModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                />
            }
        </>
    )
}

export default Menu;