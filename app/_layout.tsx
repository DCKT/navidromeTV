import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { AudioProvider } from "@/context/AudioContext";
import { AudioPlayer } from "@/components/AudioPlayer";
import { View } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import tw from "twrnc";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

const spotifyDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#1DB954",
    background: "#121212",
    card: "#121212",
    text: "#FFFFFF",
    border: "#282828",
    notification: "#1DB954",
  },
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

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
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={spotifyDarkTheme}>
        <AudioProvider>
          <View style={tw`flex-1 bg-[#121212]`}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="album/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <AudioPlayer />
          </View>
        </AudioProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
