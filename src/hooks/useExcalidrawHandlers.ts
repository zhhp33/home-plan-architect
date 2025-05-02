
import { MutableRefObject } from 'react';
import { toast } from 'sonner';
import { Product } from '@/types/product';
import { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';

// Use any for ExcalidrawElement to avoid type issues
type ExcalidrawElement = any;

interface ExcalidrawHandlersProps {
  excalidrawAPIRef: MutableRefObject<ExcalidrawImperativeAPI | null>;
  productElements: Map<string, Product>;
  updateProductElements: (updater: (prev: Map<string, Product>) => Map<string, Product>) => void;
  addProductElement: (id: string, product: Product) => void;
  onElementSelect: (element: any) => void;
  onProductsChange: (products: any[]) => void;
  bulkSetProductElements: (elements: [string, Product][]) => void;
  handleChange: (elements: readonly ExcalidrawElement[]) => void;
}

export const useExcalidrawHandlers = ({
  excalidrawAPIRef,
  productElements,
  addProductElement,
  handleChange
}: ExcalidrawHandlersProps) => {
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    try {
      const productData = JSON.parse(e.dataTransfer.getData('application/json')) as Product;
      const { clientX, clientY } = e;
      
      if (!excalidrawAPIRef.current) return;
      
      // Get canvas position
      const appState = excalidrawAPIRef.current.getAppState();
      const scrollX = appState.scrollX || 0;
      const scrollY = appState.scrollY || 0;
      const zoom = appState.zoom?.value || 1;
      
      // Convert screen coordinates to canvas coordinates
      const sceneX = (clientX - scrollX) / zoom;
      const sceneY = (clientY - scrollY) / zoom;
      
      // Let Excalidraw create the element with proper ID and properties
      const elements = excalidrawAPIRef.current.getSceneElements();
      
      // Generate a unique ID
      const id = Math.random().toString(36).substring(2, 10);
      
      // Create a properly formatted Excalidraw element
      const newElement: ExcalidrawElement = {
        id,
        type: "rectangle",
        x: sceneX,
        y: sceneY,
        width: 100,
        height: 100,
        strokeColor: "#000000",
        backgroundColor: "#f1f1f1",
        fillStyle: "solid",
        strokeWidth: 1,
        strokeStyle: "solid",
        roughness: 0,
        opacity: 100,
        groupIds: [],
        roundness: { type: 1 },
        seed: Math.floor(Math.random() * 1000),
        version: 1,
        versionNonce: Math.floor(Math.random() * 1000000),
        isDeleted: false,
        boundElements: null,
        updated: Date.now(),
        link: null,
        locked: false,
        text: productData.name,
        fontSize: 16,
        fontFamily: 1,
        textAlign: "center",
        verticalAlign: "middle",
        baseline: 18,
        containerId: null,
        originalText: productData.name,
        angle: 0,
      } as ExcalidrawElement;
      
      // Add the element to the canvas using the proper API method
      excalidrawAPIRef.current.updateScene({
        elements: [...elements, newElement]
      });
      
      // Store the product data associated with this element
      addProductElement(id, productData);
      
      toast.success(`已添加 ${productData.name}`);
      
      // Trigger change handler manually to update UI
      if (excalidrawAPIRef.current) {
        setTimeout(() => {
          handleChange(excalidrawAPIRef.current!.getSceneElements());
        }, 0);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return {
    handleDrop,
    handleDragOver
  };
};
