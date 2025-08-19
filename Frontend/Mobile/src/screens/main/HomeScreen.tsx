import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  FAB,
  Surface,
  useTheme,
  Chip,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../contexts/AuthContext';
import { useTask } from '../../contexts/TaskContext';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = () => {
  const { user } = useAuth();
  const { tasks, myTasks, createdTasks, fetchAllTasks, fetchMyTasks, fetchCreatedTasks, isLoading } = useTask();
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([
        fetchAllTasks(),
        fetchMyTasks(),
        fetchCreatedTasks(),
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getStatusEmoji = (isComplete: boolean) => {
    return isComplete ? '✅' : '⏳';
  };

  const getPriorityEmoji = (task: any) => {
    // Простая логика для определения приоритета на основе даты создания
    const createdDate = new Date(task.created_at);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays > 7) return '🔴'; // Высокий приоритет
    if (diffDays > 3) return '🟡'; // Средний приоритет
    return '🟢'; // Низкий приоритет
  };

  const renderTaskCard = (task: any, index: number) => (
    <Card key={task.id} style={styles.taskCard} mode="outlined">
      <Card.Content>
        <View style={styles.taskHeader}>
          <Text variant="titleMedium" style={styles.taskTitle} numberOfLines={1}>
            {task.name}
          </Text>
          <View style={styles.taskStatus}>
            <Text style={styles.statusEmoji}>{getStatusEmoji(task.is_complete)}</Text>
            <Text style={styles.statusEmoji}>{getPriorityEmoji(task)}</Text>
          </View>
        </View>
        
        {task.description && (
          <Text variant="bodyMedium" style={styles.taskDescription} numberOfLines={2}>
            {task.description}
          </Text>
        )}
        
        <View style={styles.taskInfo}>
          <Chip icon="account" style={styles.chip}>
            <Text style={styles.chipText} numberOfLines={1}>
              От: {task.sender?.first_name || 'Неизвестно'} {task.sender?.last_name || ''}
            </Text>
          </Chip>
          {task.recipient ? (
            <Chip icon="account-check" style={styles.chip}>
              <Text style={styles.chipText} numberOfLines={1}>
                Кому: {task.recipient.first_name || 'Неизвестно'} {task.recipient.last_name || ''}
              </Text>
            </Chip>
          ) : (
            <Chip icon="account-question" style={styles.chip}>
              <Text style={styles.chipText} numberOfLines={1}>
                Получатель не назначен
              </Text>
            </Chip>
          )}
        </View>
        
        <Text variant="bodySmall" style={styles.taskDate}>
          📅 {new Date(task.created_at).toLocaleDateString('ru-RU')}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <LinearGradient
      colors={['#f5f7fa', '#c3cfe2']}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.welcomeText}>
            👋 Привет, {user?.first_name}!
          </Text>
          <Text style={styles.subtitle}>
            Управляйте своими задачами эффективно
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <Surface style={styles.statCard} elevation={2}>
            <Text style={styles.statNumber}>{myTasks.length}</Text>
            <Text style={styles.statLabel}>Мои задачи</Text>
            <Text style={styles.statEmoji}>📋</Text>
          </Surface>
          
          <Surface style={styles.statCard} elevation={2}>
            <Text style={styles.statNumber}>
              {myTasks.filter(task => task.is_complete).length}
            </Text>
            <Text style={styles.statLabel}>Выполнено</Text>
            <Text style={styles.statEmoji}>✅</Text>
          </Surface>
          
          <Surface style={styles.statCard} elevation={2}>
            <Text style={styles.statNumber}>{createdTasks.length}</Text>
            <Text style={styles.statLabel}>Создано</Text>
            <Text style={styles.statEmoji}>✨</Text>
          </Surface>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Последние задачи</Text>
          {tasks.slice(0, 5).map((task, index) => renderTaskCard(task, index))}
          
          {tasks.length === 0 && (
            <Surface style={styles.emptyState} elevation={1}>
              <Text style={styles.emptyStateText}>🎯</Text>
              <Text style={styles.emptyStateTitle}>Нет задач</Text>
              <Text style={styles.emptyStateSubtitle}>
                Создайте первую задачу или дождитесь назначения
              </Text>
            </Surface>
          )}
        </View>
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => Alert.alert('Создать задачу', 'Функция в разработке')}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  statEmoji: {
    fontSize: 20,
    marginTop: 5,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  taskCard: {
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  taskTitle: {
    flex: 1,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  taskStatus: {
    flexDirection: 'row',
    gap: 5,
  },
  statusEmoji: {
    fontSize: 16,
  },
  taskDescription: {
    marginBottom: 15,
    color: '#666',
  },
  taskInfo: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  chip: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    maxWidth: '48%',
    minWidth: '45%',
  },
  chipText: {
    fontSize: 12,
    color: '#333',
    flexShrink: 1,
  },
  taskDate: {
    color: '#999',
    fontStyle: 'italic',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
  },
  emptyStateText: {
    fontSize: 48,
    marginBottom: 15,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#007AFF',
  },
});

export default HomeScreen;
