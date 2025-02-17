import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {words} from '../utils/sampleData';
import {useWordSession} from '../hooks/useWordSession';
import {generateOptions} from '../utils/testUtils';
import {Word} from '../types';
import {COLORS} from '../constants/colors';

const LearningScreen = () => {
  const navigation = useNavigation();

  const {
    wordProgress,
    getNextLearningBatch,
    getStageWords,
    getReviewWords,
    updateWordProgress,
    isStageComplete,
    isSessionComplete,
    currentStage,
    setCurrentStage,
  } = useWordSession(words);

  // 基本状态
  const [currentWords, setCurrentWords] = useState<Word[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showingTest, setShowingTest] = useState(false);
  const [showingAnswer, setShowingAnswer] = useState(false);
  const [testDirection, setTestDirection] = useState<'CN_TO_EN' | 'EN_TO_CN'>(
    'CN_TO_EN',
  );
  const [wrongAnswer, setWrongAnswer] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const currentWord = currentWords[currentWordIndex];
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);

  // 初始化学习
  useEffect(() => {
    const initialBatch = getNextLearningBatch();
    setCurrentWords(initialBatch);
  }, []);

  const moveToNextBatch = () => {
    const nextBatch = getNextLearningBatch();
    if (nextBatch.length > 0) {
      setCurrentWords(nextBatch);
      setCurrentWordIndex(0);
      setShowingTest(false);
      return true;
    }
    return false;
  };

  const handleAnswer = (answer: string) => {
    if (!currentWord) return;

    setSelectedAnswer(answer);

    const correctAnswer =
      testDirection === 'CN_TO_EN' ? currentWord.word : currentWord.meaning;
    const isCorrect = answer === correctAnswer;

    updateWordProgress(currentWord.id, isCorrect, currentStage);

    if (!isCorrect) {
      if (currentStage >= 2) {
        // 阶段2和3的错误处理
        setTimeout(() => {
          setWrongAnswer(answer); // 添加这行
          setShowingAnswer(true); // 修改：显示错误答案页面
          setShowingTest(false);
          setSelectedAnswer(null);
          setCurrentOptions([]);
        }, 1000);
      } else {
        // 阶段1的错误处理
        setWrongAnswer(answer);
        setTimeout(() => {
          setShowingAnswer(true);
          setShowingTest(false);
          setSelectedAnswer(null);
          setCurrentOptions([]);
        }, 1000);
      }
    } else {
      // 答对了
      setTimeout(() => {
        setSelectedAnswer(null);
        setCurrentOptions([]);
        if (currentWordIndex < currentWords.length - 1) {
          // 继续测试下一个单词
          setCurrentWordIndex(prev => prev + 1);
          setTestDirection(Math.random() > 0.5 ? 'CN_TO_EN' : 'EN_TO_CN');
        } else {
          // 检查是否需要继续学习新单词
          const nextBatch = getNextLearningBatch();
          if (nextBatch.length > 0) {
            // 有新单词要学习
            setCurrentWords(nextBatch);
            setCurrentWordIndex(0);
            setShowingTest(false); // 切换到学习模式
          } else {
            // 没有新单词，检查复习和阶段转换
            const reviewWords = getReviewWords();
            if (reviewWords.length > 0) {
              setCurrentWords(reviewWords);
              setCurrentWordIndex(0);
              setShowingTest(true);
              setTestDirection(Math.random() > 0.5 ? 'CN_TO_EN' : 'EN_TO_CN');
            } else if (currentStage === 3 && isSessionComplete()) {
              navigation.navigate('SessionComplete');
            } else if (currentStage < 3 && isStageComplete(currentStage)) {
              const nextStage = currentStage + 1;
              setCurrentStage(nextStage);
              const nextStageWords = getStageWords(nextStage);
              setCurrentWords(nextStageWords);
              setCurrentWordIndex(0);
              setShowingTest(true);
              setTestDirection(Math.random() > 0.5 ? 'CN_TO_EN' : 'EN_TO_CN');
            }
          }
        }
      }, 1000);
    }
  };

  //handleNext 函数
  const handleNext = () => {
    if (showingAnswer) {
      // 从错误答案页面返回测试
      setShowingAnswer(false);
      setShowingTest(true);
      setCurrentOptions([]);
      setTestDirection(Math.random() > 0.5 ? 'CN_TO_EN' : 'EN_TO_CN');
      return;
    }

    // 在学习模式下
    if (!showingTest) {
      if (currentWordIndex < currentWords.length - 1) {
        // 继续学习下一个单词
        setCurrentWordIndex(prev => prev + 1);
      } else {
        // 当前批次学习完成，开始测试
        setCurrentWordIndex(0);
        setShowingTest(true);
        setTestDirection(Math.random() > 0.5 ? 'CN_TO_EN' : 'EN_TO_CN');
        setCurrentOptions([]);
      }
    }
  };

  // 进度条计算
  const getProgress = () => {
    const totalProgress = words.length * 3; // 总进度为单词数量 * 3（三个阶段）
    const currentProgress = wordProgress.reduce((sum, progress) => {
      // 每完成一个阶段加一分
      return sum + progress.level;
    }, 0);
    return (currentProgress / totalProgress) * 100;
  };

  // 添加空状态处理
  if (!currentWord || currentWords.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.question}>所有单词学习完成！</Text>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => navigation.navigate('Home')}>
            <Text style={styles.buttonText}>返回首页</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (showingAnswer) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.answerTitle}>YOUR ANSWER</Text>
          <Text style={styles.wrongAnswer}>{wrongAnswer}</Text>

          <View style={styles.correctAnswerContainer}>
            <Text style={styles.label}>ENGLISH</Text>
            <Text style={styles.word}>{currentWord.word}</Text>

            <Text style={styles.label}>CHINESE</Text>
            <Text style={styles.meaning}>{currentWord.meaning}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!showingTest) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.wordType}>{currentWord.partOfSpeech}</Text>
          <Text style={styles.word}>{currentWord.word}</Text>
          <Text style={styles.meaning}>{currentWord.meaning}</Text>
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // 修改测试界面的选项渲染部分
  if (showingTest) {
    const question =
      testDirection === 'CN_TO_EN' ? currentWord.meaning : currentWord.word;
    const correctAnswer =
      testDirection === 'CN_TO_EN' ? currentWord.word : currentWord.meaning;

    // 只在没有当前选项时生成新选项
    if (currentOptions.length === 0) {
      const newOptions = generateOptions(
        correctAnswer,
        words,
        testDirection === 'CN_TO_EN',
      );
      setCurrentOptions(newOptions);
    }

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, {width: `${getProgress()}%`}]} />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.question}>{question}</Text>
          <View style={styles.optionsContainer}>
            {currentOptions.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === correctAnswer;

              const buttonStyle = [
                styles.optionButton,
                selectedAnswer && {
                  backgroundColor: isCorrect
                    ? COLORS.success
                    : isSelected
                    ? COLORS.error
                    : COLORS.surface,
                },
              ];

              return (
                <TouchableOpacity
                  key={index}
                  style={buttonStyle}
                  onPress={() => handleAnswer(option)}
                  disabled={selectedAnswer !== null}>
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </SafeAreaView>
    );
  }
};

// 保持原有的 styles ...

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
  wordType: {
    fontSize: 16,
    color: COLORS.text,
    opacity: 0.7,
    marginBottom: 8,
  },
  word: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  meaning: {
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 32,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '500',
  },
  question: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 32,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
    color: COLORS.text,
  },
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
    padding: 20,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
  },
  label: {
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.7,
    marginBottom: 4,
    marginTop: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.surface,
    width: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.success,
  },
});
export default LearningScreen;
