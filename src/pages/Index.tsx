
import React, { useState } from 'react';
import ProductLibrary from '@/components/ProductLibrary';
import PropertyPanel from '@/components/PropertyPanel';
import DesignerCanvas from '@/components/DesignerCanvas';
import Toolbar from '@/components/Toolbar';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  type: string;
  price: number;
  quantity: number;
}

const Index = () => {
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const { toast } = useToast();
  
  const handlePropertyChange = (property: string, value: any) => {
    if (!selectedElement) return;
    
    // This would typically update the canvas element, but in this demo
    // we just update our local state
    setSelectedElement({
      ...selectedElement,
      [property]: value
    });
    
    // In a real implementation, we would update the Excalidraw element
    // excalidrawRef.current.updateScene({
    //   elements: elements.map(el => 
    //     el.id === selectedElement.id 
    //       ? { ...el, [property]: value } 
    //       : el
    //   )
    // });
  };
  
  const handleProductDragStart = (product: any) => {
    // This is handled by the DesignerCanvas component
  };
  
  const handleSave = () => {
    // We would save the design here
    toast({
      title: "成功",
      description: "设计方案已保存",
    });
  };
  
  const handleExport = () => {
    // We would export the design here
    toast({
      title: "成功",
      description: "图片已导出",
    });
  };
  
  return (
    <div className="flex flex-col h-screen bg-app-background text-white">
      {/* Toolbar */}
      <Toolbar 
        onSave={handleSave} 
        onExport={handleExport}
        products={products}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Product Library */}
        <div className="w-64 h-full designer-panel">
          <ProductLibrary onDragStart={handleProductDragStart} />
        </div>
        
        {/* Main Canvas */}
        <div className="flex-1 h-full">
          <DesignerCanvas 
            onElementSelect={setSelectedElement} 
            onProductsChange={setProducts}
          />
        </div>
        
        {/* Right Sidebar - Property Panel */}
        <div className="w-72 h-full designer-panel">
          <PropertyPanel 
            selectedElement={selectedElement}
            onPropertyChange={handlePropertyChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
