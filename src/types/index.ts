export interface Word {
  id: string;
  word: string;
  meaning: string;
  partOfSpeech?: string;
  learned: boolean;
}

export interface WordList {
  id: string;
  title: string;
  totalWords: number;
  learnedWords: number;
}
