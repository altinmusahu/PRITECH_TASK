import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';

const FILTERS = ['All', 'Active', 'Completed'];

export default function FilterBar({ active, onChange, counts }) {
  return (
    <View style={styles.container}>
      {FILTERS.map((filter) => {
        const isActive = active === filter;
        return (
          <TouchableOpacity
            key={filter}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => onChange(filter)}
            activeOpacity={0.7}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {filter}
            </Text>
            {counts[filter] !== undefined && (
              <View style={[styles.count, isActive && styles.countActive]}>
                <Text style={[styles.countText, isActive && styles.countTextActive]}>
                  {counts[filter]}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: radius.md,
    gap: 4,
  },
  tabActive: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  label: {
    ...typography.small,
    fontWeight: '500',
    color: colors.textLight,
  },
  labelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  count: {
    backgroundColor: colors.border,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  countActive: {
    backgroundColor: colors.primaryLight,
  },
  countText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textLight,
  },
  countTextActive: {
    color: colors.primary,
  },
});
