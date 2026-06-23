import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { STATUS } from '../constants';

const STORAGE_KEY = '@pritech_tasks';

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  // GET - read all tasks from the JSON store
  const loadTasks = async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      setTasks(raw ? JSON.parse(raw) : []);
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const persist = async (updated) => {
    setTasks(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      setTasks(raw ? JSON.parse(raw) : []);
    } catch {
      // keep existing state on error
    } finally {
      setRefreshing(false);
    }
  }, []);

  // CREATE
  const createTask = useCallback(
    async ({ title, description }) => {
      const task = {
        id: uuidv4(),
        title: title.trim(),
        description: description.trim(),
        status: STATUS.NOT_COMPLETED,
        createdAt: new Date().toISOString(),
      };
      await persist([task, ...tasks]);
      return task;
    },
    [tasks]
  );

  // UPDATE - change any fields (title, description, status)
  const updateTask = useCallback(
    async (id, changes) => {
      const updated = tasks.map((t) => (t.id === id ? { ...t, ...changes } : t));
      await persist(updated);
    },
    [tasks]
  );

  // toggle status between Completed / Not Completed
  const toggleStatus = useCallback(
    async (id) => {
      const updated = tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              status:
                t.status === STATUS.COMPLETED
                  ? STATUS.NOT_COMPLETED
                  : STATUS.COMPLETED,
            }
          : t
      );
      await persist(updated);
    },
    [tasks]
  );

  // DELETE
  const deleteTask = useCallback(
    async (id) => {
      await persist(tasks.filter((t) => t.id !== id));
    },
    [tasks]
  );

  return {
    tasks,
    loading,
    refreshing,
    refresh,
    createTask,
    updateTask,
    toggleStatus,
    deleteTask,
  };
}
