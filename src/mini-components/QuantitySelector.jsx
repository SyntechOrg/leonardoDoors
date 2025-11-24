import React from "react";

export default function QuantitySelector({ quantity, onQuantityChange }) {
  const handleDecrement = () => {
    if (quantity > 0) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    onQuantityChange(quantity + 1);
  };

  return (
    <div className="flex items-center border border-gray-300 rounded-md">
      <button
        onClick={handleDecrement}
        className="px-3 py-1.5 text-lg text-gray-500 hover:bg-gray-100 transition"
      >
        -
      </button>
      <span className="px-4 py-1.5 font-medium text-center">{quantity}</span>
      <button
        onClick={handleIncrement}
        className="px-3 py-1.5 text-lg text-gray-500 hover:bg-gray-100 transition"
      >
        +
      </button>
    </div>
  );
}
