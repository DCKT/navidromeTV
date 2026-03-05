import {
  View,
  Image,
  useWindowDimensions,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useRef, useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { Album, fetchAlbums, getCoverArtUrl } from "@/services/navidrome";
import { useRouter } from "expo-router";
import tw from "twrnc";
import { useSuspenseQuery } from "@tanstack/react-query";
import { FlashList } from "@shopify/flash-list";

function AlbumGridItem({
  item,
  itemWidth,
}: {
  item: Album;
  itemWidth: number;
}) {
  const coverUrl = getCoverArtUrl(item.coverArt || item.id, 400);
  const router = useRouter();
  const [focused, setFocused] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;

  const handleFocus = () => {
    setFocused(true);
    Animated.spring(scale, {
      toValue: 1.06,
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
        router.push({ pathname: "/album/[id]", params: { id: item.id } })
      }
      onFocus={handleFocus}
      onBlur={handleBlur}
      activeOpacity={0.9}
      style={tw`p-3`}
    >
      <Animated.View
        style={[
          tw`rounded-lg mb-2`,
          {
            width: itemWidth,
            height: itemWidth,
            transform: [{ scale }],
            shadowColor: focused ? "rgba(255,255,255,0.2)" : "transparent",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: focused ? 0.6 : 0,
            shadowRadius: 16,
          },
        ]}
      >
        <Image
          source={{ uri: coverUrl }}
          style={[
            tw`rounded-lg`,
            { width: itemWidth, height: itemWidth, backgroundColor: "#282828" },
          ]}
        />
      </Animated.View>
      <View style={{ width: itemWidth }}>
        <ThemedText
          style={tw`text-lg font-semibold ${focused ? "text-[#1DB954]" : "text-white"}`}
          numberOfLines={1}
        >
          {item.name}
        </ThemedText>
        <ThemedText
          style={tw`text-base ${focused ? "text-[#1DB954]" : "text-neutral-400"}`}
          numberOfLines={1}
        >
          {item.artist}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
}

export default function AlbumsScreen() {
  const { width } = useWindowDimensions();
  const { data: albums } = useSuspenseQuery({
    queryKey: ["getAlbums"],
    queryFn: () => fetchAlbums("newest", 50),
    select: (data) =>
      [...data].sort((a, b) => a.artist.localeCompare(b.artist)),
  });

  const numColumns = width > 1200 ? 6 : width > 900 ? 5 : width > 600 ? 4 : 2;
  const itemWidth = (width - (numColumns + 1) * 26) / numColumns;

  return (
    <View style={tw`flex-1 bg-[#121212] pt-36`}>
      <ThemedText style={tw`text-4xl font-extrabold text-white mb-6 px-12`}>
        Albums
      </ThemedText>
      <FlashList
        data={albums}
        renderItem={({ item }: { item: Album }) => (
          <AlbumGridItem item={item} itemWidth={itemWidth} />
        )}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        key={numColumns}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}
