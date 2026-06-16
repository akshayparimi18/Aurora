import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import React, { useState, useEffect } from 'react';
import { LogBox } from 'react-native';
import { supabase } from './src/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Ignore all warnings for the hackathon demo
LogBox.ignoreAllLogs();

// Screens
import { SplashScreen } from './src/screens/SplashScreen';
import { CarouselScreen } from './src/screens/CarouselScreen';
import { AuthScreen } from './src/screens/AuthScreen';
import { QuestionnaireScreen } from './src/screens/QuestionnaireScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';

type AppState = 'loading' | 'splash' | 'carousel' | 'auth' | 'setup' | 'dashboard';

export default function App() {
  const [appState, setAppState] = useState<AppState>('loading');

  useEffect(() => {
    // 1. Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // 2. If logged in, check if they finished the Setup Questionnaire
        AsyncStorage.getItem('@aurora_setup_complete').then(val => {
          if (val === 'true') {
            setAppState('dashboard');
          } else {
            setAppState('setup');
          }
        });
      } else {
        // If not logged in, start the fresh flow
        setAppState('splash');
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        AsyncStorage.getItem('@aurora_setup_complete').then(val => {
          if (val === 'true') {
            setAppState('dashboard');
          } else {
            setAppState('setup');
          }
        });
      }
    });
    
    return () => subscription.unsubscribe();
  }, []);

  if (appState === 'loading') {
    return null; // Could show a tiny spinner, but null is fine for milliseconds
  }

  if (appState === 'splash') {
    return <SplashScreen onComplete={() => setAppState('carousel')} />;
  }

  if (appState === 'carousel') {
    return <CarouselScreen onComplete={() => setAppState('auth')} />;
  }

  if (appState === 'auth') {
    return <AuthScreen onComplete={() => setAppState('setup')} />;
  }

  if (appState === 'setup') {
    return (
      <QuestionnaireScreen 
        onComplete={async () => {
          await AsyncStorage.setItem('@aurora_setup_complete', 'true');
          setAppState('dashboard');
        }} 
      />
    );
  }

  if (appState === 'dashboard') {
    return (
      <DashboardScreen 
        onLogout={async () => {
          await AsyncStorage.removeItem('@aurora_setup_complete');
          setAppState('auth');
        }} 
      />
    );
  }

  return null;
}
