
import React from 'react';
import { 
  Circle,
  Square,
  Type,
  Image,
  Move,
  ArrowUpDown,
  ArrowLeftRight,
  Palette,
  Minus,
  Plus,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PropertyPanelProps {
  selectedElement: any;
  onPropertyChange: (property: string, value: any) => void;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({ 
  selectedElement, 
  onPropertyChange 
}) => {
  const getElementIcon = () => {
    if (!selectedElement) return <Square className="h-4 w-4" />;

    switch (selectedElement.type) {
      case 'rectangle':
        return <Square className="h-4 w-4" />;
      case 'ellipse':
        return <Circle className="h-4 w-4" />;
      case 'text':
        return <Type className="h-4 w-4" />;
      case 'image':
        return <Image className="h-4 w-4" />;
      default:
        return <Square className="h-4 w-4" />;
    }
  };

  if (!selectedElement) {
    return (
      <div className="h-full flex flex-col bg-app-panel text-white border-l border-gray-700/30 p-4">
        <div className="text-center text-gray-400 mt-8">
          <p>请选择一个元素来查看属性</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-app-panel text-white border-l border-gray-700/30">
      <div className="p-3 border-b border-gray-700/30">
        <div className="flex items-center gap-2">
          {getElementIcon()}
          <h2 className="text-lg font-semibold">元素属性</h2>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="style">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800/30">
            <TabsTrigger value="style">样式</TabsTrigger>
            <TabsTrigger value="position">位置与大小</TabsTrigger>
          </TabsList>
          <TabsContent value="style" className="p-3 space-y-4">
            <div className="space-y-2">
              <Label className="text-sm">填充颜色</Label>
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-white border border-gray-500 cursor-pointer"></div>
                <div className="w-8 h-8 rounded-full bg-red-500 cursor-pointer"></div>
                <div className="w-8 h-8 rounded-full bg-blue-500 cursor-pointer"></div>
                <div className="w-8 h-8 rounded-full bg-green-500 cursor-pointer"></div>
                <div className="w-8 h-8 rounded-full bg-yellow-500 cursor-pointer"></div>
                <div className="w-8 h-8 rounded-full bg-purple-500 cursor-pointer"></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm">边框颜色</Label>
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-white border border-gray-500 cursor-pointer"></div>
                <div className="w-8 h-8 rounded-full bg-red-500 cursor-pointer"></div>
                <div className="w-8 h-8 rounded-full bg-blue-500 cursor-pointer"></div>
                <div className="w-8 h-8 rounded-full bg-green-500 cursor-pointer"></div>
                <div className="w-8 h-8 rounded-full bg-yellow-500 cursor-pointer"></div>
                <div className="w-8 h-8 rounded-full bg-purple-500 cursor-pointer"></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">边框宽度</Label>
                <div className="text-xs">{selectedElement.strokeWidth || 1}px</div>
              </div>
              <div className="flex items-center gap-2">
                <Minus className="h-4 w-4 text-gray-400" />
                <Slider 
                  value={[selectedElement.strokeWidth || 1]} 
                  min={1} 
                  max={10} 
                  step={1}
                  onValueChange={(value) => onPropertyChange('strokeWidth', value[0])}
                />
                <Plus className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">透明度</Label>
                <div className="text-xs">{selectedElement.opacity || 100}%</div>
              </div>
              <div className="flex items-center gap-2">
                <Minus className="h-4 w-4 text-gray-400" />
                <Slider 
                  value={[selectedElement.opacity || 100]} 
                  min={0} 
                  max={100} 
                  step={1}
                  onValueChange={(value) => onPropertyChange('opacity', value[0])}
                />
                <Plus className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="position" className="p-3 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs">X 位置</Label>
                <Input 
                  type="number" 
                  value={selectedElement.x || 0} 
                  onChange={(e) => onPropertyChange('x', parseFloat(e.target.value))}
                  className="bg-gray-800/40 border-gray-700/30"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Y 位置</Label>
                <Input 
                  type="number" 
                  value={selectedElement.y || 0} 
                  onChange={(e) => onPropertyChange('y', parseFloat(e.target.value))}
                  className="bg-gray-800/40 border-gray-700/30"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">宽度</Label>
                <Input 
                  type="number" 
                  value={selectedElement.width || 100} 
                  onChange={(e) => onPropertyChange('width', parseFloat(e.target.value))}
                  className="bg-gray-800/40 border-gray-700/30"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">高度</Label>
                <Input 
                  type="number" 
                  value={selectedElement.height || 100} 
                  onChange={(e) => onPropertyChange('height', parseFloat(e.target.value))}
                  className="bg-gray-800/40 border-gray-700/30"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">旋转角度</Label>
                <div className="text-xs">{selectedElement.angle || 0}°</div>
              </div>
              <div className="flex items-center gap-2">
                <Minus className="h-4 w-4 text-gray-400" />
                <Slider 
                  value={[selectedElement.angle || 0]} 
                  min={0} 
                  max={360} 
                  step={1}
                  onValueChange={(value) => onPropertyChange('angle', value[0])}
                />
                <Plus className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {selectedElement.type === 'product' && (
        <div className="p-3 border-t border-gray-700/30 bg-gray-800/30">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">产品名称</span>
              <span className="text-sm font-medium">{selectedElement.productName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">产品类型</span>
              <span className="text-sm">{selectedElement.productType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">价格</span>
              <span className="text-sm text-app-accent">¥{selectedElement.price?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyPanel;
