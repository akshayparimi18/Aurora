import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function ProgressTab() {
  const [aiPlan, setAiPlan] = useState<any>(null);

  useEffect(() => {
    AsyncStorage.getItem('@aurora_ai_plan').then(plan => {
      if (plan) setAiPlan(JSON.parse(plan));
    });
  }, []);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Dummy data for charts
  const hydrationData = [30, 40, 60, 50, 80, 40, 70];
  const sleepData = [6, 7, 5, 8, 7.5, 9, 6.5];

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton}>
          <Feather name="chevron-left" size={24} color="#F8FAFC" />
        </TouchableOpacity>
        <View>
           <Text style={styles.headerTitle}>Progress</Text>
           <Text style={styles.headerSub}>Your health trends</Text>
        </View>
        <View style={{width: 40}} /> 
      </View>

      {/* Tabs */}
      <View style={styles.timeTabs}>
         <View style={[styles.timeTab, styles.timeTabActive]}>
           <Text style={[styles.timeTabText, {color: '#FFF'}]}>Week</Text>
         </View>
         <View style={styles.timeTab}>
           <Text style={styles.timeTabText}>Month</Text>
         </View>
         <View style={styles.timeTab}>
           <Text style={styles.timeTabText}>3 Months</Text>
         </View>
      </View>

      {/* Averages Row */}
      <View style={styles.avgRow}>
         <View style={styles.avgCard}>
            <Feather name="droplet" size={20} color="#38BDF8" style={{marginBottom: 8}} />
            <Text style={styles.avgValue}>2.1L</Text>
            <Text style={styles.avgLabel}>Hyd. Avg</Text>
         </View>
         <View style={[styles.avgCard, {borderColor: '#FACC15'}]}>
            <Feather name="moon" size={20} color="#FACC15" style={{marginBottom: 8}} />
            <Text style={[styles.avgValue, {color: '#FACC15'}]}>7.0h</Text>
            <Text style={styles.avgLabel}>Sleep Avg</Text>
         </View>
         <View style={styles.avgCard}>
            <Feather name="check" size={20} color="#4ADE80" style={{marginBottom: 8}} />
            <Text style={[styles.avgValue, {color: '#4ADE80'}]}>3/5</Text>
            <Text style={styles.avgLabel}>Habits Avg</Text>
         </View>
      </View>

      {/* AI Summary */}
      <LinearGradient colors={['rgba(129, 140, 248, 0.15)', 'rgba(192, 132, 252, 0.15)']} style={styles.summaryCard}>
         <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 12}}>
           <Feather name="star" size={16} color="#C084FC" style={{marginRight: 8}} />
           <Text style={styles.summaryTitle}>Aurora's Summary</Text>
         </View>
         <Text style={styles.summaryText}>
           {aiPlan ? `You are doing great! Keep following your ${aiPlan.target_calories} calorie goal and you will see results soon.` : `Start logging your health data to see personalised progress insights here.`}
         </Text>
      </LinearGradient>

      {/* Hydration Chart */}
      <View style={styles.chartCard}>
         <View style={styles.chartHeader}>
           <View style={{flexDirection: 'row', alignItems: 'center'}}>
             <Feather name="droplet" size={16} color="#38BDF8" style={{marginRight: 8}} />
             <Text style={styles.chartTitle}>Hydration %</Text>
           </View>
           <Text style={styles.chartStatus}>On track</Text>
         </View>
         
         <View style={styles.chartBars}>
            {hydrationData.map((val, idx) => (
               <View key={idx} style={styles.barContainer}>
                  <View style={[styles.barFill, {height: `${val}%`, backgroundColor: '#38BDF8'}]} />
                  <Text style={styles.barLabel}>{days[idx]}</Text>
               </View>
            ))}
         </View>
      </View>

      {/* Sleep Chart */}
      <View style={styles.chartCard}>
         <View style={styles.chartHeader}>
           <View style={{flexDirection: 'row', alignItems: 'center'}}>
             <Feather name="moon" size={16} color="#FACC15" style={{marginRight: 8}} />
             <Text style={styles.chartTitle}>Sleep Hours</Text>
           </View>
           <Text style={[styles.chartStatus, {color: '#FACC15'}]}>7.0h avg</Text>
         </View>
         
         <View style={styles.chartBars}>
            {sleepData.map((val, idx) => (
               <View key={idx} style={styles.barContainer}>
                  <View style={[styles.barFill, {height: `${(val / 10) * 100}%`, backgroundColor: '#FACC15'}]} />
                  <Text style={styles.barLabel}>{days[idx]}</Text>
               </View>
            ))}
         </View>
      </View>
      
      {/* Achievements Grid */}
      <Text style={styles.sectionTitle}>ACHIEVEMENTS</Text>
      <View style={styles.achievementsGrid}>
         {[1,2,3,4,5,6].map((i) => (
            <View key={i} style={styles.achievementCard}>
               <Feather name="lock" size={24} color="#334155" style={{marginBottom: 12}} />
               <Text style={styles.achTitle}>Locked</Text>
            </View>
         ))}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingBottom: 120 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  iconButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: '#FFF', fontSize: 24, fontWeight: '800' },
  headerSub: { color: '#64748B', fontSize: 14 },
  
  timeTabs: { flexDirection: 'row', backgroundColor: '#1C1C2E', borderRadius: 16, padding: 4, marginBottom: 24 },
  timeTab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  timeTabActive: { backgroundColor: 'rgba(255,255,255,0.1)' },
  timeTabText: { color: '#64748B', fontSize: 14, fontWeight: '600' },

  avgRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  avgCard: { flex: 1, backgroundColor: '#1C1C2E', borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  avgValue: { color: '#38BDF8', fontSize: 20, fontWeight: '800', marginBottom: 4 },
  avgLabel: { color: '#64748B', fontSize: 12, fontWeight: '500' },

  summaryCard: { padding: 24, borderRadius: 24, marginBottom: 24 },
  summaryTitle: { color: '#C084FC', fontSize: 16, fontWeight: '700' },
  summaryText: { color: '#F8FAFC', fontSize: 16, lineHeight: 24, fontWeight: '500' },

  chartCard: { backgroundColor: '#1C1C2E', borderRadius: 24, padding: 24, marginBottom: 24 },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  chartTitle: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  chartStatus: { color: '#38BDF8', fontSize: 14, fontWeight: '600' },
  chartBars: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 120 },
  barContainer: { alignItems: 'center', flex: 1 },
  barFill: { width: 24, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4, marginBottom: 8 },
  barLabel: { color: '#64748B', fontSize: 10, fontWeight: '600' },

  sectionTitle: { color: '#64748B', fontSize: 12, fontWeight: '800', letterSpacing: 1.5, marginBottom: 16, marginTop: 8 },
  achievementsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  achievementCard: { width: '30%', aspectRatio: 0.8, backgroundColor: '#1C1C2E', borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  achTitle: { color: '#64748B', fontSize: 12, fontWeight: '600' }
});
