import { Image, View, TouchableOpacity, Animated } from "react-native";
import { useRef, useState } from "react";
import { ThemedText } from "./ThemedText";
import { getCoverArtUrl, Album } from "@/services/navidrome";
import { useRouter } from "expo-router";
import tw from "twrnc";

interface AlbumCardProps {
  album: Album;
  width: number;
}

export function AlbumCard({ album, width }: AlbumCardProps) {
  const coverUrl = getCoverArtUrl(album.coverArt || album.id, 400);
  const router = useRouter();
  const [focused, setFocused] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;

  const handleFocus = () => {
    setFocused(true);
    Animated.spring(scale, {
      toValue: 1.08,
      friction: 6,
      tension: 150,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    setFocused(false);
    Animated.spring(scale, {
      toValue: 1,
      friction: 6,
      tension: 150,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({ pathname: "/album/[id]", params: { id: album.id } })
      }
      onFocus={handleFocus}
      onBlur={handleBlur}
      activeOpacity={0.9}
      style={[tw`mr-4`, { width }]}
    >
      <Animated.View
        style={[
          tw`rounded-lg mb-2`,
          {
            width,
            height: width,
            transform: [{ scale }],
            // shadowColor: focused ? "#1DB954" : "transparent",
            // shadowOffset: { width: 0, height: 0 },
            // shadowOpacity: focused ? 0.6 : 0,
            // shadowRadius: 16,
          },
        ]}
      >
        <Image
          source={{ uri: coverUrl }}
          style={[
            tw`rounded-lg`,
            { width, height: width, backgroundColor: "#282828" },
          ]}
        />
      </Animated.View>
      <View style={tw`w-full`}>
        <ThemedText
          style={tw`text-lg font-semibold ${focused ? "text-[#1DB954]" : "text-white"}`}
          numberOfLines={1}
        >
          {album.name}
        </ThemedText>
        <ThemedText
          style={tw`text-base ${focused ? "text-[#1DB954]" : "text-neutral-400"}`}
          numberOfLines={1}
        >
          {album.artist}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
}
