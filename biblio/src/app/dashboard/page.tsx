//src/app/dashboard/page.tsx

"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Menu from "./admin/component/Menu";
import { API_URL } from "@/config";

// Interface for form data
interface FormData {
  email: string;
  password: string;
}

// Validation schema
const schema = yup.object().shape({
  email: yup.string().required("Email er påkrævet").email("Ugyldig email"),
  password: yup.string().required("Password er påkrævet").min(6, "Mindst 6 tegn"),
});

const DashboardPage = () => {

  const [isRegistering, setIsRegistering] = useState(false);// State for at skifte mellem login og registrering
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
        // Endpoint for login og registrering
      const endpoint = isRegistering ? `${API_URL}/register` : `${API_URL}/login`;

      const res = await fetch(endpoint, {
        credentials: "include",
        cache: "no-store",
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        console.log(isRegistering ? "Bruger registreret" : "Login succesfuld");
        if (!isRegistering) {
          router.push("dashboard/admin");
        } else {
          setIsRegistering(false); // Skift tilbage til login efter registrering
        }
      } else {
        console.log("Fejl ved " + (isRegistering ? "registrering" : "login"));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div>
        <Menu isMenuItemShown={false} />
      </div>

      <section className="fixed z-40 w-96 p-10 mx-auto bg-white text-black top-20 left-1/2 transform -translate-x-1/2 rounded-md shadow-md">
        <h2 className="text- text-xl font-semibold mb-4">
          {isRegistering ? "Registrering" : "Login"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="text-[#3C6973]">Email</label>
            <input type="email" {...register("email")} className="border w-full p-2 rounded" />
            <p className="text-[#F05523] font-semibold">{errors.email?.message}</p>
          </div>

          <div className="mb-4">
            <label className="text-[#3C6973]">Password</label>
            <input type="password" {...register("password")} className="border w-full p-2 rounded" />
            <p className="text-[#F05523] font-semibold">{errors.password?.message}</p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#557d85] hover:bg-[#7AB3BF] text-white font-bold py-2 px-4 w-full rounded"
            >
              {isRegistering ? "Registrer" : "Login"}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          {isRegistering ? (
            <>
              Allerede registreret?{" "}
              <button className="text-blue-500 underline" onClick={() => setIsRegistering(false)}>
                Log ind her
              </button>
            </>
          ) : (
            <>
              Ingen konto?{" "}
              <button className="text-blue-500 underline" onClick={() => setIsRegistering(true)}>
                Registrer dig her
              </button>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default DashboardPage;
