// "use client";

// import { createContext, useContext, useState, useEffect, useCallback } from "react";
// import { useSession } from "next-auth/react";
// import { getAuthHeaders, handleAuthError } from "./apiAuth";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// const CartContext = createContext({
//   cart: [],
//   cartCount: 0,
//   subtotal: 0,
//   loading: false,
//   fetchCart: () => {},
//   toggleCartItem: () => {},
//   updateCartItem: () => {},
//   removeFromCart: () => {},
//   isInCart: () => false,
// });

// export function CartProvider({ children }) {
//   const { data: session, status } = useSession();
//   const [cart, setCart] = useState([]);
//   const [cartCount, setCartCount] = useState(0);
//   const [subtotal, setSubtotal] = useState(0);
//   const [loading, setLoading] = useState(false);

//   const fetchCart = useCallback(async () => {
//     if (status !== "authenticated") {
//       setCart([]);
//       setCartCount(0);
//       setSubtotal(0);
//       return;
//     }

//     try {
//       setLoading(true);
//       const headers = await getAuthHeaders(session);
//       if (!headers) return;

//       const res = await fetch(`${API_URL}/api/v1/cart`, { headers });
//       if (await handleAuthError(res)) return;

//       if (res.ok) {
//         const data = await res.json();
//         setCart(data.items || []);
//         setCartCount(data.total_items || 0);
//         setSubtotal(data.subtotal || 0);
//       }
//     } catch (err) {
//       console.error("Failed to fetch cart:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, [session, status]);

//   // Auto-fetch cart when session changes
//   useEffect(() => {
//     fetchCart();
//   }, [fetchCart]);

//   // Toggle: if product is in cart, remove it. Otherwise, add it.
//   const toggleCartItem = useCallback(async (productId) => {
//     if (status !== "authenticated") {
//       alert("Please sign in to add items to your cart.");
//       return { added: false };
//     }

//     try {
//       const headers = await getAuthHeaders(session);
//       if (!headers) return { added: false };

//       const res = await fetch(`${API_URL}/api/v1/cart/cart_items`, {
//         method: "POST",
//         headers: { ...headers, "Content-Type": "application/json" },
//         body: JSON.stringify({ product_id: productId }),
//       });

//       if (await handleAuthError(res)) return { added: false };

//       if (res.ok) {
//         const data = await res.json();
//         setCart(data.cart.items || []);
//         setCartCount(data.cart.total_items || 0);
//         setSubtotal(data.cart.subtotal || 0);
//         return { added: data.added };
//       } else {
//         const errData = await res.json().catch(() => ({}));
//         console.error("Toggle cart error:", errData);
//         return { added: false };
//       }
//     } catch (err) {
//       console.error("Toggle cart item failed:", err);
//       return { added: false };
//     }
//   }, [session, status]);

//   // Update quantity
//   const updateCartItem = useCallback(async (itemId, quantity) => {
//     try {
//       const headers = await getAuthHeaders(session);
//       if (!headers) return;

//       const res = await fetch(`${API_URL}/api/v1/cart/cart_items/${itemId}`, {
//         method: "PATCH",
//         headers: { ...headers, "Content-Type": "application/json" },
//         body: JSON.stringify({ quantity }),
//       });

//       if (await handleAuthError(res)) return;

//       if (res.ok) {
//         const data = await res.json();
//         setCart(data.items || []);
//         setCartCount(data.total_items || 0);
//         setSubtotal(data.subtotal || 0);
//       }
//     } catch (err) {
//       console.error("Update cart item failed:", err);
//     }
//   }, [session]);

//   // Remove item
//   const removeFromCart = useCallback(async (itemId) => {
//     try {
//       const headers = await getAuthHeaders(session);
//       if (!headers) return;

//       const res = await fetch(`${API_URL}/api/v1/cart/cart_items/${itemId}`, {
//         method: "DELETE",
//         headers,
//       });

//       if (await handleAuthError(res)) return;

//       if (res.ok) {
//         const data = await res.json();
//         setCart(data.items || []);
//         setCartCount(data.total_items || 0);
//         setSubtotal(data.subtotal || 0);
//       }
//     } catch (err) {
//       console.error("Remove from cart failed:", err);
//     }
//   }, [session]);

//   // Check if a product is currently in the cart
//   const isInCart = useCallback((productId) => {
//     return cart.some((item) => item.product_id === productId);
//   }, [cart]);

//   return (
//     <CartContext.Provider
//       value={{
//         cart,
//         cartCount,
//         subtotal,
//         loading,
//         fetchCart,
//         toggleCartItem,
//         updateCartItem,
//         removeFromCart,
//         isInCart,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }

// export function useCart() {
//   return useContext(CartContext);
// }
