import React from 'react';
import {StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';
import Animated, {useSharedValue} from 'react-native-reanimated';

export const LottieAnimation = () => {
  const progress = useSharedValue(100);

  return (
    <Animated.View style={styles.container}>
      <LottieView
        progress={progress.value}
        source={require('../animation.json')}
        autoPlay
        loop
        resizeMode="contain"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
