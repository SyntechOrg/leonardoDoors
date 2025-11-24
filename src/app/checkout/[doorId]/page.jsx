import { notFound } from "next/navigation";
import { getDoorById, getAllDoorIds } from "@/lib/door-data";
import ProductCheckoutClient from "../ProductCheckoutClient";

export const revalidate = 1800;

export const dynamicParams = true;

export async function generateStaticParams() {
  const doors = await getAllDoorIds();
  
  return doors.map((door) => ({
    doorId: String(door.id),
  }));
}

export default async function ProductPage({ params }) {
  const { doorId } = params;

  const door = await getDoorById(doorId);

  if (!door) {
    return notFound();
  }

  return (
    <main>
      <ProductCheckoutClient initialDoor={door} />
    </main>
  );
}