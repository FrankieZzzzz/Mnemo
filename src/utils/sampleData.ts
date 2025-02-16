import {WordList, Word} from '../types';

// 单词本信息
export const wordList: WordList = {
  id: '1',
  title: '基础词汇 - 第一课',
  totalWords: 4,
  learnedWords: 0,
};

// 单词列表
export const words: Word[] = [
  {
    id: '1',
    word: 'apple',
    meaning: '苹果',
    partOfSpeech: 'n.',
    learned: false,
  },
  {
    id: '2',
    word: 'book',
    meaning: '书',
    partOfSpeech: 'n.',
    learned: false,
  },
  {
    id: '3',
    word: 'cat',
    meaning: '猫',
    partOfSpeech: 'n.',
    learned: false,
  },
  //   {
  //     id: '4',
  //     word: 'dog',
  //     meaning: '狗',
  //     partOfSpeech: 'n.',
  //     learned: false,
  //   },
  //   {
  //     id: '5',
  //     word: 'food',
  //     meaning: '食物',
  //     partOfSpeech: 'n.',
  //     learned: false,
  //   },
];
