import { StatusBar } from "expo-status-bar";
import { StyleSheet, Platform } from "react-native";
import { useEffect, useRef } from "react";
import AppNavegation from "./Src/Navegation/AppNavegation";
import NotificationService from "./Src/Services/NotificationService";
import * as Notifications from 'expo-notifications';

export default function App() {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // Initialize notifications
    initializeNotifications();

    // Set up notification listeners
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('📱 Notification received:', notification);
      // You can handle the notification here (e.g., update badge count)
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('👆 Notification tapped:', response);
      // Handle notification tap (e.g., navigate to specific screen)
      const data = response.notification.request.content.data;
      if (data.type === 'appointment_reminder') {
        // Navigate to appointments screen
        console.log('Navigate to appointment:', data.appointmentId);
      }
    });

    return () => {
      // Clean up listeners
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  const initializeNotifications = async () => {
    try {
      // Request permissions
      const hasPermission = await NotificationService.requestPermissions();
      
      if (hasPermission) {
        console.log('✅ Notification permissions granted');
        
        // Configure notification channels (Android)
        await NotificationService.configureNotificationChannel();
        
        // Get push token
        const token = await NotificationService.getExpoPushToken();
        if (token) {
          console.log('🔑 Push token obtained:', token);
          // TODO: Send this token to your backend to store it
        }
      } else {
        console.log('❌ Notification permissions denied');
      }
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  };

  return (
    <>
      <StatusBar style="auto" />
      <AppNavegation />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
