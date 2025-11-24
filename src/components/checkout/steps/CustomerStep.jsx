import React, { useState, useEffect } from "react";
import { useCheckout } from "../store/CheckoutProvider";
import SummarySidebar from "../components/SummarySidebar";
import { Input, Select } from "../components/FormControls";
import { supabase } from "@components/supabase/supabaseClient";

export default function CustomerStep() {
  const { state, dispatch } = useCheckout();
  const c = state.customer;

  const [local, setLocal] = useState(c);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const set = (k) => (e) => setLocal((s) => ({ ...s, [k]: e.target.value }));

  useEffect(() => {
    const fetchUser = async () => {
      setAuthLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setAuthUser(user);
      
      if (user && !local.email) {
        setLocal(prev => ({
            ...prev,
            email: user.email,
        }));
      }
      setAuthLoading(false);
    };
    fetchUser();
  }, []);

  const formValid =
    local.firstName &&
    local.lastName &&
    /\S+@\S+\.\S+/.test(local.email) &&
    local.address1 &&
    local.zip &&
    local.country;

  const canSubmit = formValid && !!authUser && !authLoading;

  const handleSubmitOrder = async () => {
    if (!canSubmit || isSubmitting) return;
    
    setIsSubmitting(true);
    setStatusMessage("Verifying prices...");

    try {
      const user = authUser;

      let customerId = null;

      const { data: existingCustomer, error: fetchError } = await supabase
        .from("customers")
        .select("id")
        .eq("auth_user_id", user.id)
        .single();

      if (existingCustomer) {
        customerId = existingCustomer.id;
      } else {
        const { data: newCustomer, error: createError } = await supabase
          .from("customers")
          .insert({
            auth_user_id: user.id,
            email: user.email,
            first_name: local.firstName,
            last_name: local.lastName,
            street: local.address1,
            postal_code: local.zip,
            city: local.city || "",
            country: local.country,
            phone_number: local.phone,
            customer_type: "private",
            status: "active"
          })
          .select("id")
          .single();

        if (createError) throw new Error(`Customer creation failed: ${createError.message}`);
        customerId = newCustomer.id;
      }

      const cartVariantIds = state.cart.items.map(i => i.variantId);
      
      const { data: dbVariants, error: priceError } = await supabase
        .from("doors_variants")
        .select("id, price, discount_price, door_id")
        .in("id", cartVariantIds);

      if (priceError) throw new Error("Could not verify product prices.");

      let verifiedSubtotal = 0;
      const verifiedItems = state.cart.items.map(cartItem => {
        const dbVariant = dbVariants.find(v => v.id === cartItem.variantId);
        if (!dbVariant) throw new Error(`Product no longer available: ${cartItem.name}`);
        
        const realPrice = (dbVariant.discount_price && dbVariant.discount_price > 0) 
          ? dbVariant.discount_price 
          : dbVariant.price;

        verifiedSubtotal += realPrice * cartItem.qty;

        return {
          ...cartItem,
          finalPrice: realPrice,
          door_id: dbVariant.door_id 
        };
      });

      const taxAmount = verifiedSubtotal * 0.077; 
      const shippingCost = verifiedSubtotal > 0 ? 15 : 0; 
      const totalAmount = verifiedSubtotal + taxAmount + shippingCost;

      setStatusMessage("Creating order...");
      const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_id: customerId,
          order_number: orderNumber,
          status: "pending",
          payment_method: "invoice", 
          subtotal: verifiedSubtotal,
          tax_amount: taxAmount,
          shipping_cost: shippingCost,
          total_amount: totalAmount,
          notes: local.message || "",
          order_date: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (orderError) throw new Error(`Order creation failed: ${orderError.message}`);

const itemsPayload = verifiedItems.map(item => ({
  order_id: orderData.id,
  door_id: item.door_id,
  quantity: item.qty,
  price: item.finalPrice,      
  amount: item.finalPrice * item.qty, 
  tax_percentage: 7.7,          
  unit: "Pcs",                  
}));

const { error: itemsError } = await supabase
  .from("order_items")
  .insert(itemsPayload);

if (itemsError) throw new Error(`Failed to save items: ${itemsError.message}`);

      dispatch({ type: "SET_CUSTOMER", payload: local });
      dispatch({
        type: "SUBMIT_ORDER_SUCCESS", 
        payload: { orderId: orderData.id, orderNumber: orderNumber },
      });
      dispatch({ type: "CLEAR_CART" });
      dispatch({ type: "SET_STEP", step: 3 });

    } catch (error) {
      console.error("Checkout Error:", error);
      alert(error.message);
      setStatusMessage("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_360px]">
      <div className="rounded border border-gray-200 bg-white p-4 md:p-6">
        <h3 className="mb-4 text-sm font-semibold text-gray-900">
          Ihre Informationen
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Vorname"
            value={local.firstName}
            onChange={set("firstName")}
            autoComplete="given-name"
          />
          <Input
            label="Nachname"
            value={local.lastName}
            onChange={set("lastName")}
            autoComplete="family-name"
          />
          <div className="md:col-span-2">
            <Input
              label="Straße & Hausnummer"
              value={local.address1}
              onChange={set("address1")}
              autoComplete="address-line1"
            />
          </div>
          <Select
            label="Land / Region"
            value={local.country}
            onChange={set("country")}
          >
            <option value="Schweiz">Schweiz</option>
            <option value="Deutschland">Deutschland</option>
            <option value="Österreich">Österreich</option>
          </Select>
          <Input
            label="PLZ"
            value={local.zip}
            onChange={set("zip")}
            autoComplete="postal-code"
          />
          <Input
            label="Stadt"
            value={local.city || ""}
            onChange={set("city")}
            autoComplete="address-level2"
          />
          <Input
            label="E-Mail"
            type="email"
            value={local.email}
            onChange={set("email")}
            autoComplete="email"
          />
          <Input
            label="Telefonnummer"
            value={local.phone}
            onChange={set("phone")}
            autoComplete="tel"
          />
          <div className="md:col-span-2">
            <Input
              label="Nachricht (Optional)"
              value={local.message || ""}
              onChange={set("message")}
              placeholder="Besondere Hinweise zur Lieferung..."
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => dispatch({ type: "SET_STEP", step: 0 })}
            className="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
          >
            Zurück
          </button>
          <button
            onClick={handleSubmitOrder}
            disabled={!canSubmit || isSubmitting}
            className="rounded bg-yellow-500 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-600 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {authLoading
              ? "Laden..."
              : isSubmitting
              ? statusMessage || "Verarbeiten..."
              : "Bestellung abschicken"}
          </button>
        </div>

        {!authLoading && !authUser && (
          <div className="mt-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Anmeldung erforderlich</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>Sie müssen eingeloggt sein, um eine Bestellung aufzugeben.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <SummarySidebar
        totals={state.meta.totals}
        items={state.cart.items}
        ctaText={isSubmitting ? "Verarbeiten..." : "Bestellung abschicken"}
        onCta={() => canSubmit && handleSubmitOrder()}
        disabled={!canSubmit || isSubmitting}
      />
    </div>
  );
}