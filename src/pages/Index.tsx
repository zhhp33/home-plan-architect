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
  const {
    toast
  } = useToast();
  const handlePropertyChange = (property: string, value: any) => {
    if (!selectedElement) return;
    setSelectedElement({
      ...selectedElement,
      [property]: value
    });
  };
  const handleProductDragStart = (product: any) => {
    // This is handled by the DesignerCanvas component
  };
  const handleSave = () => {
    // We would save the design here
    toast({
      title: "成功",
      description: "设计方案已保存"
    });
  };
  const handleExport = () => {
    // We would export the design here
    toast({
      title: "成功",
      description: "图片已导出"
    });
  };
  return <div className="flex flex-col h-screen bg-[#121420] text-white">
      {/* Toolbar */}
      <Toolbar onSave={handleSave} onExport={handleExport} products={products} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Product Library */}
        <div className="w-72 h-full border-r border-gray-700/30 bg-[#1a1c2a]">
          
          <div className="overflow-y-auto h-[calc(100%-3.5rem)]">
            <ProductLibrary onDragStart={handleProductDragStart} />
          </div>
        </div>
        
        {/* Main Canvas */}
        <div className="flex-1 h-full bg-[#1c1c28] relative">
          <DesignerCanvas onElementSelect={setSelectedElement} onProductsChange={setProducts} />
        </div>
        
        {/* Right Sidebar - Property Panel */}
        
      </div>
    </div>;
};
export default Index;