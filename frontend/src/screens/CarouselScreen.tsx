import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity, SafeAreaView, Animated, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    tag: 'WELCOME TO AURORA',
    title: 'Your personal health AI',
    description: 'Aurora learns your patterns and gives personalised insights — hydration, sleep, habits, and nutrition all in one place.',
    image: require('../../assets/carousel/carousel_welcome_v2_1781462369970.png'),
    colors: ['#818CF8', '#C084FC']
  },
  {
    id: '2',
    tag: 'SLEEP',
    title: 'Sleep smarter, recover faster',
    description: 'Log your sleep and wake times. Aurora analyses your patterns and shows you exactly how to improve.',
    image: require('../../assets/carousel/carousel_sleep_v2_1781462381798.png'),
    colors: ['#FBBF24', '#F59E0B']
  },
  {
    id: '3',
    tag: 'HYDRATION',
    title: 'Stay hydrated, stay sharp',
    description: 'Track every sip with a tap. Aurora reminds you throughout the day and celebrates your streaks.',
    image: require('../../assets/carousel/carousel_hydration_v2_1781462394513.png'),
    colors: ['#38BDF8', '#0284C7']
  },
  {
    id: '4',
    tag: 'HABITS',
    title: 'Forge unbreakable routines',
    description: 'Five daily habits, tracked simply. Aurora celebrates your streaks and nudges you when you need it most.',
    image: require('../../assets/carousel/carousel_workout_1781462543363.png'),
    colors: ['#34D399', '#059669'] // Green color palette for habits
  }
];

interface CarouselScreenProps {
  onComplete: () => void;
}

const AnimatedIllustration = ({ image }: { image: any }) => {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 1, duration: 4000, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 4000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const translateY = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -15] });

  return (
    <View style={styles.imagePlaceholder}>
      <Animated.Image 
        source={image}
        style={[
          StyleSheet.absoluteFillObject, 
          { width: undefined, height: undefined, transform: [{ scale: 1.1 }, { translateY }] }
        ]}
        resizeMode="cover"
      />
    </View>
  );
};

export function CarouselScreen({ onComplete }: CarouselScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      onComplete();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <AnimatedIllustration image={item.image} />
            <View style={styles.contentContainer}>
              <View style={styles.tagContainer}>
                <Text style={styles.tagText}>● {item.tag}</Text>
              </View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index ? styles.activeDot : styles.inactiveDot
              ]}
            />
          ))}
        </View>

        <TouchableOpacity activeOpacity={0.8} onPress={handleNext}>
          <LinearGradient
            colors={['#5E8CFF', '#38BDF8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>{currentIndex === SLIDES.length - 1 ? "Get Started" : "Continue"}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A1A',
  },
  slide: {
    width,
    flex: 1,
  },
  imagePlaceholder: {
    flex: 0.55,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#13132D',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    overflow: 'hidden',
  },
  glowCircle: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.15,
    transform: [{ scale: 1.5 }],
  },
  contentContainer: {
    flex: 0.45,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  tagContainer: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20,
  },
  tagText: {
    color: '#818CF8',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 16,
    letterSpacing: -1,
    lineHeight: 48,
  },
  description: {
    fontSize: 16,
    color: '#94A3B8',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  activeDot: {
    width: 24,
    backgroundColor: '#818CF8',
  },
  inactiveDot: {
    width: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  button: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
