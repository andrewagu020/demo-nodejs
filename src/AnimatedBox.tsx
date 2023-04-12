import {PanGestureHandler} from 'react-native-gesture-handler';
import {Easing, useAnimatedStyle, withTiming} from 'react-native-reanimated';
import {withSpring} from 'react-native-reanimated';
import {
  useAnimatedGestureHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import Animated from 'react-native-reanimated';
import React, {useRef} from 'react';
import {LottieAnimation} from './LottieAnimation';

const {width, height} = Dimensions.get('window');
const MAX_TRANSLATE_X = width / 3;
const MAX_TRANSLATE_Y = height / 2.5;

export const AnimatedBox = () => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const velocityX = useRef(0);
  const velocityY = useRef(0);
  const rotation = useSharedValue(0);

  /**
   * TODO: quay component 1 góc 180 độ trong vong 500ms
   */
  const handleRotate = () => {
    rotation.value = withTiming(rotation.value + Math.PI / 2, {
      duration: 500,
      easing: Easing.inOut(Easing.ease),
    });
  };

  const onGestureEvent = useAnimatedGestureHandler({
    /**
     * TODO: Hàm onStart được gọi khi người dùng bắt đầu vuốt component. Nó nhận được hai đối số:
     * * the current gesture state và a context object mà bạn có thể sử dụng để lưu trữ bất kỳ dữ liệu nào bạn cần trong suốt thời gian của cử chỉ.
     * * Ở đây, chúng ta lưu trữ vị trí bắt đầu của component trong đối tượng bối cảnh.
     * @param _
     * @param ctx
     */
    onStart: (_, ctx: Record<string, any>) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    /**
     * TODO: Chức năng onActive được gọi lặp lại khi người dùng tiếp tục vuốt component.
     * * Nó nhận the current gesture state và a context object làm đối số.
     * * Ở đây, chúng ta cập nhật vị trí của component dựa trên cử chỉ vuốt của người dùng.
     * * khi ta vuốt component theo trục X, vị trí của nó sẽ bị giới hạn bởi MAX_TRANSLATE_X
     * * khi ta vuốt component theo trục X, vị trí của nó sẽ bị giới hạn bởi MAX_TRANSLATE_Y
     * @param velocity: xác định tốc độ vuốt component , lưu lại tốc độ vào biến velocityX, velocityY
     * @param event
     * @param ctx
     */
    onActive: (event, ctx) => {
      const newX = ctx.startX + event.translationX;
      const newY = ctx.startY + event.translationY;

      translateX.value = Math.max(
        -MAX_TRANSLATE_X,
        Math.min(newX, MAX_TRANSLATE_X),
      );
      translateY.value = Math.max(
        -MAX_TRANSLATE_Y,
        Math.min(newY, MAX_TRANSLATE_Y),
      );

      velocityX.current = event.velocityX;
      velocityY.current = event.velocityY;
    },
    /**
     * TODO: Hàm onEnd được gọi khi người dùng nhấc ngón tay khỏi màn hình sau khi vuốt component.
     * * Nó nhận trạng thái cử chỉ cuối cùng và đối tượng ngữ cảnh làm đối số.
     * * Trong ví dụ này, chúng tôi sử dụng các hàm snapPoint và withSpring từ react-native-reanimated để tạo hiệu ứng hộp sang trái hoặc phải dựa trên hướng và tốc độ của thao tác vuốt.
     * * trước đó đã lưu tốc độ vuốt component, nên sẽ lấy toạ độ mới cộng thêm gia tốc để nó trôi đến vị trí mới
     * @param event
     */
    onEnd: event => {
      translateX.value = withSpring(translateX.value + event.velocityX * 0.1, {
        velocity: velocityX.current,
      });
      translateY.value = withSpring(translateY.value + event.velocityY * 0.1, {
        velocity: velocityY.current,
      });
    },
  });

  /**
   * TODO: style để vuốt component
   */
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
      ],
    };
  });

  /**
   * TODO: style để quay component
   */
  const animatedStyleRoute = useAnimatedStyle(() => {
    return {
      transform: [{rotateZ: `${rotation.value}rad`}],
    };
  });

  return (
    <View style={styles.container}>
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View style={[styles.box, animatedStyle, animatedStyleRoute]}>
          <TouchableOpacity onPress={handleRotate}>
            <LottieAnimation />
          </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: 200,
    height: 200,
    backgroundColor: 'black',
    borderRadius: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
