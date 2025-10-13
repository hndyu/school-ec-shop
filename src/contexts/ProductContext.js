import React, { createContext, useEffect, useState } from 'react';

export const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("http://localhost:3001/api/products");
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
