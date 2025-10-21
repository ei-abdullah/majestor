import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

interface CharacterIllustrationProps {
  size?: 'small' | 'medium' | 'large';
  style?: any;
}

export const CharacterIllustration: React.FC<CharacterIllustrationProps> = ({
  size = 'medium',
  style,
}) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return { width: 80, height: 80 };
      case 'large':
        return { width: 200, height: 200 };
      default:
        return { width: 120, height: 120 };
    }
  };

  return (
    <View style={[styles.container, getSize(), style]}>
      {/* Placeholder for character illustration */}
      <View style={styles.character}>
        <Text style={styles.characterEmoji}>👩‍🎓</Text>
        <View style={styles.speechBubble}>
          <Text style={styles.speechText}>💬</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: theme.spacing.md,
  },
  character: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterEmoji: {
    fontSize: 60,
  },
  speechBubble: {
    position: 'absolute',
    top: -10,
    right: -15,
    backgroundColor: theme.colors.white,
    borderRadius: 15,
    padding: 4,
    ...theme.shadows.sm,
  },
  speechText: {
    fontSize: 16,
  },
});