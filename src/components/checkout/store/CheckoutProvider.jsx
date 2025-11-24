"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
} from "react";
import { supabase } from "../../supabase/supabaseClient";

const CheckoutContext = createContext();

const initialState = {
  cart: { items: [] },
  customer: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    city: "",
    zip: "",
    country: "Schweiz",
    message: "",
  },
  meta: {
    step: 0,
    totals: { subtotal: 0, tax: 0, shipping: 0, total: 0 },
  },
};

const calculateTotals = (items) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * 0.077; // 7.7% Swiss VAT
  const shipping = subtotal > 0 ? 15 : 0;
  const total = subtotal + tax + shipping;

  return { subtotal, tax, shipping, total };
};

function checkoutReducer(state, action) {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existing = state.cart.items.find((i) => i.id === action.payload.id);
      let newItems;
      if (existing) {
        newItems = state.cart.items.map((i) =>
          i.id === action.payload.id
            ? { ...i, qty: i.qty + action.payload.qty }
            : i
        );
      } else {
        newItems = [...state.cart.items, action.payload];
      }
      return {
        ...state,
        cart: { items: newItems },
        meta: {
          ...state.meta,
          totals: calculateTotals(newItems),
        },
      };
    }
    case "SUBMIT_ORDER_SUCCESS":
      return {
        ...state,
        orderInfo: action.payload, 
      };

    case "UPDATE_ITEM_QTY": {
      const newItems = state.cart.items.map((i) =>
        i.id === action.id ? { ...i, qty: action.qty } : i
      );
      return {
        ...state,
        cart: { items: newItems },
        meta: {
          ...state.meta,
          totals: calculateTotals(newItems),
        },
      };
    }

    case "REMOVE_ITEM": {
      const newItems = state.cart.items.filter((i) => i.id !== action.id);
      return {
        ...state,
        cart: { items: newItems },
        meta: {
          ...state.meta,
          totals: calculateTotals(newItems),
        },
      };
    }

    case "CLEAR_CART":
      return {
        ...state,
        cart: { items: [] },
        meta: {
          ...state.meta,
          totals: calculateTotals([]),
        },
      };

    case "SET_STEP":
      return {
        ...state,
        meta: { ...state.meta, step: action.step },
      };

    case "SET_CUSTOMER":
      return {
        ...state,
        customer: action.payload,
      };

    case "LOAD_CART":
      return {
        ...state,
        cart: { items: action.payload },
        meta: {
          ...state.meta,
          totals: calculateTotals(action.payload),
        },
      };

    default:
      return state;
  }
}

export function CheckoutProvider({ children }) {
  const [state, dispatch] = useReducer(checkoutReducer, initialState);
  const [user, setUser] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  // Only load cart from localStorage ONCE on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart-storage");
      if (savedCart) {
        try {
          const items = JSON.parse(savedCart);
          console.log("Loaded from localStorage on mount:", items);
          dispatch({ type: "LOAD_CART", payload: items });
        } catch (err) {
          console.error("Failed to load cart from localStorage:", err);
        }
      }
      setHydrated(true);
    }
  }, []); // Empty dependency array - runs only once

  // Get user info (separate from cart loading)
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    // Only save if we are hydrated, otherwise we might overwrite valid data with initial empty state
    if (hydrated && typeof window !== "undefined") {
      localStorage.setItem("cart-storage", JSON.stringify(state.cart.items));
      console.log("Saved to localStorage:", state.cart.items);
    }
  }, [state.cart.items, hydrated]);

  return (
    <CheckoutContext.Provider value={{ state, dispatch, user }}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckout must be used within CheckoutProvider");
  }
  return context;
}
