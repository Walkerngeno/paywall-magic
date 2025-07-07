import React from 'react';
import { Check, Zap, Star, Shield, Download } from 'lucide-react';
import { Feature } from '@/types/paywall';

const features: Feature[] = [
  { icon: <Zap className="w-5 h-5" />, text: 'Ad-free experience' },
  { icon: <Star className="w-5 h-5" />, text: 'Exclusive content' },
  { icon: <Shield className="w-5 h-5" />, text: 'Priority support' },
  { icon: <Download className="w-5 h-5" />, text: 'Offline access' },
];

export const FeaturesList = () => {
  return (
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
  );
};

export { features };