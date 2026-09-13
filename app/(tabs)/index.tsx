import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppButton from '@/components/AppButton';
import Header from '@/components/Header';
import { COLORS } from '@/constants/colors';

export default function Index() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Header title="QR Attendance" />
          <View style={styles.authorPill}>
            <MaterialIcons name="verified" size={14} color={COLORS.primary} />
            <Text style={styles.authorText}>Created by John Gabriel Cabaluna</Text>
          </View>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <MaterialIcons name="qr-code-scanner" size={34} color={COLORS.textOnPrimary} />
          </View>
          <View style={styles.heroCopy}>
            <Text style={styles.heroLabel}>SCHOOL EVENT ATTENDANCE</Text>
            <Text style={styles.subtitle}>
              Scan your event QR code for a fast and secure attendance record.
            </Text>
          </View>
        </View>

        <View style={styles.actionGroup}>
          <AppButton theme="primary" title="Scan QR Code" icon="qr-code-outline" onPress={() => router.push('/scan')} />
          <AppButton title="Attendance History" icon="time-outline" onPress={() => router.push('/history')} />
          <AppButton title="Profile" icon="person-outline" onPress={() => router.push('/profile')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 20 },
  headerContainer: { alignItems: 'center', marginBottom: 18 },
  authorPill: {
    maxWidth: '100%', flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 999, paddingHorizontal: 14, paddingVertical: 7,
  },
  authorText: { flexShrink: 1, fontSize: 12, fontWeight: '700', color: COLORS.primaryDark },
  heroCard: {
    width: '100%', flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.card, borderRadius: 24,
    borderWidth: 1, borderColor: COLORS.border, padding: 22,
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1, shadowRadius: 16, elevation: 4,
  },
  heroIcon: {
    width: 58, height: 58, borderRadius: 18, backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center', marginRight: 16,
  },
  heroCopy: { flex: 1 },
  heroLabel: { fontSize: 12, fontWeight: '800', color: COLORS.primaryDark, letterSpacing: 0.8, marginBottom: 6 },
  subtitle: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 20 },
  actionGroup: { width: '100%', marginTop: 16 },
});
