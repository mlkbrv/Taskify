import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Text,
  Button,
  Surface,
  useTheme,
  Avatar,
  List,
  Divider,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const theme = useTheme();

  const handleLogout = () => {
    Alert.alert(
      'Выйти из аккаунта',
      'Вы уверены, что хотите выйти?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Выйти',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Logout error:', error);
            }
          },
        },
      ]
    );
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <LinearGradient
      colors={['#f5f7fa', '#c3cfe2']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Surface style={styles.profileCard} elevation={8}>
            <View style={styles.avatarContainer}>
              <Avatar.Text
                size={80}
                label={getInitials(user?.first_name || '', user?.last_name || '')}
                style={styles.avatar}
                color="#fff"
              />
            </View>
            
            <Text style={styles.userName}>
              {user?.first_name} {user?.last_name}
            </Text>
            
            <Text style={styles.userEmail}>
              {user?.email}
            </Text>
            
            <View style={styles.userStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>🎯</Text>
                <Text style={styles.statLabel}>Активный</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>📱</Text>
                <Text style={styles.statLabel}>Мобильное</Text>
              </View>
            </View>
          </Surface>
        </View>

        <View style={styles.section}>
          <Surface style={styles.menuCard} elevation={2}>
            <List.Item
              title="Настройки приложения"
              description="Тема, уведомления, язык"
              left={(props) => <List.Icon {...props} icon="cog" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => Alert.alert('Настройки', 'Функция в разработке')}
              style={styles.menuItem}
            />
            
            <Divider />
            
            <List.Item
              title="Помощь и поддержка"
              description="FAQ, контакты, руководство"
              left={(props) => <List.Icon {...props} icon="help-circle" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => Alert.alert('Помощь', 'Функция в разработке')}
              style={styles.menuItem}
            />
            
            <Divider />
            
            <List.Item
              title="О приложении"
              description="Версия, лицензия, разработчики"
              left={(props) => <List.Icon {...props} icon="information" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => Alert.alert('О приложении', 'Taskify v1.0.0\n\nПриложение для управления задачами\n\nРазработано с ❤️')}
              style={styles.menuItem}
            />
          </Surface>
        </View>

        <View style={styles.section}>
          <Button
            mode="outlined"
            onPress={handleLogout}
            icon="logout"
            style={styles.logoutButton}
            textColor="#f44336"
            buttonColor="rgba(255, 255, 255, 0.9)"
          >
            Выйти из аккаунта
          </Button>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            🎯 Taskify - Управление задачами
          </Text>
          <Text style={styles.footerSubtext}>
            Версия 1.0.0
          </Text>
        </View>
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
  profileCard: {
    padding: 30,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatar: {
    backgroundColor: '#007AFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  userStats: {
    flexDirection: 'row',
    gap: 30,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  menuCard: {
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    overflow: 'hidden',
  },
  menuItem: {
    paddingVertical: 5,
  },
  logoutButton: {
    borderColor: '#f44336',
    borderRadius: 10,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});

export default ProfileScreen;
