import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Text, Image } from 'react-native';

const Loading = ({text}) => {
  const scale = useRef(new Animated.Value(0.75)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const innerRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.5,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.75,
          duration: 1400,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.timing(innerRotate, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  }, [scale, rotate, innerRotate]);

  const rotation = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const innerRotation = innerRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Render 3 curves with synchronized spacing and borderWidth
  const renderCurves = () => {
    const numberOfCurves = 3; // Set to 3 curves
    const baseSpacing = 0.3; // Base scale factor
    const baseBorderWidth = 10; // Base border width

    return Array.from({ length: numberOfCurves }).map((_, index) => {
      const scaleFactor = baseSpacing + index * 0.05; // Increase spacing for each curve
      const borderWidth = baseBorderWidth * scaleFactor; // Border width proportional to spacing

      const borderStyles = [
        { borderTopColor: '#3373EB' }, // 첫 곡선
        { borderRightColor: '#3373EB' }, // 중간 곡선
        { borderBottomColor: '#3373EB' }, //마지막 곡선
      ];

      return (
        <Animated.View
          key={index}
          style={[
            styles.curve,
            borderStyles[index], // Apply specific borderColor for each curve
            {
              borderWidth: borderWidth, // Synchronized borderWidth
              transform: [
                { rotate: `${(360 / numberOfCurves) * index}deg` },
                { scale: scaleFactor }, // Synchronized spacing
              ],
            },
          ]}
        />
      );
    });
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.outerCircle,
          {
            transform: [{ rotate: rotation }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.circle,
            {
              transform: [{ scale }],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.curvesContainer,
              {
                transform: [{ rotate: innerRotation }],
              },
            ]}
          >
            {renderCurves()}
          </Animated.View>
        </Animated.View>
      </Animated.View>
      <View style={styles.fixedcircle} >
        <Image
          source={require('../assets/images/white_pt.png')} // Replace with your image path
          style={styles.fixedcircleImage}
        />
      </View>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  outerCircle: {
    width: 200,
    height: 200,
    borderWidth: 17,
    borderTopColor: '#3373EB',
    borderLeftColor: '#EDEFF1',
    borderRightColor: '#EDEFF1',
    borderBottomColor: '#EDEFF1',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  circle: {
    width: 70, // Original circle size maintained
    height: 70,
    backgroundColor: 'black',
    borderRadius: 35,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  curvesContainer: {
    width: 150, // Fits between circle and fixedcircle
    height: 150,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  curve: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 75, // Matches curvesContainer size
  },
  fixedcircle: {
    width: 50, // Ensures it stays inside curvesContainer
    height: 50,
    backgroundColor: '#3373EB',
    borderRadius: 25,
    position: 'absolute',
    zIndex: 2, // Keeps it on top
    padding: 10,
  },
  text: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 300,
  },
  fixedcircleImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
});

export default Loading;
