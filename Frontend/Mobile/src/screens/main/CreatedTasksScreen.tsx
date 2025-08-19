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
  Surface,
  useTheme,
  Chip,
  IconButton,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useTask } from '../../contexts/TaskContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const CreatedTasksScreen = () => {
  const { createdTasks, fetchCreatedTasks, deleteTask, isLoading } = useTask();
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await fetchCreatedTasks();
    } catch (error) {
      console.error('Error loading created tasks:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleDeleteTask = async (taskId: number) => {
    Alert.alert(
      'Удалить задачу',
      'Вы уверены, что хотите удалить эту задачу? Это действие нельзя отменить.',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTask(taskId);
              Alert.alert('Успех', 'Задача удалена!');
            } catch (error) {
              Alert.alert('Ошибка', 'Не удалось удалить задачу');
            }
          },
        },
      ]
    );
  };

  const getStatusEmoji = (isComplete: boolean) => {
    return isComplete ? '✅' : '⏳';
  };

  const getPriorityEmoji = (task: any) => {
    const createdDate = new Date(task.created_at);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays > 7) return '🔴';
    if (diffDays > 3) return '🟡';
    return '🟢';
  };

  const renderTaskCard = (task: any) => (
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
          📅 Создано: {new Date(task.created_at).toLocaleDateString('ru-RU')}
        </Text>
        
        {task.completed_at && (
          <Text variant="bodySmall" style={styles.completedDate}>
            ✅ Завершено: {new Date(task.completed_at).toLocaleDateString('ru-RU')}
          </Text>
        )}
      </Card.Content>
      
      <Card.Actions>
        {!task.is_complete && (
          <Button
            mode="outlined"
            onPress={() => Alert.alert('Редактировать', 'Функция в разработке')}
            icon="pencil"
            style={styles.editButton}
          >
            Редактировать
          </Button>
        )}
        <Button
          mode="outlined"
          onPress={() => handleDeleteTask(task.id)}
          icon="delete"
          style={styles.deleteButton}
          textColor="#f44336"
        >
          Удалить
        </Button>
      </Card.Actions>
    </Card>
  );

  const completedTasks = createdTasks.filter(task => task.is_complete);
  const pendingTasks = createdTasks.filter(task => !task.is_complete);

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
          <Text style={styles.title}>✨ Созданные задачи</Text>
          <Text style={styles.subtitle}>
            Задачи, которые вы создали
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <Surface style={styles.statCard} elevation={2}>
            <Text style={styles.statNumber}>{pendingTasks.length}</Text>
            <Text style={styles.statLabel}>В работе</Text>
            <Text style={styles.statEmoji}>⏳</Text>
          </Surface>
          
          <Surface style={styles.statCard} elevation={2}>
            <Text style={styles.statNumber}>{completedTasks.length}</Text>
            <Text style={styles.statLabel}>Завершено</Text>
            <Text style={styles.statEmoji}>✅</Text>
          </Surface>
        </View>

        {pendingTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⏳ В работе ({pendingTasks.length})</Text>
            {pendingTasks.map(renderTaskCard)}
          </View>
        )}

        {completedTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>✅ Завершено ({completedTasks.length})</Text>
            {completedTasks.map(renderTaskCard)}
          </View>
        )}

        {createdTasks.length === 0 && (
          <Surface style={styles.emptyState} elevation={1}>
            <Text style={styles.emptyStateText}>✨</Text>
            <Text style={styles.emptyStateTitle}>Нет созданных задач</Text>
            <Text style={styles.emptyStateSubtitle}>
              Создайте свою первую задачу, чтобы начать работу
            </Text>
          </Surface>
        )}
      </ScrollView>
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
  title: {
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
    marginBottom: 10,
    flexDirection: 'row',
    gap: 8,
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
    marginBottom: 5,
  },
  completedDate: {
    color: '#4CAF50',
    fontStyle: 'italic',
  },
  editButton: {
    borderColor: '#007AFF',
  },
  deleteButton: {
    borderColor: '#f44336',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    margin: 20,
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
});

export default CreatedTasksScreen;
