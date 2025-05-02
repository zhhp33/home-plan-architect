
import { useState } from 'react';
import { Product } from '@/types/product';

export const useDesignerState = () => {
  const [productElements, setProductElements] = useState<Map<string, Product>>(new Map());
  
  // Create a properly typed function to update the product elements
  const updateProductElements = (updater: (prev: Map<string, Product>) => Map<string, Product>) => {
    setProductElements(updater);
  };
  
  // Create a function to add a product element with proper typing
  const addProductElement = (id: string, product: Product) => {
    setProductElements(prev => {
      const newMap = new Map(prev);
      newMap.set(id, product);
      return newMap;
    });
  };
  
  return {
    productElements,
    setProductElements,
    updateProductElements,
    addProductElement
  };
};
