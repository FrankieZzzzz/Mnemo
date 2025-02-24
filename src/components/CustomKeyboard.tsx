import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {COLORS} from '../constants/colors';

interface CustomKeyboardProps {
  letters: string[];
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onSkip: () => void;
  onCheck: () => void;
  hasInput: boolean;
}

const CustomKeyboard = ({
  letters,
  onKeyPress,
  onBackspace,
  onSkip,
  onCheck,
  hasInput,
}: CustomKeyboardProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.keyboardContent}>
        <View style={styles.row}>
          {letters.slice(0, 5).map((letter, index) => (
            <TouchableOpacity
              key={index}
              style={styles.key}
              onPress={() => onKeyPress(letter)}>
              <Text style={styles.keyText}>{letter}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.key, styles.backspace]}
            onPress={onBackspace}>
            <Text style={styles.backspaceText}>⌫</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          {letters.slice(5, 8).map((letter, index) => (
            <TouchableOpacity
              key={index}
              style={styles.key}
              onPress={() => onKeyPress(letter)}>
              <Text style={styles.keyText}>{letter}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.key, styles.skipKey, hasInput && styles.checkKey]}
            onPress={hasInput ? onCheck : onSkip}>
            <Text style={[styles.skipText, hasInput && styles.checkText]}>
              {hasInput ? 'Check' : 'Skip'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.spaceKey}
          onPress={() => onKeyPress(' ')}>
          <Text style={styles.keyText}>space</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 34, // For iPhone home indicator
  },
  keyboardContent: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  key: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.darkGrey,
    borderRadius: 8,
  },
  keyText: {
    fontSize: 18,
    color: COLORS.text,
  },
  backspace: {
    fontSize: 18,
    backgroundColor: COLORS.primary,
    color: COLORS.background,
  },

  spaceKey: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.darkGrey,
    borderRadius: 8,
    color: COLORS.background,
    fontSize: 18,
    fontWeight: '500',
  },
  backspaceText: {
    fontSize: 22, // 更大的退格键字体
    color: COLORS.background,
  },
  skipKey: {
    flex: 2,
  },
  checkKey: {
    backgroundColor: COLORS.primary,
  },
  skipText: {
    fontSize: 18,
    color: COLORS.text,
  },
  checkText: {
    color: COLORS.background,
  },
});

export default CustomKeyboard;
