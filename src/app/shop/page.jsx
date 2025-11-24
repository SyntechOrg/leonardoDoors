// import React from "react";
// import DoorCatalog from "@components/shop/DoorCatalog";
// import Modern from "@components/repeats/Modern";

// export default function Shop() {
//   return (
//     <div className="container">
//       <DoorCatalog />
//       <Modern />
//     </div>
//   );
// }

import { Suspense } from "react";
import DoorCatalogClient from "@components/shop/DoorCatalog";
import { getDoorsAndTaxonomies } from "@/lib/door-data";

export const revalidate = 3600;

export default async function ShopPage() {
  const { doors, taxonomies, taxonomyTypes } = await getDoorsAndTaxonomies();

  return (
    <main>
      <Suspense fallback={<p className="text-center py-20">Laden...</p>}>
        <DoorCatalogClient
          initialDoors={doors}
          initialTaxonomies={taxonomies}
          initialTaxonomyTypes={taxonomyTypes}
        />
      </Suspense>
    </main>
  );
}