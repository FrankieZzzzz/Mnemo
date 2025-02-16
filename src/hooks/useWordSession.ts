import {useState, useCallback} from 'react';
import {Word} from '../types';

interface WordProgress {
  id: string;
  level: number; // 0: 未学习, 1: 阶段1完成, 2: 阶段2完成
  needsReview: boolean;
}

export const useWordSession = (allWords: Word[]) => {
  const [wordProgress, setWordProgress] = useState<WordProgress[]>(
    allWords.map(word => ({
      id: word.id,
      level: 0,
      needsReview: false,
    })),
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentStage, setCurrentStage] = useState(1);

  // 获取下一批未学习的单词（阶段1用）
  const getNextLearningBatch = useCallback(() => {
    const nextBatch = allWords.slice(currentIndex, currentIndex + 2);
    setCurrentIndex(prev => prev + 2);
    return nextBatch;
  }, [allWords, currentIndex]);

  // 获取阶段2的测试单词
  const getStage2Words = useCallback(() => {
    return allWords.filter(word => {
      const progress = wordProgress.find(p => p.id === word.id);
      return progress?.level === 1;
    });
  }, [allWords, wordProgress]);

  // 获取需要复习的单词
  const getReviewWords = useCallback(() => {
    return allWords.filter(word => {
      const progress = wordProgress.find(p => p.id === word.id);
      return progress?.needsReview === true;
    });
  }, [allWords, wordProgress]);

  // 更新单词进度
  const updateWordProgress = useCallback(
    (wordId: string, isCorrect: boolean, stage: number) => {
      setWordProgress(current =>
        current.map(progress => {
          if (progress.id === wordId) {
            if (isCorrect) {
              return {
                ...progress,
                level: stage === 1 ? 1 : 2, // 根据阶段设置不同的level
                needsReview: false,
              };
            } else {
              return {
                ...progress,
                needsReview: true,
              };
            }
          }
          return progress;
        }),
      );
    },
    [],
  );

  // 检查是否可以进入阶段2
  const canEnterStage2 = useCallback(() => {
    return (
      wordProgress.every(p => p.level >= 1) && currentIndex >= allWords.length
    );
  }, [wordProgress, currentIndex, allWords.length]);

  // 检查是否所有单词都完成
  const isSessionComplete = useCallback(() => {
    return wordProgress.every(p => p.level === 2);
  }, [wordProgress]);

  return {
    wordProgress,
    getNextLearningBatch,
    getStage2Words, // 添加这个
    getReviewWords,
    updateWordProgress,
    canEnterStage2, // 添加这个
    isSessionComplete,
    currentStage,
    setCurrentStage,
  };
};
