import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Album, fetchAlbums, getCoverArtUrl } from "@/services/navidrome";
import { Link } from "expo-router";
import tw from "twrnc";
import { useSuspenseQuery } from "@tanstack/react-query";
import { FlashList } from "@shopify/flash-list";

export default function AlbumsScreen() {
  const { width } = useWindowDimensions();
  const { data: albums } = useSuspenseQuery({
    queryKey: ["getAlbums"],
    queryFn: () => fetchAlbums("newest", 50),
  });

  const numColumns = width > 1000 ? 5 : width > 600 ? 4 : 2;
  const itemWidth = (width - (numColumns + 1) * 20) / numColumns;

  return (
    <View style={tw`flex-1 pt-36 bg-zinc-900`}>
      <FlashList
        data={albums}
        renderItem={({ item }: { item: Album }) => {
          const coverUrl = getCoverArtUrl(item.coverArt || item.id, 400);

          return (
            <Link
              href={{ pathname: "/albums/[id]", params: { id: item.id } }}
              asChild
            >
              <TouchableOpacity
                activeOpacity={0.7}
                focusable={true}
                style={tw`p-4`}
              >
                <Image
                  source={{ uri: coverUrl }}
                  style={[
                    styles.cover,
                    { width: itemWidth, height: itemWidth },
                  ]}
                />
                <ThemedText
                  style={tw`text-xl text-white font-semibold`}
                  numberOfLines={1}
                >
                  {item.name}
                </ThemedText>
                <ThemedText style={tw`text-lg text-gray-400`} numberOfLines={1}>
                  {item.artist}
                </ThemedText>
              </TouchableOpacity>
            </Link>
          );
        }}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        key={numColumns}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#151515",
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#151515",
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 34,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  itemContainer: {
    marginBottom: 20,
  },
  cover: {
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#333",
  },
  albumTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  artistName: {
    fontSize: 14,
    color: "#aaa",
    marginTop: 2,
  },
});
