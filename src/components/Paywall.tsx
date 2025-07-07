import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Check, Star, Crown, Zap, Shield, Download, Sparkles } from 'lucide-react';
import appLogo from '@/assets/app-logo.png';

interface Product {
  id: string;
  title: string;
  price: string;
  period: string;
  badge?: string;
  popular?: boolean;
}

interface PurchaseState {
  loading: boolean;
  productId: string | null;
}

const Paywall = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([
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
  ]);
  
  const [selectedProduct, setSelectedProduct] = useState<string>('annual');
  const [purchaseState, setPurchaseState] = useState<PurchaseState>({
    loading: false,
    productId: null,
  });
  const [restoring, setRestoring] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Analytics tracking
  const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    console.log(`Analytics: ${eventName}`, properties);
    // In production, integrate with your analytics service:
    // analytics.track(eventName, properties);
  };

  const features = [
    { icon: <Zap className="w-5 h-5" />, text: 'Ad-free experience' },
    { icon: <Star className="w-5 h-5" />, text: 'Exclusive content' },
    { icon: <Shield className="w-5 h-5" />, text: 'Priority support' },
    { icon: <Download className="w-5 h-5" />, text: 'Offline access' },
  ];

  // RevenueCat REST API call to fetch offerings
  useEffect(() => {
    const fetchOfferings = async () => {
      trackEvent('paywall_viewed');
      
      try {
        // Replace with your actual RevenueCat API key and app user ID
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
  }, [toast]);

  const handlePurchase = async (productId: string) => {
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
  };

  const handleRestore = async () => {
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
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="text-center pt-12 pb-8 px-6">
        <div className="mx-auto w-24 h-24 mb-6 relative">
          <img 
            src={appLogo} 
            alt="App Logo" 
            className="w-full h-full object-contain"
          />
          <div className="absolute -top-2 -right-2">
            <Crown className="w-8 h-8 text-accent" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Premium Features
        </h1>
        <p className="text-muted-foreground text-lg">
          Unlock everything and supercharge your experience
        </p>
      </div>

      {/* Features */}
      <div className="px-6 mb-8">
        <div className="grid grid-cols-1 gap-4">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {feature.icon}
              </div>
              <div className="flex items-center gap-2 flex-1">
                <Check className="w-5 h-5 text-success" />
                <span className="text-foreground font-medium">{feature.text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Cards */}
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
              onClick={() => setSelectedProduct(product.id)}
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

      {/* Action Buttons */}
      <div className="px-6 mt-auto pb-8">
        <div className="space-y-4">
          <Button
            variant="premium"
            size="lg"
            className="w-full text-lg font-semibold"
            onClick={() => handlePurchase(selectedProduct)}
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
            onClick={handleRestore}
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

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-sm mx-auto text-center">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-success" />
            </div>
            <DialogTitle className="text-xl font-bold">
              🎉 Welcome to Premium!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Your subscription is now active. Enjoy all the premium features!
            </p>
            <div className="space-y-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-success" />
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
            <Button 
              variant="premium" 
              size="lg" 
              className="w-full"
              onClick={() => {
                setShowSuccessModal(false);
                trackEvent('success_modal_dismissed');
              }}
            >
              Continue to App
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Paywall;