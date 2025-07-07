import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Product, PurchaseState } from '@/types/paywall';
import { useAnalytics } from './useAnalytics';

export const useRevenueCat = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [purchaseState, setPurchaseState] = useState<PurchaseState>({
    loading: false,
    productId: null,
  });
  const [restoring, setRestoring] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const { toast } = useToast();
  const { trackEvent } = useAnalytics();

  // Fetch offerings from RevenueCat
  useEffect(() => {
    const fetchOfferings = async () => {
      trackEvent('paywall_viewed');
      
      try {
        const appUserId = 'anonymous_user_' + Date.now();
        const apiKey = 'rc_test_YOUR_API_KEY_HERE'; // Replace with actual key
        
        const response = await fetch(`https://api.revenuecat.com/v1/subscribers/${appUserId}/offerings`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        
        // Update products with actual pricing from RevenueCat
        if (data.current_offering_id && data.offerings[data.current_offering_id]) {
          const offering = data.offerings[data.current_offering_id];
          const updatedProducts = products.map(product => {
            const rcPackage = offering.packages.find((pkg: any) => pkg.identifier === product.id);
            if (rcPackage) {
              return {
                ...product,
                price: rcPackage.product.price_string || product.price,
              };
            }
            return product;
          });
          setProducts(updatedProducts);
        }
        
        trackEvent('offerings_loaded_success');
        console.log('Offerings loaded successfully');
      } catch (error) {
        console.error('Failed to fetch offerings:', error);
        trackEvent('offerings_load_failed', { error: error.message });
        toast({
          title: 'Error',
          description: 'Failed to load subscription options',
          variant: 'destructive',
        });
      }
    };

    fetchOfferings();
  }, [toast, trackEvent, products]);

  const handlePurchase = useCallback(async (productId: string) => {
    setPurchaseState({ loading: true, productId });
    trackEvent('purchase_attempted', { product_id: productId });
    
    try {
      const appUserId = 'anonymous_user_' + Date.now();
      const apiKey = 'rc_test_YOUR_API_KEY_HERE'; // Replace with actual key
      
      // RevenueCat REST API purchase - POST receipt validation
      const response = await fetch('https://api.revenuecat.com/v1/receipts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          app_user_id: appUserId,
          fetch_token: 'your_receipt_token_here', // From your payment provider
          product_id: productId,
          price: products.find(p => p.id === productId)?.price.replace('$', ''),
          currency: 'USD',
        }),
      });

      if (!response.ok) {
        throw new Error(`Purchase API Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.subscriber?.entitlements?.premium?.is_active) {
        trackEvent('purchase_success', { product_id: productId });
        setShowSuccessModal(true);
        console.log('Purchase completed successfully');
      } else {
        throw new Error('Subscription not activated');
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      trackEvent('purchase_failed', { product_id: productId, error: error.message });
      toast({
        title: 'Purchase Failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setPurchaseState({ loading: false, productId: null });
    }
  }, [products, trackEvent, toast]);

  const handleRestore = useCallback(async () => {
    setRestoring(true);
    trackEvent('restore_attempted');
    
    try {
      const appUserId = 'anonymous_user_' + Date.now();
      const apiKey = 'rc_test_YOUR_API_KEY_HERE'; // Replace with actual key
      
      // RevenueCat REST API restore - GET subscriber info
      const response = await fetch(`https://api.revenuecat.com/v1/subscribers/${appUserId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Restore API Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.subscriber?.entitlements?.premium?.is_active) {
        trackEvent('restore_success');
        setShowSuccessModal(true);
      } else {
        trackEvent('restore_no_subscription');
        toast({
          title: 'No Active Subscription',
          description: 'No active subscription found.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Restore failed:', error);
      trackEvent('restore_failed', { error: error.message });
      toast({
        title: 'Restore Failed',
        description: 'Unable to restore purchases. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setRestoring(false);
    }
  }, [trackEvent, toast]);

  return {
    products,
    purchaseState,
    restoring,
    showSuccessModal,
    setShowSuccessModal,
    handlePurchase,
    handleRestore,
    trackEvent,
  };
};