import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTasks } from '../hooks/useTasks';
import { colors, spacing, radius, typography } from '../theme';

export default function TaskDetailScreen({ route, navigation }) {
  const { taskId } = route.params;
  const { tasks, toggleTask, deleteTask } = useTasks();
  const [deleting, setDeleting] = useState(false);

  const task = useMemo(() => tasks.find((t) => t.id === taskId), [tasks, taskId]);

  if (!task) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <View style={styles.center}>
          <Text style={styles.notFound}>Task not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const createdAt = new Date(task.createdAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const createdTime = new Date(task.createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      `This will permanently delete "${task.title}". This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            await deleteTask(task.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.statusBanner, task.completed ? styles.bannerDone : styles.bannerActive]}>
          <Text style={[styles.statusDot, task.completed ? styles.dotDone : styles.dotActive]}>●</Text>
          <Text style={[styles.statusLabel, task.completed ? styles.labelDone : styles.labelActive]}>
            {task.completed ? 'Completed' : 'Active'}
          </Text>
        </View>

        <Text style={styles.title}>{task.title}</Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>📅</Text>
            <View>
              <Text style={styles.metaLabel}>Created</Text>
              <Text style={styles.metaValue}>{createdAt}</Text>
              <Text style={styles.metaTime}>{createdTime}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionLabel}>Description</Text>
        {task.description ? (
          <Text style={styles.description}>{task.description}</Text>
        ) : (
          <Text style={styles.noDesc}>No description provided.</Text>
        )}

        <View style={styles.divider} />

        <Text style={styles.sectionLabel}>Actions</Text>

        <TouchableOpacity
          style={[styles.actionBtn, task.completed ? styles.actionUndo : styles.actionComplete]}
          onPress={() => toggleTask(task.id)}
          activeOpacity={0.85}
        >
          <Text style={styles.actionIcon}>{task.completed ? '↩' : '✓'}</Text>
          <Text style={styles.actionText}>
            {task.completed ? 'Mark as Active' : 'Mark as Completed'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.actionDelete]}
          onPress={handleDelete}
          disabled={deleting}
          activeOpacity={0.85}
        >
          <Text style={styles.actionIcon}>🗑</Text>
          <Text style={[styles.actionText, { color: colors.danger }]}>Delete Task</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFound: {
    ...typography.body,
    color: colors.textLight,
  },
  scroll: {
    padding: spacing.lg,
    paddingBottom: 40,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: spacing.md,
    gap: 6,
  },
  bannerActive: {
    backgroundColor: '#FFF3CD',
  },
  bannerDone: {
    backgroundColor: colors.successLight,
  },
  statusDot: {
    fontSize: 10,
  },
  dotActive: {
    color: '#856404',
  },
  dotDone: {
    color: colors.success,
  },
  statusLabel: {
    ...typography.small,
    fontWeight: '700',
  },
  labelActive: {
    color: '#856404',
  },
  labelDone: {
    color: colors.success,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
    lineHeight: 30,
    marginBottom: spacing.lg,
  },
  metaRow: {
    marginBottom: spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  metaIcon: {
    fontSize: 18,
    marginTop: 2,
  },
  metaLabel: {
    ...typography.tiny,
    color: colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metaValue: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    marginTop: 1,
  },
  metaTime: {
    ...typography.small,
    color: colors.textLight,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  sectionLabel: {
    ...typography.tiny,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.text,
    lineHeight: 24,
  },
  noDesc: {
    ...typography.body,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
    gap: spacing.sm,
    borderWidth: 1.5,
  },
  actionComplete: {
    backgroundColor: colors.successLight,
    borderColor: '#C3E6CB',
  },
  actionUndo: {
    backgroundColor: colors.primaryLight,
    borderColor: '#BDD3F0',
  },
  actionDelete: {
    backgroundColor: colors.dangerLight,
    borderColor: '#F5C6CB',
  },
  actionIcon: {
    fontSize: 18,
    width: 24,
    textAlign: 'center',
  },
  actionText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
  },
});
