
import { useState } from 'react';
import { Product } from '@/types/product';

export const useDesignerState = () => {
  const [productElements, setProductElements] = useState<Map<string, Product>>(new Map());
  
  return {
    productElements,
    setProductElements
  };
};
