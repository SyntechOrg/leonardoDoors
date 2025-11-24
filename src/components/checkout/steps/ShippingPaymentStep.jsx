import React, { useState, useEffect } from "react";
import { useCheckout } from "../store/CheckoutProvider";
import SummarySidebar from "../components/SummarySidebar";
import { RadioCard, Input } from "../components/FormControls";
import { formatCHF } from "@utils/currency";

// You'll need to install: npm install @stripe/react-stripe-js @stripe/js
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const METHODS = [
  {
    id: "dhl",
    label: "DHL Express",
    cost: 0,
    eta: "20. Juli – 03. August",
    right: "Kostenloser Versand",
  },
  {
    id: "fedex",
    label: "FedEx",
    cost: 25,
    eta: "20. Juli – 03. August",
    right: "CHF 25.00",
  },
  {
    id: "express",
    label: "Express-Versand",
    cost: 35,
    eta: "20. Juli – 03. August",
    right: "CHF 35.00",
  },
];

export default function ShippingPaymentStep() {
  const { state, dispatch } = useCheckout();
  const stripe = useStripe();
  const elements = useElements();

  const [shippingId, setShippingId] = useState(
    state.shipping?.methodId || "dhl"
  );
  const [payMethod, setPayMethod] = useState(state.payment?.method || "card");
  const [cardComplete, setCardComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cardError, setCardError] = useState(null);

  const chooseShip = (m) => {
    setShippingId(m.id);
    dispatch({
      type: "SET_SHIPPING",
      payload: { methodId: m.id, label: m.label, cost: m.cost, eta: m.eta },
    });
  };

  const handleCardChange = (event) => {
    setCardError(event.error?.message || null);
    setCardComplete(event.complete);
  };

  const next = async () => {
    if (payMethod === "card") {
      if (!stripe || !elements) {
        setCardError("Stripe is not loaded");
        return;
      }

      if (!cardComplete) {
        setCardError("Please complete your card details");
        return;
      }

      setLoading(true);
      setCardError(null);

      try {
        // Create Payment Method with Stripe
        const { paymentMethod, error } = await stripe.createPaymentMethod({
          type: "card",
          card: elements.getElement(CardElement),
        });

        if (error) {
          throw new Error(error.message);
        }

        // Store payment method info (not the actual card data)
        dispatch({
          type: "SET_PAYMENT",
          payload: {
            method: "card",
            token: paymentMethod.id,
            brand: paymentMethod.card.brand.toUpperCase(),
            last4: paymentMethod.card.last4,
          },
        });

        dispatch({ type: "SET_STEP", step: 3 });
      } catch (err) {
        setCardError(err.message);
      } finally {
        setLoading(false);
      }
    } else if (payMethod === "paypal") {
      // PayPal placeholder
      dispatch({
        type: "SET_PAYMENT",
        payload: { method: "paypal", token: "paypal_placeholder" },
      });
      dispatch({ type: "SET_STEP", step: 3 });
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-8">
        <section className="rounded border border-gray-200 bg-white p-4 md:p-6">
          <h4 className="mb-4 text-base font-semibold">VERSANDSERVICE</h4>
          <div className="space-y-3">
            {METHODS.map((m) => (
              <RadioCard
                key={m.id}
                name="shipping"
                checked={shippingId === m.id}
                onChange={() => chooseShip(m)}
                title={m.label}
                subtitle={`Voraussichtliche Lieferzeit: ${m.eta}`}
                right={m.cost ? formatCHF(m.cost) : m.right}
              />
            ))}
          </div>
        </section>

        <section className="rounded border border-gray-200 bg-white p-4 md:p-6">
          <h4 className="mb-4 text-base font-semibold">ZAHLMETHODEN</h4>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <RadioCard
              name="pay"
              checked={payMethod === "card"}
              onChange={() => setPayMethod("card")}
              title="Kreditkarte"
              subtitle="Sie können alle Kreditkartenmarken nutzen."
            />
            <RadioCard
              name="pay"
              checked={payMethod === "paypal"}
              onChange={() => setPayMethod("paypal")}
              title="Paypal"
              subtitle="Zahlen Sie sicher mit PayPal."
            />
          </div>

          {payMethod === "card" && (
            <div className="mt-6 space-y-4">
              <div className="border border-gray-300 rounded p-4 bg-gray-50">
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Kartendaten
                </label>
                <CardElement
                  onChange={handleCardChange}
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#424770",
                        "::placeholder": {
                          color: "#aab7c4",
                        },
                      },
                      invalid: {
                        color: "#9e2146",
                      },
                    },
                  }}
                />
              </div>

              {cardError && (
                <div className="rounded border border-red-300 bg-red-50 p-3">
                  <p className="text-sm text-red-800">{cardError}</p>
                </div>
              )}

              <p className="text-xs text-gray-500">
                Ihre Kartendaten werden sicher über Stripe verarbeitet und nicht
                auf unseren Servern gespeichert.
              </p>
            </div>
          )}

          {payMethod === "paypal" && (
            <div className="mt-4 rounded border border-blue-300 bg-blue-50 p-3">
              <p className="text-sm text-blue-800">
                Sie werden zu PayPal weitergeleitet, um die Zahlung zu
                bestätigen.
              </p>
            </div>
          )}
        </section>

        <div className="flex gap-3">
          <button
            onClick={() => dispatch({ type: "SET_STEP", step: 1 })}
            disabled={loading}
            className="rounded border border-gray-300 px-4 py-2 text-sm disabled:opacity-60"
          >
            Zurück
          </button>
          <button
            onClick={next}
            disabled={(!cardComplete && payMethod === "card") || loading}
            className="rounded bg-yellow-500 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-600 disabled:opacity-60 transition-colors"
          >
            {loading ? "Wird verarbeitet..." : "Überprüfen Sie Ihre Bestellung"}
          </button>
        </div>
      </div>

      <SummarySidebar
        totals={state.meta.totals}
        items={state.cart.items}
        ctaText="Überprüfen Sie Ihre Bestellung"
        onCta={() => !loading && next()}
        disabled={(!cardComplete && payMethod === "card") || loading}
      />
    </div>
  );
}
