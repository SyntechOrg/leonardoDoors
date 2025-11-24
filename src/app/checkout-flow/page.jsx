"use client";

import React, { Suspense } from "react";
import {
  CheckoutProvider,
  useCheckout,
} from "@components/checkout/store/CheckoutProvider";
import ProgressHeader from "@components/checkout/components/ProgressHeader";
import SummarySidebar from "@components/checkout/components/SummarySidebar";
import CartStep from "@components/checkout/steps/CartStep";
import CustomerStep from "@components/checkout/steps/CustomerStep";
const ShippingPaymentStep = React.lazy(() =>
  import("@components/checkout/steps/ShippingPaymentStep")
);
import ReviewStep from "@components/checkout/steps/ReviewStep";
import TrackingStep from "@components/checkout/steps/TrackingStep";
import ConfirmationStep from "@components/checkout/steps/ConfirmationStep";

function StepRouter() {
  const { state } = useCheckout();
  switch (state.meta.step) {
    case 0:
      return <CartStep />;
    case 1:
      return <CustomerStep />;
    // case 2:
    //   return (
    //     <Suspense fallback={<div className="p-6">Lädt…</div>}>
    //       <ShippingPaymentStep />
    //     </Suspense>
    //   );
    case 3:
      return <ConfirmationStep />;
    // case 4:
    //   return <TrackingStep />;
    default:
      return <CartStep />;
  }
}

function HeaderAndContent() {
  const { state, dispatch } = useCheckout();
  return (
    <>
      <ProgressHeader
        current={state.meta.step}
        onStepChange={(s) => dispatch({ type: "SET_STEP", step: s })}
      />
      {/* For CartStep and others, each step renders its own main + sidebar grid.
          If you prefer a single global grid, move SummarySidebar here and let
          steps render only the main column. */}
      <div className="mt-8">
        <StepRouter />
      </div>
    </>
  );
}

export default function CheckoutShell() {
  return (
      <div className="mx-auto max-w-6xl px-4 py-6 md:py-10">
        <HeaderAndContent />
      </div>
  );
}

