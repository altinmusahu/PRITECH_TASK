import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTasks } from '../hooks/useTasks';
import { STATUS } from '../constants';
import { colors, spacing, radius, typography } from '../theme';

export default function TaskDetailScreen({ route, navigation }) {
  const { taskId } = route.params;
  const { tasks, toggleStatus, updateTask, deleteTask } = useTasks();

  const task = useMemo(() => tasks.find((t) => t.id === taskId), [tasks, taskId]);

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [titleError, setTitleError] = useState('');

  const startEdit = () => {
    setTitle(task.title);
    setDescription(task.description);
    setTitleError('');
    setEditing(true);
  };

  const cancelEdit = () => setEditing(false);

  const saveEdit = async () => {
    if (!title.trim()) {
      setTitleError('Title is required.');
      return;
    }
    if (title.trim().length < 3) {
      setTitleError('Title must be at least 3 characters.');
      return;
    }
    await updateTask(taskId, { title: title.trim(), description: description.trim() });
    setEditing(false);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      `This will permanently delete "${task?.title}". This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteTask(taskId);
            navigation.goBack();
          },
        },
      ]
    );
  };

  if (!task) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <View style={styles.center}>
          <Text style={styles.notFound}>Task not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isCompleted = task.status === STATUS.COMPLETED;

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

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={[styles.statusBanner, isCompleted ? styles.bannerDone : styles.bannerActive]}>
            <Text style={[styles.statusDot, isCompleted ? styles.dotDone : styles.dotActive]}>o</Text>
            <Text style={[styles.statusLabel, isCompleted ? styles.labelDone : styles.labelActive]}>
              {task.status}
            </Text>
          </View>

          {editing ? (
            <View style={[styles.inputWrap, titleError && styles.inputError]}>
              <TextInput
                style={styles.titleInput}
                value={title}
                onChangeText={(v) => { setTitle(v); setTitleError(''); }}
                autoFocus
                maxLength={80}
              />
            </View>
          ) : (
            <Text style={styles.title}>{task.title}</Text>
          )}
          {titleError ? <Text style={styles.errorText}>{titleError}</Text> : null}

          <View style={styles.metaRow}>
            <Text style={styles.metaIcon}>#</Text>
            <View>
              <Text style={styles.metaLabel}>Created</Text>
              <Text style={styles.metaValue}>{createdAt}</Text>
              <Text style={styles.metaTime}>{createdTime}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>Description</Text>
          {editing ? (
            <View style={[styles.inputWrap, styles.textareaWrap]}>
              <TextInput
                style={[styles.input, styles.textarea]}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                maxLength={400}
                placeholder="Add a description..."
                placeholderTextColor={colors.textMuted}
              />
            </View>
          ) : task.description ? (
            <Text style={styles.description}>{task.description}</Text>
          ) : (
            <Text style={styles.noDesc}>No description provided.</Text>
          )}

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>Actions</Text>

          {editing ? (
            <View style={styles.editRow}>
              <TouchableOpacity style={styles.cancelEditBtn} onPress={cancelEdit}>
                <Text style={styles.cancelEditText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveEditBtn} onPress={saveEdit}>
                <Text style={styles.saveEditText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={[styles.actionBtn, styles.actionEdit]} onPress={startEdit} activeOpacity={0.85}>
              <Text style={styles.actionText}>Edit Task</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.actionBtn, isCompleted ? styles.actionUndo : styles.actionComplete]}
            onPress={() => toggleStatus(task.id)}
            activeOpacity={0.85}
          >
            <Text style={styles.actionText}>
              {isCompleted ? `Mark as ${STATUS.NOT_COMPLETED}` : `Mark as ${STATUS.COMPLETED}`}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionBtn, styles.actionDelete]} onPress={handleDelete} activeOpacity={0.85}>
            <Text style={[styles.actionText, { color: colors.danger }]}>Delete Task</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFound: { ...typography.body, color: colors.textLight },
  scroll: { padding: spacing.lg, paddingBottom: 40 },
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
  bannerActive: { backgroundColor: '#FFF3CD' },
  bannerDone: { backgroundColor: colors.successLight },
  statusDot: { fontSize: 10 },
  dotActive: { color: '#856404' },
  dotDone: { color: colors.success },
  statusLabel: { ...typography.small, fontWeight: '700' },
  labelActive: { color: '#856404' },
  labelDone: { color: colors.success },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 30,
    marginBottom: spacing.lg,
  },
  inputWrap: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  inputError: { borderColor: colors.danger },
  titleInput: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    paddingVertical: 12,
  },
  input: { ...typography.body, color: colors.text, paddingVertical: 10 },
  textareaWrap: { paddingVertical: spacing.sm },
  textarea: { minHeight: 80 },
  errorText: { ...typography.tiny, color: colors.danger, marginBottom: spacing.sm },
  metaRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, marginBottom: spacing.md },
  metaIcon: { fontSize: 18, marginTop: 2 },
  metaLabel: { ...typography.tiny, color: colors.textMuted, fontWeight: '600', textTransform: 'uppercase' },
  metaValue: { ...typography.body, color: colors.text, fontWeight: '600', marginTop: 1 },
  metaTime: { ...typography.small, color: colors.textLight },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.lg },
  sectionLabel: { ...typography.tiny, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', marginBottom: spacing.sm },
  description: { ...typography.body, color: colors.text, lineHeight: 24 },
  noDesc: { ...typography.body, color: colors.textMuted, fontStyle: 'italic' },
  editRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
  cancelEditBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.lg,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  cancelEditText: { ...typography.body, fontWeight: '600', color: colors.textLight },
  saveEditBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: radius.lg,
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  saveEditText: { ...typography.body, fontWeight: '700', color: colors.white },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
    gap: spacing.sm,
    borderWidth: 1.5,
  },
  actionEdit: { backgroundColor: colors.surface, borderColor: colors.border },
  actionComplete: { backgroundColor: colors.successLight, borderColor: '#C3E6CB' },
  actionUndo: { backgroundColor: colors.primaryLight, borderColor: '#BDD3F0' },
  actionDelete: { backgroundColor: colors.dangerLight, borderColor: '#F5C6CB' },
  actionIcon: { fontSize: 14, width: 24, textAlign: 'center', fontWeight: '800' },
  actionText: { ...typography.body, fontWeight: '600', color: colors.text },
});
