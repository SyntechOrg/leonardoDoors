import React from "react";
import { useCheckout } from "../store/CheckoutProvider";
import Link from "next/link";

export default function ConfirmationStep() {
  const { state } = useCheckout();
  const { orderId, orderNumber } = state.orderInfo || {};

  return (
    <div className="rounded border border-gray-200 bg-white p-6 md:p-10 text-center max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-green-600">Vielen Dank!</h2>
      <p className="mt-2 text-lg text-gray-700">
        Ihre Bestellung wurde erfolgreich übermittelt.
      </p>

      {orderNumber && (
        <p className="mt-4 text-gray-600">
          Ihre Bestellnummer lautet:
          <br />
          <strong className="text-xl text-gray-900">{orderNumber}</strong>
        </p>
      )}
      {orderId && <p className="mt-1 text-sm text-gray-500">(ID: {orderId})</p>}
{/* 
      <p className="mt-6 text-gray-600">
        Wir werden uns in Kürze mit Ihnen in Verbindung setzen, um die Details
        zu bestätigen.
      </p> */}
      <p className="mt-6 text-gray-600">
      Bitte aktualisieren Sie die Seite, wenn Sie neue Bestellungen aufgeben möchten.
      </p>

      <Link href="/shop" className="mt-8 inline-block rounded bg-yellow-500 px-6 py-3 text-sm font-semibold text-white hover:bg-yellow-600">
        Weiter einkaufen
      </Link>
    </div>
  );
}
