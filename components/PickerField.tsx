import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/constants/colors';

type Props = {
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

export default function PickerField({ value, icon, onPress }: Props) {
  return (
    <View style={styles.fieldOuter}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Choose ${value}`}
        style={({ pressed }) => [styles.fieldInner, pressed && styles.pressed]}
        onPress={onPress}
        android_ripple={{ color: COLORS.surface }}
      >
        <View style={styles.iconChip}>
          <Ionicons name={icon} size={18} color={COLORS.primary} />
        </View>
        <Text style={styles.value}>{value}</Text>
        <Ionicons
          name="chevron-forward"
          size={18}
          color={COLORS.textSecondary}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  fieldOuter: {
    width: '100%',
    marginBottom: 4,
  },
  fieldInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 56,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  pressed: {
    opacity: 0.85,
  },
  iconChip: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
  },
});
