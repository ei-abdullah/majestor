import React from 'react';
import { Image, View, StyleSheet } from 'react-native';

interface CharacterImageProps {
  type: 'welcome' | 'login' | 'signup';
  style?: any;
}

export const CharacterImage: React.FC<CharacterImageProps> = ({ type, style }) => {
  const getImageSource = () => {
    switch (type) {
      case 'welcome':
        // Welcome character for both welcome screen and role selection screen
        return require('../../assets/images/characters/welcome-character.png');
      case 'login':
        // Login character for login page
        return require('../../assets/images/characters/login-character.png');
      case 'signup':
        // Use welcome character for signup as well (you can add signup-character.png later if needed)
        return require('../../assets/images/characters/welcome-character.png');
      default:
        return null;
    }
  };

  const imageSource = getImageSource();

  return (
    <Image
      source={imageSource}
      style={[styles.image, style]}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  placeholderContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderImage: {
    width: 120,
    height: 120,
  },
  image: {
    width: 200,
    height: 200,
  },
});

// Instructions for adding real images:
// 1. Save your character images in: assets/images/characters/
// 2. Name them: welcome-character.png, login-character.png, signup-character.png
// 3. Uncomment the require() statements above
// 4. The images will automatically replace the placeholders