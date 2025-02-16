import React from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import WordCard from '../components/WordCard';
import {words} from '../utils/sampleData';
import {COLORS} from '../constants/colors';

const WordListScreen = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={words}
        renderItem={({item}) => <WordCard word={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  list: {
    padding: 16,
  },
});

export default WordListScreen;
