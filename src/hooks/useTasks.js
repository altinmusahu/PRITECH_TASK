import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = '@pritech_tasks';

const DUMMY_TASKS = [
  {
    id: '1',
    title: 'Design new landing page',
    description: 'Create wireframes and mockups for the updated marketing landing page. Focus on conversion rate and clean layout.',
    completed: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'Review pull requests',
    description: 'Go through the 3 open PRs on the main repo. Leave feedback and approve or request changes.',
    completed: true,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Write unit tests for auth module',
    description: 'Cover login, logout, and token refresh flows. Aim for 80%+ coverage on the auth service.',
    completed: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    title: 'Update project documentation',
    description: 'Revise the README and add setup instructions for the new environment variables introduced in the latest release.',
    completed: true,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    title: 'Fix pagination bug on dashboard',
    description: 'Page 2 onwards returns duplicate entries. Investigate the offset query and add a reproducible test case.',
    completed: false,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
];

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setTasks(JSON.parse(stored));
      } else {
        setTasks(DUMMY_TASKS);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DUMMY_TASKS));
      }
    } catch {
      setTasks(DUMMY_TASKS);
    } finally {
      setLoading(false);
    }
  };

  const persist = async (updated) => {
    setTasks(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save tasks', e);
    }
  };

  const addTask = useCallback(
    async ({ title, description }) => {
      const newTask = {
        id: uuidv4(),
        title: title.trim(),
        description: description.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
      };
      await persist([newTask, ...tasks]);
      return newTask;
    },
    [tasks]
  );

  const toggleTask = useCallback(
    async (id) => {
      await persist(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
    },
    [tasks]
  );

  const deleteTask = useCallback(
    async (id) => {
      await persist(tasks.filter((t) => t.id !== id));
    },
    [tasks]
  );

  const updateTask = useCallback(
    async (id, changes) => {
      await persist(tasks.map((t) => (t.id === id ? { ...t, ...changes } : t)));
    },
    [tasks]
  );

  return { tasks, loading, addTask, toggleTask, deleteTask, updateTask };
}
