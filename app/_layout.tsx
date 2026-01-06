import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';
import { AudioProvider } from '@/context/AudioContext';
import { AudioPlayer } from '@/components/AudioPlayer';
import { View, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Disable reanimated warnings
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
      if (error) {
        console.warn(`Error in loading fonts: ${error}`);
      }
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AudioProvider>
        <View style={{ flex: 1, position: 'relative' }}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>

          {/* Global Player floating at the TOP */}
          <View style={[
            styles.playerContainer,
            { bottom: insets.bottom * 3, left: insets.left, right: insets.right }
          ]}
            pointerEvents="box-none" // Allow touches to pass through if player is not covering everything (though it has background)
          >
            {/* Player itself will take space, ensure it has pointerEvents="auto" */}
            <View style={{ pointerEvents: 'auto' }}>
              <AudioPlayer />
            </View>
          </View>
        </View>
      </AudioProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  playerContainer: {
    position: 'absolute',
    zIndex: 100, // Ensure it's on top
  }
});
