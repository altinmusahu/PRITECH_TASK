import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { RectButton, Swipeable } from 'react-native-gesture-handler';
import { STATUS } from '../constants';
import { colors, typography, radius, spacing } from '../theme';

export default function TaskItem({ task, onToggle, onPress, onDelete }) {
  const isCompleted = task.status === STATUS.COMPLETED;

  const formattedDate = new Date(task.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const renderRightActions = () => (
    <RectButton style={styles.swipeDelete} onPress={onDelete}>
      <Text style={styles.swipeDeleteText}>Delete</Text>
    </RectButton>
  );

  return (
    <View style={styles.swipeWrap}>
      <Swipeable
        renderRightActions={renderRightActions}
        overshootRight={false}
        rightThreshold={44}
      >
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.checkbox, isCompleted && styles.checkboxDone]}
              onPress={onToggle}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              {isCompleted && <Text style={styles.checkmark}>Y</Text>}
            </TouchableOpacity>

            <View style={styles.content}>
              <Text style={[styles.title, isCompleted && styles.titleDone]} numberOfLines={1}>
                {task.title}
              </Text>
              {task.description ? (
                <Text style={styles.desc} numberOfLines={2}>
                  {task.description}
                </Text>
              ) : null}
              <View style={styles.footer}>
                <Text style={styles.date}>{formattedDate}</Text>
                <View style={[styles.badge, isCompleted ? styles.badgeDone : styles.badgePending]}>
                  <Text style={[styles.badgeText, isCompleted ? styles.badgeTextDone : styles.badgeTextPending]}>
                    {task.status}
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.swipeHint}>{'<'}</Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
    </View>
  );
}

const styles = StyleSheet.create({
  swipeWrap: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  swipeDelete: {
    width: 92,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipeDeleteText: {
    ...typography.small,
    color: colors.white,
    fontWeight: '800',
  },
  card: {
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    marginTop: 2,
    marginRight: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  checkboxDone: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  title: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 3,
  },
  titleDone: {
    color: colors.textLight,
    textDecorationLine: 'line-through',
  },
  desc: {
    ...typography.small,
    color: colors.textLight,
    lineHeight: 18,
    marginBottom: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  date: {
    ...typography.tiny,
    color: colors.textMuted,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
  },
  badgePending: {
    backgroundColor: '#FFF3CD',
  },
  badgeDone: {
    backgroundColor: '#D4EDDA',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  badgeTextPending: {
    color: '#856404',
  },
  badgeTextDone: {
    color: '#155724',
  },
  swipeHint: {
    marginLeft: spacing.sm,
    color: colors.textMuted,
    fontSize: 24,
    lineHeight: 24,
  },
});
