import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {COLORS} from '../constants/colors';
import {Word} from '../types';

interface WordCardProps {
  word: Word;
}

const WordCard = ({word}: WordCardProps) => {
  const [showMeaning, setShowMeaning] = useState(false);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setShowMeaning(!showMeaning)}>
      <Text style={styles.wordText}>{word.word}</Text>
      {showMeaning && (
        <View style={styles.meaningContainer}>
          <Text style={styles.meaningText}>{word.meaning}</Text>
          {word.example && (
            <Text style={styles.exampleText}>{word.example}</Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  wordText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  meaningContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray + '20',
  },
  meaningText: {
    fontSize: 16,
    color: COLORS.text,
  },
  exampleText: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 4,
    fontStyle: 'italic',
  },
});

export default WordCard;
