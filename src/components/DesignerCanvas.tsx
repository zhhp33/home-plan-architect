
import React, { useEffect, useRef } from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';
import type { 
  ExcalidrawImperativeAPI,
  ExcalidrawElement
} from '@excalidraw/excalidraw/types/types';
import { toast } from 'sonner';
import { Product } from '@/types/product';
import { useDesignerState } from '@/hooks/useDesignerState';
import { useExcalidrawHandlers } from '@/hooks/useExcalidrawHandlers';
import { ExcalidrawActions } from './ExcalidrawActions';

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
    setProductElements, 
    updateProductElements,
    addProductElement 
  } = useDesignerState();
  
  const { handleChange, handleDrop, handleDragOver } = useExcalidrawHandlers({
    excalidrawAPIRef,
    productElements,
    setProductElements,
    updateProductElements,
    addProductElement,
    onElementSelect,
    onProductsChange
  });
  
  // Load saved design when available
  useEffect(() => {
    const loadSavedDesign = async () => {
      const savedDesign = localStorage.getItem('homeDesignProject');
      if (savedDesign && excalidrawAPIRef.current) {
        try {
          const data = JSON.parse(savedDesign);
          excalidrawAPIRef.current.updateScene({
            elements: data.elements,
            appState: data.appState,
          });
          
          // Restore product elements
          if (data.productElements && Array.isArray(data.productElements)) {
            const productElementsMap = new Map(data.productElements);
            setProductElements(productElementsMap);
          }
          
          toast.success('已加载保存的设计');
        } catch (error) {
          console.error('Failed to load saved design:', error);
        }
      }
    };
    
    // Small delay to ensure excalidrawRef is initialized
    const timer = setTimeout(loadSavedDesign, 500);
    return () => clearTimeout(timer);
  }, [setProductElements]);
  
  return (
    <div 
      className="w-full h-full relative bg-[#1c1c28]" 
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <Excalidraw
        excalidrawAPI={(api) => {
          excalidrawAPIRef.current = api;
        }}
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
