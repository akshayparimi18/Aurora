import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';

export function ProfileTab() {
  const [userName, setUserName] = useState('Guest');
  const [aiPlan, setAiPlan] = useState<any>(null);

  useEffect(() => {
    AsyncStorage.getItem('@aurora_user_name').then(name => {
      if (name) setUserName(name);
    });
    AsyncStorage.getItem('@aurora_ai_plan').then(plan => {
      if (plan) setAiPlan(JSON.parse(plan));
    });
  }, []);

  const speakText = (text: string) => {
    Speech.speak(text, { language: 'en', pitch: 1.0, rate: 1.0 });
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton}>
          <Feather name="chevron-left" size={24} color="#F8FAFC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Plan</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Feather name="settings" size={20} color="#94A3B8" />
        </TouchableOpacity>
      </View>

      {/* Avatar Section */}
      <View style={styles.avatarSection}>
        <LinearGradient colors={['#818CF8', '#C084FC']} style={styles.avatarRing}>
          <View style={styles.avatarInner}>
            <Text style={styles.avatarText}>{userName.charAt(0)}</Text>
          </View>
        </LinearGradient>
        <Text style={styles.nameText}>{userName}</Text>
        <Text style={styles.subText}>Health journey since June 2026</Text>
        
        <View style={styles.badgeWrapper}>
          <Feather name="star" size={14} color="#C084FC" style={{marginRight: 6}} />
          <Text style={styles.badgeText}>Level 4 • Wellness Warrior</Text>
        </View>
      </View>

      {/* AI Plan Section */}
      {aiPlan ? (
        <View style={styles.planContainer}>
          <Text style={styles.sectionTitle}>YOUR AI HEALTH PLAN</Text>
          
          <View style={styles.targetGrid}>
            <LinearGradient colors={['rgba(56, 189, 248, 0.1)', 'rgba(56, 189, 248, 0.05)']} style={styles.targetCard}>
               <Feather name="zap" size={24} color="#38BDF8" style={{marginBottom: 8}} />
               <Text style={styles.targetValue}>{aiPlan.target_calories}</Text>
               <Text style={styles.targetLabel}>Daily Calories</Text>
            </LinearGradient>
            
            <LinearGradient colors={['rgba(192, 132, 252, 0.1)', 'rgba(192, 132, 252, 0.05)']} style={styles.targetCard}>
               <Feather name="activity" size={24} color="#C084FC" style={{marginBottom: 8}} />
               <Text style={[styles.targetValue, {color: '#C084FC'}]}>{aiPlan.target_steps}</Text>
               <Text style={styles.targetLabel}>Daily Steps</Text>
            </LinearGradient>
          </View>

          <View style={styles.aiCard}>
             <View style={styles.aiHeader}>
               <View style={{flexDirection: 'row', alignItems: 'center'}}>
                 <View style={[styles.iconWrap, {backgroundColor: 'rgba(250, 204, 21, 0.1)'}]}>
                   <Feather name="coffee" size={18} color="#FACC15" />
                 </View>
                 <Text style={styles.aiTitle}>Diet Strategy</Text>
               </View>
               <TouchableOpacity onPress={() => speakText(aiPlan.diet_plan)} style={styles.speakBtn}>
                 <Feather name="volume-2" size={18} color="#94A3B8" />
               </TouchableOpacity>
             </View>
             <Text style={styles.aiBody}>{aiPlan.diet_plan}</Text>
          </View>

          <View style={styles.aiCard}>
             <View style={styles.aiHeader}>
               <View style={{flexDirection: 'row', alignItems: 'center'}}>
                 <View style={[styles.iconWrap, {backgroundColor: 'rgba(244, 63, 94, 0.1)'}]}>
                   <Feather name="target" size={18} color="#F43F5E" />
                 </View>
                 <Text style={styles.aiTitle}>Workout Split</Text>
               </View>
               <TouchableOpacity onPress={() => speakText(aiPlan.workout_split)} style={styles.speakBtn}>
                 <Feather name="volume-2" size={18} color="#94A3B8" />
               </TouchableOpacity>
             </View>
             <Text style={styles.aiBody}>{aiPlan.workout_split}</Text>
          </View>
        </View>
      ) : (
        <View style={styles.emptyState}>
           <Feather name="cpu" size={48} color="#334155" />
           <Text style={styles.emptyText}>No AI Plan generated yet. Complete the setup questionnaire to get your personalized plan!</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingBottom: 120 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  iconButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: '800' },
  
  avatarSection: { alignItems: 'center', marginBottom: 40 },
  avatarRing: { width: 100, height: 100, borderRadius: 50, padding: 3, marginBottom: 16 },
  avatarInner: { flex: 1, backgroundColor: '#0F0F1A', borderRadius: 50, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 40, fontWeight: '800', color: '#FFF' },
  nameText: { fontSize: 24, fontWeight: '800', color: '#FFF', marginBottom: 4 },
  subText: { fontSize: 14, color: '#64748B', marginBottom: 16 },
  badgeWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(192, 132, 252, 0.1)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(192, 132, 252, 0.2)' },
  badgeText: { color: '#C084FC', fontSize: 14, fontWeight: '600' },

  planContainer: { gap: 16 },
  sectionTitle: { color: '#94A3B8', fontSize: 12, fontWeight: '800', letterSpacing: 1.5, marginBottom: 8, marginLeft: 4 },
  
  targetGrid: { flexDirection: 'row', gap: 16 },
  targetCard: { flex: 1, padding: 20, borderRadius: 24, alignItems: 'flex-start', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  targetValue: { color: '#38BDF8', fontSize: 28, fontWeight: '800', marginBottom: 4 },
  targetLabel: { color: '#94A3B8', fontSize: 12, fontWeight: '600' },

  aiCard: { backgroundColor: '#1C1C2E', padding: 24, borderRadius: 24 },
  aiHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  iconWrap: { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  aiTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: '700' },
  speakBtn: { padding: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12 },
  aiBody: { color: '#94A3B8', fontSize: 15, lineHeight: 24 },

  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 40, backgroundColor: '#1C1C2E', borderRadius: 24, marginTop: 20 },
  emptyText: { color: '#64748B', textAlign: 'center', marginTop: 16, lineHeight: 24 }
});
