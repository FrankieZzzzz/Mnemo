import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {wordList} from '../utils/sampleData';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.wordListCard}>
        <Text style={styles.title}>{wordList.title}</Text>
        <Text style={styles.progress}>
          {wordList.learnedWords} / {wordList.totalWords} words
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

export default HomeScreen;

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
