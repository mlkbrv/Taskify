import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Text,
} from 'react-native';
import { Card, Title, Paragraph, Chip, useTheme } from 'react-native-paper';
import { useTask } from '../../contexts/TaskContext';
import { Ionicons } from '@expo/vector-icons';

const CompletedTasksScreen = () => {
  const { completedTasks, fetchCompletedTasks, isLoading } = useTask();
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    fetchCompletedTasks();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCompletedTasks();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderTask = ({ item }: { item: any }) => (
    <Card style={styles.taskCard} mode="outlined">
      <Card.Content>
        <View style={styles.taskHeader}>
          <Title style={styles.taskTitle} numberOfLines={1}>{item.name}</Title>
          <Chip 
            icon={() => <Ionicons name="checkmark-circle" size={16} color="green" />}
            style={styles.completedChip}
          >
            Завершено
          </Chip>
        </View>
        
        <Paragraph style={styles.taskDescription} numberOfLines={2}>{item.description}</Paragraph>
        
        <View style={styles.taskInfo}>
          <View style={styles.infoRow}>
            <Ionicons name="person" size={16} color={theme.colors.primary} />
            <Text style={styles.infoText} numberOfLines={1}>
              От: {item.sender?.first_name || 'Неизвестно'} {item.sender?.last_name || ''}
            </Text>
          </View>
          
          {item.recipient && (
            <View style={styles.infoRow}>
              <Ionicons name="person-check" size={16} color={theme.colors.primary} />
              <Text style={styles.infoText} numberOfLines={1}>
                Кому: {item.recipient.first_name || 'Неизвестно'} {item.recipient.last_name || ''}
              </Text>
            </View>
          )}
          
          <View style={styles.infoRow}>
            <Ionicons name="time" size={16} color={theme.colors.primary} />
            <Text style={styles.infoText}>
              Создано: {formatDate(item.created_at)}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="checkmark" size={16} color="green" />
            <Text style={styles.infoText}>
              Завершено: {formatDate(item.completed_at)}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="checkmark-circle-outline" size={64} color={theme.colors.outline} />
      <Text style={styles.emptyStateTitle}>Нет завершенных задач</Text>
      <Text style={styles.emptyStateSubtitle}>
        Завершенные задачи появятся здесь после их выполнения
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={completedTasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  taskCard: {
    marginBottom: 12,
    elevation: 2,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 18,
    flex: 1,
    marginRight: 8,
    flexShrink: 1,
  },
  completedChip: {
    backgroundColor: '#e8f5e8',
  },
  taskDescription: {
    marginBottom: 12,
    color: '#666',
  },
  taskInfo: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    flexShrink: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

export default CompletedTasksScreen;
