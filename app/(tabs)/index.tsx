import {
  View,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { AlbumCard } from "@/components/AlbumCard";
import { fetchAlbums, Album, navidrome } from "@/services/navidrome";
import { useQuery } from "@tanstack/react-query";
import tw from "twrnc";

const NAVIDROME_URL = process.env.EXPO_PUBLIC_NAVIDROME_URL!;
const USERNAME = process.env.EXPO_PUBLIC_USERNAME!;
const PASSWORD = process.env.EXPO_PUBLIC_PASSWORD!;

navidrome.setConfig({
  url: NAVIDROME_URL,
  username: USERNAME,
  password: PASSWORD,
});

const CARD_WIDTH = 200;

function AlbumRow({ title, queryKey, type, size }: {
  title: string;
  queryKey: string;
  type: string;
  size: number;
}) {
  const { data: albums, isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchAlbums(type, size),
  });

  if (isLoading) {
    return (
      <View style={tw`mb-8`}>
        <ThemedText style={tw`text-2xl font-bold text-white mb-4 px-12`}>
          {title}
        </ThemedText>
        <ActivityIndicator color="#1DB954" style={tw`py-8`} />
      </View>
    );
  }

  if (!albums || albums.length === 0) return null;

  return (
    <View style={tw`mb-8`}>
      <ThemedText style={tw`text-2xl font-bold text-white mb-4 px-12`}>
        {title}
      </ThemedText>
      <FlatList
        horizontal
        data={albums}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AlbumCard album={item} width={CARD_WIDTH} />
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`px-12`}
      />
    </View>
  );
}

export default function HomeScreen() {
  return (
    <ScrollView
      style={tw`flex-1 bg-[#121212]`}
      contentContainerStyle={tw`pt-36 pb-32`}
    >
      <ThemedText style={tw`text-5xl font-extrabold text-white mb-8 px-12`}>
        Good evening
      </ThemedText>

      <AlbumRow
        title="Recently Added"
        queryKey="recentAlbums"
        type="newest"
        size={20}
      />

      <AlbumRow
        title="Recently Played"
        queryKey="recentlyPlayed"
        type="recent"
        size={20}
      />

      <AlbumRow
        title="Most Played"
        queryKey="frequentAlbums"
        type="frequent"
        size={20}
      />

      <AlbumRow
        title="Random Mix"
        queryKey="randomAlbums"
        type="random"
        size={20}
      />
    </ScrollView>
  );
}
