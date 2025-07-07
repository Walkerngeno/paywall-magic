import React, { useState } from 'react';
import { Product } from '@/types/paywall';
import { useRevenueCat } from '@/hooks/useRevenueCat';
import { PaywallHeader } from './paywall/PaywallHeader';
import { FeaturesList } from './paywall/FeaturesList';
import { PricingCards } from './paywall/PricingCards';
import { ActionButtons } from './paywall/ActionButtons';
import { SuccessModal } from './paywall/SuccessModal';

const initialProducts: Product[] = [
  {
    id: 'monthly',
    title: 'Monthly',
    price: '$4.99',
    period: '/month',
  },
  {
    id: 'annual',
    title: 'Annual',
    price: '$29.99',
    period: '/year',
    badge: 'Best Value',
    popular: true,
  },
  {
    id: 'lifetime',
    title: 'Lifetime',
    price: '$99.99',
    period: 'one-time',
  },
];

const Paywall = () => {
  const [selectedProduct, setSelectedProduct] = useState<string>('annual');
  
  const {
    products,
    purchaseState,
    restoring,
    showSuccessModal,
    setShowSuccessModal,
    handlePurchase,
    handleRestore,
    trackEvent,
  } = useRevenueCat(initialProducts);

  const handleSuccessModalDismiss = () => {
    trackEvent('success_modal_dismissed');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PaywallHeader />
      <FeaturesList />
      <PricingCards 
        products={products}
        selectedProduct={selectedProduct}
        onProductSelect={setSelectedProduct}
      />
      <ActionButtons
        selectedProduct={selectedProduct}
        purchaseState={purchaseState}
        restoring={restoring}
        onPurchase={handlePurchase}
        onRestore={handleRestore}
      />
      <SuccessModal
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onDismiss={handleSuccessModalDismiss}
      />
    </div>
  );
};

export default Paywall;