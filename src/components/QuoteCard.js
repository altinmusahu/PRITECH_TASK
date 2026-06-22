import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';

export default function QuoteCard({ quote, loading, onRefresh }) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.label}>Daily Inspiration</Text>
        <TouchableOpacity onPress={onRefresh} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.refresh}>↻</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.white} style={{ marginTop: 8 }} />
      ) : quote ? (
        <>
          <Text style={styles.quote}>"{quote.text}"</Text>
          <Text style={styles.author}>— {quote.author}</Text>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.tiny,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  refresh: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  quote: {
    ...typography.body,
    color: colors.white,
    fontStyle: 'italic',
    lineHeight: 22,
    marginBottom: spacing.xs,
  },
  author: {
    ...typography.small,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500',
  },
});
