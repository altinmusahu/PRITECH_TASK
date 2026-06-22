import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTasks } from '../hooks/useTasks';
import { STATUS } from '../constants';
import TaskItem from '../components/TaskItem';
import EmptyState from '../components/EmptyState';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import { colors, spacing, typography } from '../theme';

export default function TaskListScreen({ navigation }) {
  const { tasks, loading, refreshing, refresh, toggleStatus, deleteTask } = useTasks();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const counts = useMemo(() => ({
    All: tasks.length,
    [STATUS.NOT_COMPLETED]: tasks.filter((t) => t.status === STATUS.NOT_COMPLETED).length,
    [STATUS.COMPLETED]: tasks.filter((t) => t.status === STATUS.COMPLETED).length,
  }), [tasks]);

  const filtered = useMemo(() => {
    let list = tasks;
    if (filter === STATUS.NOT_COMPLETED) list = list.filter((t) => t.status === STATUS.NOT_COMPLETED);
    if (filter === STATUS.COMPLETED) list = list.filter((t) => t.status === STATUS.COMPLETED);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((t) => t.title.toLowerCase().includes(q));
    }
    return list;
  }, [tasks, filter, search]);

  const handleDelete = (task) => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${task.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteTask(task.id) },
      ]
    );
  };

  const emptyMessage = () => {
    if (search.trim()) return { icon: '🔍', title: 'No results', subtitle: `No tasks match "${search}"` };
    if (filter === STATUS.COMPLETED) return { icon: '✅', title: 'No completed tasks', subtitle: 'Mark a task as done and it will appear here.' };
    if (filter === STATUS.NOT_COMPLETED) return { icon: '🎉', title: 'All done!', subtitle: 'You have no active tasks right now.' };
    return { icon: '📋', title: 'No tasks yet', subtitle: 'Tap the + button to add your first task.' };
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const empty = emptyMessage();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>My Tasks</Text>
          <Text style={styles.sub}>
            {counts[STATUS.NOT_COMPLETED]} active · {counts[STATUS.COMPLETED]} completed
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddTask')}
          activeOpacity={0.85}
        >
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <SearchBar value={search} onChangeText={setSearch} onClear={() => setSearch('')} />
            <FilterBar active={filter} onChange={setFilter} counts={counts} />
          </>
        }
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggle={() => toggleStatus(item.id)}
            onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}
            onDelete={() => handleDelete(item)}
          />
        )}
        ListEmptyComponent={
          <EmptyState icon={empty.icon} title={empty.title} subtitle={empty.subtitle} />
        }
        contentContainerStyle={filtered.length === 0 ? { flex: 1 } : { paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  greeting: { fontSize: 26, fontWeight: '800', color: colors.text, letterSpacing: -0.5 },
  sub: { ...typography.small, color: colors.textLight, marginTop: 2 },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  addIcon: { fontSize: 26, color: colors.white, lineHeight: 28, fontWeight: '300' },
});
