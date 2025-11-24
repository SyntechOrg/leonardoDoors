"use client";

import React, { useState, useEffect } from "react";
import { useCheckout } from "../store/CheckoutProvider";
import SummarySidebar from "../components/SummarySidebar";
import { useRouter } from "next/navigation";

export default function ReviewStep() {
  const { state, dispatch } = useCheckout();
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Stripe setup (will be done in ShippingPaymentStep via Elements provider)
  // This step assumes payment token/method is already stored in state.payment

  const placeOrder = async () => {
    setLoading(true);
    setError(null);

    try {
      const createPaymentIntentResponse = await fetch(
        `${
          process.env.NEXT_PUBLIC_STRAPI_URL || process.env.REACT_APP_STRAPI_URL || "http://localhost:1337"
        }/api/payment/create-intent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: Math.round(state.meta.totals.grand * 100),
            currency: state.meta.currency.toLowerCase(),
            customer: {
              email: state.customer.email,
              name: `${state.customer.firstName} ${state.customer.lastName}`,
            },
          }),
        }
      );

      if (!createPaymentIntentResponse.ok) {
        throw new Error("Failed to create payment intent");
      }

      const { clientSecret } = await createPaymentIntentResponse.json();

      const orderResponse = await fetch(
        `${
          process.env.NEXT_PUBLIC_STRAPI_URL || process.env.REACT_APP_STRAPI_URL || "http://localhost:1337"
        }/api/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // "Authorization": `Bearer ${userToken}`, // Add when user is logged in
          },
          body: JSON.stringify({
            data: {
              // Customer info
              customerFirstName: state.customer.firstName,
              customerLastName: state.customer.lastName,
              customerEmail: state.customer.email,
              customerPhone: state.customer.phone,
              customerAddress: state.customer.address1,
              customerAddress2: state.customer.address2 || "",
              customerCity: state.customer.city,
              customerZip: state.customer.zip,
              customerCountry: state.customer.country,

              // Cart items
              items: state.cart.items.map((item) => ({
                doorId: item.doorId,
                variantId: item.variantId,
                name: item.name,
                price: item.price,
                quantity: item.qty,
                options: JSON.stringify(item.options),
              })),

              // Shipping & Payment
              shippingMethod: state.shipping.methodId,
              shippingCost: state.shipping.cost,
              paymentMethod: state.payment.method,
              stripePaymentIntentId: clientSecret?.split("_secret_")[0] || "", // Store PI ID

              // Totals
              subtotal: state.meta.totals.subtotal,
              discount: state.meta.totals.discount,
              tax: state.meta.totals.tax,
              shipping: state.meta.totals.shipping,
              total: state.meta.totals.grand,
              currency: state.meta.currency,

              // Status
              status: "pending_shipment",
              paymentStatus: "paid",
            },
          }),
        }
      );

      if (!orderResponse.ok) {
        throw new Error("Failed to create order");
      }

      const orderResult = await orderResponse.json();
      const orderId = orderResult.data.id;

      // Step 4: Clear cart and move to tracking
      dispatch({ type: "CLEAR_CART" });
      dispatch({ type: "SET_STEP", step: 4 });

      // Optional: Store order ID for redirect
      // navigate(`/order/${orderId}/track`);
    } catch (err) {
      console.error("Order placement error:", err);
      setError(err.message || "Fehler beim Platzieren der Bestellung");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-8">
        <section className="rounded border border-gray-200 bg-white p-4 md:p-6">
          <h4 className="mb-4 text-base font-semibold">VERSANDINFORMATIONEN</h4>
          <div className="space-y-2 text-sm text-gray-800">
            <div>
              {state.customer.firstName} {state.customer.lastName}
            </div>
            <div>{state.customer.address1}</div>
            {state.customer.address2 && <div>{state.customer.address2}</div>}
            <div>
              {state.customer.zip} {state.customer.city}{" "}
              {state.customer.country}
            </div>
            <div className="pt-2 border-t border-gray-200">
              {state.customer.email} · {state.customer.phone}
            </div>
          </div>
        </section>

        <section className="rounded border border-gray-200 bg-white p-4 md:p-6">
          <h4 className="mb-4 text-base font-semibold">ZAHLMETHODEN</h4>
          <div className="text-sm text-gray-800">
            {state.payment.method === "card"
              ? `Kreditkarte (${state.payment.brand}) •••• ${
                  state.payment.last4 || ""
                }`
              : "PayPal"}
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Zahlungen werden sicher über Stripe verarbeitet.
          </p>
        </section>

        <section className="rounded border border-gray-200 bg-white p-4 md:p-6">
          <h4 className="mb-4 text-base font-semibold">VERSANDMETHODE</h4>
          <div className="text-sm text-gray-800">
            <div>{state.shipping.label}</div>
            <div className="text-xs text-gray-600">
              ETA: {state.shipping.eta}
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded border border-red-300 bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            disabled={loading}
          />
          <span>
            Ich bestätige, dass alle Angaben korrekt sind und akzeptiere die
            Geschäftsbedingungen. Zahlungen werden über Stripe verarbeitet.
          </span>
        </label>

        <div className="flex gap-3">
          <button
            onClick={() => dispatch({ type: "SET_STEP", step: 2 })}
            disabled={loading}
            className="rounded border border-gray-300 px-4 py-2 text-sm disabled:opacity-60"
          >
            Zurück
          </button>
          <button
            onClick={placeOrder}
            disabled={!agree || loading}
            className="rounded bg-yellow-500 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-600 disabled:opacity-60 transition-colors"
          >
            {loading
              ? "Wird verarbeitet..."
              : "Bestellung bestätigen & Bezahlen"}
          </button>
        </div>
      </div>

      <SummarySidebar
        totals={state.meta.totals}
        items={state.cart.items}
        ctaText="Bestellung bestätigen"
        onCta={() => agree && !loading && placeOrder()}
        disabled={!agree || loading}
      />
    </div>
  );
}
