import { useCheckout } from "../components/checkout/store/CheckoutProvider";

export function useCart() {
  const { state, dispatch } = useCheckout();

  console.log("useCart state:", state);

  const addToCart = (itemData) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: itemData,
    });
  };

  const updateQty = (itemId, qty) => {
    if (qty <= 0) {
      removeItem(itemId);
    } else {
      dispatch({
        type: "UPDATE_ITEM_QTY",
        id: itemId,
        qty,
      });
    }
  };

  const removeItem = (itemId) => {
    dispatch({
      type: "REMOVE_ITEM",
      id: itemId,
    });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return {
    cart: state.cart,
    addToCart,
    updateQty,
    removeItem,
    clearCart,
    totals: state.meta.totals,
  };
}
