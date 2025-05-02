
import React from 'react';
import { MutableRefObject } from 'react';
import { exportToBlob } from '@excalidraw/excalidraw';
import { Product } from '@/types/product';
import { toast } from 'sonner';

interface ExcalidrawActionsProps {
  excalidrawAPIRef: MutableRefObject<any>;
  productElements: Map<string, Product>;
}

export const ExcalidrawActions: React.FC<ExcalidrawActionsProps> = ({ 
  excalidrawAPIRef,
  productElements
}) => {
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
  
  return null; // The component doesn't render anything, just provides actions
};
