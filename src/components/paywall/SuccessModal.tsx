import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Sparkles } from 'lucide-react';
import { features } from './FeaturesList';

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
  onDismiss: () => void;
}

export const SuccessModal = ({ open, onClose, onDismiss }: SuccessModalProps) => {
  const handleContinue = () => {
    onClose();
    onDismiss();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
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
            onClick={handleContinue}
          >
            Continue to App
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};