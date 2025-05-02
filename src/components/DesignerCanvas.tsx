
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';
import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';
import { toast } from 'sonner';
import { Product } from '@/types/product';
import { useDesignerState } from '@/hooks/useDesignerState';
import { useExcalidrawHandlers } from '@/hooks/useExcalidrawHandlers';
import { ExcalidrawActions } from './ExcalidrawActions';

// Import the types directly from the package
type ExcalidrawElement = any;

interface DesignerCanvasProps {
  onElementSelect: (element: any) => void;
  onProductsChange: (products: any[]) => void;
}

const DesignerCanvas: React.FC<DesignerCanvasProps> = ({ 
  onElementSelect,
  onProductsChange
}) => {
  // Use state to track if the API is ready to avoid re-initializing
  const [apiReady, setApiReady] = useState(false);
  const excalidrawAPIRef = useRef<ExcalidrawImperativeAPI | null>(null);
  const { 
    productElements, 
    updateProductElements,
    addProductElement,
    bulkSetProductElements 
  } = useDesignerState();
  
  const handleChange = useCallback((elements: readonly ExcalidrawElement[]) => {
    // Find the selected element
    const selectedElements = elements.filter(el => el.isSelected);
    if (selectedElements.length === 1) {
      const selectedElement = selectedElements[0];
      const productData = productElements.get(selectedElement.id);
      
      if (productData) {
        onElementSelect({
          ...selectedElement,
          productName: productData.name,
          productType: productData.type,
          price: productData.price,
          type: 'product'
        });
      } else {
        onElementSelect(selectedElement);
      }
    } else if (selectedElements.length === 0) {
      onElementSelect(null);
    }
    
    // Update products list for pricing
    const products: { 
      id: string; 
      name: string; 
      type: string; 
      price: number; 
      quantity: number; 
    }[] = [];
    
    // Create a map to count occurrences of each product
    const productCounts = new Map<string, number>();
    
    elements.forEach(el => {
      const productData = productElements.get(el.id);
      if (productData) {
        const key = `${productData.id}-${productData.name}`;
        const currentCount = productCounts.get(key) || 0;
        productCounts.set(key, currentCount + 1);
      }
    });
    
    // Convert to array for the pricing component
    productCounts.forEach((quantity, key) => {
      const [id, name] = key.split('-');
      const productData = Array.from(productElements.values())
        .find(p => p.id === id && p.name === name);
      
      if (productData) {
        products.push({
          id: productData.id,
          name: productData.name,
          type: productData.type,
          price: productData.price,
          quantity
        });
      }
    });
    
    onProductsChange(products);
  }, [productElements, onElementSelect, onProductsChange]);
  
  const { handleDrop, handleDragOver } = useExcalidrawHandlers({
    excalidrawAPIRef,
    productElements,
    updateProductElements,
    addProductElement,
    onElementSelect,
    onProductsChange,
    bulkSetProductElements,
    handleChange
  });
  
  // Memoized handler for API initialization to avoid re-renders
  const handleExcalidrawAPI = useCallback((api: ExcalidrawImperativeAPI) => {
    if (!excalidrawAPIRef.current) {
      excalidrawAPIRef.current = api;
      setApiReady(true);
    }
  }, []);
  
  // Load saved design when available
  useEffect(() => {
    if (!apiReady || !excalidrawAPIRef.current) return;
    
    const loadSavedDesign = async () => {
      const savedDesign = localStorage.getItem('homeDesignProject');
      if (savedDesign && excalidrawAPIRef.current) {
        try {
          const data = JSON.parse(savedDesign);
          excalidrawAPIRef.current.updateScene({
            elements: data.elements || [],
            appState: data.appState || {},
          });
          
          // Restore product elements using the new bulk setter
          if (data.productElements && Array.isArray(data.productElements)) {
            bulkSetProductElements(data.productElements);
          }
          
          toast.success('已加载保存的设计');
        } catch (error) {
          console.error('Failed to load saved design:', error);
        }
      }
    };
    
    // Only load once when API is ready
    loadSavedDesign();
    
    // No cleanup needed since this only runs once when apiReady becomes true
  }, [apiReady, bulkSetProductElements]);
  
  return (
    <div 
      className="w-full h-full relative bg-[#1c1c28]" 
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <Excalidraw
        excalidrawAPI={handleExcalidrawAPI}
        onChange={handleChange}
        theme="dark"
        name="家装设计方案"
        UIOptions={{
          canvasActions: {
            loadScene: true,
            saveToActiveFile: false,
            export: false,
            toggleTheme: false,
          },
        }}
      />
      
      <ExcalidrawActions excalidrawAPIRef={excalidrawAPIRef} productElements={productElements} />
    </div>
  );
};

export default DesignerCanvas;
