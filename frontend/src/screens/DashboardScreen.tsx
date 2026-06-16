import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, Platform, StatusBar, Animated, Image, Modal, Alert } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatScreen } from './ChatScreen';
import { HabitsTab } from '../components/tabs/HabitsTab';
import { ProgressTab } from '../components/tabs/ProgressTab';
import { ProfileTab } from '../components/tabs/ProfileTab';
import { FoodScannerModal } from '../components/FoodScannerModal';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async (): Promise<Notifications.NotificationBehavior> => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  } as any),
});

const BACKEND_URL = 'http://192.168.1.4:8000/api/chat';
const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;

interface DashboardScreenProps {
  onLogout: () => void;
}

export function DashboardScreen({ onLogout }: DashboardScreenProps) {
  const [hydration, setHydration] = useState(500);
  const hydrationGoal = 2500;
  
  const [habits, setHabits] = useState([
    { id: '1', title: 'Morning Run (5km)', status: 'completed' as const },
    { id: '2', title: 'Read 10 pages', status: 'in-progress' as const },
    { id: '3', title: 'Meditation (10m)', status: 'pending' as const },
  ]);

  const [workout, setWorkout] = useState<any>(null);

  const [activeTab, setActiveTab] = useState<'home'|'habits'|'progress'|'profile'>('home');

  const [userName, setUserName] = useState('Guest');
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);

  const [showChatModal, setShowChatModal] = useState(false);

  const [hydrationWidthAnim] = useState(new Animated.Value(500)); 

  const currentHour = new Date().getHours();
  let timeGreeting = 'Good evening';
  let timeIcon = '🌙';
  let quickActions: Array<{ title: string; icon: any; color: string }> = [
    { title: 'Log Sleep', icon: 'moon', color: '#C084FC' },
    { title: 'Evening Wind-Down', icon: 'coffee', color: '#FACC15' }
  ];

  if (currentHour < 12) {
    timeGreeting = 'Good morning';
    timeIcon = '☀️';
    quickActions = [
      { title: 'Log Breakfast', icon: 'sun', color: '#FACC15' },
      { title: 'Morning Stretch', icon: 'activity', color: '#38BDF8' }
    ];
  } else if (currentHour < 17) {
    timeGreeting = 'Good afternoon';
    timeIcon = '🌤️';
    quickActions = [
      { title: 'Log Lunch', icon: 'coffee', color: '#F43F5E' },
      { title: 'Quick Walk', icon: 'map-pin', color: '#4ADE80' }
    ];
  }

  useEffect(() => {
    Animated.timing(hydrationWidthAnim, {
      toValue: hydration,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [hydration]);

  const interpolatedWidth = hydrationWidthAnim.interpolate({
    inputRange: [0, hydrationGoal],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp'
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  useEffect(() => {
    async function setupAutoNotifications() {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') return;

      // Cancel previous triggers so they don't spam on hot reloads
      await Notifications.cancelAllScheduledNotificationsAsync();

      // Auto-schedule a recurring Hydration reminder (every 60 seconds for Hackathon demo)
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "💧 Hydration Check!",
          body: "It's been a while! Time to drink a glass of water to hit your goal.",
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 60, repeats: true },
      });

      // Auto-schedule a recurring Steps reminder (every 120 seconds for Hackathon demo)
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "👟 Almost there!",
          body: "You're only 2,000 steps away from crushing your daily goal!",
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 120, repeats: true },
      });
    }

    setupAutoNotifications();

    AsyncStorage.getItem('@aurora_user_name').then(name => {
      if (name) setUserName(name);
    });
  }, []);

  const currentDateFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  return (
    <View style={styles.safeArea}>
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      {activeTab === 'home' && (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greetingSub}>{timeGreeting} {timeIcon}</Text>
              <Text style={styles.greetingName}>{userName}</Text>
              <Text style={styles.dateText}>{currentDateFormatted}</Text>
            </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton} onPress={() => setShowScannerModal(true)}>
              <Feather name="camera" size={20} color="#818CF8" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => Alert.alert('Notifications Active', 'Smart reminders are running in the background!')}>
              <Feather name="bell" size={20} color="#94A3B8" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileAvatar} onPress={handleSignOut}>
              <Text style={styles.profileText}>{userName.charAt(0)}</Text>
            </TouchableOpacity>
          </View>
          </View>

          <View style={styles.quickActionsContainer}>
            {quickActions.map((action, idx) => (
              <TouchableOpacity key={idx} style={styles.quickActionChip} onPress={() => setShowChatModal(true)}>
                <Feather name={action.icon} size={16} color={action.color} />
                <Text style={styles.quickActionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <LinearGradient colors={['rgba(30, 41, 59, 0.8)', 'rgba(15, 23, 42, 0.8)']} style={styles.card}>
          <View style={styles.wellnessLeft}>
            <Text style={styles.wellnessTitle}>DAILY WELLNESS</Text>
            <View style={styles.wellnessBarBg}>
               <View style={styles.wellnessBarFill} />
            </View>
            <Text style={styles.wellnessSub}>out of 100</Text>
            
            <View style={styles.startDayButton}>
               <Text style={styles.startDayText}>✨ Start your day</Text>
            </View>
          </View>
          <View style={styles.wellnessRight}>
             <WellnessItem icon="droplet" label="Hydration" value="0%" />
             <WellnessItem icon="moon" label="Sleep" value="--" />
             <WellnessItem icon="check" label="Habits" value="0%" />
             <WellnessItem icon="zap" label="Calories" value="--" />
          </View>
        </LinearGradient>

        <View style={styles.insightCard}>
           <View style={styles.insightHeader}>
             <View style={styles.insightIconWrap}>
               <Feather name="plus" size={16} color="#C084FC" />
             </View>
             <Text style={styles.insightTitle}>AURORA'S INSIGHT</Text>
           </View>
           <Text style={styles.insightText}>Let's start with a simple win today by drinking at least 1L of water to get you closer to your daily hydration goal.</Text>
        </View>

        <View style={styles.hydrationCard}>
           <View style={styles.hydrationLeft}>
              <View style={styles.hydrationIconWrap}>
                 <Feather name="droplet" size={16} color="#38BDF8" />
              </View>
              <Text style={styles.hydrationTitle}>HYDRATION</Text>
              <Text style={styles.hydrationStatus}>Not logged</Text>
           </View>
           <View style={styles.hydrationRight}>
             <Image source={require('../../assets/carousel/carousel_hydration_v2_1781462394513.png')} style={styles.hydrationImg} />
           </View>
        </View>

        <View style={styles.habitCard}>
           <View style={styles.habitHeader}>
             <View style={[styles.insightIconWrap, {backgroundColor: 'rgba(56, 189, 248, 0.1)'}]}>
               <Feather name="check-square" size={16} color="#38BDF8" />
             </View>
             <Text style={[styles.insightTitle, {color: '#38BDF8'}]}>STAY ON TRACK</Text>
           </View>
           <View style={styles.habitList}>
             {habits.map(habit => (
               <View key={habit.id} style={styles.habitRow}>
                 <View style={[styles.habitCheck, habit.status === 'completed' && styles.habitCheckCompleted]}>
                   {habit.status === 'completed' && <Feather name="check" size={14} color="#FFF" />}
                 </View>
                 <Text style={[styles.habitText, habit.status === 'completed' && styles.habitTextCompleted]}>
                   {habit.title}
                 </Text>
               </View>
             ))}
           </View>
        </View>
        </ScrollView>
      )}

      {activeTab === 'habits' && <HabitsTab />}
      {activeTab === 'progress' && <ProgressTab />}
      {activeTab === 'profile' && <ProfileTab />}

      <View style={styles.bottomBar}>
         <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('home')}>
           <Feather name="home" size={24} color={activeTab === 'home' ? '#818CF8' : '#64748B'} />
           <Text style={[styles.tabText, activeTab === 'home' && {color: '#818CF8'}]}>Home</Text>
         </TouchableOpacity>
         <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('habits')}>
           <Feather name="check-square" size={24} color={activeTab === 'habits' ? '#818CF8' : '#64748B'} />
           <Text style={[styles.tabText, activeTab === 'habits' && {color: '#818CF8'}]}>Habits</Text>
         </TouchableOpacity>
         
         <View style={[styles.fabWrapper]}>
           <TouchableOpacity activeOpacity={0.9} onPress={() => setShowChatModal(true)}>
             <LinearGradient colors={['#818CF8', '#38BDF8']} style={styles.fabCenter}>
                <Feather name="mic" size={32} color="#FFF" />
             </LinearGradient>
           </TouchableOpacity>
         </View>

         <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('progress')}>
           <Feather name="bar-chart-2" size={24} color={activeTab === 'progress' ? '#818CF8' : '#64748B'} />
           <Text style={[styles.tabText, activeTab === 'progress' && {color: '#818CF8'}]}>Progress</Text>
         </TouchableOpacity>
         <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('profile')}>
           <Feather name="user" size={24} color={activeTab === 'profile' ? '#818CF8' : '#64748B'} />
           <Text style={[styles.tabText, activeTab === 'profile' && {color: '#818CF8'}]}>Profile</Text>
         </TouchableOpacity>
      </View>

      <Modal visible={showChatModal} animationType="slide" transparent={false}>
        <ChatScreen 
          onClose={() => setShowChatModal(false)} 
          onHydrationLogged={(amt) => setHydration(prev => prev + amt)} 
          onWorkoutGenerated={(workout) => {
             setShowChatModal(false);
             setWorkout(workout);
             setTimeout(() => setShowWorkoutModal(true), 500);
          }}
        />
      </Modal>

      <Modal visible={showWorkoutModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
               <View style={styles.insightIconWrap}>
                 <Feather name="zap" size={20} color="#C084FC" />
               </View>
               <Text style={styles.modalTitle}>{workout?.title || 'Custom Workout'}</Text>
               <TouchableOpacity onPress={() => setShowWorkoutModal(false)} style={styles.closeBtn}>
                 <Feather name="x" size={24} color="#94A3B8" />
               </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{marginTop: 20}}>
              {workout?.exercises?.map((ex: any, idx: number) => (
                <View key={idx} style={styles.exerciseCard}>
                  <Text style={styles.exName}>{ex.name}</Text>
                  <View style={styles.exDetails}>
                    <Text style={styles.exBadge}>{ex.sets} sets</Text>
                    <Text style={styles.exBadge}>{ex.reps} reps</Text>
                    <Text style={styles.exBadge}>{ex.duration}</Text>
                  </View>
                </View>
              ))}
              
              <TouchableOpacity style={styles.startWorkoutBtn} onPress={() => setShowWorkoutModal(false)}>
                <LinearGradient colors={['#818CF8', '#C084FC']} style={styles.startWorkoutGradient}>
                  <Text style={styles.startWorkoutBtnText}>Let's Go!</Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <FoodScannerModal visible={showScannerModal} onClose={() => setShowScannerModal(false)} />
    </View>
  );
}

const WellnessItem = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
  <View style={styles.wellnessItem}>
    <View style={styles.wellnessIconWrap}>
       <Feather name={icon} size={14} color="#94A3B8" />
    </View>
    <Text style={styles.wellnessLabel}>{label}</Text>
    <Text style={styles.wellnessValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0F0F1A', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  bgCircle1: { position: 'absolute', top: -150, right: -100, width: 400, height: 400, borderRadius: 200, backgroundColor: '#2E1E6A', opacity: 0.6 },
  bgCircle2: { position: 'absolute', top: -50, left: -150, width: 300, height: 300, borderRadius: 150, backgroundColor: '#1E2564', opacity: 0.5 },
  container: { padding: 24, paddingTop: 40, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 },
  greetingSub: { fontSize: 16, color: '#F8FAFC', fontWeight: '500' },
  greetingName: { fontSize: 36, fontWeight: '800', color: '#FFFFFF', letterSpacing: -1, marginTop: 4, marginBottom: 4 },
  dateText: { color: '#64748B', fontSize: 16, marginTop: 4 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  profileAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#818CF8', justifyContent: 'center', alignItems: 'center' },
  profileText: { color: '#FFF', fontSize: 18, fontWeight: '700' },

  quickActionsContainer: { flexDirection: 'row', gap: 12, marginBottom: 24, paddingHorizontal: 4 },
  quickActionChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  quickActionText: { color: '#F8FAFC', fontSize: 14, fontWeight: '600', marginLeft: 8 },

  card: { padding: 24, borderRadius: 32, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  wellnessLeft: { flex: 1, borderRightWidth: 1, borderColor: 'rgba(255,255,255,0.2)', paddingRight: 20 },
  wellnessTitle: { color: '#FFFFFF', fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 24, opacity: 0.9 },
  wellnessBarBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 3, marginBottom: 8 },
  wellnessBarFill: { width: '30%', height: '100%', backgroundColor: '#FFFFFF', borderRadius: 3 },
  wellnessSub: { color: '#E2E8F0', fontSize: 12, marginBottom: 32 },
  startDayButton: { backgroundColor: 'rgba(255,255,255,0.2)', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 20, alignSelf: 'flex-start' },
  startDayText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
  
  wellnessRight: { flex: 1, paddingLeft: 20, justifyContent: 'space-between' },
  wellnessItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  wellnessIconWrap: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  wellnessLabel: { flex: 1, color: '#E2E8F0', fontSize: 14, fontWeight: '500' },
  wellnessValue: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  
  insightCard: { backgroundColor: '#1C1C2E', borderRadius: 24, padding: 24, marginBottom: 20 },
  insightHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  insightIconWrap: { width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(192, 132, 252, 0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  insightTitle: { color: '#C084FC', fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  insightText: { color: '#F8FAFC', fontSize: 16, lineHeight: 24, fontWeight: '500' },
  
  hydrationCard: { backgroundColor: '#1C1C2E', borderRadius: 24, flexDirection: 'row', overflow: 'hidden', height: 140 },
  hydrationLeft: { flex: 1, padding: 24, justifyContent: 'center' },
  hydrationIconWrap: { width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(56, 189, 248, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  hydrationTitle: { color: '#38BDF8', fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  hydrationStatus: { color: '#64748B', fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  hydrationRight: { width: 140, backgroundColor: '#0D0D17', justifyContent: 'center', alignItems: 'center' },
  hydrationImg: { width: '150%', height: '150%', opacity: 0.6 },
  
  habitCard: { backgroundColor: '#1C1C2E', borderRadius: 24, padding: 24, marginBottom: 20 },
  habitHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  habitList: { gap: 16 },
  habitRow: { flexDirection: 'row', alignItems: 'center' },
  habitCheck: { width: 24, height: 24, borderRadius: 8, borderWidth: 2, borderColor: '#38BDF8', marginRight: 16, justifyContent: 'center', alignItems: 'center' },
  habitCheckCompleted: { backgroundColor: '#38BDF8' },
  habitText: { color: '#F8FAFC', fontSize: 16, fontWeight: '500' },
  habitTextCompleted: { color: '#64748B', textDecorationLine: 'line-through' },

  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 90, backgroundColor: 'rgba(15, 15, 26, 0.95)', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', borderTopWidth: 1, borderColor: '#1E1E2E' },
  tabItem: { alignItems: 'center', justifyContent: 'center', width: 60 },
  tabText: { fontSize: 10, color: '#64748B', marginTop: 4, fontWeight: '500' },
  fabWrapper: { top: -20 },
  fabCenter: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', shadowColor: '#38BDF8', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 8 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#1C1C2E', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 40, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#FFF', flex: 1, marginLeft: 12 },
  closeBtn: { padding: 8 },
  exerciseCard: { backgroundColor: '#0D0D17', borderRadius: 16, padding: 16, marginBottom: 12 },
  exName: { color: '#F8FAFC', fontSize: 16, fontWeight: '700', marginBottom: 12 },
  exDetails: { flexDirection: 'row', gap: 8 },
  exBadge: { backgroundColor: 'rgba(255,255,255,0.05)', color: '#94A3B8', fontSize: 12, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, overflow: 'hidden' },
  startWorkoutBtn: { marginTop: 24, borderRadius: 16, overflow: 'hidden' },
  startWorkoutGradient: { paddingVertical: 16, alignItems: 'center' },
  startWorkoutBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' }
});
