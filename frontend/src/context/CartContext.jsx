import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const KEY = "cart";

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(load); // [{product:{id,nombre,precio,stock,imagenUrl}, cantidad}]

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const add = (product, cantidad = 1) => {
    setItems((prev) => {
      const found = prev.find((i) => i.product.id === product.id);
      if (found) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, cantidad: i.cantidad + cantidad } : i
        );
      }
      return [...prev, { product: { id: product.id, nombre: product.nombre, precio: Number(product.precio), stock: product.stock, imagenUrl: product.imagenUrl }, cantidad }];
    });
  };

  const setQty = (id, cantidad) => {
    setItems((prev) =>
      cantidad <= 0 ? prev.filter((i) => i.product.id !== id)
        : prev.map((i) => (i.product.id === id ? { ...i, cantidad } : i))
    );
  };

  const remove = (id) => setItems((prev) => prev.filter((i) => i.product.id !== id));
  const clear = () => setItems([]);

  const total = useMemo(
    () => items.reduce((acc, i) => acc + Number(i.product.precio) * i.cantidad, 0),
    [items]
  );
  const count = useMemo(() => items.reduce((acc, i) => acc + i.cantidad, 0), [items]);

  return (
    <CartContext.Provider value={{ items, add, setQty, remove, clear, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
