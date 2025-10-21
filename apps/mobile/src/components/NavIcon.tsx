import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { theme } from '../constants/theme';

interface NavIconProps {
  type: 'home' | 'discussions' | 'posts' | 'search' | 'carpool' | 'accommodation';
  isActive: boolean;
  size?: number;
}

export const NavIcon: React.FC<NavIconProps> = ({ 
  type, 
  isActive, 
  size = 22 
}) => {
  const iconColor = isActive ? theme.colors.primary : theme.colors.white;
  
  const renderIcon = () => {
    switch (type) {
      case 'home':
        return (
          <Ionicons 
            name="home-outline" 
            size={size} 
            color={iconColor} 
          />
        );
      case 'discussions':
        return (
          <Ionicons 
            name="people-outline" 
            size={size} 
            color={iconColor} 
          />
        );
      case 'posts':
        return (
          <Ionicons 
            name="document-text-outline" 
            size={size} 
            color={iconColor} 
          />
        );
      case 'search':
        return (
          <Ionicons 
            name="search-outline" 
            size={size} 
            color={iconColor} 
          />
        );
      case 'carpool':
        return (
          <Ionicons 
            name="car-outline" 
            size={size} 
            color={iconColor} 
          />
        );
      case 'accommodation':
        return (
          <Ionicons 
            name="business-outline" 
            size={size} 
            color={iconColor} 
          />
        );
      default:
        return (
          <Ionicons 
            name="ellipse-outline" 
            size={size} 
            color={iconColor} 
          />
        );
    }
  };

  return (
    <View style={[
      styles.container,
      isActive && styles.activeContainer
    ]}>
      {renderIcon()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeContainer: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.white,
  },
});