import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Surface,
  useTheme,
  HelperText,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useTask } from '../../contexts/TaskContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const CreateTaskScreen = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { createTask } = useTask();
  const navigation = useNavigation();
  const theme = useTheme();

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert('Ошибка', 'Название задачи обязательно');
      return false;
    }
    if (!recipientEmail.trim()) {
      Alert.alert('Ошибка', 'Email получателя обязателен');
      return false;
    }
    // Простая валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      Alert.alert('Ошибка', 'Введите корректный email');
      return false;
    }
    return true;
  };

  const handleCreateTask = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      
      const taskData = {
        name: name.trim(),
        description: description.trim(),
        recipient_email: recipientEmail.trim(), // Будем использовать email для поиска пользователя
      };

      await createTask(taskData);
      
      Alert.alert(
        'Успех',
        'Задача успешно создана!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      console.error('Error creating task:', error);
      Alert.alert(
        'Ошибка',
        error.response?.data?.detail || 'Не удалось создать задачу'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.content}>
            <Surface style={styles.surface} elevation={8}>
              <View style={styles.header}>
                <Ionicons name="create" size={32} color={theme.colors.primary} />
                <Text style={styles.title}>Создать задачу</Text>
              </View>
              
              <TextInput
                label="Название задачи *"
                value={name}
                onChangeText={setName}
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="pencil" />}
                maxLength={100}
              />
              <HelperText type="info">
                {name.length}/100 символов
              </HelperText>
              
              <TextInput
                label="Описание"
                value={description}
                onChangeText={setDescription}
                mode="outlined"
                style={styles.input}
                multiline
                numberOfLines={4}
                left={<TextInput.Icon icon="document-text" />}
                maxLength={500}
              />
              <HelperText type="info">
                {description.length}/500 символов
              </HelperText>
              
              <TextInput
                label="Email получателя *"
                value={recipientEmail}
                onChangeText={setRecipientEmail}
                mode="outlined"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                left={<TextInput.Icon icon="person" />}
              />
              
              <View style={styles.buttonContainer}>
                <Button
                  mode="contained"
                  onPress={handleCreateTask}
                  loading={isLoading}
                  disabled={isLoading}
                  style={styles.createButton}
                  contentStyle={styles.buttonContent}
                >
                  Создать задачу
                </Button>
                
                <Button
                  mode="outlined"
                  onPress={() => navigation.goBack()}
                  disabled={isLoading}
                  style={styles.cancelButton}
                >
                  Отмена
                </Button>
              </View>
            </Surface>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  surface: {
    padding: 30,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 12,
    color: '#333',
  },
  input: {
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    marginTop: 30,
    gap: 16,
  },
  createButton: {
    borderRadius: 10,
    paddingVertical: 5,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  cancelButton: {
    borderRadius: 10,
    paddingVertical: 5,
  },
});

export default CreateTaskScreen;
