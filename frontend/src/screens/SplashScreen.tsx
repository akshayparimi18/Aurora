import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // 1. Initial pop-in and fade-in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();

    // 2. Wait, then fade out and transition
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        onComplete();
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <LinearGradient colors={['#080C16', '#1A1B41']} style={styles.container}>
      <Animated.Image 
        source={require('../../assets/splash_aurora_1781462721834.png')}
        style={[styles.logoCircle, { transform: [{ scale: scaleAnim }], opacity: fadeAnim }]} 
        resizeMode="cover"
      />
      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>Aurora</Animated.Text>
      <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>Your AI-powered health companion.</Animated.Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoCircle: {
    width: 250,
    height: 250,
    borderRadius: 125,
    marginBottom: 30, 
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 50,
    elevation: 10,
  },
  title: {
    fontSize: 56,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: -2,
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: {width: 0, height: 4},
    textShadowRadius: 10,
    zIndex: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: '400',
    textAlign: 'center',
  },
});
