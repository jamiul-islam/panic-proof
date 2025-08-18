import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
  Platform
} from 'react-native';
import { colors } from '@/constants/colors';
import { spacings } from '@/constants/spacings';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  ...rest
}: ButtonProps) {
  const getBackgroundColor = () => {
    if (disabled) return colors.disabled;
    
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.secondary;
      case 'outline':
        return 'transparent';
      case 'danger':
        return colors.danger;
      default:
        return colors.primary;
    }
  };
  
  const getTextColor = () => {
    if (disabled) return colors.textTertiary;
    
    switch (variant) {
      case 'outline':
        return colors.primary;
      case 'primary':
      case 'secondary':
      case 'danger':
        return colors.textInverse;
      default:
        return colors.textInverse;
    }
  };
  
  const getBorderColor = () => {
    if (disabled) return colors.disabled;
    
    switch (variant) {
      case 'outline':
        return colors.primary;
      default:
        return 'transparent';
    }
  };
  
  const getPadding = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: spacings.sm, paddingHorizontal: spacings.md };
      case 'medium':
        return { paddingVertical: spacings.md, paddingHorizontal: spacings.lg };
      case 'large':
        return { paddingVertical: spacings.lg, paddingHorizontal: spacings.xxl };
      default:
        return { paddingVertical: spacings.md, paddingHorizontal: spacings.lg };
    }
  };
  
  const getFontSize = () => {
    switch (size) {
      case 'small':
        return spacings.fontSize.sm;
      case 'medium':
        return spacings.fontSize.md;
      case 'large':
        return spacings.fontSize.lg;
      default:
        return spacings.fontSize.md;
    }
  };
  
  // Filter out responder props on web to avoid warnings
  const buttonProps = Platform.OS === 'web' 
    ? Object.fromEntries(Object.entries(rest).filter(([key]) => !key.includes('Responder')))
    : rest;
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          ...getPadding(),
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
      {...buttonProps}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text
            style={[
              styles.text,
              {
                color: getTextColor(),
                fontSize: getFontSize(),
                marginLeft: icon && iconPosition === 'left' ? spacings.sm : 0,
                marginRight: icon && iconPosition === 'right' ? spacings.sm : 0,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: spacings.borderRadius.sm,
    borderWidth: 1,
  },
  text: {
    fontWeight: '600',
  },
});