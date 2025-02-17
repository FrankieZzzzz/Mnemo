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
  //   const [currentStage, setCurrentStage] = useState(1);
  const [currentWords, setCurrentWords] = useState<Word[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showingTest, setShowingTest] = useState(false);
  const [showingAnswer, setShowingAnswer] = useState(false);
  const [testDirection, setTestDirection] = useState<'CN_TO_EN' | 'EN_TO_CN'>(
    'CN_TO_EN',
  );
  const [wrongAnswer, setWrongAnswer] = useState<string | null>(null);

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
    const currentWord = currentWords[currentWordIndex];
    if (!currentWord) return;

    const isCorrect =
      answer ===
      (testDirection === 'CN_TO_EN' ? currentWord.word : currentWord.meaning);

    updateWordProgress(currentWord.id, isCorrect, currentStage);
    if (!isCorrect) {
      if (currentStage >= 2) {
        setShowingTest(false);
      } else {
        setWrongAnswer(answer);
        setShowingAnswer(true);
        setShowingTest(false);
      }
    } else {
      if (currentWordIndex < currentWords.length - 1) {
        // 继续测试当前批次的下一个单词
        setCurrentWordIndex(prev => prev + 1);
        setTestDirection(Math.random() > 0.5 ? 'CN_TO_EN' : 'EN_TO_CN');
      } else {
        // 当前批次测试完成
        const reviewWords = getReviewWords();

        if (reviewWords.length > 0) {
          setCurrentWords(reviewWords);
          setCurrentWordIndex(0);
          setShowingTest(true);
          setTestDirection(Math.random() > 0.5 ? 'CN_TO_EN' : 'EN_TO_CN');
        } else if (currentStage === 3 && isSessionComplete()) {
          // 如果是阶段3且所有单词都完成，结束会话
          navigation.navigate('SessionComplete');
        } else if (currentStage < 3 && isStageComplete(currentStage)) {
          // 当前阶段完成，进入下一阶段
          const nextStage = currentStage + 1;
          setCurrentStage(nextStage);
          const nextStageWords = getStageWords(nextStage);
          setCurrentWords(nextStageWords);
          setCurrentWordIndex(0);
          setShowingTest(true);
          setTestDirection(Math.random() > 0.5 ? 'CN_TO_EN' : 'EN_TO_CN');
        } else {
          // 继续当前阶段的其他单词
          const remainingWords = getStageWords(currentStage);
          if (remainingWords.length > 0) {
            setCurrentWords(remainingWords);
            setCurrentWordIndex(0);
            setShowingTest(true);
            setTestDirection(Math.random() > 0.5 ? 'CN_TO_EN' : 'EN_TO_CN');
          }
        }
      }
    }
  };
  //handleNext 函数
  const handleNext = () => {
    if (showingAnswer) {
      setShowingAnswer(false);
      if (currentWordIndex < currentWords.length - 1) {
        setCurrentWordIndex(prev => prev + 1);
        setShowingTest(true);
        setTestDirection(Math.random() > 0.5 ? 'CN_TO_EN' : 'EN_TO_CN');
      } else {
        const reviewWords = getReviewWords();
        if (reviewWords.length > 0) {
          setCurrentWords(reviewWords);
          setCurrentWordIndex(0);
          setShowingTest(true);
        } else if (currentStage < 3 && canEnterNextStage(currentStage + 1)) {
          setCurrentStage(prev => prev + 1);
          const nextStageWords = getStageWords(currentStage + 1);
          setCurrentWords(nextStageWords);
          setCurrentWordIndex(0);
          setShowingTest(true);
        } else {
          const nextBatch = getNextLearningBatch();
          if (nextBatch.length > 0) {
            setCurrentWords(nextBatch);
            setCurrentWordIndex(0);
            setShowingTest(false);
          } else if (isSessionComplete()) {
            navigation.navigate('SessionComplete');
          }
        }
      }
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
      }
    }
  };
  const currentWord = currentWords[currentWordIndex];
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
  // 测试界面
  const question =
    testDirection === 'CN_TO_EN' ? currentWord.meaning : currentWord.word;
  const options = generateOptions(
    testDirection === 'CN_TO_EN' ? currentWord.word : currentWord.meaning,
    words,
    testDirection === 'CN_TO_EN',
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, {width: `${getProgress()}%`}]} />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.question}>{question}</Text>
        <View style={styles.optionsContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              onPress={() => handleAnswer(option)}>
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

// 保持原有的 styles ...

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  wordType: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  word: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  meaning: {
    fontSize: 18,
    marginBottom: 32,
  },
  nextButton: {
    backgroundColor: '#333',
    padding: 15,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  question: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  answerTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  wrongAnswer: {
    fontSize: 20,
    color: '#FF3B30',
    marginBottom: 24,
  },
  correctAnswerContainer: {
    marginTop: 24,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    marginTop: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E5EA',
    width: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#34C759',
  },
});
export default LearningScreen;
