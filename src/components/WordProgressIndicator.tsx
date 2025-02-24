import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import {COLORS} from '../constants/colors';

interface WordProgressIndicatorProps {
  level: number; // 0-3 表示单词当前的级别
}

const WordProgressIndicator = ({level}: WordProgressIndicatorProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 创建放大缩小动画
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.2,
        useNativeDriver: true,
        speed: 20,
        bounciness: 8,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
        bounciness: 8,
      }),
    ]).start();
  }, [level]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{scale: scaleAnim}],
        },
      ]}>
      <View style={styles.circle}>
        {level >= 1 && <View style={[styles.quarter, styles.quarter1]} />}
        {level >= 2 && <View style={[styles.quarter, styles.quarter2]} />}
        {level >= 3 && <View style={[styles.quarter, styles.quarter3]} />}
        {level >= 4 && <View style={[styles.quarter, styles.quarter4]} />}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.surface,
    overflow: 'hidden',
    position: 'relative',
  },
  quarter: {
    position: 'absolute',
    width: '50%',
    height: '50%',
    backgroundColor: COLORS.primary,
  },
  quarter1: {
    top: 0,
    right: 0,
    borderBottomLeftRadius: 12,
  },
  quarter2: {
    bottom: 0,
    right: 0,
    borderTopLeftRadius: 12,
  },
  quarter3: {
    bottom: 0,
    left: 0,
    borderTopRightRadius: 12,
  },
  quarter4: {
    top: 0,
    left: 0,
    borderBottomRightRadius: 12,
  },
});

export default WordProgressIndicator;
