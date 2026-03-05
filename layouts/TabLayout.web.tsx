import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Pressable } from 'react-native';
import { SpotifyColors } from '@/constants/Colors';
import { useTextStyles } from '@/hooks/useTextStyles';

export default function TabLayout() {
  const textStyles = useTextStyles();

  const tabBarButton = (props: any) => {
    const style: any = props.style ?? {};
    return (
      <Pressable
        {...props}
        style={({ pressed, focused }) => [
          style,
          {
            opacity: pressed || focused ? 0.6 : 1.0,
          },
        ]}
      />
    );
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: SpotifyColors.green,
        tabBarInactiveTintColor: SpotifyColors.textSecondary,
        tabBarActiveBackgroundColor: SpotifyColors.darkBase,
        tabBarStyle: {
          width: '100%',
          backgroundColor: SpotifyColors.darkBase,
          borderBottomColor: SpotifyColors.darkHighlight,
        },
        tabBarPosition: 'top',
        tabBarIconStyle: {
          height: textStyles.title.lineHeight,
          width: 0,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarButton,
          tabBarLabelStyle: textStyles.default,
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="shuffle"
        options={{
          title: 'Shuffle',
          tabBarButton,
          tabBarLabelStyle: textStyles.default,
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="albums"
        options={{
          title: 'Library',
          tabBarButton,
          tabBarLabelStyle: textStyles.default,
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarButton,
          tabBarLabelStyle: textStyles.default,
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="tv_focus"
        options={
          Platform.OS === 'web'
            ? { href: null }
            : {
              title: 'TV demo',
              tabBarButton,
              tabBarLabelStyle: textStyles.default,
              tabBarIcon: () => null,
            }
        }
      />
    </Tabs>
  );
}
