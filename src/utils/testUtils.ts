import {Word} from '../types';

export const generateOptions = (
  correctAnswer: string,
  allWords: Word[],
  isEnglish: boolean,
): string[] => {
  // 从所有单词中过滤出不包含正确答案的选项
  const otherOptions = allWords
    .filter(word => (isEnglish ? word.word : word.meaning) !== correctAnswer)
    .map(word => (isEnglish ? word.word : word.meaning))
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  // 将正确答案和其他选项合并，并随机排序
  return [correctAnswer, ...otherOptions].sort(() => Math.random() - 0.5);
};
