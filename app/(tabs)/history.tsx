import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { COLORS } from '@/constants/colors';
import { STUDENT_ID } from '@/constants/student';
import { type AttendanceRecord, getAttendanceHistory } from '@/lib/database';

export default function HistoryScreen() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    const data = await getAttendanceHistory(STUDENT_ID);
    setRecords(data);
    setLoading(false);
  };

  const renderItem = ({ item }: { item: AttendanceRecord }) => (
    <View style={styles.recordCard}>
      <View style={styles.recordIcon}>
        <Ionicons name="checkmark" size={20} color={COLORS.primary} />
      </View>
      <View style={styles.recordBody}>
        <Text style={styles.recordTitle}>{item.eventTitle}</Text>
        <Text style={styles.recordId}>Event: {item.eventId}</Text>
        <View style={styles.timeRow}>
          <Ionicons name="time-outline" size={13} color={COLORS.textSecondary} />
          <Text style={styles.recordTime}>
            {' '}
            {new Date(item.scannedAt).toLocaleString()}
          </Text>
        </View>
      </View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Present</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerTextWrap}>
          <Text style={styles.title}>Attendance History</Text>
          <Text style={styles.subtitle}>
            Your past attendance records will appear here.
          </Text>
        </View>
        {!loading && records.length > 0 && (
          <View style={styles.countPill}>
            <Text style={styles.countText}>{records.length}</Text>
          </View>
        )}
      </View>

      {loading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : records.length === 0 ? (
        <View style={styles.emptyWrap}>
          <View style={styles.emptyIcon}>
            <Ionicons name="receipt-outline" size={30} color={COLORS.primary} />
          </View>
          <Text style={styles.empty}>No attendance records yet.</Text>
        </View>
      ) : (
        <FlatList
          data={records}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTextWrap: { flex: 1, paddingRight: 12 },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  countPill: {
    backgroundColor: COLORS.surface,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginTop: 2,
  },
  countText: { fontSize: 14, fontWeight: '800', color: COLORS.primary },
  loading: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 24,
  },
  emptyWrap: { alignItems: 'center', marginTop: 48 },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  empty: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 40,
  },
  recordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    marginBottom: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },
  recordIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recordBody: { flex: 1 },
  recordTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  recordId: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordTime: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  badge: {
    backgroundColor: COLORS.successSoft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: { fontSize: 11, fontWeight: '700', color: COLORS.success },
});
