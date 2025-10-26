import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure how notifications should be handled when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  constructor() {
    this.notificationListener = null;
    this.responseListener = null;
  }

  /**
   * Request notification permissions from the user
   */
  async requestPermissions() {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  /**
   * Get the Expo push token for this device
   */
  async getExpoPushToken() {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return null;
      }

      // Get the token
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: '94cc8e67-7877-4209-b854-cad8f7e4d1f5',
      });

      console.log('Expo Push Token:', token.data);
      
      // Store the token locally
      await AsyncStorage.setItem('expoPushToken', token.data);
      
      return token.data;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }

  /**
   * Configure notification channel for Android
   */
  async configureNotificationChannel() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        sound: 'default',
      });

      // Create specific channels for different notification types
      await Notifications.setNotificationChannelAsync('appointments', {
        name: 'Citas Médicas',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#4CAF50',
        sound: 'default',
      });

      await Notifications.setNotificationChannelAsync('reminders', {
        name: 'Recordatorios',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#2196F3',
        sound: 'default',
      });
    }
  }

  /**
   * Schedule a local notification
   */
  async scheduleNotification(title, body, data = {}, trigger = null) {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: trigger || null, // null means show immediately
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  }

  /**
   * Schedule a notification for an appointment reminder
   */
  async scheduleAppointmentReminder(appointmentData) {
    try {
      const { fechaHora, doctor, consultorio } = appointmentData;
      const appointmentDate = new Date(fechaHora);
      
      // Schedule notification 1 hour before appointment
      const reminderDate = new Date(appointmentDate.getTime() - 60 * 60 * 1000);
      
      if (reminderDate > new Date()) {
        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: '🏥 Recordatorio de Cita',
            body: `Tu cita con ${doctor?.nombre || 'el doctor'} es en 1 hora en ${consultorio?.nombre || 'el consultorio'}`,
            data: { 
              type: 'appointment_reminder',
              appointmentId: appointmentData.id,
              ...appointmentData 
            },
            sound: 'default',
            priority: Notifications.AndroidNotificationPriority.HIGH,
            channelId: 'appointments',
          },
          trigger: {
            date: reminderDate,
          },
        });

        console.log('Appointment reminder scheduled:', notificationId);
        return notificationId;
      }
    } catch (error) {
      console.error('Error scheduling appointment reminder:', error);
      return null;
    }
  }

  /**
   * Cancel a scheduled notification
   */
  async cancelNotification(notificationId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log('Notification cancelled:', notificationId);
    } catch (error) {
      console.error('Error cancelling notification:', error);
    }
  }

  /**
   * Cancel all scheduled notifications
   */
  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('All notifications cancelled');
    } catch (error) {
      console.error('Error cancelling all notifications:', error);
    }
  }

  /**
   * Get all scheduled notifications
   */
  async getAllScheduledNotifications() {
    try {
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      return notifications;
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }

  /**
   * Set up notification listeners
   */
  setupNotificationListeners(onNotificationReceived, onNotificationResponse) {
    // Listener for notifications received while app is in foreground
    this.notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      if (onNotificationReceived) {
        onNotificationReceived(notification);
      }
    });

    // Listener for when user taps on notification
    this.responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      if (onNotificationResponse) {
        onNotificationResponse(response);
      }
    });
  }

  /**
   * Remove notification listeners
   */
  removeNotificationListeners() {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
  }

  /**
   * Show immediate notification
   */
  async showNotification(title, body, data = {}) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: null, // Show immediately
      });
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }

  /**
   * Get notification badge count
   */
  async getBadgeCount() {
    try {
      const count = await Notifications.getBadgeCountAsync();
      return count;
    } catch (error) {
      console.error('Error getting badge count:', error);
      return 0;
    }
  }

  /**
   * Set notification badge count
   */
  async setBadgeCount(count) {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error('Error setting badge count:', error);
    }
  }

  /**
   * Clear badge count
   */
  async clearBadgeCount() {
    try {
      await Notifications.setBadgeCountAsync(0);
    } catch (error) {
      console.error('Error clearing badge count:', error);
    }
  }
}

export default new NotificationService();