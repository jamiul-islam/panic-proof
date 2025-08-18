import { Platform } from 'react-native';

// Spacing scale
export const spacings = {
  // Base spacing units
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
  xxxxxl: 48,

  // Common spacing patterns
  cardPadding: 16,
  sectionSpacing: 24,
  screenPadding: 16,

  // Button specific
  buttonPadding: {
    horizontal: 24,
    vertical: 12,
  },

  // Border radius scale
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 999,
  },

  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  // Component heights
  heights: {
    input: 50,
    button: 48,
    buttonSmall: 32,
  },

  // Light shadow configuration
  lightShadow: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    android: {
      elevation: 1,
    },
    web: {
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    },
  }),

  // Standard shadow configuration  
  shadow: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    android: {
      elevation: 3,
    },
    web: {
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
  }),
};

export default spacings;
