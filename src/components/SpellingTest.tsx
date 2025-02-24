import React, {useState, useMemo} from 'react'; // 添加 useMemo
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import {COLORS} from '../constants/colors';
import CustomKeyboard from './CustomKeyboard';
import {Word} from '../types';

interface SpellingTestProps {
  word: Word;
  onCorrect: () => void;
  onSkip: () => void;
}

const SpellingTest = ({word, onCorrect, onSkip}: SpellingTestProps) => {
  const [input, setInput] = useState('');
  const [showingAnswer, setShowingAnswer] = useState(false); // 添加状态
  const [isCorrect, setIsCorrect] = useState(false);

  // 使用 useMemo 来保持字母顺序不变
  const letters = useMemo(() => {
     // 获取单词的所有字母（去重）
    const wordLetters = Array.from(new Set(word.word.toLowerCase().split('')));
    
    const extraLetters = 'abcdefghijklmnopqrstuvwxyz'
     .split('')
      .filter(l => !wordLetters.includes(l))
      .sort(() => Math.random() - 0.5)
      .slice(0, 8 - wordLetters.length); 
    return [...wordLetters, ...extraLetters].sort(() => Math.random() - 0.5);
  }, [word]);

    // 检查答案
   const checkAnswer = (newInput: string, isManualCheck = false) => {
    if (newInput.toLowerCase() === word.word.toLowerCase()) {
      setIsCorrect(true);
      setTimeout(() => {
        setIsCorrect(false);
        onCorrect();
        setInput('');
      }, 1500);
    } else if (isManualCheck) {
      // 手动点击Check时，如果答案错误，显示错误页面
      setShowingAnswer(true);
    }
  };

 const handleKeyPress = (key: string) => {
    const newInput = input + key;
    setInput(newInput);
    checkAnswer(newInput, false); // 自动检查，但不显示错误页面
  };

   // 处理手动Check按钮点击
  const handleCheck = () => {
    checkAnswer(input, true); // 手动检查，显示错误页面
  };


  const handleBackspace = () => {
    setInput(prev => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (input.toLowerCase() === word.word.toLowerCase()) {
      onCorrect();
      setInput('');
    }
  };

   // 错误答案显示界面
   if (showingAnswer) {
    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.answerTitle}>YOUR ANSWER</Text>
          <Text style={styles.wrongAnswer}>{input}</Text>

          <View style={styles.correctAnswerContainer}>
            <Text style={styles.label}>ENGLISH</Text>
            <Text style={styles.word}>{word.word}</Text>

            <Text style={styles.label}>CHINESE</Text>
            <Text style={styles.meaning}>{word.meaning}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={() => {
            setShowingAnswer(false);
            setInput('');
          }}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 主要拼写测试界面
   return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.meaning}>{word.meaning}</Text>
        <Text style={styles.direction}>中文 > English (US)</Text>
      </View>

      <View style={styles.bottomContainer}>
        <TextInput
          style={[
            styles.input,
            isCorrect && styles.inputCorrect,
          ]}
          value={input}
          onChangeText={setInput}
          showSoftInputOnFocus={false}
          autoCapitalize="none"
          caretHidden={true}
        />
        <View style={styles.keyboardContainer}>
          <CustomKeyboard
            letters={letters}
            onKeyPress={handleKeyPress}
            onBackspace={handleBackspace}
            onSkip={onSkip}
            onCheck={handleCheck} // 使用新的handleCheck函数
            hasInput={input.length > 0}
          />
          {isCorrect && (
            <View style={styles.correctOverlay}>
              <View style={styles.correctContent}>
                <Text style={styles.correctText}>✓ Correct</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
 
  direction: {
    fontSize: 16,
    color: COLORS.text,
    opacity: 0.7,
  },
  bottomContainer: {
    paddingHorizontal: 16,
  },
  input: {
    height: 50,
    marginBottom: 11,
    backgroundColor: COLORS.darkGrey,
    borderRadius: 8,
    padding: 10,
    fontSize: 18,
    color: COLORS.text,
  },
  // 错误答案界面的样式
  answerTitle: {
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.7,
    marginBottom: 8,
  },
  wrongAnswer: {
    fontSize: 20,
    color: COLORS.error,
    marginBottom: 24,
  },
  correctAnswerContainer: {
    marginTop: 24,
    padding: 24,
    borderRadius: 12,
    backgroundColor: COLORS.surface, // 使用深色背景
  },
  label: {
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.7,
    marginBottom: 8,
    marginTop: 8,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  word: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
   meaning: {
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 16,
  },
   buttonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    height: 50,
    marginBottom: 16,
    backgroundColor: COLORS.background,
    borderColor: COLORS.surface,
    borderWidth: 4,
    borderRadius: 8,
    paddingHorizontal: 16, // 调整水平内边距
    fontSize: 18,
    color: COLORS.text,
  },
  inputCorrect: {
    color: COLORS.success,
  },
   keyboardContainer: {
    position: 'relative', // 为了正确定位 overlay
  },
  correctOverlay: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    zIndex: 1, // 确保在键盘上方
  },
  correctContent: {
    backgroundColor: COLORS.success,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 8, // 与 space 键保持相同间距
  },
  correctText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default SpellingTest;
