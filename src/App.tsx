import React, { useState, useMemo, useCallback } from 'react';
import { useStorage } from './hooks/useStorage';
import { Product, Sale, Purchase, BudgetProduct, AppConfig, BudgetProfile, Client } from './types';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { 
  Package, 
  ShoppingCart, 
  BookOpen, 
  Calculator, 
  Settings,
  Plus,
  Minus,
  Eye,
  Search,
  Filter,
  ArrowUpDown,
  Archive,
  Trash2,
  Save,
  Download,
  Upload,
  CheckCircle2,
  Circle,
  DollarSign,
  User,
  CreditCard,
  Wallet,
  BarChart3,
  PieChart as PieChartIcon,
  LayoutDashboard,
  Edit3,
  Barcode,
  Palette,
  ChevronRight,
  ChevronLeft,
  MoreVertical,
  ChevronUp,
  ChevronDown,
  Share2,
  Copy,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Banknote,
  Smartphone,
  Users,
  AlertTriangle,
  Camera,
  QrCode,
  Layers,
  Box,
  Tag
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

const DEFAULT_CONFIG: AppConfig = {
  dollarRate: 1,
  profitMargin: 30,
  themeColor: '#3b82f6',
  pageOrder: ['Resumen', 'Inventario', 'Catálogo', 'Presupuesto', 'Contabilidad', 'Configuración']
};

export default function App() {
  const [products, setProducts] = useStorage<Product[]>('products', []);
  const [sales, setSales] = useStorage<Sale[]>('sales', []);
  const [purchases, setPurchases] = useStorage<Purchase[]>('purchases', []);
  const [budgets, setBudgets] = useStorage<BudgetProfile[]>('budgets', []);
  const [activeBudgetId, setActiveBudgetId] = useStorage<string | null>('activeBudgetId', null);
  const [clients, setClients] = useStorage<Client[]>('clients', []);
  const [config, setConfig] = useStorage<AppConfig>('config', DEFAULT_CONFIG);
  const [activePage, setActivePage] = useState('Resumen');

  // Helper to format numbers
  const formatNum = useCallback((num: number) => {
    return new Intl.NumberFormat('es-VE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  }, []);

  const getProductPrice = useCallback((product: Product) => {
    if (product.isFixedDollar && product.manualPriceUSD) {
      return product.manualPriceUSD * config.dollarRate;
    }
    return product.manualPrice || 0;
  }, [config.dollarRate]);

  const deleteProduct = useCallback((id: string) => {
    if (confirm('¿Eliminar permanentemente este producto? Esta acción no se puede deshacer.')) {
      setProducts(products.filter((p: Product) => p.id !== id));
      toast.error('Producto eliminado');
    }
  }, [products, setProducts]);

  // Theme style
  const themeStyle = {
    '--primary': config.themeColor,
  } as React.CSSProperties;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans" style={themeStyle}>
      <Toaster position="top-center" />
      
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b px-4 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          {activePage !== 'Resumen' && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-primary hover:bg-primary/10 rounded-full" 
              onClick={() => setActivePage('Resumen')}
            >
              <LayoutDashboard size={18} />
            </Button>
          )}
          <h1 className="text-lg font-bold tracking-tight text-slate-900">
            {activePage}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-[10px] h-6 border-slate-200">
            $1 = {formatNum(config.dollarRate)}
          </Badge>
        </div>
      </header>

      <main className="p-4 max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {activePage === 'Resumen' && (
            <DashboardPage 
              sales={sales} 
              purchases={purchases} 
              clients={clients}
              formatNum={formatNum}
              config={config}
            />
          )}
          {activePage === 'Inventario' && (
            <InventoryPage 
              products={products} 
              setProducts={setProducts} 
              config={config} 
              setConfig={setConfig}
              formatNum={formatNum}
              setActivePage={setActivePage}
              getProductPrice={getProductPrice}
              deleteProduct={deleteProduct}
            />
          )}
          {activePage === 'Presupuesto' && (
            <BudgetPage 
              budgets={budgets} 
              setBudgets={setBudgets} 
              activeBudgetId={activeBudgetId}
              setActiveBudgetId={setActiveBudgetId}
              products={products}
              config={config}
              formatNum={formatNum}
            />
          )}
          {activePage === 'Catálogo' && (
            <CatalogPage 
              products={products} 
              setProducts={setProducts}
              sales={sales}
              setSales={setSales}
              clients={clients}
              setClients={setClients}
              config={config}
              formatNum={formatNum}
              getProductPrice={getProductPrice}
            />
          )}
          {activePage === 'Contabilidad' && (
            <AccountingPage 
              sales={sales} 
              setSales={setSales}
              purchases={purchases}
              setPurchases={setPurchases}
              clients={clients}
              setClients={setClients}
              config={config}
              formatNum={formatNum}
            />
          )}
          {activePage === 'Configuración' && (
            <ConfigPage 
              config={config} 
              setConfig={setConfig} 
              products={products}
              setProducts={setProducts}
            />
          )}
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center h-16 px-2 z-20">
        {config.pageOrder.map((page) => {
          const isActive = activePage === page;
          const Icon = {
            'Resumen': LayoutDashboard,
            'Inventario': Package,
            'Presupuesto': ShoppingCart,
            'Catálogo': BookOpen,
            'Contabilidad': Calculator,
            'Configuración': Settings
          }[page] || Package;

          return (
            <button
              key={page}
              onClick={() => setActivePage(page)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'text-primary' : 'text-slate-400'
              }`}
            >
              <Icon size={20} className={isActive ? 'animate-in zoom-in-90' : ''} />
              <span className="text-[10px] mt-1 font-medium">{page}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

// --- Page Components ---

interface DashboardPageProps {
  sales: Sale[];
  purchases: Purchase[];
  clients: Client[];
  formatNum: (num: number) => string;
  config: AppConfig;
}

function DashboardPage({ sales, purchases, clients, formatNum, config }: DashboardPageProps) {
  const totals = useMemo(() => {
    const efectivo = sales.filter((s: Sale) => s.paymentMethod === 'efectivo').reduce((acc: number, s: Sale) => acc + (s.price * s.quantity), 0);
    const pagomovil = sales.filter((s: Sale) => s.paymentMethod === 'pagomovil').reduce((acc: number, s: Sale) => acc + (s.price * s.quantity), 0);
    const fiado = clients.reduce((acc: number, c: Client) => acc + c.debt, 0);
    const totalVentas = efectivo + pagomovil;
    const totalCompras = purchases.reduce((acc: number, p: Purchase) => acc + p.amount, 0);
    
    return { efectivo, pagomovil, fiado, totalVentas, totalCompras };
  }, [sales, purchases]);

  const pieData = [
    { name: 'Efectivo', value: totals.efectivo, color: '#10b981' },
    { name: 'Banco', value: totals.pagomovil, color: '#3b82f6' },
    { name: 'Fiado', value: totals.fiado, color: '#f59e0b' },
  ].filter(d => d.value > 0);

  const last7Days = useMemo(() => {
    const days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return days.map(day => {
      const daySales = sales.filter((s: Sale) => s.date.startsWith(day)).reduce((acc: number, s: Sale) => acc + (s.price * s.quantity), 0);
      return { name: day.split('-')[2], sales: daySales };
    });
  }, [sales]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 gap-4">
        <Card className="bg-white border-none shadow-sm overflow-hidden rounded-3xl">
          <div className="h-2 bg-primary w-full" />
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mb-1">Balance Total</p>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Bs. {formatNum(totals.totalVentas - totals.totalCompras)}</h2>
              </div>
              <div className="p-4 bg-primary/10 rounded-3xl text-primary shadow-inner">
                <TrendingUp size={28} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-xl text-green-600">
                  <ArrowUpRight size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Ingresos</p>
                  <p className="text-lg font-black text-green-600">Bs. {formatNum(totals.totalVentas)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-xl text-red-600">
                  <ArrowDownRight size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Egresos</p>
                  <p className="text-lg font-black text-red-600">Bs. {formatNum(totals.totalCompras)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden group hover:bg-green-50 transition-colors">
            <CardContent className="p-3 text-center">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-sm group-hover:scale-110 transition-transform">
                <Banknote size={20} />
              </div>
              <p className="text-[8px] text-slate-400 uppercase font-black tracking-tighter">Efectivo</p>
              <p className="text-xs font-black text-slate-800">Bs. {formatNum(totals.efectivo)}</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden group hover:bg-blue-50 transition-colors">
            <CardContent className="p-3 text-center">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-sm group-hover:scale-110 transition-transform">
                <Smartphone size={20} />
              </div>
              <p className="text-[8px] text-slate-400 uppercase font-black tracking-tighter">Pago Móvil</p>
              <p className="text-xs font-black text-slate-800">Bs. {formatNum(totals.pagomovil)}</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden group hover:bg-amber-50 transition-colors">
            <CardContent className="p-3 text-center">
              <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-sm group-hover:scale-110 transition-transform">
                <Users size={20} />
              </div>
              <p className="text-[8px] text-slate-400 uppercase font-black tracking-tighter">Fiados</p>
              <p className="text-xs font-black text-slate-800">Bs. {formatNum(totals.fiado)}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <PieChartIcon size={16} className="text-primary" />
              Distribución de Fondos
            </CardTitle>
          </CardHeader>
          <CardContent className="h-48">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `Bs. ${formatNum(value)}`}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                Sin datos suficientes
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <BarChart3 size={16} className="text-primary" />
              Ventas Últimos 7 Días
            </CardTitle>
          </CardHeader>
          <CardContent className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={last7Days}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                <YAxis hide />
                <Tooltip 
                  formatter={(value: number) => `Bs. ${formatNum(value)}`}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="sales" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

// --- Page Components ---

interface InventoryPageProps {
  products: Product[];
  setProducts: (products: Product[]) => void;
  config: AppConfig;
  setConfig: (config: AppConfig) => void;
  formatNum: (num: number) => string;
  setActivePage: (page: string) => void;
  getProductPrice: (product: Product) => number;
  deleteProduct: (id: string) => void;
}

function InventoryPage({ products, setProducts, config, setConfig, formatNum, setActivePage, getProductPrice, deleteProduct }: InventoryPageProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('A-Z');
  const [isAddOpen, setIsAddOpen] = useState(false);

  const updateStock = (productId: string, delta: number) => {
    setProducts(products.map((p: Product) => 
      p.id === productId ? { ...p, stock: Math.max(0, p.stock + delta) } : p
    ));
  };

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    let result = products.filter((p: Product) => 
      !p.archived && (
        p.name.toLowerCase().includes(search.toLowerCase()) || 
        (p.code && p.code.toLowerCase().includes(search.toLowerCase()))
      )
    );

    switch (filter) {
      case 'A-Z': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'Z-A': result.sort((a, b) => b.name.localeCompare(a.name)); break;
      case 'Mayor Precio': result.sort((a, b) => (b.manualPrice || 0) - (a.manualPrice || 0)); break;
      case 'Menor Precio': result.sort((a, b) => (a.manualPrice || 0) - (b.manualPrice || 0)); break;
      case 'Con Stock': result = result.filter(p => p.stock > 0); break;
      case 'Poco Stock': result = result.filter(p => p.stock > 0 && p.stock <= 5); break;
      case 'Nada de Stock': result = result.filter(p => p.stock === 0); break;
    }
    return result;
  }, [products, search, filter]);

  const addProduct = (newProduct: Product) => {
    if (editingProduct) {
      setProducts(products.map((p: Product) => p.id === editingProduct.id ? newProduct : p));
      setEditingProduct(null);
    } else {
      setProducts([...products, newProduct]);
    }
    setIsAddOpen(false);
    toast.success(editingProduct ? 'Producto actualizado' : 'Producto agregado');
  };

  const archiveProduct = (id: string) => {
    setProducts(products.map((p: Product) => p.id === id ? { ...p, archived: true } : p));
    toast.info('Producto archivado');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            placeholder="Buscar producto..." 
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[140px]">
            <Filter size={16} className="mr-2" />
            <SelectValue placeholder="Filtro" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A-Z">A-Z</SelectItem>
            <SelectItem value="Z-A">Z-A</SelectItem>
            <SelectItem value="Mayor Precio">Mayor Precio</SelectItem>
            <SelectItem value="Menor Precio">Menor Precio</SelectItem>
            <SelectItem value="Con Stock">Con Stock</SelectItem>
            <SelectItem value="Poco Stock">Poco Stock</SelectItem>
            <SelectItem value="Nada de Stock">Nada de Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-3">
        {filteredProducts.map((product: Product) => (
          <Card 
            key={product.id} 
            className="overflow-hidden border-none shadow-md bg-white rounded-3xl group transition-all hover:shadow-lg cursor-pointer active:scale-[0.99]"
            onClick={() => setSelectedProductForDetail(product)}
          >
            <div className="p-3 space-y-3">
              {/* Top Section */}
              <div className="flex gap-3">
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-20 bg-slate-100 rounded-2xl overflow-hidden border border-slate-100 shadow-inner">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Package size={32} />
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center border border-slate-50">
                    <div className="w-5 h-5 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                      <Package size={12} />
                    </div>
                  </div>
                </div>

                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="min-w-0">
                      <h3 className="text-lg font-black text-slate-900 leading-tight truncate">{product.name}</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{product.unitsPerPack || 1} UDS</p>
                    </div>
                    <Button 
                      size="icon" 
                      variant="ghost"
                      className="w-8 h-8 rounded-full text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                      onClick={(e) => { e.stopPropagation(); deleteProduct(product.id); }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-slate-50 rounded-xl p-0.5 border border-slate-100 shadow-sm">
                      <button 
                        onClick={(e) => { e.stopPropagation(); updateStock(product.id, -1); }}
                        className="w-7 h-7 rounded-lg bg-white text-red-500 flex items-center justify-center hover:bg-red-50 transition-colors active:scale-90 border border-slate-100"
                      >
                        <Minus size={14} strokeWidth={3} />
                      </button>
                      <span className="w-8 text-center font-black text-slate-800 text-sm">{product.stock}</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); updateStock(product.id, 1); }}
                        className="w-7 h-7 rounded-lg bg-white text-green-500 flex items-center justify-center hover:bg-green-50 transition-colors active:scale-90 border border-slate-100"
                      >
                        <Plus size={14} strokeWidth={3} />
                      </button>
                    </div>
                    {product.stock === 0 && (
                      <Badge className="bg-red-50 text-red-600 border-none px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider">
                        Agotado
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Prices Section */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-50">
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Precio Mayor</p>
                  <p className="text-sm font-black text-slate-900 leading-none">Bs.S {formatNum(product.wholesalePrice / (product.unitsPerPack || 1))}</p>
                  <p className="text-[10px] font-bold text-green-600">
                    ${formatNum((product.wholesalePrice / (product.unitsPerPack || 1)) / config.dollarRate)}
                  </p>
                </div>
                <div className="text-right bg-green-50 p-2 rounded-xl border border-green-100 shadow-sm">
                  <p className="text-[8px] font-black text-green-600 uppercase tracking-widest">Precio Venta</p>
                  <p className="text-base font-black text-green-700 leading-none">Bs.S {formatNum(getProductPrice(product))}</p>
                  <p className="text-[11px] font-black text-green-800">
                    ${formatNum(product.isFixedDollar ? (product.manualPriceUSD || 0) : ((product.manualPrice || 0) / config.dollarRate))}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Product Detail Dialog */}
      <Dialog open={!!selectedProductForDetail} onOpenChange={(open) => !open && setSelectedProductForDetail(null)}>
        <DialogContent className="max-w-[95vw] w-full max-h-[90vh] rounded-3xl p-0 overflow-hidden flex flex-col">
          {selectedProductForDetail && (
            <div className="flex flex-col h-full overflow-y-auto">
              <div className="h-56 bg-slate-100 relative flex-shrink-0">
                {selectedProductForDetail.image ? (
                  <img src={selectedProductForDetail.image} alt={selectedProductForDetail.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Package size={64} />
                  </div>
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="rounded-full shadow-lg bg-white/90 backdrop-blur-sm"
                    onClick={() => {
                      setEditingProduct(selectedProductForDetail);
                      setSelectedProductForDetail(null);
                      setIsAddOpen(true);
                    }}
                  >
                    <Edit3 size={18} />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="rounded-full shadow-lg"
                    onClick={() => {
                      deleteProduct(selectedProductForDetail.id);
                      setSelectedProductForDetail(null);
                    }}
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
              <div className="p-6 space-y-6 pb-10">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-black text-slate-900 leading-tight break-words">{selectedProductForDetail.name}</h2>
                  </div>
                  <div className="flex flex-col items-end ml-2">
                    <Badge variant={selectedProductForDetail.stock > 5 ? 'secondary' : 'destructive'} className="px-3 py-1 rounded-full text-xs font-black shadow-sm whitespace-nowrap">
                      {selectedProductForDetail.stock} en stock
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-2 text-slate-400">
                      <Layers size={14} />
                      <p className="text-[10px] uppercase font-black tracking-widest">Stock Actual</p>
                    </div>
                    <p className="text-2xl font-black text-slate-900">{selectedProductForDetail.stock} <span className="text-xs font-bold text-slate-400">unid.</span></p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-2 text-slate-400">
                      <Box size={14} />
                      <p className="text-[10px] uppercase font-black tracking-widest">Unid. x Bulto</p>
                    </div>
                    <p className="text-2xl font-black text-slate-900">{selectedProductForDetail.unitsPerPack} <span className="text-xs font-bold text-slate-400">unid.</span></p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] uppercase text-slate-400 font-black tracking-widest ml-1">Costos y Precios</p>
                  <div className="grid gap-3">
                    <div className="flex justify-between items-center p-4 bg-slate-50 rounded-3xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-xl shadow-sm text-slate-400">
                          <DollarSign size={16} />
                        </div>
                        <span className="text-sm font-bold text-slate-600">Precio Bulto</span>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-slate-900">Bs. {formatNum(selectedProductForDetail.wholesalePrice || 0)} <span className="text-xs font-bold text-slate-400 ml-1">(${formatNum((selectedProductForDetail.wholesalePrice || 0) / config.dollarRate)})</span></p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-slate-50 rounded-3xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-xl shadow-sm text-slate-400">
                          <Tag size={16} />
                        </div>
                        <span className="text-sm font-bold text-slate-600">Costo Unitario</span>
                      </div>
                      <p className="text-lg font-black text-slate-900">Bs. {formatNum((selectedProductForDetail.wholesalePrice || 0) / (selectedProductForDetail.unitsPerPack || 1))} <span className="text-xs font-bold text-slate-400 ml-1">(${formatNum(((selectedProductForDetail.wholesalePrice || 0) / (selectedProductForDetail.unitsPerPack || 1)) / config.dollarRate)})</span></p>
                    </div>

                    <div className="p-4 bg-green-50 rounded-3xl border border-green-100 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-xl shadow-sm text-green-600">
                          <CheckCircle2 size={16} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Sugerido (+{config.profitMargin}%)</p>
                        </div>
                      </div>
                      <p className="text-lg font-black text-green-700">Bs. {formatNum(((selectedProductForDetail.wholesalePrice || 0) / (selectedProductForDetail.unitsPerPack || 1)) * (1 + config.profitMargin / 100))} <span className="text-xs font-bold text-green-600/60 ml-1">(${formatNum((((selectedProductForDetail.wholesalePrice || 0) / (selectedProductForDetail.unitsPerPack || 1)) * (1 + config.profitMargin / 100)) / config.dollarRate)})</span></p>
                    </div>

                    <div className="flex justify-between items-center p-6 bg-primary rounded-[2.5rem] shadow-xl shadow-primary/20 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-3">
                        {selectedProductForDetail.isFixedDollar && (
                          <Badge variant="outline" className="text-[8px] font-black uppercase bg-white/20 border-white/30 text-white backdrop-blur-sm">Fijado en $</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-2xl text-white backdrop-blur-sm">
                          <TrendingUp size={24} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">Precio Final</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-black text-white">Bs. {formatNum(getProductPrice(selectedProductForDetail))}</p>
                        <p className="text-sm font-bold text-white/60">
                          ${formatNum(selectedProductForDetail.isFixedDollar ? (selectedProductForDetail.manualPriceUSD || 0) : ((selectedProductForDetail.manualPrice || 0) / config.dollarRate))}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    className="w-full h-14 rounded-2xl font-black border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-95 transition-transform"
                    onClick={() => {
                      archiveProduct(selectedProductForDetail.id);
                      setSelectedProductForDetail(null);
                    }}
                  >
                    <Archive size={20} className="mr-2" /> Archivar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isAddOpen} onOpenChange={(open) => {
        setIsAddOpen(open);
        if (!open) setEditingProduct(null);
      }}>
        <DialogTrigger render={<Button className="fixed bottom-20 right-4 rounded-full w-14 h-14 shadow-lg" size="icon" />}>
          <Plus size={28} />
        </DialogTrigger>
        <DialogContent className="max-w-[90vw] rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
          </DialogHeader>
          <ProductForm 
            onSave={addProduct} 
            config={config} 
            formatNum={formatNum} 
            initialData={editingProduct}
          />
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

interface ProductFormProps {
  onSave: (product: Product) => void;
  config: AppConfig;
  formatNum: (num: number) => string;
  initialData?: Product | null;
}

function ProductForm({ onSave, config, formatNum, initialData }: ProductFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [units, setUnits] = useState(initialData?.unitsPerPack?.toString() || '1');
  const [stock, setStock] = useState(initialData?.stock?.toString() || '0');
  const [wholesalePrice, setWholesalePrice] = useState(initialData?.wholesalePrice?.toString() || '0');
  const [wholesalePriceUSD, setWholesalePriceUSD] = useState((initialData?.wholesalePrice / config.dollarRate || 0).toString());
  const [isFixedDollar, setIsFixedDollar] = useState(initialData?.isFixedDollar || false);
  const [manualPrice, setManualPrice] = useState(initialData?.manualPrice?.toString() || '0');
  const [manualPriceUSD, setManualPriceUSD] = useState((initialData?.manualPrice / config.dollarRate || 0).toString());
  const [image, setImage] = useState<string | null>(initialData?.image || null);

  const unitPrice = useMemo(() => {
    const w = parseFloat(wholesalePrice) || 0;
    const u = parseFloat(units) || 1;
    return w / u;
  }, [wholesalePrice, units]);

  const suggestedPrice = useMemo(() => {
    return unitPrice * (1 + config.profitMargin / 100);
  }, [unitPrice, config.profitMargin]);

  const handleWholesaleBsChange = (val: string) => {
    setWholesalePrice(val);
    const num = parseFloat(val) || 0;
    setWholesalePriceUSD((num / config.dollarRate).toFixed(2));
  };

  const handleWholesaleUSDChange = (val: string) => {
    setWholesalePriceUSD(val);
    const num = parseFloat(val) || 0;
    setWholesalePrice((num * config.dollarRate).toFixed(2));
  };

  const handleManualBsChange = (val: string) => {
    setManualPrice(val);
    const num = parseFloat(val) || 0;
    setManualPriceUSD((num / config.dollarRate).toFixed(2));
  };

  const handleManualUSDChange = (val: string) => {
    setManualPriceUSD(val);
    const num = parseFloat(val) || 0;
    setManualPrice((num * config.dollarRate).toFixed(2));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!name) return toast.error('Nombre requerido');
    onSave({
      id: initialData?.id || crypto.randomUUID(),
      name,
      unitsPerPack: parseInt(units) || 1,
      stock: parseInt(stock) || 0,
      wholesalePrice: parseFloat(wholesalePrice) || 0,
      wholesalePriceUSD: parseFloat(wholesalePriceUSD) || 0,
      isFixedDollar,
      manualPrice: parseFloat(manualPrice) || suggestedPrice,
      manualPriceUSD: parseFloat(manualPriceUSD) || (suggestedPrice / config.dollarRate),
      archived: false,
      image
    });
  };

  return (
    <div className="space-y-6 py-4">
      <div className="flex flex-col items-center gap-4">
        <div 
          className="w-32 h-32 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center bg-slate-50 cursor-pointer overflow-hidden relative group hover:border-primary transition-colors"
          onClick={() => document.getElementById('img-input')?.click()}
        >
          {image ? (
            <img src={image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <>
              <div className="p-3 bg-white rounded-2xl shadow-sm mb-2 text-slate-400 group-hover:text-primary transition-colors">
                <Camera size={24} />
              </div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Subir Foto</span>
            </>
          )}
          <input id="img-input" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Información Básica</Label>
          <div className="grid gap-3">
            <div className="relative">
              <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre del producto" className="pl-10 h-12 rounded-2xl border-none bg-slate-100 focus:bg-white transition-all" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Stock</Label>
            <div className="relative">
              <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="pl-10 h-12 rounded-2xl border-none bg-slate-100 focus:bg-white transition-all" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Unidades x Bulto</Label>
            <div className="relative">
              <Box className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input type="number" value={units} onChange={(e) => setUnits(e.target.value)} className="pl-10 h-12 rounded-2xl border-none bg-slate-100 focus:bg-white transition-all" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Costos y Precios</Label>
          <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input type="number" step="0.01" value={wholesalePrice} onChange={(e) => handleWholesaleBsChange(e.target.value)} placeholder="Bulto (Bs)" className="pl-10 h-12 rounded-2xl border-none bg-slate-100 focus:bg-white transition-all" />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <Input type="number" step="0.01" value={wholesalePriceUSD} onChange={(e) => handleWholesaleUSDChange(e.target.value)} placeholder="Bulto ($)" className="pl-8 h-12 rounded-2xl border-none bg-slate-100 focus:bg-white transition-all" />
              </div>
            </div>
            
            <div className="bg-primary/5 p-4 rounded-3xl space-y-2 border border-primary/10">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Sugerido (+{config.profitMargin}%)</span>
                <span className="text-sm font-black text-green-600">Bs. {formatNum(suggestedPrice)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Costo Unitario</span>
                <span className="text-sm font-black text-slate-600">Bs. {formatNum(unitPrice)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <Label className="text-xs font-black text-primary uppercase tracking-widest">Precio Final de Venta</Label>
                <div className="flex items-center gap-2 bg-slate-100 px-2 py-1 rounded-full">
                  <span className="text-[9px] font-black text-slate-500 uppercase">Fijar en $</span>
                  <Switch checked={isFixedDollar} onCheckedChange={setIsFixedDollar} className="scale-75" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" size={18} />
                  <Input type="number" step="0.01" value={manualPrice} onChange={(e) => handleManualBsChange(e.target.value)} placeholder={formatNum(suggestedPrice)} className="pl-10 h-14 rounded-2xl border-2 border-primary/20 focus:border-primary bg-white text-lg font-black text-primary" />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-bold">$</span>
                  <Input type="number" step="0.01" value={manualPriceUSD} onChange={(e) => handleManualUSDChange(e.target.value)} placeholder={formatNum(suggestedPrice / config.dollarRate)} className="pl-8 h-14 rounded-2xl border-2 border-primary/20 focus:border-primary bg-white text-lg font-black text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Button className="w-full h-14 rounded-2xl text-base font-black shadow-lg shadow-primary/20 active:scale-95 transition-transform" onClick={handleSubmit}>
        {initialData ? 'Actualizar Producto' : 'Crear Producto'}
      </Button>
    </div>
  );
}

interface BudgetPageProps {
  budgets: BudgetProfile[];
  setBudgets: (budgets: BudgetProfile[]) => void;
  activeBudgetId: string | null;
  setActiveBudgetId: (id: string | null) => void;
  products: Product[];
  config: AppConfig;
  formatNum: (num: number) => string;
}

function BudgetPage({ budgets, setBudgets, activeBudgetId, setActiveBudgetId, products, config, formatNum }: BudgetPageProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isNewProfileOpen, setIsNewProfileOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('0');
  const [newItemQty, setNewItemQty] = useState('1');

  const activeProfile = budgets.find((b: BudgetProfile) => b.id === activeBudgetId);
  const budget = activeProfile?.items || [];

  const totalBudget = budget.reduce((acc: number, item: BudgetProduct) => acc + (item.wholesalePrice * item.quantity), 0);
  const totalSpent = budget.reduce((acc: number, item: BudgetProduct) => acc + (item.spent || 0), 0);

  const createProfile = () => {
    if (!newProfileName) return;
    const newProfile: BudgetProfile = {
      id: crypto.randomUUID(),
      name: newProfileName,
      items: [],
      date: new Date().toISOString()
    };
    setBudgets([...budgets, newProfile]);
    setActiveBudgetId(newProfile.id);
    setNewProfileName('');
    setIsNewProfileOpen(false);
    toast.success('Perfil de presupuesto creado');
  };

  const deleteProfile = (id: string) => {
    if (confirm('¿Eliminar este perfil de presupuesto?')) {
      const newBudgets = budgets.filter((b: BudgetProfile) => b.id !== id);
      setBudgets(newBudgets);
      if (activeBudgetId === id) setActiveBudgetId(newBudgets[0]?.id || null);
      toast.error('Perfil eliminado');
    }
  };

  const addItem = () => {
    if (!newItemName || !activeBudgetId) return;
    const item: BudgetProduct = {
      id: crypto.randomUUID(),
      name: newItemName,
      wholesalePrice: parseFloat(newItemPrice) || 0,
      quantity: parseInt(newItemQty) || 1,
      bought: false
    };
    
    setBudgets(budgets.map((b: BudgetProfile) => 
      b.id === activeBudgetId ? { ...b, items: [...b.items, item] } : b
    ));

    setNewItemName('');
    setNewItemPrice('0');
    setNewItemQty('1');
    setIsAddOpen(false);
  };

  const toggleBought = (id: string) => {
    setBudgets(budgets.map((b: BudgetProfile) => {
      if (b.id === activeBudgetId) {
        return {
          ...b,
          items: b.items.map((item: BudgetProduct) => {
            if (item.id === id) {
              const newBought = !item.bought;
              return { 
                ...item, 
                bought: newBought,
                spent: newBought ? item.wholesalePrice * item.quantity : 0
              };
            }
            return item;
          })
        };
      }
      return b;
    }));
  };

  const clearBudget = () => {
    if (confirm('¿Vaciar este presupuesto?')) {
      setBudgets(budgets.map((b: BudgetProfile) => 
        b.id === activeBudgetId ? { ...b, items: [] } : b
      ));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 10 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -10 }}
      className="space-y-4"
    >
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {budgets.map((b: BudgetProfile) => (
          <Badge 
            key={b.id} 
            variant={activeBudgetId === b.id ? 'default' : 'outline'}
            className="cursor-pointer whitespace-nowrap px-3 py-1 text-xs rounded-full"
            onClick={() => setActiveBudgetId(b.id)}
          >
            {b.name}
            {activeBudgetId === b.id && (
              <button className="ml-2 hover:text-red-200" onClick={(e) => { e.stopPropagation(); deleteProfile(b.id); }}>
                <Trash2 size={10} />
              </button>
            )}
          </Badge>
        ))}
        <Button variant="outline" size="sm" className="rounded-full h-6 px-2 text-[10px]" onClick={() => setIsNewProfileOpen(true)}>
          <Plus size={12} className="mr-1" /> Nuevo Perfil
        </Button>
      </div>

      {!activeBudgetId ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
          <ShoppingCart size={48} className="mx-auto mb-4 text-slate-200" />
          <p className="text-slate-500 font-medium">Crea un perfil para empezar</p>
          <Button className="mt-4" onClick={() => setIsNewProfileOpen(true)}>Crear Perfil</Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-primary text-white border-none shadow-sm rounded-2xl">
              <CardContent className="p-4">
                <p className="text-[10px] opacity-80 uppercase font-black tracking-widest">Estimado</p>
                <p className="text-xl font-black">Bs. {formatNum(totalBudget)}</p>
                <p className="text-xs font-bold opacity-60">${formatNum(totalBudget / config.dollarRate)}</p>
              </CardContent>
            </Card>
            <Card className="bg-green-600 text-white border-none shadow-sm rounded-2xl">
              <CardContent className="p-4">
                <p className="text-[10px] opacity-80 uppercase font-black tracking-widest">Gastado</p>
                <p className="text-xl font-black">Bs. {formatNum(totalSpent)}</p>
                <p className="text-xs font-bold opacity-60">${formatNum(totalSpent / config.dollarRate)}</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-between items-center">
            <h2 className="font-bold text-slate-700 flex items-center gap-2">
              <ShoppingCart size={16} className="text-primary" />
              {activeProfile?.name}
            </h2>
            <Button variant="ghost" size="sm" onClick={clearBudget} className="text-destructive h-8 px-2 text-xs">
              <Trash2 size={14} className="mr-1" /> Vaciar
            </Button>
          </div>

          <div className="space-y-2">
            {budget.map((item: BudgetProduct) => (
              <Card key={item.id} className={`border-none shadow-sm transition-opacity ${item.bought ? 'opacity-60 bg-slate-50' : 'bg-white'}`}>
                <CardContent className="p-3 flex items-center gap-3">
                  <button 
                    onClick={() => toggleBought(item.id)}
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                      item.bought ? 'bg-green-600 text-white' : 'border-2 border-slate-200 text-transparent'
                    }`}
                  >
                    <CheckCircle2 size={16} />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`font-black text-sm truncate ${item.bought ? 'line-through text-slate-400' : 'text-slate-700'}`}>{item.name}</p>
                    <p className="text-[10px] text-slate-500 font-bold">
                      {item.quantity} x Bs. {formatNum(item.wholesalePrice)} (${formatNum(item.wholesalePrice / config.dollarRate)})
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-sm text-slate-900">Bs. {formatNum(item.wholesalePrice * item.quantity)}</p>
                    <p className="text-[10px] font-bold text-slate-400">${formatNum((item.wholesalePrice * item.quantity) / config.dollarRate)}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
            {budget.length === 0 && (
              <div className="text-center py-10 text-slate-400 bg-white rounded-xl border border-dashed">
                <p className="text-xs">No hay productos en este presupuesto</p>
              </div>
            )}
          </div>

          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger render={<Button className="fixed bottom-20 right-4 rounded-full w-14 h-14 shadow-lg" size="icon" />}>
              <Plus size={28} />
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] rounded-2xl">
              <DialogHeader>
                <DialogTitle>Añadir al Presupuesto</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label>Producto</Label>
                  <Input value={newItemName} onChange={(e) => setNewItemName(e.target.value)} placeholder="Nombre del producto" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Precio Bulto (Bs)</Label>
                    <Input type="number" step="0.01" value={newItemPrice} onChange={(e) => setNewItemPrice(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Cantidad</Label>
                    <Input type="number" value={newItemQty} onChange={(e) => setNewItemQty(e.target.value)} />
                  </div>
                </div>
                <Button className="w-full" onClick={addItem}>Añadir</Button>
                
                <Separator />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">O elegir del inventario</p>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-1">
                    {products.filter((p: Product) => !p.archived).map((p: Product) => (
                      <button 
                        key={p.id}
                        className="w-full text-left p-2 hover:bg-slate-100 rounded text-sm flex justify-between items-center group transition-colors"
                        onClick={() => {
                          setNewItemName(p.name);
                          setNewItemPrice(p.wholesalePrice.toString());
                        }}
                      >
                        <span className="group-hover:text-primary transition-colors">{p.name}</span>
                        <span className="text-[10px] text-slate-400">Bs. {formatNum(p.wholesalePrice)}</span>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}

      <Dialog open={isNewProfileOpen} onOpenChange={setIsNewProfileOpen}>
        <DialogContent className="max-w-[90vw] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Nuevo Perfil de Presupuesto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nombre del Perfil</Label>
              <Input 
                value={newProfileName} 
                onChange={(e) => setNewProfileName(e.target.value)} 
                placeholder="Ej: Compra Semanal, Evento..." 
              />
            </div>
            <Button className="w-full" onClick={createProfile}>Crear Perfil</Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

interface CatalogPageProps {
  products: Product[];
  setProducts: (products: Product[]) => void;
  sales: Sale[];
  setSales: (sales: Sale[]) => void;
  clients: Client[];
  setClients: (clients: Client[]) => void;
  config: AppConfig;
  formatNum: (num: number) => string;
  getProductPrice: (product: Product) => number;
}

function CatalogPage({ products, setProducts, sales, setSales, clients, setClients, config, formatNum, getProductPrice }: CatalogPageProps) {
  const [isSaleOpen, setIsSaleOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [saleQty, setSaleQty] = useState('1');
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'pagomovil' | 'fiado'>('efectivo');
  const [reference, setReference] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [newClientName, setNewClientName] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('A-Z');

  const filteredProducts = useMemo(() => {
    let result = products.filter((p: Product) => 
      !p.archived && (
        p.name.toLowerCase().includes(search.toLowerCase()) || 
        (p.code && p.code.toLowerCase().includes(search.toLowerCase()))
      )
    );

    switch (filter) {
      case 'A-Z': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'Z-A': result.sort((a, b) => b.name.localeCompare(a.name)); break;
      case 'Mayor Precio': result.sort((a, b) => (b.manualPrice || 0) - (a.manualPrice || 0)); break;
      case 'Menor Precio': result.sort((a, b) => (a.manualPrice || 0) - (b.manualPrice || 0)); break;
      case 'Con Stock': result = result.filter(p => p.stock > 0); break;
      case 'Poco Stock': result = result.filter(p => p.stock > 0 && p.stock <= 5); break;
      case 'Nada de Stock': result = result.filter(p => p.stock === 0); break;
    }
    return result;
  }, [products, search, filter]);

  const registerSale = () => {
    if (!selectedProduct) return;
    const qty = parseInt(saleQty) || 1;
    if (qty > selectedProduct.stock) return toast.error('Stock insuficiente');

    let clientId = selectedClientId;
    let clientName = '';

    if (paymentMethod === 'fiado') {
      if (clientId === 'new') {
        if (!newClientName) return toast.error('Nombre del cliente requerido');
        const newClient: Client = {
          id: crypto.randomUUID(),
          name: newClientName,
          debt: 0
        };
        setClients([...clients, newClient]);
        clientId = newClient.id;
        clientName = newClient.name;
      } else if (clientId) {
        const client = clients.find((c: Client) => c.id === clientId);
        clientName = client?.name || '';
      } else {
        return toast.error('Seleccione un cliente para fiado');
      }
    }

    const sale: Sale = {
      id: crypto.randomUUID(),
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      quantity: qty,
      price: selectedProduct.manualPrice || 0,
      paymentMethod,
      reference: paymentMethod === 'pagomovil' ? reference : undefined,
      clientId: paymentMethod === 'fiado' ? clientId : undefined,
      clientName: paymentMethod === 'fiado' ? clientName : undefined,
      date: new Date().toISOString()
    };

    if (paymentMethod === 'fiado') {
      setClients(clients.map((c: Client) => 
        c.id === clientId ? { 
          ...c, 
          debt: c.debt + (sale.price * sale.quantity),
          pendingSales: [...(c.pendingSales || []), sale]
        } : c
      ));
    } else {
      setSales([sale, ...sales]);
    }
    
    setProducts(products.map((p: Product) => 
      p.id === selectedProduct.id ? { ...p, stock: p.stock - qty } : p
    ));

    setIsSaleOpen(false);
    setSelectedProduct(null);
    setSaleQty('1');
    setReference('');
    setSelectedClientId('');
    setNewClientName('');
    toast.success('Venta registrada');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-4"
    >
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            placeholder="Buscar en catálogo..." 
            className="pl-10 h-10 rounded-xl border-none shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[120px] h-10 rounded-xl border-none shadow-sm">
            <Filter size={16} className="mr-2" />
            <SelectValue placeholder="Filtro" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A-Z">A-Z</SelectItem>
            <SelectItem value="Z-A">Z-A</SelectItem>
            <SelectItem value="Mayor Precio">Mayor Precio</SelectItem>
            <SelectItem value="Menor Precio">Menor Precio</SelectItem>
            <SelectItem value="Con Stock">Con Stock</SelectItem>
            <SelectItem value="Poco Stock">Poco Stock</SelectItem>
            <SelectItem value="Nada de Stock">Nada de Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {filteredProducts.map((product: Product) => (
          <Card key={product.id} className="overflow-hidden flex flex-col border-none shadow-sm bg-white group hover:shadow-md transition-all duration-300">
            <div className="p-2">
              <div className="aspect-square bg-slate-50 rounded-xl overflow-hidden relative group-hover:scale-[1.02] transition-transform duration-300">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-200">
                    <Package size={40} />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge variant={product.stock > 0 ? 'secondary' : 'destructive'} className="text-[9px] px-1.5 py-0 h-4 min-w-0 shadow-sm">
                    {product.stock}
                  </Badge>
                </div>
              </div>
            </div>
            <CardContent className="px-3 pb-3 pt-0 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm leading-tight mb-1 text-slate-800 line-clamp-2">{product.name}</h3>
                <p className="text-[10px] text-slate-400 font-medium">Ref: ${formatNum((product.manualPrice || 0) / config.dollarRate)}</p>
              </div>
              <div className="mt-2 flex flex-col gap-2">
                <p className="text-primary font-black text-base">Bs. {formatNum(getProductPrice(product))}</p>
                <Button size="sm" className="w-full h-9 text-xs rounded-xl font-bold shadow-sm active:scale-95 transition-transform" onClick={() => {
                  setSelectedProduct(product);
                  setIsSaleOpen(true);
                }}>
                  Vender
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isSaleOpen} onOpenChange={setIsSaleOpen}>
        <DialogContent className="max-w-[90vw] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Registrar Venta</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border">
                <div className="w-12 h-12 bg-slate-200 rounded overflow-hidden">
                  {selectedProduct.image && <img src={selectedProduct.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />}
                </div>
                <div>
                  <p className="font-bold text-sm">{selectedProduct.name}</p>
                  <p className="text-xs text-primary font-bold">Bs. {formatNum(getProductPrice(selectedProduct))}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cantidad</Label>
                  <Input type="number" value={saleQty} onChange={(e) => setSaleQty(e.target.value)} max={selectedProduct.stock} />
                </div>
                <div className="space-y-2">
                  <Label>Método de Pago</Label>
                  <Select value={paymentMethod} onValueChange={(v: 'efectivo' | 'pagomovil' | 'fiado') => setPaymentMethod(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="efectivo">Efectivo</SelectItem>
                      <SelectItem value="pagomovil">Pago Móvil</SelectItem>
                      <SelectItem value="fiado">Fiado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {paymentMethod === 'pagomovil' && (
                <div className="space-y-2">
                  <Label>Referencia</Label>
                  <Input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Últimos 4 dígitos" />
                </div>
              )}

              {paymentMethod === 'fiado' && (
                <div className="space-y-2">
                  <Label>Cliente</Label>
                  <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((c: Client) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                      <SelectItem value="new">+ Nuevo Cliente</SelectItem>
                    </SelectContent>
                  </Select>
                  {selectedClientId === 'new' && (
                    <Input 
                      value={newClientName} 
                      onChange={(e) => setNewClientName(e.target.value)} 
                      placeholder="Nombre del nuevo cliente" 
                      className="mt-2"
                    />
                  )}
                </div>
              )}

              <div className="bg-primary/10 p-3 rounded-lg flex justify-between items-center">
                <span className="text-sm font-medium">Total a cobrar:</span>
                <span className="text-xl font-bold text-primary">Bs. {formatNum(getProductPrice(selectedProduct) * (parseInt(saleQty) || 1))}</span>
              </div>

              <Button className="w-full" onClick={registerSale}>Confirmar Venta</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

interface AccountingPageProps {
  sales: Sale[];
  setSales: (sales: Sale[]) => void;
  purchases: Purchase[];
  setPurchases: (purchases: Purchase[]) => void;
  clients: Client[];
  setClients: (clients: Client[]) => void;
  config: AppConfig;
  formatNum: (num: number) => string;
}

function AccountingPage({ sales, setSales, purchases, setPurchases, clients, setClients, config, formatNum }: AccountingPageProps) {
  const [activeTab, setActiveTab] = useState('ventas');
  const [isAddPurchaseOpen, setIsAddPurchaseOpen] = useState(false);
  const [purchaseDesc, setPurchaseDesc] = useState('');
  const [purchaseAmount, setPurchaseAmount] = useState('0');
  
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');

  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);

  const [selectedClientForDetail, setSelectedClientForDetail] = useState<Client | null>(null);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);
  const [editDate, setEditDate] = useState('');
  const [editAmount, setEditAmount] = useState('0');
  const [editQty, setEditQty] = useState('1');
  const [editPaymentMethod, setEditPaymentMethod] = useState<'efectivo' | 'pagomovil' | 'fiado'>('efectivo');

  const totalSales = sales.reduce((acc: number, s: Sale) => acc + (s.price * s.quantity), 0);
  const totalPurchases = purchases.reduce((acc: number, p: Purchase) => acc + p.amount, 0);
  const totalFiado = clients.reduce((acc: number, c: Client) => acc + c.debt, 0);

  const [isPayDebtOpen, setIsPayDebtOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('0');

  const payDebt = () => {
    const amount = parseFloat(paymentAmount) || 0;
    if (amount <= 0 || !selectedClientId) return;

    const client = clients.find((c: Client) => c.id === selectedClientId);
    if (!client) return;

    const paymentEntry: Sale = {
      id: crypto.randomUUID(),
      productId: 'PAYMENT',
      productName: `Abono: ${client.name}`,
      quantity: 1,
      price: -amount,
      paymentMethod: 'efectivo',
      clientId: client.id,
      clientName: client.name,
      date: new Date().toISOString()
    };

    setSales([paymentEntry, ...sales]);
    setClients(clients.map((c: Client) => 
      c.id === selectedClientId ? { ...c, debt: c.debt - amount } : c
    ));

    setIsPayDebtOpen(false);
    setPaymentAmount('0');
    setSelectedClientId('');
    toast.success('Pago registrado');
  };

  const payPendingItem = (client: Client, sale: Sale) => {
    setSales([sale, ...sales]);
    const updatedClients = clients.map((c: Client) => 
      c.id === client.id ? { 
        ...c, 
        debt: Math.max(0, c.debt - (sale.price * sale.quantity)),
        pendingSales: (c.pendingSales || []).filter(s => s.id !== sale.id)
      } : c
    );
    setClients(updatedClients);
    
    // Update selected client for detail if open
    const updatedClient = updatedClients.find(c => c.id === client.id);
    if (updatedClient) setSelectedClientForDetail(updatedClient);
    
    toast.success('Venta registrada');
  };

  const addPurchase = useCallback(() => {
    if (!purchaseDesc || !purchaseAmount) return;
    const purchase: Purchase = {
      id: crypto.randomUUID(),
      description: purchaseDesc,
      amount: parseFloat(purchaseAmount) || 0,
      date: new Date().toISOString()
    };
    setPurchases([purchase, ...purchases]);
    setPurchaseDesc('');
    setPurchaseAmount('0');
    setIsAddPurchaseOpen(false);
    toast.success('Compra registrada');
  }, [purchaseDesc, purchaseAmount, purchases, setPurchases]);

  const addClient = useCallback(() => {
    if (!clientName) return toast.error('Nombre requerido');
    const client: Client = {
      id: crypto.randomUUID(),
      name: clientName,
      phone: clientPhone,
      address: clientAddress,
      debt: 0
    };
    setClients([...clients, client]);
    setClientName('');
    setClientPhone('');
    setClientAddress('');
    setIsAddClientOpen(false);
    toast.success('Cliente registrado');
  }, [clientName, clientPhone, clientAddress, clients, setClients]);

  const deleteSale = (id: string) => {
    if (confirm('¿Eliminar esta venta?')) {
      const sale = sales.find((s: Sale) => s.id === id);
      if (sale && sale.paymentMethod === 'fiado' && sale.clientId) {
        setClients(clients.map((c: Client) => 
          c.id === sale.clientId ? { ...c, debt: c.debt - (sale.price * sale.quantity) } : c
        ));
      }
      setSales(sales.filter((s: Sale) => s.id !== id));
    }
  };

  const deleteClient = (id: string) => {
    if (confirm('¿Eliminar este cliente? Se perderá el registro de su deuda.')) {
      setClients(clients.filter((c: Client) => c.id !== id));
      toast.error('Cliente eliminado');
    }
  };

  const updateSale = () => {
    if (!editingSale) return;
    const qty = parseInt(editQty) || 1;
    const price = editingSale.price;
    
    let updatedClients = [...clients];
    if (editingSale.paymentMethod === 'fiado' && editingSale.clientId) {
      updatedClients = updatedClients.map((c: Client) => 
        c.id === editingSale.clientId ? { ...c, debt: c.debt - (editingSale.price * editingSale.quantity) } : c
      );
    }
    
    if (editPaymentMethod === 'fiado' && editingSale.clientId) {
      updatedClients = updatedClients.map((c: Client) => 
        c.id === editingSale.clientId ? { ...c, debt: c.debt + (price * qty) } : c
      );
    }
    
    setClients(updatedClients);
    setSales(sales.map((s: Sale) => 
      s.id === editingSale.id ? { 
        ...s, 
        quantity: qty, 
        date: new Date(editDate + 'T12:00:00').toISOString(), 
        paymentMethod: editPaymentMethod 
      } : s
    ));
    
    setEditingSale(null);
    toast.success('Venta actualizada');
  };

  const updatePurchase = () => {
    if (!editingPurchase) return;
    setPurchases(purchases.map((p: Purchase) => 
      p.id === editingPurchase.id ? { 
        ...p, 
        amount: parseFloat(editAmount) || 0, 
        date: new Date(editDate + 'T12:00:00').toISOString() 
      } : p
    ));
    setEditingPurchase(null);
    toast.success('Compra actualizada');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      <div className="grid grid-cols-3 gap-2">
        <Card className="bg-green-50 border-green-100 cursor-pointer group hover:bg-green-100 transition-colors rounded-2xl" onClick={() => setActiveTab('ventas')}>
          <CardContent className="p-3 text-center">
            <div className="w-8 h-8 bg-green-200 text-green-700 rounded-xl flex items-center justify-center mx-auto mb-1 group-hover:scale-110 transition-transform">
              <TrendingUp size={16} />
            </div>
            <p className="text-[8px] uppercase font-black text-green-600 tracking-tighter">Ventas</p>
            <p className="text-xs font-black text-green-800">Bs. {formatNum(totalSales)}</p>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-100 cursor-pointer group hover:bg-red-100 transition-colors rounded-2xl" onClick={() => setActiveTab('compras')}>
          <CardContent className="p-3 text-center">
            <div className="w-8 h-8 bg-red-200 text-red-700 rounded-xl flex items-center justify-center mx-auto mb-1 group-hover:scale-110 transition-transform">
              <TrendingDown size={16} />
            </div>
            <p className="text-[8px] uppercase font-black text-red-600 tracking-tighter">Compras</p>
            <p className="text-xs font-black text-red-800">Bs. {formatNum(totalPurchases)}</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-100 cursor-pointer group hover:bg-amber-100 transition-colors rounded-2xl" onClick={() => setActiveTab('clientes')}>
          <CardContent className="p-3 text-center">
            <div className="w-8 h-8 bg-amber-200 text-amber-700 rounded-xl flex items-center justify-center mx-auto mb-1 group-hover:scale-110 transition-transform">
              <Users size={16} />
            </div>
            <p className="text-[8px] uppercase font-black text-amber-600 tracking-tighter">Fiados</p>
            <p className="text-xs font-black text-amber-800">Bs. {formatNum(totalFiado)}</p>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isPayDebtOpen} onOpenChange={setIsPayDebtOpen}>
        <DialogContent className="max-w-[90vw] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Cobrar Fiado</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Cliente</Label>
              <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.filter((c: Client) => c.debt > 0).map((c: Client) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} (Debe: Bs. {formatNum(c.debt)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Monto del Pago (Bs)</Label>
              <Input type="number" step="0.01" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} />
            </div>
            <Button className="w-full" onClick={payDebt}>Registrar Ingreso</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ventas">Ventas</TabsTrigger>
          <TabsTrigger value="compras">Compras</TabsTrigger>
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="ventas" className="mt-4 space-y-2">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ventas Completadas</p>
            {sales.map((sale: Sale) => (
              <Card key={sale.id} className="bg-green-50 border-green-100">
                <CardContent className="p-3 flex justify-between items-center">
                  <div className="flex items-center gap-3 flex-1" onClick={() => {
                    setEditingSale(sale);
                    setEditDate(sale.date.split('T')[0]);
                    setEditQty(sale.quantity.toString());
                    setEditPaymentMethod(sale.paymentMethod);
                  }}>
                    <div className="p-2 bg-white rounded-full text-green-600 shadow-sm">
                      {sale.paymentMethod === 'efectivo' && <Wallet size={16} />}
                      {sale.paymentMethod === 'pagomovil' && <CreditCard size={16} />}
                      {sale.paymentMethod === 'fiado' && <User size={16} />}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-green-900">{sale.productName}</p>
                      <p className="text-[10px] text-green-600/70">
                        {sale.quantity} unid. | {new Date(sale.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <p className="font-bold text-sm text-green-900">Bs. {formatNum(sale.price * sale.quantity)}</p>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-green-300 hover:text-destructive" onClick={() => deleteSale(sale.id)}>
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {sales.length === 0 && <p className="text-center py-10 text-slate-400">No hay ventas registradas</p>}
          </div>

          <Separator className="my-4" />

          <div className="space-y-2">
            <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest ml-1">Fiados Pendientes</p>
            {clients.flatMap(c => (c.pendingSales || []).map(s => ({ ...s, client: c }))).map((item: Sale & { client: Client }) => (
              <Card key={item.id} className="bg-amber-50 border-amber-100">
                <CardContent className="p-3 flex justify-between items-center">
                  <div className="flex items-center gap-3 flex-1" onClick={() => setSelectedClientForDetail(item.client)}>
                    <div className="p-2 bg-white rounded-full text-amber-600 shadow-sm">
                      <User size={16} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-amber-900">{item.productName}</p>
                      <p className="text-[10px] text-amber-600/70">
                        {item.quantity} unid. | {item.client.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-amber-900">Bs. {formatNum(item.price * item.quantity)}</p>
                    <p className="text-[9px] font-black text-amber-600 uppercase">Pendiente</p>
                  </div>
                </CardContent>
              </Card>
            ))}
            {clients.every(c => !c.pendingSales || c.pendingSales.length === 0) && (
              <p className="text-center py-6 text-slate-400 text-xs">No hay fiados pendientes</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="compras" className="mt-4 space-y-2">
          {purchases.map((purchase: Purchase) => (
            <Card key={purchase.id} className="bg-red-50 border-red-100">
              <CardContent className="p-3 flex justify-between items-center">
                <div className="flex-1" onClick={() => {
                  setEditingPurchase(purchase);
                  setEditDate(purchase.date.split('T')[0]);
                  setEditAmount(purchase.amount.toString());
                }}>
                  <p className="font-bold text-sm text-red-900">{purchase.description}</p>
                  <p className="text-[10px] text-red-600/70">{new Date(purchase.date).toLocaleDateString()}</p>
                </div>
                <p className="font-bold text-sm text-red-600">Bs. {formatNum(purchase.amount)}</p>
              </CardContent>
            </Card>
          ))}
          {purchases.length === 0 && <p className="text-center py-10 text-slate-400">No hay compras registradas</p>}
        </TabsContent>

        <TabsContent value="clientes" className="mt-4 space-y-2">
          <div className="grid gap-2">
            {clients.map((client: Client) => (
              <Card key={client.id} className="overflow-hidden border-none shadow-sm bg-white">
                <CardContent className="p-3 flex justify-between items-center">
                  <div className="flex items-center gap-3 flex-1" onClick={() => setSelectedClientForDetail(client)}>
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{client.name}</p>
                      {client.phone && <p className="text-[10px] text-slate-500">{client.phone}</p>}
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <p className={`font-bold text-sm ${client.debt > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                      Deuda: Bs. {formatNum(client.debt)}
                    </p>
                    <div className="flex gap-1">
                      {(client.debt > 0 || (client.pendingSales && client.pendingSales.length > 0)) && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-amber-600 hover:bg-amber-50"
                          onClick={() => setSelectedClientForDetail(client)}
                        >
                          <ChevronRight size={14} />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-slate-300 hover:text-destructive"
                        onClick={() => deleteClient(client.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {clients.length === 0 && <p className="text-center py-10 text-slate-400">No hay clientes registrados</p>}
          </div>
        </TabsContent>
      </Tabs>

      {/* Client Detail Dialog */}
      <Dialog open={!!selectedClientForDetail} onOpenChange={(open) => !open && setSelectedClientForDetail(null)}>
        <DialogContent className="max-w-[95vw] rounded-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Perfil de Deudor: {selectedClientForDetail?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
              <p className="text-xs font-black text-amber-600 uppercase tracking-widest mb-1">Deuda Total</p>
              <p className="text-2xl font-black text-amber-700">Bs. {formatNum(selectedClientForDetail?.debt || 0)}</p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Productos Pendientes</p>
              {selectedClientForDetail?.pendingSales && selectedClientForDetail.pendingSales.length > 0 ? (
                <div className="space-y-2">
                  {selectedClientForDetail.pendingSales.map((sale) => (
                    <Card key={sale.id} className="bg-white border-slate-100 shadow-none">
                      <CardContent className="p-3 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-sm">{sale.productName}</p>
                          <p className="text-[10px] text-slate-500">
                            {sale.quantity} unid. x Bs. {formatNum(sale.price)}
                          </p>
                          <p className="text-[10px] text-slate-400">{new Date(sale.date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                          <p className="font-bold text-sm">Bs. {formatNum(sale.price * sale.quantity)}</p>
                          <Button 
                            size="sm" 
                            className="h-8 text-[10px] font-bold rounded-lg bg-green-600 hover:bg-green-700"
                            onClick={() => payPendingItem(selectedClientForDetail, sale)}
                          >
                            Marcar Pago
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center py-6 text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed">No hay productos pendientes</p>
              )}
            </div>

            <div className="pt-4 flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1 h-12 rounded-xl text-xs font-bold"
                onClick={() => {
                  setSelectedClientId(selectedClientForDetail!.id);
                  setPaymentAmount(selectedClientForDetail!.debt.toString());
                  setIsPayDebtOpen(true);
                  setSelectedClientForDetail(null);
                }}
              >
                <DollarSign size={14} className="mr-2" /> Abono General
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Sale Dialog */}
      <Dialog open={!!editingSale} onOpenChange={(open) => !open && setEditingSale(null)}>
        <DialogContent className="max-w-[90vw] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Editar Venta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Fecha</Label>
              <Input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Cantidad</Label>
              <Input type="number" value={editQty} onChange={(e) => setEditQty(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Método de Pago</Label>
              <Select value={editPaymentMethod} onValueChange={(v: 'efectivo' | 'pagomovil' | 'fiado') => setEditPaymentMethod(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="efectivo">Efectivo</SelectItem>
                  <SelectItem value="pagomovil">Pago Móvil</SelectItem>
                  <SelectItem value="fiado">Fiado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={updateSale}>Guardar Cambios</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Purchase Dialog */}
      <Dialog open={!!editingPurchase} onOpenChange={(open) => !open && setEditingPurchase(null)}>
        <DialogContent className="max-w-[90vw] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Editar Compra</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Fecha</Label>
              <Input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Monto (Bs)</Label>
              <Input type="number" step="0.01" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} />
            </div>
            <Button className="w-full" onClick={updatePurchase}>Guardar Cambios</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Action Button */}
      <Dialog open={isQuickActionOpen} onOpenChange={setIsQuickActionOpen}>
        <DialogTrigger render={<Button className="fixed bottom-20 right-4 rounded-full w-14 h-14 shadow-lg" size="icon" />}>
          <Plus size={28} />
        </DialogTrigger>
        <DialogContent className="max-w-[90vw] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Nueva Entrada</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 py-4">
            <Button 
              variant="outline" 
              className="h-16 justify-start px-6 rounded-xl border-slate-200 hover:border-primary hover:bg-primary/5"
              onClick={() => {
                setIsQuickActionOpen(false);
                // We should probably navigate to Catalog or open a generic sale dialog
                // For now, let's just show a toast or open a simple sale dialog if we had one
                toast.info('Para registrar una venta, use la pestaña Catálogo');
              }}
            >
              <ShoppingCart className="mr-4 text-green-500" />
              <div className="text-left">
                <p className="font-bold">Nueva Venta</p>
                <p className="text-[10px] text-slate-500">Registrar salida de productos</p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-16 justify-start px-6 rounded-xl border-slate-200 hover:border-primary hover:bg-primary/5"
              onClick={() => {
                setIsQuickActionOpen(false);
                setIsAddPurchaseOpen(true);
              }}
            >
              <Package className="mr-4 text-red-500" />
              <div className="text-left">
                <p className="font-bold">Nueva Compra / Gasto</p>
                <p className="text-[10px] text-slate-500">Registrar egreso de dinero</p>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="h-16 justify-start px-6 rounded-xl border-slate-200 hover:border-primary hover:bg-primary/5"
              onClick={() => {
                setIsQuickActionOpen(false);
                setIsAddClientOpen(true);
              }}
            >
              <User className="mr-4 text-amber-500" />
              <div className="text-left">
                <p className="font-bold">Nuevo Perfil de Cliente</p>
                <p className="text-[10px] text-slate-500">Para gestionar fiados</p>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Purchase Dialog */}
      <Dialog open={isAddPurchaseOpen} onOpenChange={setIsAddPurchaseOpen}>
        <DialogContent className="max-w-[90vw] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Registrar Compra / Gasto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Input value={purchaseDesc} onChange={(e) => setPurchaseDesc(e.target.value)} placeholder="Ej: Reposición de refrescos" />
            </div>
            <div className="space-y-2">
              <Label>Monto (Bs)</Label>
              <Input type="number" step="0.01" value={purchaseAmount} onChange={(e) => setPurchaseAmount(e.target.value)} />
            </div>
            <Button className="w-full" onClick={addPurchase}>Guardar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Client Dialog */}
      <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
        <DialogContent className="max-w-[90vw] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Nuevo Cliente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nombre Completo</Label>
              <Input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Ej: Juan Pérez" />
            </div>
            <div className="space-y-2">
              <Label>Teléfono (Opcional)</Label>
              <Input value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} placeholder="Ej: 0412-1234567" />
            </div>
            <div className="space-y-2">
              <Label>Dirección (Opcional)</Label>
              <Input value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} placeholder="Ej: Calle 5, Casa 10" />
            </div>
            <Button className="w-full" onClick={addClient}>Registrar Cliente</Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

interface ConfigPageProps {
  config: AppConfig;
  setConfig: (config: AppConfig) => void;
  products: Product[];
  setProducts: (products: Product[]) => void;
}

function ConfigPage({ config, setConfig, products, setProducts }: ConfigPageProps) {
  const [rate, setRate] = useState(config.dollarRate.toString());
  const [margin, setMargin] = useState(config.profitMargin.toString());
  const [isArchivedOpen, setIsArchivedOpen] = useState(false);

  const saveConfig = () => {
    const newRate = parseFloat(rate) || 1;
    const newMargin = parseFloat(margin) || 0;
    
    // Update products based on new rate if they are fixed dollar
    const updatedProducts = products.map((p: Product) => {
      if (!p.isFixedDollar) {
        return p;
      } else {
        const dollarPrice = p.manualPrice! / config.dollarRate;
        return { ...p, manualPrice: dollarPrice * newRate };
      }
    });

    setProducts(updatedProducts);
    setConfig({ ...config, dollarRate: newRate, profitMargin: newMargin });
    toast.success('Configuración guardada');
  };

  const unarchiveProduct = (id: string) => {
    setProducts(products.map((p: Product) => p.id === id ? { ...p, archived: false } : p));
    toast.success('Producto restaurado');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-sm uppercase text-slate-500 font-bold">Tasas y Ganancias</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Tasa del Dólar (Bs/$)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input type="number" step="0.01" className="pl-10" value={rate} onChange={(e) => setRate(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Porcentaje de Ganancia (%)</Label>
            <Input type="number" value={margin} onChange={(e) => setMargin(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm uppercase text-slate-500 font-bold flex items-center gap-2">
            <Palette size={16} className="text-primary" />
            Personalización
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Color de la Aplicación</Label>
            <div className="grid grid-cols-5 gap-3">
              {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#64748b', '#000000'].map((color) => (
                <button
                  key={color}
                  onClick={() => setConfig({ ...config, themeColor: color })}
                  className={`w-full aspect-square rounded-xl transition-all ${
                    config.themeColor === color ? 'ring-4 ring-offset-2 ring-primary scale-90' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
              <div className="relative w-full aspect-square">
                <input 
                  type="color" 
                  value={config.themeColor} 
                  onChange={(e) => setConfig({ ...config, themeColor: e.target.value })}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div 
                  className="w-full h-full rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400"
                  style={{ backgroundColor: config.themeColor }}
                >
                  <Plus size={16} />
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-xs font-medium text-slate-600">Color seleccionado:</span>
              <span className="text-xs font-mono font-bold uppercase text-primary">{config.themeColor}</span>
            </div>
          </div>
          <Separator className="bg-slate-100" />
          <div className="space-y-3">
            <Label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Orden de las Páginas</Label>
            <div className="space-y-2">
              {config.pageOrder.map((page, index) => (
                <div key={page} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 shadow-sm text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-[10px] font-bold">
                      {index + 1}
                    </div>
                    <span className="font-medium text-slate-700">{page}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-slate-400 hover:text-primary" 
                      disabled={index === 0}
                      onClick={() => {
                        const newOrder = [...config.pageOrder];
                        [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
                        setConfig({ ...config, pageOrder: newOrder });
                      }}
                    >
                      <ChevronUp size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-slate-400 hover:text-primary" 
                      disabled={index === config.pageOrder.length - 1}
                      onClick={() => {
                        const newOrder = [...config.pageOrder];
                        [newOrder[index + 1], newOrder[index]] = [newOrder[index], newOrder[index + 1]];
                        setConfig({ ...config, pageOrder: newOrder });
                      }}
                    >
                      <ChevronDown size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Separator className="bg-slate-100" />
          <Button variant="outline" className="w-full justify-between h-12 rounded-xl border-slate-200 hover:bg-slate-50" onClick={() => setIsArchivedOpen(true)}>
            <div className="flex items-center">
              <Archive size={18} className="mr-3 text-amber-500" />
              <span className="font-medium">Productos Archivados</span>
            </div>
            <Badge variant="secondary" className="rounded-lg">{products.filter((p: Product) => p.archived).length}</Badge>
          </Button>
        </CardContent>
      </Card>

      <Button className="w-full h-12 text-lg font-bold shadow-lg" onClick={saveConfig}>
        <Save size={20} className="mr-2" /> Guardar Cambios
      </Button>

      <Dialog open={isArchivedOpen} onOpenChange={setIsArchivedOpen}>
        <DialogContent className="max-w-[90vw] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Productos Archivados</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-2">
              {products.filter((p: Product) => p.archived).map((p: Product) => (
                <div key={p.id} className="flex justify-between items-center p-2 bg-slate-50 rounded border">
                  <span className="text-sm font-medium">{p.name}</span>
                  <Button size="sm" variant="ghost" className="text-primary" onClick={() => unarchiveProduct(p.id)}>
                    Restaurar
                  </Button>
                </div>
              ))}
              {products.filter((p: Product) => p.archived).length === 0 && (
                <p className="text-center py-10 text-slate-400 text-sm">No hay productos archivados</p>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
