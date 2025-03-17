//src/app/(home)/page.tsx

import Link from "next/link";
import { getAllGenreData } from "./data";

export default async function Home() {

  const data = await getAllGenreData();

  return (

    <div className="">

      {data &&

        data.map((item: any, index: number) => (

          <div key={data._id}>

            <Link
              href={{
                pathname: `/genre/${item.slug}`
                

              }}
            >

              {item.name}

            </Link>

          </div>


        ))


      }

    </div>
  );
}
