"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { HiStar, HiOutlineHeart, HiChevronUp } from "react-icons/hi2";
import ImageGallery from "../repeats/ImageGallery";
import QuantitySelector from "../../mini-components/QuantitySelector";

const formatCurrency = (amount, currency = "CHF") => {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

export default function SingleProduct({ product, onAddToCart }) {
  const [quantities, setQuantities] = useState({});
  const [isSizeSelectorOpen, setSizeSelectorOpen] = useState(true);
  const [showCheckoutPrompt, setShowCheckoutPrompt] = useState(false);
  const router = useRouter();

  if (!product) {
    return (
      <div className="bg-white py-20 text-center">
        <p className="text-gray-500">Produkt wird geladen...</p>
      </div>
    );
  }

  const handleQuantityChange = (variantId, newQuantity) => {
    setQuantities((prev) => ({
      ...prev,
      [variantId]: newQuantity >= 0 ? newQuantity : 0,
    }));
  };

  const totalQuantity = Object.values(quantities).reduce(
    (sum, qty) => sum + qty,
    0
  );

  const handleAddToCart = () => {
    const itemsToAdd = Object.entries(quantities)
      .filter(([, qty]) => qty > 0)
      .map(([variantId, quantity]) => ({ variantId, quantity }));

    if (itemsToAdd.length === 0) {
      alert("Bitte wählen Sie eine Menge für mindestens eine Größe.");
      return;
    }

    if (onAddToCart) {
      onAddToCart(itemsToAdd);
    }

    setQuantities({});
    setShowCheckoutPrompt(true);
  };

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <ImageGallery images={product.images} />

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {product.name}
            </h1>
            {/* <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <HiStar
                    key={i}
                    className={`h-5 w-5 ${
                      i < product.rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2">
                  {product.reviewCount} Review
                  {product.reviewCount !== 1 && "s"}
                </span>
              </div>
              <span>•</span>
              <span>SKU: {product.sku}</span>
            </div> */}

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">
                {formatCurrency(product.price.current, product.price.currency)}
              </span>
              {product.price.discount > 0 && (
                <>
                  <span className="text-xl font-medium text-gray-400 line-through">
                    {formatCurrency(
                      product.price.original,
                      product.price.currency
                    )}
                  </span>
                  <span className="px-2 py-0.5 text-xs font-semibold text-white bg-yellow-500 rounded-md">
                    {product.price.discount}% OFF
                  </span>
                </>
              )}
            </div>

            <div className="mt-6 border-t border-b border-gray-200">
              <button
                onClick={() => setSizeSelectorOpen(!isSizeSelectorOpen)}
                className="w-full flex justify-between items-center py-4 text-left"
              >
                <span className="font-semibold text-gray-800">
                  GRÖSSE WÄHLEN
                </span>
                <HiChevronUp
                  className={`h-5 w-5 text-gray-500 transition-transform ${
                    isSizeSelectorOpen ? "" : "transform rotate-180"
                  }`}
                />
              </button>
              {isSizeSelectorOpen && (
                <div className="pb-4 space-y-2">
                  {product.variants && product.variants.length > 0 ? (
                    product.variants.map((variant) => (
                      <div
                        key={variant.id}
                        className="grid grid-cols-3 gap-4 items-center p-2 rounded-md hover:bg-gray-50"
                      >
                        <div className="col-span-1">
                          <p className="font-medium text-sm text-gray-800">
                            {variant.size}
                          </p>
                          <p className="text-xs text-gray-500">
                            {variant.description}
                          </p>
                        </div>
                        <div className="col-span-1 text-sm text-center">
                          <p className="font-semibold">
                            {formatCurrency(variant.price)} inkl. MwSt
                          </p>
                          {variant.stock > 0 && variant.stock <= 5 && (
                            <p className="text-yellow-600 font-medium">
                              Lagerbestand niedrig
                            </p>
                          )}
                          {variant.stock === 0 && (
                            <p className="text-red-600 font-medium">
                              Nicht verfügbar
                            </p>
                          )}
                        </div>
                        <div className="col-span-1 flex justify-end">
                          {variant.stock > 0 ? (
                            <QuantitySelector
                              quantity={quantities[variant.id] || 0}
                              onQuantityChange={(newQty) =>
                                handleQuantityChange(variant.id, newQty)
                              }
                            />
                          ) : (
                            <button
                              disabled
                              className="w-full px-4 py-2 text-sm font-medium text-gray-500 bg-gray-200 border border-gray-300 rounded-md cursor-not-allowed"
                            >
                              Nicht verfügbar
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      Keine Größen verfügbar.
                    </p>
                  )}
                </div>
              )}
            </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
              <div className="w-full sm:w-auto">
                <p className="text-lg font-bold text-center sm:text-left">
                  {totalQuantity} Artikel
                </p>
              </div>
              <button
                onClick={handleAddToCart}
                className="w-full sm:flex-1 bg-yellow-500 text-white font-bold py-3 px-6 rounded-md hover:bg-yellow-600 transition-colors"
              >
                In den Warenkorb
              </button>
              {/* <button className="p-3 text-gray-400 hover:text-red-500 transition-colors">
                <HiOutlineHeart className="h-7 w-7" />
              </button> */}
            </div>

            {/* Checkout Prompt */}
            {/* {showCheckoutPrompt && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-gray-800 mb-3">
                  ✓ {totalQuantity} Artikel zum Warenkorb hinzugefügt!
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push("/checkout-flow")}
                    className="flex-1 bg-yellow-600 text-white font-semibold py-2 px-4 rounded hover:bg-yellow-700 transition-colors"
                  >
                    Zur Kasse gehen
                  </button>
                  <button
                    onClick={() => setShowCheckoutPrompt(false)}
                    className="flex-1 border border-gray-300 text-gray-800 font-semibold py-2 px-4 rounded hover:bg-gray-50 transition-colors"
                  >
                    Weiter Einkaufen
                  </button>
                </div>
              </div>
            )} */}

            {/* <p className="mt-4 text-sm text-gray-500">
              Lieferzeit inkl. Produktion: {product.deliveryTime}
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
}
