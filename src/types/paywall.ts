export interface Product {
  id: string;
  title: string;
  price: string;
  period: string;
  badge?: string;
  popular?: boolean;
}

export interface PurchaseState {
  loading: boolean;
  productId: string | null;
}

export interface Feature {
  icon: React.ReactNode;
  text: string;
}