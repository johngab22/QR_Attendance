import { createElement, useState } from 'react';
import {
  Platform,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import QRCode from 'react-native-qrcode-svg';

import AppButton from '@/components/AppButton';
import PickerField from '@/components/PickerField';
import { COLORS } from '@/constants/colors';
import { createEvent } from '@/lib/database';

const isWeb = Platform.OS === 'web';

function toLocalISO(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:00`
  );
}

function formatDateTime(date: Date) {
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDateTimeInput(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}

function WebDateTimeInput({
  label,
  value,
  onChange,
  min,
}: {
  label: string;
  value: Date;
  onChange: (value: Date) => void;
  min?: Date;
}) {
  return createElement('input', {
    'aria-label': label,
    type: 'datetime-local',
    value: formatDateTimeInput(value),
    min: min ? formatDateTimeInput(min) : undefined,
    onChange: (event: { currentTarget: { value: string } }) => {
      const selected = new Date(event.currentTarget.value);
      if (!Number.isNaN(selected.getTime())) onChange(selected);
    },
    style: webDateTimeInputStyle,
  });
}

const webDateTimeInputStyle = {
  width: '100%',
  minHeight: 56,
  boxSizing: 'border-box' as const,
  border: `1px solid ${COLORS.border}`,
  borderRadius: 14,
  backgroundColor: COLORS.background,
  color: COLORS.textPrimary,
  fontSize: 15,
  fontWeight: 600,
  padding: '12px 14px',
  cursor: 'pointer',
  outlineColor: COLORS.primary,
};

export default function TeacherScreen() {
  const [title, setTitle] = useState('');
  const [eventId, setEventId] = useState('');
  const [startDate, setStartDate] = useState(() => new Date());
  const [endDate, setEndDate] = useState(
    () => new Date(Date.now() + 60 * 60 * 1000)
  );
  const [editTarget, setEditTarget] = useState<'start' | 'end' | null>(null);
  const [editingPart, setEditingPart] = useState<'date' | 'time'>('date');
  const [draftDate, setDraftDate] = useState(() => new Date());
  const [payload, setPayload] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const openPicker = (target: 'start' | 'end') => {
    setDraftDate(new Date(target === 'start' ? startDate : endDate));
    setEditTarget(target);
    setEditingPart('date');
  };

  const updateStartDate = (selected: Date) => {
    const duration = Math.max(
      endDate.getTime() - startDate.getTime(),
      60 * 60 * 1000
    );
    setStartDate(selected);
    if (endDate.getTime() <= selected.getTime()) {
      setEndDate(new Date(selected.getTime() + duration));
    }
  };

  const onPickerChange = (_: DateTimePickerEvent, selected?: Date) => {
    if (!selected) return;
    setDraftDate((current) =>
      editingPart === 'date'
        ? new Date(selected.getFullYear(), selected.getMonth(), selected.getDate(), current.getHours(), current.getMinutes())
        : new Date(current.getFullYear(), current.getMonth(), current.getDate(), selected.getHours(), selected.getMinutes())
    );
  };

  const confirmPicker = () => {
    if (editTarget === 'start') updateStartDate(draftDate);
    if (editTarget === 'end') setEndDate(draftDate);
    setEditTarget(null);
  };

  const handleCreateEvent = () => {
    const event = {
      eventId: eventId.trim(),
      title: title.trim(),
      start: toLocalISO(startDate),
      end: toLocalISO(endDate),
    };

    if (!event.eventId || !event.title) {
      setMessage('All fields are required.');
      return;
    }

    if (endDate.getTime() <= startDate.getTime()) {
      setMessage('Start time must be before end time.');
      return;
    }

    createEvent(event).then(() => {
      setMessage('Event saved! Scan the QR with the Scan tab to test it.');
      setPayload(
        JSON.stringify({
          v: 1,
          event: event.eventId,
          title: event.title,
          start: event.start,
          end: event.end,
        })
      );
      // Clear the fields so the next event gets a fresh, unique code
      setTitle('');
      setEventId('');
    });
  };

  const setEndOffset = (minutes: number) => {
    setEndDate(new Date(startDate.getTime() + minutes * 60 * 1000));
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Create Event QR</Text>
      <Text style={styles.subtitle}>
        Fill in the event details, then scan the generated QR with the Scan tab.
      </Text>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionLabel}>Event Details</Text>
        <Text style={styles.label}>Event Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Founders Day Assembly"
          placeholderTextColor={COLORS.textSecondary}
        />

        <Text style={styles.label}>Event Code</Text>
        <TextInput
          style={styles.input}
          value={eventId}
          onChangeText={setEventId}
          placeholder="e.g. EVT-2026-0002"
          placeholderTextColor={COLORS.textSecondary}
          autoCapitalize="characters"
        />
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionLabel}>Schedule</Text>
        <Text style={styles.label}>Start</Text>
        {isWeb ? (
          <WebDateTimeInput
            label="Event start date and time"
            value={startDate}
            onChange={updateStartDate}
          />
        ) : (
          <PickerField
            value={formatDateTime(startDate)}
            icon="sunny-outline"
            onPress={() => openPicker('start')}
          />
        )}

        <Text style={styles.label}>Ends</Text>
        {isWeb ? (
          <WebDateTimeInput
            label="Event end date and time"
            value={endDate}
            min={startDate}
            onChange={setEndDate}
          />
        ) : (
          <PickerField
            value={formatDateTime(endDate)}
            icon="moon-outline"
            onPress={() => openPicker('end')}
          />
        )}

        <View style={styles.chipRow}>
          <Text style={styles.chipLabel}>Quick add:</Text>
          <PressableChip label="+30 min" onPress={() => setEndOffset(30)} />
          <PressableChip label="+1 hour" onPress={() => setEndOffset(60)} />
          <PressableChip label="+2 hours" onPress={() => setEndOffset(120)} />
        </View>
      </View>

      {!isWeb && (
        <Modal
          visible={editTarget !== null}
          transparent
          animationType="fade"
          statusBarTranslucent
          onRequestClose={() => setEditTarget(null)}
        >
          <View style={styles.modalBackdrop}>
            <Pressable
              style={StyleSheet.absoluteFill}
              accessibilityRole="button"
              accessibilityLabel="Close date and time picker"
              onPress={() => setEditTarget(null)}
            />
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalEyebrow}>
                    {editTarget === 'start' ? 'EVENT START' : 'EVENT END'}
                  </Text>
                  <Text style={styles.modalTitle}>Choose date & time</Text>
                </View>
                <Pressable
                  style={styles.closeButton}
                  accessibilityRole="button"
                  accessibilityLabel="Close picker"
                  onPress={() => setEditTarget(null)}
                >
                  <Text style={styles.closeButtonText}>×</Text>
                </Pressable>
              </View>

              <View style={styles.pickerTabs}>
                <PickerTab label="Date" selected={editingPart === 'date'} onPress={() => setEditingPart('date')} />
                <PickerTab label="Time" selected={editingPart === 'time'} onPress={() => setEditingPart('time')} />
              </View>

              <Text style={styles.selectedDate}>{formatDateTime(draftDate)}</Text>
              <DateTimePicker
                value={draftDate}
                mode={editingPart}
                display="spinner"
                themeVariant="dark"
                accentColor={COLORS.primaryLight}
                onChange={onPickerChange}
                style={styles.datePicker}
              />

              <View style={styles.modalActions}>
                <Pressable
                  style={styles.cancelButton}
                  accessibilityRole="button"
                  onPress={() => setEditTarget(null)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={styles.doneButton}
                  accessibilityRole="button"
                  onPress={confirmPicker}
                >
                  <Text style={styles.doneButtonText}>Done</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {message && <Text style={styles.message}>{message}</Text>}

      <AppButton
        theme="primary"
        title="Create Event"
        icon="add-circle-outline"
        onPress={handleCreateEvent}
      />

      {payload && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>
            Scan this QR code with the Scan tab:
          </Text>
          <View style={styles.qrBox}>
            <QRCode value={payload} size={200} />
          </View>
          <Text style={styles.payloadText}>{payload}</Text>
        </View>
      )}
    </ScrollView>
  );
}

function PressableChip({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={styles.chip}
      onPress={onPress}
      android_ripple={{ color: COLORS.surface }}
    >
      <Text style={styles.chipText}>{label}</Text>
    </Pressable>
  );
}

function PickerTab({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      style={[styles.pickerTab, selected && styles.pickerTabSelected]}
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      onPress={onPress}
    >
      <Text style={[styles.pickerTabText, selected && styles.pickerTabTextSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
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
    marginBottom: 20,
  },
  sectionCard: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    flexWrap: 'wrap',
  },
  chipLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  chip: {
    backgroundColor: COLORS.surface,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  message: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primaryDark,
    textAlign: 'center',
    marginTop: 12,
  },
  resultCard: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    marginTop: 8,
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 14,
  },
  qrBox: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
  },
  payloadText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(10, 19, 43, 0.58)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: COLORS.modalSurface,
    borderWidth: 1,
    borderColor: COLORS.modalBorder,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.24,
    shadowRadius: 24,
    elevation: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalEyebrow: { fontSize: 10, fontWeight: '800', letterSpacing: 1.4, color: COLORS.primaryLight },
  modalTitle: { marginTop: 3, fontSize: 20, fontWeight: '800', color: COLORS.modalText },
  closeButton: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.modalSurfaceRaised,
    justifyContent: 'center', alignItems: 'center',
  },
  closeButtonText: { fontSize: 28, lineHeight: 30, color: COLORS.modalTextSecondary },
  pickerTabs: {
    flexDirection: 'row', backgroundColor: COLORS.modalSurfaceRaised, borderRadius: 12,
    padding: 4, marginBottom: 12,
  },
  pickerTab: { flex: 1, minHeight: 44, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
  pickerTabSelected: { backgroundColor: COLORS.primary },
  pickerTabText: { fontSize: 14, fontWeight: '700', color: COLORS.modalTextSecondary },
  pickerTabTextSelected: { color: COLORS.textOnPrimary },
  selectedDate: { textAlign: 'center', fontSize: 14, fontWeight: '700', color: COLORS.modalText },
  datePicker: { width: '100%' },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelButton: {
    flex: 1, minHeight: 50, borderRadius: 14, borderWidth: 1, borderColor: COLORS.modalBorder,
    justifyContent: 'center', alignItems: 'center',
  },
  cancelButtonText: { fontSize: 15, fontWeight: '700', color: COLORS.modalText },
  doneButton: {
    flex: 1, minHeight: 50, borderRadius: 14, backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  doneButtonText: { fontSize: 15, fontWeight: '800', color: COLORS.textOnPrimary },
});
