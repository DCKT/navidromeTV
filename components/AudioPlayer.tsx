import { View, ActivityIndicator, Image, BackHandler } from "react-native";
import { ThemedText } from "./ThemedText";
import { Focusable } from "./Focusable";
import { useAudioPlayer, AudioSource, useAudioPlayerStatus } from "expo-audio";
import { getStreamUrl, getCoverArtUrl } from "@/services/navidrome";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import tw from "twrnc";
import { useAudio } from "@/context/AudioContext";

export function AudioPlayer() {
  const {
    currentSong,
    playerState,
    setPlayerState,
    pause,
    resume,
    stop,
    next,
    previous,
    hasPrevious,
    hasNext,
    shuffleMode,
  } = useAudio();
  const [source, setSource] = useState<AudioSource | null>(null);
  const player = useAudioPlayer(source);
  const status = useAudioPlayerStatus(player);

  // Handle back/menu button on TV remote
  useEffect(() => {
    if (!currentSong) return;

    const handler = BackHandler.addEventListener("hardwareBackPress", () => {
      stop();
      return true;
    });

    return () => handler.remove();
  }, [currentSong, stop]);

  useEffect(() => {
    if (currentSong) {
      const url = getStreamUrl(currentSong.id);
      setSource({ uri: url });
    } else {
      setSource(null);
    }
  }, [currentSong]);

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

  useEffect(() => {
    if (!player) return;
    if (status.didJustFinish) {
      if (hasNext) {
        next();
      } else {
        setPlayerState("stopped");
      }
    }
  }, [status.didJustFinish, hasNext, next, setPlayerState]);

  if (!currentSong) return null;

  if (!player) {
    return (
      <View
        style={tw`absolute inset-0 bg-[#121212] items-center justify-center`}
      >
        <ActivityIndicator color="#1DB954" size="large" />
      </View>
    );
  }

  const progress =
    status.duration > 0 ? (status.currentTime / status.duration) * 100 : 0;
  const coverArtUrl = getCoverArtUrl(
    currentSong.coverArt || currentSong.id,
    600,
  );

  const togglePlayPause = () => {
    if (playerState === "playing") {
      pause();
    } else {
      resume();
    }
  };

  return (
    <View
      style={tw`absolute inset-0 bg-[#121212] flex-col items-center justify-center`}
    >
      {/* Album art */}
      <Image
        source={{ uri: coverArtUrl }}
        style={tw`w-[340px] h-[340px] rounded-lg mb-8`}
      />

      {/* Song info */}
      <View style={tw`items-center mb-6`}>
        <ThemedText
          style={tw`text-4xl font-extrabold text-white mb-1`}
          numberOfLines={1}
        >
          {currentSong.title}
        </ThemedText>
        <ThemedText style={tw`text-xl text-neutral-400`} numberOfLines={1}>
          {currentSong.artist}
        </ThemedText>
      </View>

      {/* Progress bar */}
      <View style={tw`w-[500px] mb-2`}>
        <View style={tw`h-1.5 bg-[#282828] rounded-full`}>
          <View
            style={[
              tw`h-full rounded-full bg-[#1DB954]`,
              { width: `${progress}%` },
            ]}
          />
        </View>
        <View style={tw`flex-row justify-between mt-2`}>
          <ThemedText style={tw`text-sm text-neutral-500`}>
            {formatTime(status.currentTime)}
          </ThemedText>
          <ThemedText style={tw`text-sm text-neutral-500`}>
            {formatTime(status.duration)}
          </ThemedText>
        </View>
      </View>

      {/* Controls */}
      <View style={tw`flex-row items-center gap-8 mt-6`}>
        <Focusable onPress={stop} style={tw`p-4`} focusScale={1.2}>
          <Ionicons name="close-circle" size={44} color="#B3B3B3" />
        </Focusable>

        {!shuffleMode && (
          <Focusable
            onPress={previous}
            style={tw`p-3`}
            focusScale={1.2}
            disabled={!hasPrevious}
          >
            <Ionicons name="play-skip-back" size={36} color="white" />
          </Focusable>
        )}

        <Focusable
          onPress={togglePlayPause}
          hasTVPreferredFocus
          style={tw`p-2`}
          focusScale={1.2}
        >
          <Ionicons
            name={playerState === "playing" ? "pause-circle" : "play-circle"}
            size={80}
            color="#1DB954"
          />
        </Focusable>

        <Focusable
          onPress={next}
          style={tw`p-3`}
          focusScale={1.2}
          disabled={!hasNext}
        >
          <Ionicons
            name={shuffleMode ? "shuffle" : "play-skip-forward"}
            size={36}
            color="white"
          />
        </Focusable>
      </View>
    </View>
  );
}

const formatTime = (seconds: number) => {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
};
