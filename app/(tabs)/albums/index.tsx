import { View, Image, useWindowDimensions } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Focusable } from "@/components/Focusable";
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

  return (
    <Focusable
      onPress={() =>
        router.push({ pathname: "/album/[id]", params: { id: item.id } })
      }
      style={tw`p-3`}
      focusScale={1.08}
      rounded={false}
    >
      <Image
        source={{ uri: coverUrl }}
        style={[
          tw`rounded-lg mb-2`,
          { width: itemWidth, height: itemWidth, backgroundColor: "#282828" },
        ]}
      />
      <View style={{ width: itemWidth }}>
        <ThemedText
          style={tw`text-lg text-white font-semibold`}
          numberOfLines={1}
        >
          {item.name}
        </ThemedText>
        <ThemedText style={tw`text-base text-neutral-400`} numberOfLines={1}>
          {item.artist}
        </ThemedText>
      </View>
    </Focusable>
  );
}

export default function AlbumsScreen() {
  const { width } = useWindowDimensions();
  const { data: albums } = useSuspenseQuery({
    queryKey: ["getAlbums"],
    queryFn: () => fetchAlbums("newest", 50),
  });

  const numColumns =
    width > 1200 ? 6 : width > 900 ? 5 : width > 600 ? 4 : 2;
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
