import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

interface FoodScannerProps {
  visible: boolean;
  onClose: () => void;
}

export function FoodScannerModal({ visible, onClose }: FoodScannerProps) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return;

    const res = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (!res.canceled && res.assets[0]) {
      setImageUri(res.assets[0].uri);
      scanFood(res.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (!res.canceled && res.assets[0]) {
      setImageUri(res.assets[0].uri);
      scanFood(res.assets[0].uri);
    }
  };

  const scanFood = async (uri: string) => {
    setIsScanning(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', {
        uri,
        name: 'food.jpg',
        type: 'image/jpeg',
      } as any);

      const response = await fetch('http://192.168.1.4:8000/api/vision', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        console.error("Backend vision error", await response.text());
      }
    } catch (err) {
      console.error("Vision upload error", err);
    } finally {
      setIsScanning(false);
    }
  };

  const reset = () => {
    setImageUri(null);
    setResult(null);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>AI Food Scanner</Text>
            <TouchableOpacity onPress={() => { reset(); onClose(); }}>
              <Feather name="x" size={24} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {!imageUri ? (
            <View style={styles.actionContainer}>
               <Feather name="camera" size={64} color="#334155" style={{marginBottom: 24}} />
               <Text style={styles.hintText}>Snap a picture of your meal to instantly estimate calories and macros.</Text>
               
               <View style={styles.btnRow}>
                 <TouchableOpacity style={styles.primaryBtn} onPress={takePhoto}>
                   <Feather name="camera" size={20} color="#FFF" style={{marginRight: 8}} />
                   <Text style={styles.btnText}>Take Photo</Text>
                 </TouchableOpacity>
                 <TouchableOpacity style={styles.secondaryBtn} onPress={pickImage}>
                   <Feather name="image" size={20} color="#818CF8" style={{marginRight: 8}} />
                   <Text style={[styles.btnText, {color: '#818CF8'}]}>Gallery</Text>
                 </TouchableOpacity>
               </View>
            </View>
          ) : (
            <View style={styles.resultContainer}>
               <Image source={{uri: imageUri}} style={styles.previewImage} />
               
               {isScanning ? (
                 <View style={styles.scanningBox}>
                    <ActivityIndicator size="large" color="#C084FC" />
                    <Text style={styles.scanningText}>Analyzing macros using Llama Vision...</Text>
                 </View>
               ) : result ? (
                 <LinearGradient colors={['rgba(129, 140, 248, 0.1)', 'rgba(192, 132, 252, 0.1)']} style={styles.macroCard}>
                    <Text style={styles.mealName}>{result.meal_name}</Text>
                    
                    <View style={styles.calorieRow}>
                      <Text style={styles.calValue}>{result.calories}</Text>
                      <Text style={styles.calLabel}>kcal</Text>
                    </View>

                    <View style={styles.macroGrid}>
                       <View style={styles.macroBox}>
                         <Text style={[styles.mValue, {color: '#F43F5E'}]}>{result.protein_g}g</Text>
                         <Text style={styles.mLabel}>Protein</Text>
                       </View>
                       <View style={styles.macroBox}>
                         <Text style={[styles.mValue, {color: '#FACC15'}]}>{result.carbs_g}g</Text>
                         <Text style={styles.mLabel}>Carbs</Text>
                       </View>
                       <View style={styles.macroBox}>
                         <Text style={[styles.mValue, {color: '#38BDF8'}]}>{result.fat_g}g</Text>
                         <Text style={styles.mLabel}>Fat</Text>
                       </View>
                    </View>

                    <TouchableOpacity style={styles.logBtn} onPress={() => { reset(); onClose(); }}>
                      <Text style={styles.logBtnText}>Log this meal</Text>
                    </TouchableOpacity>
                 </LinearGradient>
               ) : (
                 <TouchableOpacity style={styles.secondaryBtn} onPress={reset}>
                   <Text style={[styles.btnText, {color: '#818CF8'}]}>Try Again</Text>
                 </TouchableOpacity>
               )}
            </View>
          )}

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#1C1C2E', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 40, minHeight: 400 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { color: '#FFF', fontSize: 20, fontWeight: '700' },
  
  actionContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  hintText: { color: '#94A3B8', textAlign: 'center', fontSize: 16, lineHeight: 24, marginBottom: 32, paddingHorizontal: 20 },
  btnRow: { flexDirection: 'row', gap: 16 },
  primaryBtn: { flex: 1, flexDirection: 'row', backgroundColor: '#818CF8', paddingVertical: 16, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  secondaryBtn: { flex: 1, flexDirection: 'row', backgroundColor: 'rgba(129, 140, 248, 0.1)', borderWidth: 1, borderColor: 'rgba(129, 140, 248, 0.2)', paddingVertical: 16, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  btnText: { fontSize: 16, fontWeight: '700', color: '#FFF' },

  resultContainer: { alignItems: 'center' },
  previewImage: { width: '100%', height: 200, borderRadius: 20, marginBottom: 24 },
  
  scanningBox: { alignItems: 'center', padding: 24 },
  scanningText: { color: '#C084FC', marginTop: 16, fontSize: 16, fontWeight: '600' },

  macroCard: { width: '100%', padding: 24, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  mealName: { color: '#F8FAFC', fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: 16 },
  calorieRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', marginBottom: 24 },
  calValue: { color: '#818CF8', fontSize: 48, fontWeight: '800' },
  calLabel: { color: '#94A3B8', fontSize: 16, fontWeight: '600', marginLeft: 8 },
  
  macroGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  macroBox: { alignItems: 'center', flex: 1 },
  mValue: { fontSize: 24, fontWeight: '800', marginBottom: 4 },
  mLabel: { color: '#64748B', fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },

  logBtn: { backgroundColor: '#818CF8', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  logBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' }
});
