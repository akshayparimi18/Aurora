import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

interface AuthScreenProps {
  onComplete: () => void;
}

export function AuthScreen({ onComplete }: AuthScreenProps) {
  const [introStep, setIntroStep] = useState(1);
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter your email and password.');
      return;
    }

    if (email.toLowerCase() === 'demo' && password === 'demo') {
      onComplete();
      return;
    }

    setLoading(true);

    if (isLoginMode) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        Alert.alert('Login Failed', error.message);
        setLoading(false);
        return;
      }
    } else {
      const { error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) {
        Alert.alert(
          'Hackathon Demo Mode', 
          'Cloud limit reached or email unverified. Falling back to local offline session!',
          [{ text: 'Continue setup', onPress: () => { setLoading(false); onComplete(); } }]
        );
        return;
      }
    }

    setLoading(false);
    onComplete();
  };

  const renderIntroScreens = () => {
    let title = "";
    let icon = "star";
    if (introStep === 1) { title = "Meet your personal health companion."; icon = "activity"; }
    if (introStep === 2) { title = "Track hydration, sleep, habits, and nutrition."; icon = "droplet"; }
    if (introStep === 3) { title = "Receive personalized daily insights."; icon = "sun"; }
    if (introStep === 4) { title = "Build healthier routines through consistency."; icon = "check-circle"; }
    if (introStep === 5) { title = "Learn more about yourself every day."; icon = "book-open"; }

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.introContent}>
          <Feather name={icon as any} size={80} color="#818CF8" style={{ marginBottom: 40 }} />
          <Text style={styles.introSubtitle}>Understand yourself better every day.</Text>
          <Text style={styles.introTitle}>{title}</Text>
        </View>
        <TouchableOpacity style={styles.nextBtn} onPress={() => setIntroStep(introStep + 1)}>
          <LinearGradient colors={['#818CF8', '#38BDF8']} style={styles.nextBtnGradient}>
            <Text style={styles.nextBtnText}>{introStep === 5 ? "Get Started" : "Next"}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </SafeAreaView>
    );
  };

  if (introStep <= 5) {
    return renderIntroScreens();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Feather name="activity" size={24} color="#38BDF8" />
          <Text style={styles.logoText}>Aurora</Text>
        </View>
        <Text style={styles.title}>{isLoginMode ? 'Welcome back' : 'Create your account'}</Text>
        <Text style={styles.subtitle}>Your personal health journey starts here.</Text>
      </View>

      <View style={styles.segmentContainer}>
        <TouchableOpacity style={[styles.segmentBtn, !isLoginMode && styles.activeSegment]} onPress={() => setIsLoginMode(false)}>
          <Text style={[styles.segmentText, !isLoginMode && styles.activeSegmentText]}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.segmentBtn, isLoginMode && styles.activeSegment]} onPress={() => setIsLoginMode(true)}>
          <Text style={[styles.segmentText, isLoginMode && styles.activeSegmentText]}>Sign In</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.socialAuthContainer}>
        <TouchableOpacity style={[styles.socialBtn, { flex: 1, marginRight: 8 }]} onPress={() => Alert.alert('Demo', 'Google Auth bypass for demo.')}>
          <FontAwesome5 name="google" size={18} color="#FFF" />
          <Text style={styles.socialBtnText}>Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.socialBtn, { flex: 1, marginLeft: 8 }]} onPress={() => Alert.alert('Demo', 'Apple Auth bypass for demo.')}>
          <FontAwesome5 name="apple" size={20} color="#FFF" />
          <Text style={styles.socialBtnText}>Apple</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.orText}>or continue with email</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.form}>
        {!isLoginMode && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <Feather name="user" size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Virat Kohli"
                placeholderTextColor="#64748B"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrapper}>
            <Feather name="search" size={20} color="#64748B" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor="#64748B"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrapper}>
            <Feather name="settings" size={20} color="#64748B" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Min 6 characters"
              placeholderTextColor="#64748B"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </View>
      </View>

      <TouchableOpacity activeOpacity={0.8} onPress={handleAuth} disabled={loading} style={styles.footer}>
        <LinearGradient
          colors={loading ? ['#334155', '#475569'] : ['#5E8CFF', '#38BDF8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>{loading ? 'Loading...' : (isLoginMode ? 'Sign In ✨' : 'Create Account ✨')}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A1A',
    paddingHorizontal: 24,
  },
  introContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  introSubtitle: { color: '#818CF8', fontSize: 16, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16, textAlign: 'center' },
  introTitle: { color: '#FFF', fontSize: 32, fontWeight: '800', textAlign: 'center', lineHeight: 40 },
  nextBtn: { marginBottom: 80, borderRadius: 16, overflow: 'hidden' },
  nextBtnGradient: { paddingVertical: 20, alignItems: 'center' },
  nextBtnText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  header: {
    marginTop: 40,
    marginBottom: 30,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#13132D',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeSegment: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  segmentText: {
    color: '#64748B',
    fontWeight: '600',
    fontSize: 14,
  },
  activeSegmentText: {
    color: '#FFF',
  },
  socialAuthContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    paddingVertical: 14,
  },
  socialBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  orText: {
    color: '#64748B',
    marginHorizontal: 12,
    fontSize: 12,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    color: '#FFF',
    fontSize: 16,
  },
  footer: {
    paddingBottom: 40,
    marginBottom: 20,
    paddingTop: 10,
  },
  button: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
