import {useState, useCallback} from 'react';
import {Word} from '../types';

interface WordProgress {
  id: string;
  level: number; // 0: 未学习, 1: 阶段1完成, 2: 阶段2完成, 3: 阶段3完成, 4: 拼写阶段完成
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
  // 添加进度计算函数
  const getProgress = useCallback(() => {
    const totalWords = allWords.length;
    const stage1Words = wordProgress.filter(p => p.level >= 1).length;
    const stage2Words = wordProgress.filter(p => p.level >= 2).length;
    const stage3Words = wordProgress.filter(p => p.level >= 3).length;
    const stage4Words = wordProgress.filter(p => p.level >= 4).length;

    // 计算总进度
    const totalProgress = totalWords * 4; // 4个阶段
    const currentProgress =
      stage1Words + stage2Words + stage3Words + stage4Words;

    return (currentProgress / totalProgress) * 100;
  }, [allWords.length, wordProgress]);

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
                level: stage, // 直接设置为当前阶段数
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

  // 获取特定阶段需要测试的单词
  const getStageWords = useCallback(
    (stage: number) => {
      return allWords.filter(word => {
        const progress = wordProgress.find(p => p.id === word.id);
        return progress?.level < stage; // 获取level小于当前阶段的单词
      });
    },
    [allWords, wordProgress],
  );

  // 检查是否所有单词都完成当前阶段
  const isStageComplete = useCallback(
    (stage: number) => {
      return wordProgress.every(p => p.level >= stage);
    },
    [wordProgress],
  );

  // 检查是否整个会话完成
  const isSessionComplete = useCallback(() => {
    return wordProgress.every(p => p.level === 4); // 改为4
  }, [wordProgress]);

  // 获取拼写测试的单词（第4阶段）
  const getSpellingWords = useCallback(() => {
    return allWords.filter(word => {
      const progress = wordProgress.find(p => p.id === word.id);
      return progress?.level === 3; // 获取完成第3阶段的单词
    });
  }, [allWords, wordProgress]);

  return {
    wordProgress,
    getNextLearningBatch,
    getStageWords,
    getReviewWords,
    getSpellingWords, // 添加到返回对象中
    updateWordProgress,
    isStageComplete,
    isSessionComplete,
    currentStage,
    setCurrentStage,
    getProgress,
  };
};
