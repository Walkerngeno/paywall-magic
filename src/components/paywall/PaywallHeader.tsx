import React from 'react';
import { Crown } from 'lucide-react';
import appLogo from '@/assets/app-logo.png';

export const PaywallHeader = () => {
  return (
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
  );
};