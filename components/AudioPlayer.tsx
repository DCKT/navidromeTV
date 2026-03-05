import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { useAudioPlayer, AudioSource, useAudioPlayerStatus } from "expo-audio";
import { getStreamUrl, getCoverArtUrl } from "@/services/navidrome";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import tw from "twrnc";

import { useAudio } from "@/context/AudioContext";

// No props, data comes from Context
export function AudioPlayer() {
  const { currentSong, playerState, setPlayerState, play, pause, resume } =
    useAudio();
  const [source, setSource] = useState<AudioSource | null>(null);
  const player = useAudioPlayer(source);
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    if (currentSong) {
      const url = getStreamUrl(currentSong.id);
      // Only update source if different (simplified check, could check ID)
      setSource({ uri: url });
    } else {
      setSource(null);
    }
  }, [currentSong]);

  // Sync player state with context state
  useEffect(() => {
    if (!player) return;

    if (playerState === "playing") {
      player.play();
    } else if (playerState === "paused") {
      player.pause();
    } else if (playerState === "stopped") {
      player.pause();
      player.seekTo(0);
    }
  }, [playerState, player]);

  // Update context only when play state changes significantly and doesn't match intent
  useEffect(() => {
    if (!player) return;

    // Sync when song finishes
    if (status.didJustFinish) {
      setPlayerState("stopped");
    }
  }, [status.didJustFinish, setPlayerState]);

  if (!currentSong) return null; // Don't render if no song

  if (!player) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  const progress =
    status.duration > 0 ? (status.currentTime / status.duration) * 100 : 0;
  const coverArtUrl = getCoverArtUrl(currentSong.coverArt || currentSong.id);

  const togglePlayPause = () => {
    if (playerState === "playing") {
      pause();
    } else {
      resume();
    }
  };

  return (
    <View
      style={[
        tw`absolute w-full h-full flex-1 flex-col gap-8 items-center justify-center bg-zinc-900`,
      ]}
    >
      <Image
        source={{ uri: coverArtUrl }}
        style={tw`w-[300px] h-[300px] rounded-md`}
      />
      <View style={tw`gap-2`}>
        <ThemedText style={tw`font-bold text-4xl text-white`} numberOfLines={1}>
          {currentSong.title}
        </ThemedText>
        <ThemedText
          style={tw`font-semibold text-xl text-neutral-300`}
          numberOfLines={1}
        >
          {currentSong.artist}
        </ThemedText>
      </View>
      <View style={tw`w-3/4 justify-center gap-2`}>
        <View style={tw`h-2.5 bg-zinc-700 rounded mt-1`}>
          <View
            style={[
              tw`h-full rounded-l bg-blue-500`,
              { width: `${progress}%` },
            ]}
          />
        </View>
        <ThemedText style={tw`text-lg font-semibold text-neutral-400`}>
          {formatTime(status.currentTime)} / {formatTime(status.duration)}
        </ThemedText>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={togglePlayPause}>
          <Ionicons
            name={playerState === "playing" ? "pause-circle" : "play-circle"}
            size={60}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const formatTime = (seconds: number) => {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#252525",
    padding: 10,
    // Remove margin/border for floating player look, or adjust as needed
    borderTopWidth: 1,
    borderColor: "#333",
    flexDirection: "row",
    alignItems: "center",
  },
  coverArt: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 10,
    backgroundColor: "#444",
  },
  infoContainer: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
  artist: {
    fontSize: 12,
    color: "white",
    opacity: 0.7,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressContainer: {},
  progressBar: {
    height: "100%",
    backgroundColor: "#A1CEDC",
  },
  timeInfo: {
    fontSize: 10,
    color: "#aaa",
    marginTop: 2,
  },
});
