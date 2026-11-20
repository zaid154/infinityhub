import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const getTenureDiscount = (tenure) => {
  if (tenure === '12_months') return 0.15;
  if (tenure === '6_months') return 0.05;
  return 0; // 3_months or default
};

export const CartProvider = ({ children }) => {
  // Buy Cart: Outright Capex Purchases
  const [buyCart, setBuyCart] = useState(() => {
    try {
      const saved = localStorage.getItem('technova_buy_cart') || localStorage.getItem('technova_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Rental Cart: Monthly Corporate Opex Leases
  const [rentalCart, setRentalCart] = useState(() => {
    try {
      const saved = localStorage.getItem('technova_rental_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('technova_buy_cart', JSON.stringify(buyCart));
    // Keep legacy key in sync for backwards compatibility
    localStorage.setItem('technova_cart', JSON.stringify(buyCart));
  }, [buyCart]);

  useEffect(() => {
    localStorage.setItem('technova_rental_cart', JSON.stringify(rentalCart));
  }, [rentalCart]);

  // Add to Buy Cart with strict stock clamping
  const addToBuyCart = (product, quantity = 1) => {
    const maxAvailable = product.sale_stock !== undefined ? product.sale_stock : product.stock_quantity || 10;
    if (maxAvailable <= 0) {
      toast.error(`Sorry, ${product.title} is currently out of stock for outright purchase.`);
      return false;
    }

    let clamped = false;
    setBuyCart((prev) => {
      const existing = prev.find((item) => item.product._id === product._id);
      if (existing) {
        let newQty = existing.quantity + quantity;
        if (newQty > maxAvailable) {
          newQty = maxAvailable;
          clamped = true;
        }
        return prev.map((item) =>
          item.product._id === product._id ? { ...item, quantity: newQty } : item
        );
      } else {
        let initialQty = quantity;
        if (initialQty > maxAvailable) {
          initialQty = maxAvailable;
          clamped = true;
        }
        return [...prev, { product, quantity: initialQty }];
      }
    });

    if (clamped) {
      toast.error(`Max stock limit (${maxAvailable} units) reached.`, {
        id: `buy-limit-${product._id}`,
        duration: 3000
      });
    } else {
      const shortTitle = product.title?.length > 28 ? product.title.slice(0, 28) + '...' : product.title;
      toast.success(`Added ${shortTitle} to Purchase Cart`, {
        id: `cart-action-${product._id}`,
        duration: 2500
      });
    }
    return true;
  };

  // Add to Rental Cart with strict rental_stock clamping
  const addToRentalCart = (product, quantity = 1, tenure = '6_months') => {
    const maxRental = product.rental_stock !== undefined ? product.rental_stock : 5;
    if (maxRental <= 0) {
      toast.error(`Sorry, ${product.title} has no units in active rental inventory.`, {
        id: `rental-empty-${product._id}`,
        duration: 3000
      });
      return false;
    }

    let clamped = false;
    setRentalCart((prev) => {
      const existing = prev.find((item) => item.product._id === product._id);
      if (existing) {
        let newQty = existing.quantity + quantity;
        if (newQty > maxRental) {
          newQty = maxRental;
          clamped = true;
        }
        return prev.map((item) =>
          item.product._id === product._id ? { ...item, quantity: newQty, tenure: tenure || item.tenure } : item
        );
      } else {
        let initialQty = quantity;
        if (initialQty > maxRental) {
          initialQty = maxRental;
          clamped = true;
        }
        return [...prev, { product, quantity: initialQty, tenure }];
      }
    });

    if (clamped) {
      toast.error(`Rental limit reached (${maxRental} units max). Request custom RFQ for larger quantity.`, {
        id: `rental-limit-${product._id}`,
        duration: 3000
      });
    } else {
      const shortTitle = product.title?.length > 28 ? product.title.slice(0, 28) + '...' : product.title;
      toast.success(`Added ${shortTitle} to Rental Cart`, {
        id: `cart-action-${product._id}`,
        duration: 2500
      });
    }
    return true;
  };

  // Update Buy Cart Quantity with stock clamping
  const updateBuyQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromBuyCart(productId);
      return;
    }
    setBuyCart((prev) =>
      prev.map((item) => {
        if (item.product._id === productId) {
          const maxAvailable = item.product.sale_stock !== undefined ? item.product.sale_stock : item.product.stock_quantity || 10;
          if (quantity > maxAvailable) {
            toast.error(`Only ${maxAvailable} units available in stock for direct purchase. Cannot select ${quantity}.`);
            return { ...item, quantity: maxAvailable };
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  // Update Rental Cart Quantity with rental_stock clamping
  const updateRentalQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromRentalCart(productId);
      return;
    }
    setRentalCart((prev) =>
      prev.map((item) => {
        if (item.product._id === productId) {
          const maxRental = item.product.rental_stock !== undefined ? item.product.rental_stock : 5;
          if (quantity > maxRental) {
            toast.error(`Only ${maxRental} units available in active rental inventory. Cannot select ${quantity}.`);
            return { ...item, quantity: maxRental };
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  // Update Rental Tenure ('1_month', '3_months', '6_months', '12_months')
  const updateRentalTenure = (productId, tenure) => {
    setRentalCart((prev) =>
      prev.map((item) =>
        item.product._id === productId ? { ...item, tenure } : item
      )
    );
  };

  const removeFromBuyCart = (productId) => {
    setBuyCart((prev) => prev.filter((item) => item.product._id !== productId));
    toast.success('Removed item from Purchase Order Cart');
  };

  const removeFromRentalCart = (productId) => {
    setRentalCart((prev) => prev.filter((item) => item.product._id !== productId));
    toast.success('Removed item from Rental Cart');
  };

  const clearBuyCart = () => setBuyCart([]);
  const clearRentalCart = () => setRentalCart([]);
  const clearCart = () => {
    setBuyCart([]);
    setRentalCart([]);
  };

  // Metrics
  const buyCartCount = buyCart.reduce((total, item) => total + item.quantity, 0);
  const rentalCartCount = rentalCart.reduce((total, item) => total + item.quantity, 0);
  const cartCount = buyCartCount + rentalCartCount;

  const buySubtotal = buyCart.reduce(
    (total, item) => total + (item.product.sale_price || 0) * item.quantity,
    0
  );

  // Rental monthly calculation with accurate mathematical precision:
  // Base total = sum(unit_rate * quantity)
  // Discount = sum(Math.round(unit_rate * quantity * discount_rate))
  // Net Taxable = Base total - Discount
  const rentalUndiscountedTotal = rentalCart.reduce(
    (total, item) => total + (item.product.rental_price_monthly || 0) * item.quantity,
    0
  );

  const rentalSavingsTotal = rentalCart.reduce((total, item) => {
    const itemBaseTotal = (item.product.rental_price_monthly || 0) * item.quantity;
    const discount = getTenureDiscount(item.tenure);
    return total + Math.round(itemBaseTotal * discount);
  }, 0);

  const rentalMonthlyTotal = Math.max(0, rentalUndiscountedTotal - rentalSavingsTotal);

  return (
    <CartContext.Provider
      value={{
        // Dual Cart States
        buyCart,
        rentalCart,
        // Dual Cart Operations
        addToBuyCart,
        addToRentalCart,
        updateBuyQuantity,
        updateRentalQuantity,
        updateRentalTenure,
        removeFromBuyCart,
        removeFromRentalCart,
        clearBuyCart,
        clearRentalCart,
        // Backward-compatibility aliases for legacy components
        cart: buyCart,
        addToCart: addToBuyCart,
        updateQuantity: updateBuyQuantity,
        removeFromCart: removeFromBuyCart,
        clearCart,
        cartSubtotal: buySubtotal,
        // Counts & Totals
        buyCartCount,
        rentalCartCount,
        cartCount,
        buySubtotal,
        rentalUndiscountedTotal,
        rentalMonthlyTotal,
        rentalSavingsTotal,
        getTenureDiscount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
