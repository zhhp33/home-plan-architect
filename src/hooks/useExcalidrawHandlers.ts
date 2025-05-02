
import { MutableRefObject } from 'react';
import { toast } from 'sonner';
import { Product } from '@/types/product';

interface ExcalidrawHandlersProps {
  excalidrawAPIRef: MutableRefObject<any>;
  productElements: Map<string, Product>;
  setProductElements: (elements: Map<string, Product>) => void;
  onElementSelect: (element: any) => void;
  onProductsChange: (products: any[]) => void;
}

export const useExcalidrawHandlers = ({
  excalidrawAPIRef,
  productElements,
  setProductElements,
  onElementSelect,
  onProductsChange
}: ExcalidrawHandlersProps) => {
  const handleChange = (elements: readonly any[]) => {
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
  };
  
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
      
      // Use Excalidraw's own element creation methods instead of creating our own
      const id = Math.random().toString(36).substring(2, 10);
      
      // Create a properly formatted Excalidraw element
      const newElement: any = {
        id,
        type: "rectangle",
        x: sceneX,
        y: sceneY,
        width: 100,
        height: 100,
        backgroundColor: "#f1f1f1",
        strokeColor: "#000000",
        fillStyle: "solid",
        strokeWidth: 1,
        strokeStyle: "solid",
        roughness: 0,
        opacity: 100,
        groupIds: [],
        roundness: { type: 1 },
        boundElements: null,
        link: null,
        locked: false,
        angle: 0,
        text: productData.name,
        fontSize: 16,
        fontFamily: 1,
        textAlign: "center",
        verticalAlign: "middle",
        baseline: 18,
        containerId: null,
        isDeleted: false,
        version: 1,
        seed: Math.floor(Math.random() * 1000),
      };
      
      // Add the element to the canvas using the proper API method
      excalidrawAPIRef.current.updateScene({
        elements: [...elements, newElement]
      });
      
      // Store the product data associated with this element
      setProductElements(prev => {
        const newMap = new Map(prev);
        newMap.set(id, productData);
        return newMap;
      });
      
      toast.success(`已添加 ${productData.name}`);
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return {
    handleChange,
    handleDrop,
    handleDragOver
  };
};
