import React from 'react';
import { Button } from '@/components/ui/button';
import { PurchaseState } from '@/types/paywall';

interface ActionButtonsProps {
  selectedProduct: string;
  purchaseState: PurchaseState;
  restoring: boolean;
  onPurchase: (productId: string) => void;
  onRestore: () => void;
}

export const ActionButtons = ({ 
  selectedProduct, 
  purchaseState, 
  restoring, 
  onPurchase, 
  onRestore 
}: ActionButtonsProps) => {
  return (
    <div className="px-6 mt-auto pb-8">
      <div className="space-y-4">
        <Button
          variant="premium"
          size="lg"
          className="w-full text-lg font-semibold"
          onClick={() => onPurchase(selectedProduct)}
          disabled={purchaseState.loading}
        >
          {purchaseState.loading && purchaseState.productId === selectedProduct ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            'Continue with Premium'
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="lg"
          className="w-full"
          onClick={onRestore}
          disabled={restoring}
        >
          {restoring ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
              Restoring...
            </div>
          ) : (
            'Restore Purchases'
          )}
        </Button>
      </div>
      
      {/* Footer Links */}
      <div className="flex justify-center gap-6 mt-6 text-sm text-muted-foreground">
        <button className="hover:text-foreground transition-colors">
          Terms of Service
        </button>
        <button className="hover:text-foreground transition-colors">
          Privacy Policy
        </button>
      </div>
    </div>
  );
};