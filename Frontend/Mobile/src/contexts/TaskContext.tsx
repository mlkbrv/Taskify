import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, API_ENDPOINTS } from '../services/api';

interface Task {
  id: number;
  name: string;
  description: string;
  sender: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  recipient: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  created_at: string;
  completed_at: string | null;
  is_complete: boolean;
}

interface TaskContextType {
  tasks: Task[];
  myTasks: Task[];
  createdTasks: Task[];
  completedTasks: Task[];
  isLoading: boolean;
  fetchAllTasks: () => Promise<void>;
  fetchMyTasks: () => Promise<void>;
  fetchCreatedTasks: () => Promise<void>;
  fetchCompletedTasks: () => Promise<void>;
  createTask: (taskData: Partial<Task>) => Promise<void>;
  updateTask: (id: number, taskData: Partial<Task>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  completeTask: (id: number) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [createdTasks, setCreatedTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllTasks = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(API_ENDPOINTS.ALL_TASKS);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching all tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMyTasks = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(API_ENDPOINTS.MY_TASKS);
      setMyTasks(response.data);
    } catch (error) {
      console.error('Error fetching my tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCreatedTasks = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(API_ENDPOINTS.CREATED_TASKS);
      setCreatedTasks(response.data);
    } catch (error) {
      console.error('Error fetching created tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCompletedTasks = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(API_ENDPOINTS.COMPLETED_TASKS);
      setCompletedTasks(response.data);
    } catch (error) {
      console.error('Error fetching completed tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (taskData: Partial<Task>) => {
    try {
      setIsLoading(true);
      // Убираем поля, которые не должны передаваться при создании
      const { id, created_at, completed_at, is_complete, files, ...createData } = taskData;
      
      const response = await api.post(API_ENDPOINTS.CREATED_TASKS, createData);
      await fetchCreatedTasks();
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (id: number, taskData: Partial<Task>) => {
    try {
      setIsLoading(true);
      const response = await api.patch(API_ENDPOINTS.TASK_DETAIL(id), taskData);
      await Promise.all([fetchAllTasks(), fetchMyTasks(), fetchCreatedTasks()]);
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      setIsLoading(true);
      await api.delete(API_ENDPOINTS.TASK_DETAIL(id));
      await Promise.all([fetchAllTasks(), fetchMyTasks(), fetchCreatedTasks()]);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const completeTask = async (id: number) => {
    try {
      setIsLoading(true);
      await api.post(API_ENDPOINTS.TASK_COMPLETE(id));
      await Promise.all([fetchAllTasks(), fetchMyTasks(), fetchCreatedTasks(), fetchCompletedTasks()]);
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    tasks,
    myTasks,
    createdTasks,
    completedTasks,
    isLoading,
    fetchAllTasks,
    fetchMyTasks,
    fetchCreatedTasks,
    fetchCompletedTasks,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};
