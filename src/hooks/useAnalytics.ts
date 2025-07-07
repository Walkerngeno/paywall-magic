import { useCallback } from 'react';

export const useAnalytics = () => {
  const trackEvent = useCallback((eventName: string, properties?: Record<string, any>) => {
    console.log(`Analytics: ${eventName}`, properties);
    // In production, integrate with your analytics service:
    // analytics.track(eventName, properties);
  }, []);

  return { trackEvent };
};