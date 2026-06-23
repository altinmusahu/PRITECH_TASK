import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTasks } from '../hooks/useTasks';
import { useTaskSuggestions } from '../hooks/useTaskSuggestions';
import { colors, spacing, radius, typography } from '../theme';

export default function AddTaskScreen({ navigation }) {
  const { createTask } = useTasks();
  const {
    suggestions,
    loading: suggestionsLoading,
    error: suggestionsError,
    refresh: refreshSuggestions,
  } = useTaskSuggestions();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const descRef = useRef(null);

  const validate = () => {
    const e = {};
    if (!title.trim()) e.title = 'Title is required.';
    else if (title.trim().length < 3) e.title = 'Title must be at least 3 characters.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const applySuggestion = (suggestionTitle) => {
    setTitle(suggestionTitle);
    if (errors.title) setErrors((e) => ({ ...e, title: null }));
  };

  const handleSave = async () => {
    Keyboard.dismiss();
    if (!validate()) return;
    setSaving(true);
    try {
      await createTask({ title, description });
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Could not save task. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.sectionLabel}>Task Title *</Text>
            <View style={[styles.inputWrap, errors.title && styles.inputError]}>
              <TextInput
                style={styles.input}
                placeholder="e.g. Review pull requests"
                placeholderTextColor={colors.textMuted}
                value={title}
                onChangeText={(v) => {
                  setTitle(v);
                  if (errors.title) setErrors((e) => ({ ...e, title: null }));
                }}
                returnKeyType="next"
                onSubmitEditing={() => descRef.current?.focus()}
                maxLength={80}
                autoFocus
              />
            </View>
            {errors.title ? <Text style={styles.errorText}>{errors.title}</Text> : null}
            <Text style={styles.charCount}>{title.length}/80</Text>

            <Text style={styles.sectionLabel}>Description</Text>
            <View style={[styles.inputWrap, styles.textareaWrap, errors.description && styles.inputError]}>
              <TextInput
                ref={descRef}
                style={[styles.input, styles.textarea]}
                placeholder="Add more details about this task..."
                placeholderTextColor={colors.textMuted}
                value={description}
                onChangeText={(v) => {
                  setDescription(v);
                  if (errors.description) setErrors((e) => ({ ...e, description: null }));
                }}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                maxLength={400}
                returnKeyType="done"
                blurOnSubmit
                onSubmitEditing={Keyboard.dismiss}
              />
            </View>
            {errors.description ? <Text style={styles.errorText}>{errors.description}</Text> : null}
            <Text style={styles.charCount}>{description.length}/400</Text>

            <View style={styles.suggestionsHeader}>
              <Text style={styles.sectionLabel}>Ideas From Public API</Text>
              <TouchableOpacity onPress={refreshSuggestions} disabled={suggestionsLoading}>
                <Text style={[styles.refreshText, suggestionsLoading && styles.refreshTextDisabled]}>
                  Refresh
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.suggestionsBox}>
              {suggestionsLoading ? (
                <View style={styles.suggestionsState}>
                  <ActivityIndicator color={colors.primary} size="small" />
                  <Text style={styles.suggestionsStateText}>Loading suggestions...</Text>
                </View>
              ) : suggestionsError ? (
                <View style={styles.suggestionsState}>
                  <Text style={styles.suggestionsStateText}>{suggestionsError}</Text>
                  <TouchableOpacity style={styles.retryBtn} onPress={refreshSuggestions}>
                    <Text style={styles.retryText}>Try Again</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                suggestions.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.suggestion}
                    onPress={() => applySuggestion(item.title)}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.suggestionTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                    <Text style={styles.suggestionMeta}>
                      JSONPlaceholder todo #{item.id}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </View>

            <View style={styles.hint}>
              <Text style={styles.hintIcon}>i</Text>
              <Text style={styles.hintText}>
                New tasks start as "Not Completed". Toggle the status from the task list or detail view.
              </Text>
            </View>

            <View style={styles.footer}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color={colors.white} size="small" />
                ) : (
                  <Text style={styles.saveText}>Add Task</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: spacing.lg,
    paddingTop: spacing.md,
  },
  sectionLabel: {
    ...typography.small,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  inputWrap: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 2,
  },
  inputError: {
    borderColor: colors.danger,
  },
  input: {
    ...typography.body,
    color: colors.text,
    paddingVertical: 12,
    minHeight: 44,
  },
  textareaWrap: {
    paddingVertical: spacing.sm,
  },
  textarea: {
    minHeight: 110,
  },
  errorText: {
    ...typography.tiny,
    color: colors.danger,
    marginTop: 4,
    marginLeft: 4,
  },
  charCount: {
    ...typography.tiny,
    color: colors.textMuted,
    textAlign: 'right',
    marginTop: 4,
    marginBottom: 4,
  },
  suggestionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  refreshText: {
    ...typography.small,
    color: colors.primary,
    fontWeight: '700',
    paddingHorizontal: spacing.xs,
    paddingTop: spacing.md,
  },
  refreshTextDisabled: {
    color: colors.textMuted,
  },
  suggestionsBox: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  suggestionsState: {
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  suggestionsStateText: {
    ...typography.small,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 18,
  },
  retryBtn: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  retryText: {
    ...typography.small,
    color: colors.primary,
    fontWeight: '700',
  },
  suggestion: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  suggestionTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    lineHeight: 20,
  },
  suggestionMeta: {
    ...typography.tiny,
    color: colors.textMuted,
    marginTop: 2,
  },
  hint: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  hintIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primary,
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 18,
    textAlign: 'center',
  },
  hintText: {
    flex: 1,
    ...typography.small,
    color: colors.primary,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: radius.lg,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  cancelText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textLight,
  },
  saveBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: radius.lg,
    alignItems: 'center',
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveText: {
    ...typography.body,
    fontWeight: '700',
    color: colors.white,
  },
});
