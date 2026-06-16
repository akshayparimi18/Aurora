import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';

const BACKEND_URL = 'http://192.168.1.4:8000/api/chat';
const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

interface ChatScreenProps {
  onClose: () => void;
  onHydrationLogged: (amount: number) => void;
  onWorkoutGenerated: (workout: any) => void;
}

export function ChatScreen({ onClose, onHydrationLogged, onWorkoutGenerated }: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', text: "I've logged 7 hours of sleep for you, Rakhi. That's a great start to the night, and now you can relax knowing it's all tracked." }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const recordingRef = useRef<Audio.Recording | null>(null);
  
  // Orb pulse animation
  const [orbPulseAnim] = useState(new Animated.Value(1));
  const [micPulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(orbPulseAnim, { toValue: 1.1, duration: 2000, useNativeDriver: true }),
        Animated.timing(orbPulseAnim, { toValue: 1, duration: 2000, useNativeDriver: true })
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(micPulseAnim, { toValue: 1.2, duration: 500, useNativeDriver: true }),
          Animated.timing(micPulseAnim, { toValue: 1, duration: 500, useNativeDriver: true })
        ])
      ).start();
    } else {
      micPulseAnim.setValue(1);
    }
  }, [isRecording]);

  async function startRecording() {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      setIsRecording(true);
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      recordingRef.current = recording;
    } catch (err) {
      setIsRecording(false);
    }
  }

  async function stopRecording() {
    setIsRecording(false);
    const currentRecording = recordingRef.current;
    if (!currentRecording) return;

    await currentRecording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({ allowsRecordingIOS: false, playsInSilentModeIOS: true, playThroughEarpieceAndroid: false });
    const uri = currentRecording.getURI();
    recordingRef.current = null;

    if (uri) {
      await processAudio(uri);
    }
  }

  async function processAudio(uri: string) {
    try {
      const formData = new FormData();
      formData.append('file', { uri, type: 'audio/m4a', name: 'audio.m4a' } as any);
      formData.append('model', 'whisper-large-v3-turbo');

      const whisperRes = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${GROQ_API_KEY}` },
        body: formData,
      });

      const whisperData = await whisperRes.json();
      const transcribedText = whisperData.text;

      if (!transcribedText) return;
      handleSendMessage(transcribedText);
    } catch (err) {
      console.error(err);
    }
  }

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    try {
      const backendRes = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_input: text })
      });

      const backendData = await backendRes.json();

      if (backendData?.spoken_response) {
        const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', text: backendData.spoken_response };
        setMessages(prev => [...prev, aiMsg]);
        
        Speech.speak(backendData.spoken_response, {
          language: 'en', pitch: 1.0, rate: 1.0,
        });
      }

      if (backendData?.action_payload?.intent === 'log_hydration') {
        const amountStr = backendData.action_payload.entities?.amount;
        if (amountStr) {
          const amount = parseInt(amountStr, 10);
          if (!isNaN(amount)) onHydrationLogged(amount);
        }
      } else if (backendData?.action_payload?.intent === 'generate_workout') {
        const entities = backendData.action_payload.entities;
        if (entities?.exercises) {
           onWorkoutGenerated(entities);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Feather name="star" size={20} color="#F8FAFC" />
          <Text style={styles.headerTitle}>Aurora</Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Feather name="x" size={20} color="#94A3B8" />
        </TouchableOpacity>
      </View>

      {/* Chat Messages */}
      <ScrollView style={styles.chatArea} contentContainerStyle={styles.chatContent}>
        {messages.map(msg => (
          <View key={msg.id} style={[styles.messageBubble, msg.role === 'user' ? styles.userBubble : styles.aiBubble]}>
            {msg.role === 'assistant' ? (
              <LinearGradient colors={['#818CF8', '#38BDF8']} style={styles.aiGradientBubble} start={{x: 0, y: 0}} end={{x: 1, y: 1}}>
                <Text style={styles.messageText}>{msg.text}</Text>
              </LinearGradient>
            ) : (
              <Text style={styles.messageText}>{msg.text}</Text>
            )}
          </View>
        ))}
      </ScrollView>

      {/* The Orb */}
      <View style={styles.orbContainer} pointerEvents="none">
        <Animated.View style={[styles.orbBackground, { transform: [{ scale: orbPulseAnim }] }]} />
        <View style={styles.orbCore}>
           <LinearGradient colors={['#C084FC', '#818CF8']} style={styles.orbGradient} />
        </View>
      </View>

      {/* Bottom Controls */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.bottomArea}>
          <Text style={styles.micHint}>Tap mic to speak • or type below</Text>
          
          <Animated.View style={[styles.micWrapper, { transform: [{ scale: micPulseAnim }] }]}>
            <TouchableOpacity activeOpacity={0.8} onPressIn={startRecording} onPressOut={stopRecording}>
              <LinearGradient colors={isRecording ? ['#EF4444', '#B91C1C'] : ['#818CF8', '#38BDF8']} style={styles.micBtn}>
                <Feather name="mic" size={28} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Quick Actions */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickActions} contentContainerStyle={{gap: 12, paddingHorizontal: 24}}>
            {['How am I doing?', 'Add 500ml water', 'Log 7h sleep', 'Habits left?'].map((action, i) => (
              <TouchableOpacity key={i} style={styles.actionChip} onPress={() => handleSendMessage(action)}>
                <Text style={styles.actionChipText}>{action}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Text Input */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              placeholderTextColor="#64748B"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={() => handleSendMessage(inputText)}
            />
            <TouchableOpacity style={styles.sendBtn} onPress={() => handleSendMessage(inputText)}>
              <Feather name="chevron-right" size={24} color="#818CF8" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A12' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingTop: 60, zIndex: 10 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: '700' },
  closeBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  
  chatArea: { flex: 1, zIndex: 10 },
  chatContent: { padding: 24, gap: 16, paddingBottom: 200 },
  messageBubble: { maxWidth: '80%', borderRadius: 20, marginBottom: 4 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#3B2A5E', padding: 16, borderBottomRightRadius: 4 },
  aiBubble: { alignSelf: 'flex-start' },
  aiGradientBubble: { padding: 16, borderRadius: 20, borderTopLeftRadius: 4 },
  messageText: { color: '#F8FAFC', fontSize: 16, lineHeight: 24 },

  orbContainer: { position: 'absolute', top: '40%', left: '50%', transform: [{translateX: -100}, {translateY: -100}], width: 200, height: 200, justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  orbBackground: { position: 'absolute', width: 240, height: 240, borderRadius: 120, backgroundColor: 'rgba(129, 140, 248, 0.15)' },
  orbCore: { width: 160, height: 160, borderRadius: 80, overflow: 'hidden' },
  orbGradient: { flex: 1, opacity: 0.8 },

  bottomArea: { backgroundColor: 'transparent', paddingBottom: Platform.OS === 'ios' ? 32 : 24, zIndex: 10 },
  micHint: { textAlign: 'center', color: '#64748B', fontSize: 12, marginBottom: 20 },
  micWrapper: { alignSelf: 'center', marginBottom: 24 },
  micBtn: { width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center', shadowColor: '#38BDF8', shadowOffset: {width: 0, height: 8}, shadowOpacity: 0.4, shadowRadius: 16, elevation: 8 },
  
  quickActions: { marginBottom: 20 },
  actionChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  actionChipText: { color: '#E2E8F0', fontSize: 14, fontWeight: '500' },
  
  inputRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, gap: 12 },
  textInput: { flex: 1, height: 50, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 25, paddingHorizontal: 20, color: '#FFF', fontSize: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  sendBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(129, 140, 248, 0.1)', justifyContent: 'center', alignItems: 'center' }
});
