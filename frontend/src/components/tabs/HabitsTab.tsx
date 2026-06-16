import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export function HabitsTab() {
  const [habits, setHabits] = useState([
    { id: '1', title: 'Morning Meditation', status: 'pending', streak: 4 },
    { id: '2', title: 'Drink 2L Water', status: 'completed', streak: 12 },
    { id: '3', title: 'Read 10 Pages', status: 'pending', streak: 0 }
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHabit, setNewHabit] = useState('');

  const addHabit = () => {
    if (newHabit.trim()) {
      setHabits([{ id: Date.now().toString(), title: newHabit, status: 'pending', streak: 0 }, ...habits]);
      setNewHabit('');
      setShowAddModal(false);
    }
  };

  const toggleHabit = (id: string) => {
    setHabits(habits.map(h => h.id === id ? { ...h, status: h.status === 'completed' ? 'pending' : 'completed' } : h));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="chevron-left" size={24} color="#F8FAFC" />
          </TouchableOpacity>
          <View>
             <Text style={styles.headerTitle}>Habits</Text>
             <Text style={styles.headerSub}>Today's streak builders</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddModal(true)}>
          <Feather name="plus" size={20} color="#818CF8" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 100}}>
        <Text style={styles.sectionTitle}>TODAY'S HABITS</Text>
        <View style={styles.habitList}>
          {habits.map(habit => (
            <View key={habit.id} style={styles.habitCard}>
              <TouchableOpacity style={[styles.checkbox, habit.status === 'completed' && styles.checkboxChecked]} onPress={() => toggleHabit(habit.id)}>
                {habit.status === 'completed' && <Feather name="check" size={16} color="#FFF" />}
              </TouchableOpacity>
              <View style={styles.habitInfo}>
                <Text style={[styles.habitTitle, habit.status === 'completed' && styles.habitTitleDone]}>{habit.title}</Text>
                <Text style={styles.streakText}>
                  {habit.streak > 0 ? `🔥 ${habit.streak} day streak` : 'Start your streak today'}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Add Habit Modal */}
      <Modal visible={showAddModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Habit</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Read 20 pages"
              placeholderTextColor="#64748B"
              value={newHabit}
              onChangeText={setNewHabit}
              autoFocus
            />
            <View style={styles.modalActions}>
               <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowAddModal(false)}>
                 <Text style={styles.cancelText}>Cancel</Text>
               </TouchableOpacity>
               <TouchableOpacity style={styles.saveBtn} onPress={addHabit}>
                 <Text style={styles.saveText}>Add Habit</Text>
               </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: '#FFF', fontSize: 24, fontWeight: '800' },
  headerSub: { color: '#64748B', fontSize: 14 },
  addBtn: { width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(129, 140, 248, 0.1)', borderWidth: 1, borderColor: 'rgba(129, 140, 248, 0.2)', justifyContent: 'center', alignItems: 'center' },
  
  sectionTitle: { color: '#64748B', fontSize: 12, fontWeight: '800', letterSpacing: 1.5, marginBottom: 16 },
  habitList: { gap: 16 },
  habitCard: { backgroundColor: '#1C1C2E', borderRadius: 24, padding: 20, flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: 28, height: 28, borderRadius: 8, borderWidth: 2, borderColor: '#64748B', marginRight: 16, justifyContent: 'center', alignItems: 'center' },
  checkboxChecked: { backgroundColor: '#818CF8', borderColor: '#818CF8' },
  habitInfo: { flex: 1 },
  habitTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: '700', marginBottom: 4 },
  habitTitleDone: { color: '#64748B', textDecorationLine: 'line-through' },
  streakText: { color: '#94A3B8', fontSize: 14 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 24 },
  modalContent: { backgroundColor: '#1C1C2E', borderRadius: 24, padding: 24 },
  modalTitle: { color: '#FFF', fontSize: 20, fontWeight: '700', marginBottom: 20 },
  input: { backgroundColor: '#0D0D17', color: '#FFF', borderRadius: 12, padding: 16, fontSize: 16, marginBottom: 24 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  cancelBtn: { paddingVertical: 12, paddingHorizontal: 20 },
  cancelText: { color: '#94A3B8', fontSize: 16, fontWeight: '600' },
  saveBtn: { backgroundColor: '#818CF8', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12 },
  saveText: { color: '#FFF', fontSize: 16, fontWeight: '600' }
});
