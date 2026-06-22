import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TaskListScreen from '../screens/TaskListScreen';
import AddTaskScreen from '../screens/AddTaskScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';
import { colors, typography } from '../theme';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
          headerTitleStyle: { ...typography.subheading, color: colors.text },
          headerTintColor: colors.primary,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen
          name="TaskList"
          component={TaskListScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddTask"
          component={AddTaskScreen}
          options={{ title: 'New Task', headerBackTitle: 'Back' }}
        />
        <Stack.Screen
          name="TaskDetail"
          component={TaskDetailScreen}
          options={({ navigation }) => ({
            title: 'Task Details',
            headerBackTitle: 'Back',
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('TaskList')}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              />
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
