
import React, { useEffect, useRef, useState } from 'react';
import { Excalidraw, exportToBlob } from '@excalidraw/excalidraw';
import type { 
  ExcalidrawImperativeAPI,
  ExcalidrawElement,
  NonDeletedExcalidrawElement
} from '@excalidraw/excalidraw/types/types';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  type: string;
  price: number;
  thumbnail: string;
}

interface DesignerCanvasProps {
  onElementSelect: (element: any) => void;
  onProductsChange: (products: any[]) => void;
}

const DesignerCanvas: React.FC<DesignerCanvasProps> = ({ 
  onElementSelect,
  onProductsChange
}) => {
  const excalidrawAPIRef = useRef<ExcalidrawImperativeAPI | null>(null);
  const [productElements, setProductElements] = useState<Map<string, Product>>(new Map());
  
  const handleChange = (elements: readonly ExcalidrawElement[]) => {
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
        roundness: null,
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
      };
      
      // Add the element to the canvas using the proper API method
      excalidrawAPIRef.current.updateScene({
        elements: [...elements, newElement as ExcalidrawElement]
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
  
  const exportToImage = async () => {
    if (!excalidrawAPIRef.current) return;
    
    try {
      const blob = await exportToBlob({
        elements: excalidrawAPIRef.current.getSceneElements(),
        appState: {
          exportBackground: true,
          viewBackgroundColor: '#ffffff',
          exportWithDarkMode: false,
        },
        files: excalidrawAPIRef.current.getFiles(),
      });
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `家装设计方案_${new Date().toISOString().slice(0, 10)}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('导出失败');
    }
  };
  
  const saveDesign = () => {
    if (!excalidrawAPIRef.current) return;
    
    try {
      const elements = excalidrawAPIRef.current.getSceneElements();
      const appState = excalidrawAPIRef.current.getAppState();
      const files = excalidrawAPIRef.current.getFiles();
      
      // Convert product elements map to array for serialization
      const productElementsArray = Array.from(productElements.entries());
      
      const data = {
        elements,
        appState,
        files,
        productElements: productElementsArray,
      };
      
      const json = JSON.stringify(data);
      localStorage.setItem('homeDesignProject', json);
      toast.success('设计已保存');
    } catch (error) {
      console.error('Save failed:', error);
      toast.error('保存失败');
    }
  };
  
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
            setProductElements(productElementsMap as Map<string, Product>);
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
  }, []);
  
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
    </div>
  );
};

export default DesignerCanvas;
