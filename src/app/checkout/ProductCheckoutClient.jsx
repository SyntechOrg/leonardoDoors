"use client";

import React, { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@utils/useCart"; // Keep this hook
import SingleProduct from "@components/shop/SingleProduct";
import ProductInfo from "@components/shop/ProductInfo";
import Modern from "@components/repeats/Modern";

const mapDoorToDetails = (door) => {
  if (!door) return null;

  return {
    title: door.door_name || "Door Product",
    description: [
      door.description
        ? door.description.replace(/<[^>]*>/g, "")
        : "Premium door product.",
      `Brand: ${door.brand || "Not specified"}. Type: ${
        door.door_type || "Standard"
      }.`,
      door.remarks
        ? door.remarks.replace(/<[^>]*>/g, "")
        : "High quality construction.",
    ],
    specs: [
      { label: "SKU", value: door.door_sku || "N/A" },
      { label: "Marke", value: door.brand || "N/A" },
      { label: "Türtyp", value: door.door_type || "N/A" },
      { label: "Material", value: door.material || door.frame_material || "N/A" },
      { label: "Farbe", value: door.color || "N/A" },
      { label: "Verglasung", value: door.glass_insert || "Keine" },
      { label: "Glasstruktur", value: door.glass_structure || "N/A" },
      { label: "Verriegelung", value: door.lock || "Standard" },
      { label: "Schwelle", value: door.threshold || "Standard" },
      {
        label: "Öffnungsrichtung",
        value: `${door.opening_direction_side || ""}/${
          door.opening_direction_face || ""
        }`,
      },
    ].filter((spec) => spec.value && spec.value !== "N/A"),
  };
};

const mapDoorToProduct = (door) => {
  if (!door) return null;

  // Determine prices based on the cheapest variant (effective price)
  let currentPrice = 0;
  let originalPrice = 0;
  let discountRate = 0;
  let hasDiscount = false;

  if (door.variants && door.variants.length > 0) {
    // Sort variants by effective price (discounted or regular)
    const sortedVariants = [...door.variants].sort((a, b) => {
      const priceA = a.discount_price || a.price;
      const priceB = b.discount_price || b.price;
      return priceA - priceB;
    });

    const representativeVariant = sortedVariants[0];
    
    // Use the representative variant's prices
    currentPrice = representativeVariant.discount_price || representativeVariant.price;
    originalPrice = representativeVariant.price;
    discountRate = representativeVariant.discount_rate || 0;
    
    // If discount rate is missing but discount_price exists and is lower than price, calculate it
    if (!discountRate && representativeVariant.discount_price && representativeVariant.price > representativeVariant.discount_price) {
       discountRate = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
    }
    
    // Only consider it a discount if effective price is lower than original
    hasDiscount = discountRate > 0 && originalPrice > currentPrice;
  } else {
    // Fallback if no variants
    currentPrice = door.minPrice || door.price || 0;
    originalPrice = currentPrice;
  }

  return {
    id: door.id,
    name: door.door_name || "Door Product",
    sku: door.door_sku || "N/A",
    images: door.images || [],
    rating: door.rating || 5, 
    reviewCount: 0,
    price: {
      current: currentPrice,
      original: originalPrice,
      currency: "CHF",
      discount: hasDiscount ? discountRate : 0,
    },
    deliveryTime: "3-5 Werktage",
    variants: (door.variants || []).map((variant) => ({
      id: variant.id,
      size: `${variant.height}mm × ${variant.width}mm`,
      description: `Höhe: ${variant.height}mm, Breite: ${variant.width}mm, Tiefe: ${variant.thickness}mm`,
      price: variant.discount_price || variant.price,
      stock: variant.stock || 0,
    })),
  };
};

export default function ProductCheckoutClient({ initialDoor }) {
  const router = useRouter();
  const { addToCart } = useCart();
  
  const door = initialDoor;

  const productData = useMemo(() => (door ? mapDoorToProduct(door) : null), [door]);
  
  const details = useMemo(() => (door ? mapDoorToDetails(door) : null), [door]);

  const handleAddToCart = useCallback(
    (itemsToAdd) => {
      if (!door) return;
      itemsToAdd.forEach(({ variantId, quantity }) => {
        const variant = door.variants.find((v) => v.id === variantId);
        if (!variant) return;

        const itemId = `${door.id}-${variantId}`;
        const price = variant.discount_price || variant.price;

        const item = {
          id: itemId,
          doorId: door.id,
          variantId,
          name: door.door_name,
          price,
          qty: quantity,
          image: door.images?.[0] || "",
          options: {
            variant: `${variant.height}mm × ${variant.width}mm`,
            color: door.color || "#FFFFFF",
          },
        };
        console.log("Adding to cart:", item);
        addToCart(item);
      });
      alert(`${itemsToAdd.reduce((sum, item) => sum + item.quantity, 0)} Artikel zum Warenkorb hinzugefügt!`);
    },
    [door, addToCart]
  );

  if (!door || !productData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-lg text-red-600">Tür nicht gefunden.</p>
        <button
          onClick={() => router.push("/shop")}
          className="px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
        >
          Zurück zu Türen
        </button>
      </div>
    );
  }

  return (
    <div>
      <SingleProduct product={productData} onAddToCart={handleAddToCart} />
      <div className="container mx-auto px-4 py-8">
        <ProductInfo
          details={details}
          questions={<p>Stellen Sie eine Frage zu diesem Produkt.</p>}
          reviews={<p>Seien Sie der Erste, der dieses Produkt bewertet.</p>}
        />
      </div>
      <Modern />
    </div>
  );
}