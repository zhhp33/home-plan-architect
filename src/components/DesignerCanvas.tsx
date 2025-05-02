
import React, { useEffect, useRef } from 'react';
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
  const excalidrawAPIRef = useRef<ExcalidrawImperativeAPI | null>(null);
  const { 
    productElements, 
    updateProductElements,
    addProductElement,
    bulkSetProductElements 
  } = useDesignerState();
  
  const { handleChange, handleDrop, handleDragOver } = useExcalidrawHandlers({
    excalidrawAPIRef,
    productElements,
    updateProductElements,
    addProductElement,
    onElementSelect,
    onProductsChange,
    bulkSetProductElements
  });
  
  // Load saved design when available
  useEffect(() => {
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
    
    // Use a ref to ensure this only runs once when API is available
    const timer = setTimeout(() => {
      if (excalidrawAPIRef.current) {
        loadSavedDesign();
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, []); // Empty dependency array to run only once
  
  // Separate handler for API initialization to avoid render loops
  const handleExcalidrawAPI = (api: ExcalidrawImperativeAPI) => {
    if (!excalidrawAPIRef.current) {
      excalidrawAPIRef.current = api;
    }
  };
  
  return (
    <div 
      className="w-full h-full relative bg-[#1c1c28]" 
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <Excalidraw
        excalidrawAPI={handleExcalidrawAPI}
        onChange={(elements: readonly ExcalidrawElement[]) => handleChange(elements)}
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
