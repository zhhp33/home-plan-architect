
import React, { useState } from 'react';
import { 
  Save,
  Download,
  FileText,
  Share,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  type: string;
  price: number;
  quantity: number;
}

interface ToolbarProps {
  onSave: () => void;
  onExport: () => void;
  products: Product[];
}

const Toolbar: React.FC<ToolbarProps> = ({ onSave, onExport, products }) => {
  const [quotationOpen, setQuotationOpen] = useState(false);
  
  const totalPrice = products.reduce((sum, product) => {
    return sum + (product.price * product.quantity);
  }, 0);
  
  const handleSave = () => {
    onSave();
    toast.success('设计方案已保存');
  };
  
  const handleExport = () => {
    onExport();
    toast.success('图片已导出');
  };
  
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-app-panel text-white border-b border-gray-700/30">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-bold">家装设计方案</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          className="toolbar-button"
          onClick={() => setQuotationOpen(true)}
        >
          <FileText className="h-4 w-4 mr-2" />
          报价
        </Button>
        
        <Button
          className="toolbar-button"
          onClick={handleExport}
        >
          <Download className="h-4 w-4 mr-2" />
          导出
        </Button>
        
        <Button
          className="toolbar-button"
          onClick={handleSave}
        >
          <Save className="h-4 w-4 mr-2" />
          保存
        </Button>
        
        <Button
          className="toolbar-button"
        >
          <Share className="h-4 w-4 mr-2" />
          分享
        </Button>
      </div>
      
      <Dialog open={quotationOpen} onOpenChange={setQuotationOpen}>
        <DialogContent className="bg-app-panel text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>方案报价</DialogTitle>
            <DialogDescription className="text-gray-400">
              以下是当前方案中包含的所有产品报价
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="border border-gray-700/50 rounded-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="py-2 px-4 text-left text-sm font-medium">产品</th>
                    <th className="py-2 px-4 text-left text-sm font-medium">类型</th>
                    <th className="py-2 px-4 text-right text-sm font-medium">单价</th>
                    <th className="py-2 px-4 text-center text-sm font-medium">数量</th>
                    <th className="py-2 px-4 text-right text-sm font-medium">小计</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={product.id} className={index % 2 === 0 ? 'bg-gray-800/20' : ''}>
                      <td className="py-2 px-4 text-sm">{product.name}</td>
                      <td className="py-2 px-4 text-sm">{product.type}</td>
                      <td className="py-2 px-4 text-sm text-right">¥{product.price.toLocaleString()}</td>
                      <td className="py-2 px-4 text-sm text-center">{product.quantity}</td>
                      <td className="py-2 px-4 text-sm text-right">
                        ¥{(product.price * product.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-end text-lg">
              <span className="font-medium mr-4">总计：</span>
              <span className="text-app-accent font-bold">¥{totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Toolbar;
