import { View, ActivityIndicator } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Focusable } from "@/components/Focusable";
import { Ionicons } from "@expo/vector-icons";
import { useAudio } from "@/context/AudioContext";
import { getRandomSongs } from "@/services/navidrome";
import { useCallback, useEffect, useState } from "react";
import tw from "twrnc";

export default function ShuffleScreen() {
  const { play, currentSong, setShuffleMode } = useAudio();
  const [loading, setLoading] = useState(false);

  const playRandomSong = useCallback(async () => {
    setLoading(true);
    try {
      const songs = await getRandomSongs(1);
      if (songs.length > 0) {
        play(songs[0]);
      }
    } catch (e) {
      console.error("Failed to fetch random song:", e);
    } finally {
      setLoading(false);
    }
  }, [play]);

  // Enable shuffle mode and register the skip callback
  useEffect(() => {
    setShuffleMode(true, () => {
      playRandomSong();
    });
    return () => setShuffleMode(false);
  }, [setShuffleMode, playRandomSong]);

  return (
    <View style={tw`flex-1 bg-[#121212] items-center justify-center`}>
      <Ionicons name="shuffle" size={80} color="#1DB954" style={tw`mb-6`} />
      <ThemedText style={tw`text-4xl font-extrabold text-white mb-2`}>
        Shuffle Play
      </ThemedText>
      <ThemedText style={tw`text-xl text-neutral-400 mb-10`}>
        Discover random songs from your library
      </ThemedText>

      {loading ? (
        <ActivityIndicator color="#1DB954" size="large" />
      ) : (
        <Focusable
          onPress={playRandomSong}
          style={tw`flex-row bg-[#1DB954] py-4 px-12 items-center gap-3`}
          focusScale={1.1}
          hasTVPreferredFocus
        >
          <Ionicons
            name={currentSong ? "play-skip-forward" : "play"}
            size={28}
            color="black"
          />
          <ThemedText style={tw`text-black text-2xl font-bold`}>
            {currentSong ? "Skip to Next" : "Start Shuffle"}
          </ThemedText>
        </Focusable>
      )}
    </View>
  );
}
