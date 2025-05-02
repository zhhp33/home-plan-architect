
import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Define product types
type ProductType = '家具' | '灯具' | '电器' | '卫浴' | '其他';

// Define product interface
interface Product {
  id: string;
  name: string;
  type: ProductType;
  price: number;
  thumbnail: string;
}

// Mock products data
const mockProducts: Product[] = [
  { id: '1', name: '三人沙发', type: '家具', price: 2999, thumbnail: 'placeholder.svg' },
  { id: '2', name: '单人沙发', type: '家具', price: 1599, thumbnail: 'placeholder.svg' },
  { id: '3', name: '餐桌', type: '家具', price: 1899, thumbnail: 'placeholder.svg' },
  { id: '4', name: '床', type: '家具', price: 3599, thumbnail: 'placeholder.svg' },
  { id: '5', name: '吊灯', type: '灯具', price: 799, thumbnail: 'placeholder.svg' },
  { id: '6', name: '台灯', type: '灯具', price: 399, thumbnail: 'placeholder.svg' },
  { id: '7', name: '壁灯', type: '灯具', price: 299, thumbnail: 'placeholder.svg' },
  { id: '8', name: '空调', type: '电器', price: 4999, thumbnail: 'placeholder.svg' },
  { id: '9', name: '冰箱', type: '电器', price: 3999, thumbnail: 'placeholder.svg' },
  { id: '10', name: '洗衣机', type: '电器', price: 2999, thumbnail: 'placeholder.svg' },
  { id: '11', name: '浴缸', type: '卫浴', price: 2499, thumbnail: 'placeholder.svg' },
  { id: '12', name: '马桶', type: '卫浴', price: 1299, thumbnail: 'placeholder.svg' },
  { id: '13', name: '洗手盆', type: '卫浴', price: 899, thumbnail: 'placeholder.svg' },
  { id: '14', name: '地毯', type: '其他', price: 599, thumbnail: 'placeholder.svg' },
  { id: '15', name: '窗帘', type: '其他', price: 799, thumbnail: 'placeholder.svg' },
];

interface ProductLibraryProps {
  onDragStart: (product: Product) => void;
}

const ProductLibrary: React.FC<ProductLibraryProps> = ({ onDragStart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | undefined>(undefined);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);
  
  useEffect(() => {
    let filtered = mockProducts;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply type filter
    if (selectedType && selectedType !== 'all') {
      filtered = filtered.filter(product => product.type === selectedType);
    }
    
    setFilteredProducts(filtered);
  }, [searchTerm, selectedType]);
  
  const handleDragStart = (e: React.DragEvent, product: Product) => {
    e.dataTransfer.setData('application/json', JSON.stringify(product));
    onDragStart(product);
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType(undefined);
  };
  
  const productTypes: ProductType[] = ['家具', '灯具', '电器', '卫浴', '其他'];
  
  return (
    <div className="flex flex-col h-full bg-app-panel text-white">
      <div className="p-3 border-b border-gray-700/30">
        <h2 className="text-lg font-semibold mb-3">产品库</h2>
        <div className="relative mb-3">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="搜索产品..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-gray-800/40 border-gray-700/30 text-white placeholder:text-gray-400"
          />
          {searchTerm && (
            <button 
              className="absolute right-2.5 top-2.5"
              onClick={() => setSearchTerm('')}
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>
        <div className="flex gap-2 items-center">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="bg-gray-800/40 border-gray-700/30 text-white">
              <SelectValue placeholder="产品类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部类型</SelectItem>
              {productTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={clearFilters}
            className="hover:bg-gray-700/40"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-1 gap-2">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="product-item"
              draggable
              onDragStart={(e) => handleDragStart(e, product)}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-700/50 rounded flex items-center justify-center">
                  <img 
                    src={product.thumbnail} 
                    alt={product.name} 
                    className="w-8 h-8 opacity-70"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-sm">{product.name}</h3>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs bg-gray-700/40 px-2 py-0.5 rounded">{product.type}</span>
                    <span className="text-xs text-app-accent">¥{product.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductLibrary;
