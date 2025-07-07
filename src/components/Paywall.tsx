import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Check, Star, Crown, Zap, Shield, Download } from 'lucide-react';
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

  const features = [
    { icon: <Zap className="w-5 h-5" />, text: 'Ad-free experience' },
    { icon: <Star className="w-5 h-5" />, text: 'Exclusive content' },
    { icon: <Shield className="w-5 h-5" />, text: 'Priority support' },
    { icon: <Download className="w-5 h-5" />, text: 'Offline access' },
  ];

  // Simulate RevenueCat REST API call to fetch offerings
  useEffect(() => {
    const fetchOfferings = async () => {
      try {
        // In a real implementation, this would be a call to RevenueCat REST API
        // GET https://api.revenuecat.com/v1/subscribers/{app_user_id}/offerings
        console.log('Fetching offerings from RevenueCat...');
        
        // Simulate API response delay
        setTimeout(() => {
          console.log('Offerings loaded successfully');
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch offerings:', error);
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
    
    try {
      // Simulate RevenueCat REST API purchase
      // POST https://api.revenuecat.com/v1/receipts
      console.log(`Initiating purchase for product: ${productId}`);
      
      // Simulate purchase delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful purchase
      const success = Math.random() > 0.2; // 80% success rate
      
      if (success) {
        toast({
          title: 'Purchase Successful!',
          description: 'Welcome to Premium! Enjoy all the benefits.',
          variant: 'default',
        });
        
        // In real app, this would redirect or update app state
        console.log('Purchase completed successfully');
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      console.error('Purchase failed:', error);
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
    
    try {
      // Simulate RevenueCat REST API restore
      // GET https://api.revenuecat.com/v1/subscribers/{app_user_id}
      console.log('Restoring purchases...');
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate restoration result
      const hasActiveSubscription = Math.random() > 0.7; // 30% have active subscription
      
      if (hasActiveSubscription) {
        toast({
          title: 'Purchases Restored!',
          description: 'Your Premium subscription is now active.',
          variant: 'default',
        });
      } else {
        toast({
          title: 'No Active Subscription',
          description: 'No active subscription found.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Restore failed:', error);
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
    </div>
  );
};

export default Paywall;