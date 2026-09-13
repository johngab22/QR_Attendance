import Ionicons from '@expo/vector-icons/Ionicons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS } from '@/constants/colors';
import { STUDENT_ID } from '@/constants/student';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={42} color={COLORS.textOnPrimary} />
          </View>
          <Text style={styles.name}>Student</Text>
          <Text style={styles.role}>Registered attendee</Text>
          <View style={styles.activePill}>
            <View style={styles.activeDot} />
            <Text style={styles.activeText}>Active profile</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Student details</Text>
        <View style={styles.detailsCard}>
          <ProfileRow icon="id-card-outline" label="Student ID" value={STUDENT_ID} />
          <View style={styles.divider} />
          <ProfileRow icon="school-outline" label="Account type" value="Student" />
          <View style={styles.divider} />
          <ProfileRow icon="qr-code-outline" label="Attendance access" value="QR enabled" />
        </View>

        <View style={styles.tipCard}>
          <View style={styles.tipIcon}>
            <Ionicons name="shield-checkmark-outline" size={22} color={COLORS.primary} />
          </View>
          <View style={styles.tipCopy}>
            <Text style={styles.tipTitle}>Attendance profile ready</Text>
            <Text style={styles.tipText}>
              Use the Scan tab to record attendance and History to review past check-ins.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileRow({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={20} color={COLORS.primary} />
      </View>
      <View style={styles.rowCopy}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20, paddingBottom: 36 },
  profileCard: {
    alignItems: 'center', backgroundColor: COLORS.primary, borderRadius: 26,
    paddingVertical: 26, paddingHorizontal: 20, marginBottom: 24,
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2, shadowRadius: 16, elevation: 6,
  },
  avatar: {
    width: 84, height: 84, borderRadius: 42, backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.32)', justifyContent: 'center', alignItems: 'center',
    marginBottom: 14,
  },
  name: { fontSize: 24, fontWeight: '800', color: COLORS.textOnPrimary },
  role: { marginTop: 3, fontSize: 14, color: '#DCE4FF' },
  activePill: {
    flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 14,
    backgroundColor: COLORS.card, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7,
  },
  activeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.success },
  activeText: { fontSize: 12, fontWeight: '800', color: COLORS.success },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: 0.7, marginBottom: 10 },
  detailsCard: {
    backgroundColor: COLORS.card, borderRadius: 20, borderWidth: 1,
    borderColor: COLORS.border, paddingHorizontal: 16, marginBottom: 16,
  },
  row: { minHeight: 72, flexDirection: 'row', alignItems: 'center' },
  rowIcon: {
    width: 42, height: 42, borderRadius: 14, backgroundColor: COLORS.surface,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  rowCopy: { flex: 1 },
  rowLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 2 },
  rowValue: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  divider: { height: 1, backgroundColor: COLORS.border, marginLeft: 54 },
  tipCard: {
    flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: 18,
    padding: 16, alignItems: 'flex-start',
  },
  tipIcon: {
    width: 42, height: 42, borderRadius: 14, backgroundColor: COLORS.card,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  tipCopy: { flex: 1 },
  tipTitle: { fontSize: 14, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 4 },
  tipText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19 },
});
