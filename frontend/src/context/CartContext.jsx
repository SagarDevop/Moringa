import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const STORAGE_KEY = 'bandamart_cart';

function loadCart() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
}

function saveCart(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function cartReducer(state, action) {
  let newState;
  switch (action.type) {
    case 'ADD_ITEM': {
      const itemKey = action.product.selectedSize
        ? `${action.product.id}_${action.product.selectedSize}`
        : action.product.id;
      const existing = state.find(item => item.id === itemKey);
      if (existing) {
        newState = state.map(item =>
          item.id === itemKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newState = [...state, { ...action.product, id: itemKey, productId: action.product.id, quantity: 1 }];
      }
      break;
    }
    case 'REMOVE_ITEM':
      newState = state.filter(item => item.id !== action.id);
      break;
    case 'INCREMENT': {
      newState = state.map(item =>
        item.id === action.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      break;
    }
    case 'DECREMENT': {
      newState = state.map(item =>
        item.id === action.id
          ? { ...item, quantity: Math.max(0, item.quantity - 1) }
          : item
      ).filter(item => item.quantity > 0);
      break;
    }
    case 'CLEAR':
      newState = [];
      break;
    default:
      return state;
  }
  saveCart(newState);
  return newState;
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], loadCart);

  const [donation, setDonation] = React.useState(0);

  const addItem = (product) => dispatch({ type: 'ADD_ITEM', product });
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', id });
  const increment = (id) => dispatch({ type: 'INCREMENT', id });
  const decrement = (id) => dispatch({ type: 'DECREMENT', id });
  const clearCart = () => {
    dispatch({ type: 'CLEAR' });
    setDonation(0);
  };
  const getItemQuantity = (id, selectedSize) => {
    const itemKey = selectedSize ? `${id}_${selectedSize}` : id;
    const item = items.find(i => i.id === itemKey);
    return item ? item.quantity : 0;
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, increment, decrement,
      clearCart, getItemQuantity, totalItems, totalPrice,
      donation, setDonation
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
