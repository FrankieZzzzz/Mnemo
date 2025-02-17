import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {words} from '../utils/sampleData';
import {useWordSession} from '../hooks/useWordSession';

const HomeScreen = () => {
  const navigation = useNavigation();
  const {wordProgress} = useWordSession(words); // 获取单词进度

  // 计算已学习的单词数量（完成阶段2的单词）
  const learnedWords = wordProgress.filter(p => p.level === 2).length;

  const wordListData = {
    // 改名以避免与导入的 wordList 冲突
    title: '核心词汇',
    totalWords: words.length,
    learnedWords: learnedWords,
  };

  return (
    <View style={styles.container}>
      <View style={styles.wordListCard}>
        <Text style={styles.title}>{wordListData.title}</Text>
        <Text style={styles.progress}>
          {wordListData.learnedWords} / {wordListData.totalWords} words
        </Text>
        <TouchableOpacity
          style={styles.learnButton}
          onPress={() => navigation.navigate('Learning')}>
          <Text style={styles.buttonText}>开始学习</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ... styles 保持不变 ...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  wordListCard: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  progress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  learnButton: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default HomeScreen;
