import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/constants/colors';

type Props = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  theme?: 'primary';
  onPress: () => void;
};

export default function AppButton({ title, icon, theme, onPress }: Props) {
  const isPrimary = theme === 'primary';

  return (
    <View
      style={[
        styles.buttonOuter,
        isPrimary ? styles.primaryOuter : styles.secondaryOuter,
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title}
        style={({ pressed }) => [
          styles.buttonInner,
          isPrimary ? styles.primaryInner : styles.secondaryInner,
          pressed && styles.pressed,
        ]}
        onPress={onPress}
        android_ripple={{
          color: isPrimary ? COLORS.primaryDark : COLORS.surface,
        }}
      >
        <View
          style={[
            styles.iconChip,
            isPrimary ? styles.iconChipPrimary : styles.iconChipSecondary,
          ]}
        >
          <Ionicons
            name={icon}
            size={18}
            color={isPrimary ? COLORS.textOnPrimary : COLORS.primary}
          />
        </View>
        <Text style={[styles.label, isPrimary && styles.labelPrimary]}>
          {title}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonOuter: {
    width: '100%',
    marginBottom: 14,
    borderRadius: 18,
  },
  primaryOuter: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryOuter: {
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  buttonInner: {
    borderRadius: 18,
    minHeight: 56,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primaryInner: {
    backgroundColor: COLORS.primary,
  },
  secondaryInner: {
    backgroundColor: COLORS.card,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  iconChip: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  iconChipPrimary: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  iconChipSecondary: {
    backgroundColor: COLORS.surface,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  labelPrimary: {
    color: COLORS.textOnPrimary,
  },
});
