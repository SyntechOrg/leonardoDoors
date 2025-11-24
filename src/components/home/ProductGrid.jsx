import React, { Suspense } from "react";
import { getDoorsAndTaxonomies } from "@/lib/door-data";
// Import the client component we just created above
import ProductGridClient from "./ProductGridClient";

export default async function ProductGrid() {
  // Fetch data securely on the server
  // This avoids the "supabaseKey is required" error because it runs on the Node.js server
  const { doors } = await getDoorsAndTaxonomies();

  return (
    <section>
      <Suspense
        fallback={
          <div className="container mx-auto px-4 py-35 text-center">
            <div className="animate-pulse flex flex-col items-center">
               <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
               {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
                 {[...Array(4)].map((_, i) => (
                   <div key={i} className="h-[300px] bg-gray-100 rounded-lg"></div>
                 ))}
               </div> */}
            </div>
          </div>
        }
      >
        <ProductGridClient doors={doors || []} />
      </Suspense>
    </section>
  );
}