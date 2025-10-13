import React, { createContext, useEffect, useState } from 'react';

export const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  const domain = process.env.NODE_ENV === 'production' 
    ? 'https://school-ec-shop.vercel.app' 
    : 'http://localhost:3000';

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(`${domain}/api/products`);
      const data = await response.json();
      // console.log(data);
      setProducts(data);
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <ProductContext.Provider value={{ products }}>
        {children}
      </ProductContext.Provider>
    </div>
  );
};

export default ProductProvider;
