import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/paywall';

interface PricingCardsProps {
  products: Product[];
  selectedProduct: string;
  onProductSelect: (productId: string) => void;
}

export const PricingCards = ({ products, selectedProduct, onProductSelect }: PricingCardsProps) => {
  return (
    <div className="px-6 mb-8">
      <div className="grid grid-cols-1 gap-4">
        {products.map((product) => (
          <Card 
            key={product.id}
            className={`cursor-pointer transition-all duration-300 ${
              selectedProduct === product.id 
                ? 'ring-2 ring-primary bg-gradient-to-br from-card to-primary/5' 
                : 'hover:bg-card/80'
            } ${product.popular ? 'border-primary' : ''}`}
            onClick={() => onProductSelect(product.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{product.title}</CardTitle>
                {product.badge && (
                  <Badge variant="secondary" className="bg-accent text-accent-foreground">
                    {product.badge}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">{product.price}</span>
                <span className="text-muted-foreground text-sm">{product.period}</span>
              </div>
              {product.id === 'annual' && (
                <p className="text-sm text-success mt-1">Save 50% compared to monthly</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};