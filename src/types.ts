export interface Product {
  id: string;
  name: string;
  code?: string;
  image?: string;
  unitsPerPack: number;
  stock: number; // total units
  wholesalePrice: number; // in local currency
  wholesalePriceUSD?: number;
  isFixedDollar: boolean;
  archived: boolean;
  manualPrice?: number;
  manualPriceUSD?: number;
}

export interface BudgetProfile {
  id: string;
  name: string;
  items: BudgetProduct[];
  date: string;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  paymentMethod: 'efectivo' | 'pagomovil' | 'fiado';
  reference?: string;
  clientId?: string;
  clientName?: string;
  date: string;
}

export interface Client {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  debt: number;
  pendingSales?: Sale[];
}

export interface Purchase {
  id: string;
  description: string;
  amount: number;
  date: string;
}

export interface BudgetProduct {
  id: string;
  productId?: string;
  name: string;
  wholesalePrice: number;
  quantity: number;
  bought: boolean;
  spent?: number;
}

export interface AppConfig {
  dollarRate: number;
  profitMargin: number;
  themeColor: string;
  pageOrder: string[];
}
