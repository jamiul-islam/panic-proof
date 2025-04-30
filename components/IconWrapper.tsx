import React from 'react';
import { Platform } from 'react-native';

// This component wraps lucide-react-native icons to make them web-compatible
export default function IconWrapper({ 
  icon: Icon, 
  size, 
  color, 
  ...props 
}: { 
  icon: React.ElementType; 
  size: number; 
  color: string; 
  [key: string]: any;
}) {
  // On web, we need to filter out React Native specific props that cause warnings
  if (Platform.OS === 'web') {
    // Filter out React Native specific gesture responder props
    const webSafeProps = Object.fromEntries(
      Object.entries(props).filter(([key]) => !key.includes('Responder'))
    );
    
    return <Icon size={size} color={color} {...webSafeProps} />;
  }
  
  // On native platforms, use all props
  return <Icon size={size} color={color} {...props} />;
}