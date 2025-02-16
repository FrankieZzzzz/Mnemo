import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {COLORS} from '../constants/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: object;
}

const Button = ({title, onPress, style}: ButtonProps) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  text: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Button;
