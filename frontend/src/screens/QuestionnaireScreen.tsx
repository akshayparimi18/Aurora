import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
interface QuestionnaireScreenProps {
  onComplete: () => void;
}

export function QuestionnaireScreen({ onComplete }: QuestionnaireScreenProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  // Step 1 State
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');

  
  // Step 2 State
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activity, setActivity] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState('Weight Loss');
  const [wakeUpTime, setWakeUpTime] = useState('');
  const [bedtime, setBedtime] = useState('');

  // Step 3 State
  const [goals, setGoals] = useState<string[]>([]);

  // Step 4 State
  const [waterTarget, setWaterTarget] = useState('2.5L');
  const [sleepTarget, setSleepTarget] = useState('8 hrs');

  // Step 5 State
  const [hydrationReminders, setHydrationReminders] = useState(true);
  const [sleepReminders, setSleepReminders] = useState(true);

  // ... (in the component)

  const [isGenerating, setIsGenerating] = useState(false);

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      if (name) {
        await AsyncStorage.setItem('@aurora_user_name', name);
      }
      
      setIsGenerating(true);
      try {
        const payload = {
          height, 
          weight, 
          goal: fitnessGoal, 
          age: age || "25", 
          gender: gender || "Not specified", 
          wakeUpTime: wakeUpTime || "7:00 AM", 
          bedtime: bedtime || "10:30 PM"
        };
        const response = await fetch('http://192.168.1.4:8000/api/plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (response.ok) {
          const plan = await response.json();
          await AsyncStorage.setItem('@aurora_ai_plan', JSON.stringify(plan));
        }
      } catch (err) {
        console.error("Failed to generate plan", err);
      }
      setIsGenerating(false);
      onComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const toggleGoal = (goal: string) => {
    if (goals.includes(goal)) {
      setGoals(goals.filter(g => g !== goal));
    } else {
      setGoals([...goals, goal]);
    }
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      {Array.from({ length: totalSteps }).map((_, i) => (
        <View key={i} style={[styles.progressSegment, i < step ? styles.activeProgress : {}]} />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {renderProgressBar()}
        <Text style={styles.stepText}>Step {step} of {totalSteps}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {step === 1 && (
          <View>
            <Text style={styles.title}>Welcome to Aurora</Text>
            <Text style={styles.subtitle}>Let's personalise your experience.</Text>
            
            <Text style={[styles.label, {marginTop: 20}]}>First Name</Text>
            <View style={styles.inputWrapper}>
              <Feather name="user" size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="e.g. Alex"
                placeholderTextColor="#64748B"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={{flexDirection: 'row', gap: 16, marginTop: 24}}>
              <View style={{flex: 1}}>
                <Text style={styles.label}>Age</Text>
                <TextInput
                  style={[styles.input, {backgroundColor: 'rgba(255, 255, 255, 0.05)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 12, paddingHorizontal: 16}]}
                  placeholder="25"
                  placeholderTextColor="#64748B"
                  keyboardType="numeric"
                  value={age}
                  onChangeText={setAge}
                />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.label}>Gender</Text>
                <TextInput
                  style={[styles.input, {backgroundColor: 'rgba(255, 255, 255, 0.05)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 12, paddingHorizontal: 16}]}
                  placeholder="M/F/Other"
                  placeholderTextColor="#64748B"
                  value={gender}
                  onChangeText={setGender}
                />
              </View>
            </View>
          </View>
        )}

        {step === 2 && (
          <View>
            <Text style={styles.title}>Body & lifestyle</Text>
            <Text style={styles.subtitle}>Helps Aurora personalise your calorie and activity recommendations.</Text>
            
            <View style={{flexDirection: 'row', gap: 16, marginBottom: 24}}>
              <View style={{flex: 1}}>
                <Text style={styles.label}>Height (cm)</Text>
                <TextInput
                  style={[styles.input, {backgroundColor: 'rgba(255, 255, 255, 0.05)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 12, paddingHorizontal: 16}]}
                  placeholder="e.g. 175"
                  placeholderTextColor="#64748B"
                  keyboardType="numeric"
                  value={height}
                  onChangeText={setHeight}
                />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.label}>Weight (kg)</Text>
                <TextInput
                  style={[styles.input, {backgroundColor: 'rgba(255, 255, 255, 0.05)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 12, paddingHorizontal: 16}]}
                  placeholder="e.g. 70"
                  placeholderTextColor="#64748B"
                  keyboardType="numeric"
                  value={weight}
                  onChangeText={setWeight}
                />
              </View>
            </View>

            <View style={{flexDirection: 'row', gap: 16, marginBottom: 24}}>
              <View style={{flex: 1}}>
                <Text style={styles.label}>Wake-up Time</Text>
                <TextInput
                  style={[styles.input, {backgroundColor: 'rgba(255, 255, 255, 0.05)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 12, paddingHorizontal: 16}]}
                  placeholder="7:00 AM"
                  placeholderTextColor="#64748B"
                  value={wakeUpTime}
                  onChangeText={setWakeUpTime}
                />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.label}>Bedtime</Text>
                <TextInput
                  style={[styles.input, {backgroundColor: 'rgba(255, 255, 255, 0.05)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 12, paddingHorizontal: 16}]}
                  placeholder="10:30 PM"
                  placeholderTextColor="#64748B"
                  value={bedtime}
                  onChangeText={setBedtime}
                />
              </View>
            </View>

            <Text style={styles.label}>Activity Level</Text>
            <View style={styles.tagRow}>
              {['Sedentary', 'Light', 'Moderate', 'Active', 'Very Active'].map(a => (
                <TouchableOpacity 
                  key={a} 
                  style={[styles.tag, activity === a && {borderColor: '#818CF8', backgroundColor: 'rgba(129, 140, 248, 0.1)'}]}
                  onPress={() => setActivity(a)}
                >
                  <Text style={[styles.tagText, activity === a && {color: '#818CF8'}]}>{a}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, {marginTop: 24}]}>Primary Goal</Text>
            <View style={styles.tagRow}>
              {['Weight Loss', 'Muscle Gain', 'Weight Gain', 'Maintenance'].map(g => (
                <TouchableOpacity 
                  key={g} 
                  style={[styles.tag, fitnessGoal === g && {borderColor: '#818CF8', backgroundColor: 'rgba(129, 140, 248, 0.1)'}]}
                  onPress={() => setFitnessGoal(g)}
                >
                  <Text style={[styles.tagText, fitnessGoal === g && {color: '#818CF8'}]}>{g}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, {marginTop: 24}]}>Bedtime</Text>
            <View style={styles.tagRow}>
              {['9:00 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM', '12:00 AM'].map(t => (
                <TouchableOpacity 
                  key={t} 
                  style={[styles.tag, bedtime === t && {borderColor: '#FBBF24', backgroundColor: 'rgba(251, 191, 36, 0.1)'}]}
                  onPress={() => setBedtime(t)}
                >
                  <Text style={[styles.tagText, bedtime === t && {color: '#FBBF24'}]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {step === 3 && (
          <View>
            <Text style={styles.title}>What are your goals?</Text>
            <Text style={styles.subtitle}>Choose all that apply — Aurora adapts to your priorities.</Text>
            <View style={styles.tagWrapContainer}>
              {['Lose weight', 'Build muscle', 'Improve sleep', 'Reduce stress', 'Stay healthy', 'More energy'].map(goal => (
                <TouchableOpacity 
                  key={goal} 
                  style={[styles.wrapTag, goals.includes(goal) && styles.activeTag]}
                  onPress={() => toggleGoal(goal)}
                >
                  <Text style={[styles.tagText, goals.includes(goal) && styles.activeTagText]}>{goal}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {step === 4 && (
          <View>
            <Text style={styles.title}>Set your daily targets</Text>
            <Text style={styles.subtitle}>Aurora will help you hit these every single day.</Text>
            
            <View style={styles.targetSection}>
              <View style={styles.targetHeader}>
                <Feather name="droplet" size={18} color="#38BDF8" />
                <Text style={styles.targetTitle}>Daily Water Goal</Text>
              </View>
              <View style={styles.tagRow}>
                {['1.5L', '2.0L', '2.5L', '3.0L'].map(t => (
                  <TouchableOpacity key={t} style={[styles.targetTag, waterTarget === t && styles.activeTargetTagBorder]} onPress={() => setWaterTarget(t)}>
                    <Text style={[styles.tagText, waterTarget === t && styles.activeTargetTagText]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.targetSection}>
              <View style={styles.targetHeader}>
                <Feather name="moon" size={18} color="#FBBF24" />
                <Text style={styles.targetTitle}>Sleep Goal</Text>
              </View>
              <View style={styles.tagRow}>
                {['6 hrs', '7 hrs', '8 hrs', '9 hrs'].map(t => (
                  <TouchableOpacity key={t} style={[styles.targetTag, sleepTarget === t && styles.activeTargetTagBorderYellow]} onPress={() => setSleepTarget(t)}>
                    <Text style={[styles.tagText, sleepTarget === t && styles.activeTargetTagTextYellow]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {step === 5 && (
          <View>
            <Text style={styles.title}>Stay on track</Text>
            <Text style={styles.subtitle}>Aurora will send gentle reminders to help you build consistency.</Text>
            
            <View style={styles.reminderCard}>
              <View style={styles.reminderInfo}>
                <View style={[styles.iconCircle, {backgroundColor: 'rgba(56, 189, 248, 0.2)'}]}>
                  <View style={[styles.dot, {backgroundColor: '#38BDF8'}]} />
                </View>
                <View>
                  <Text style={styles.reminderTitle}>Hydration Reminders</Text>
                  <Text style={styles.reminderDesc}>Remind me to drink water</Text>
                </View>
              </View>
              <Switch value={hydrationReminders} onValueChange={setHydrationReminders} trackColor={{ false: '#334155', true: '#38BDF8' }} />
            </View>

            <View style={styles.reminderCard}>
              <View style={styles.reminderInfo}>
                <View style={[styles.iconCircle, {backgroundColor: 'rgba(251, 191, 36, 0.2)'}]}>
                  <View style={[styles.dot, {backgroundColor: '#FBBF24'}]} />
                </View>
                <View>
                  <Text style={styles.reminderTitle}>Sleep Reminders</Text>
                  <Text style={styles.reminderDesc}>Bedtime & wake-up nudges</Text>
                </View>
              </View>
              <Switch value={sleepReminders} onValueChange={setSleepReminders} trackColor={{ false: '#334155', true: '#FBBF24' }} />
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {step > 1 && (
          <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
            <Feather name="chevron-left" size={20} color="#94A3B8" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={[styles.nextBtnWrapper, isGenerating && {opacity: 0.7}]} onPress={handleNext} disabled={isGenerating}>
          <LinearGradient
            colors={['#5E8CFF', '#38BDF8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextBtn}
          >
            <Text style={styles.nextText}>{step === totalSteps ? "Let's go! ✨" : "Continue"}</Text>
            {step < totalSteps && <Feather name="chevron-right" size={20} color="#FFF" />}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A1A', paddingHorizontal: 24 },
  header: { marginTop: 20, marginBottom: 40 },
  progressContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  progressSegment: { flex: 1, height: 4, backgroundColor: '#1E1B4B', borderRadius: 2, marginRight: 8 },
  activeProgress: { backgroundColor: '#818CF8' },
  stepText: { color: '#64748B', fontSize: 12, fontWeight: '600' },
  content: { flex: 1 },
  title: { fontSize: 32, fontWeight: '800', color: '#FFF', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#94A3B8', marginBottom: 32, lineHeight: 24 },
  label: { color: '#E2E8F0', fontSize: 14, fontWeight: '600', marginBottom: 12 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#13132D', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', borderRadius: 12, paddingHorizontal: 16 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, paddingVertical: 16, color: '#FFF', fontSize: 16 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tag: { paddingVertical: 12, paddingHorizontal: 20, backgroundColor: '#13132D', borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  tagText: { color: '#94A3B8', fontSize: 14, fontWeight: '600' },
  activeTag: { backgroundColor: 'rgba(129, 140, 248, 0.1)', borderColor: '#818CF8' },
  activeTagText: { color: '#818CF8' },
  tagWrapContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  wrapTag: { paddingVertical: 14, paddingHorizontal: 20, backgroundColor: '#13132D', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  targetSection: { marginBottom: 32 },
  targetHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  targetTitle: { color: '#94A3B8', fontSize: 14, fontWeight: '600', marginLeft: 8 },
  targetTag: { flex: 1, paddingVertical: 12, alignItems: 'center', backgroundColor: '#13132D', borderRadius: 12, borderWidth: 1, borderColor: 'transparent' },
  activeTargetTagBorder: { borderColor: '#38BDF8', backgroundColor: 'rgba(56, 189, 248, 0.1)' },
  activeTargetTagText: { color: '#38BDF8' },
  activeTargetTagBorderYellow: { borderColor: '#FBBF24', backgroundColor: 'rgba(251, 191, 36, 0.1)' },
  activeTargetTagTextYellow: { color: '#FBBF24' },
  reminderCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#13132D', padding: 16, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  reminderInfo: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  reminderTitle: { color: '#FFF', fontSize: 16, fontWeight: '600', marginBottom: 4 },
  reminderDesc: { color: '#64748B', fontSize: 12 },
  footer: { flexDirection: 'row', alignItems: 'center', paddingBottom: 60, paddingTop: 10 },
  backBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20, backgroundColor: '#13132D', borderRadius: 16, marginRight: 12 },
  backText: { color: '#94A3B8', fontSize: 16, fontWeight: '600', marginLeft: 4 },
  nextBtnWrapper: { flex: 1 },
  nextBtn: { height: 56, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  nextText: { color: '#FFF', fontSize: 18, fontWeight: '600', marginRight: 8 },
});
