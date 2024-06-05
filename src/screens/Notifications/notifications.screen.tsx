import Ionicons from "@expo/vector-icons/Ionicons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useGetNotificationsByUserIdQuery } from "../../services/notifications";
import { RootStackParamList } from "../../navigation/navigator.types";
import { useThemeConsumer } from "../../utils/theme/theme.consumer";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';

type NotificationProps = NativeStackScreenProps<RootStackParamList, "Notifications">;

const Notifications = ({ navigation }: NotificationProps) => {
  const dispatch = useDispatch();
  const loggedId = useSelector((state: RootState) => state.userData.loggedId);
  const token = useSelector((state: RootState) => state.userData.token);

  const userParams = { id: loggedId, token: token };
  const { data: notificationList, error, isLoading, refetch, isFetching } = useGetNotificationsByUserIdQuery(userParams);

  const { theme } = useThemeConsumer();

  const onRefresh = () => {
    refetch();
  };

  const renderNotificationText = (text: string) => {
    const parts = text.split(' ');
    const username = parts[0];
    const restOfText = parts.slice(1).join(' ');

    return (
      <Text style={styles.text}>
        <Text style={styles.boldText}>{username}</Text> {restOfText}
      </Text>
    );
  };

  const getTimeAgo = (timestamp: any) => {
    const now = moment();
    const createdAt = moment(timestamp);

    const diffSeconds = now.diff(createdAt, 'seconds');
    const diffMinutes = now.diff(createdAt, 'minutes');
    const diffHours = now.diff(createdAt, 'hours');
    const diffDays = now.diff(createdAt, 'days');

    if (diffSeconds < 60) {
      return `${diffSeconds} s ago`;
    } else if (diffMinutes < 60) {
      return `${diffMinutes} mins ago`;
    } else if (diffHours < 24) {
      return `${diffHours} h ago`;
    } else {
      return `${diffDays} days ago`;
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isFetching} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.sectionHeader}>New</Text>
      {notificationList && notificationList
        .filter(notification => !notification.citita)
        .map(notification => (
          <View key={notification.id} style={[styles.notification, styles.unseen]}>
            <View style={styles.textContainer}>
              {renderNotificationText(notification.text)}
              <Text style={styles.info}>{notification.info}</Text>
              <Text style={styles.timestamp}>{getTimeAgo(notification.createdAt)}</Text>
            </View>
            <MaterialCommunityIcons name="alert-circle" size={24} color={theme.colors.primary} style={styles.icon} />
          </View>
        ))
      }

      <Text style={styles.sectionHeader}>Earlier</Text>
      {notificationList && notificationList
        .filter(notification => notification.citita)
        .map(notification => (
          <View key={notification.id} style={styles.notification}>
            <View style={styles.textContainer}>
              {renderNotificationText(notification.text)}
              <Text style={styles.info}>{notification.info}</Text>
              <Text style={styles.timestamp}>{getTimeAgo(notification.createdAt)}</Text>
            </View>
          </View>
        ))
      }
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5EEF8",
    padding: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: 10,
  },
  notification: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    position: 'relative',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row', // Ensure the icon and text are on the same row
  },
  unseen: {
    backgroundColor: '#ffe6e6', // Light red background for unseen notifications
  },
  textContainer: {
    flex: 1, // Allow text container to take available space
  },
  text: {
    fontSize: 16,
    color: '#000',
  },
  boldText: {
    fontWeight: 'bold',
  },
  info: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  icon: {
    marginLeft: 10, // Space between the text container and the icon
    alignSelf: 'center', // Align the icon vertically centered
  },
});

export default Notifications;
