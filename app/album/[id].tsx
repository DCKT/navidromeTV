import { View, Image, ScrollView } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Focusable } from "@/components/Focusable";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getAlbum, getCoverArtUrl, Song } from "@/services/navidrome";
import { Ionicons } from "@expo/vector-icons";
import { useAudio } from "@/context/AudioContext";
import { useSuspenseQuery } from "@tanstack/react-query";
import tw from "twrnc";

function TrackItem({
  song,
  isActive,
  onPress,
}: {
  song: Song;
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <Focusable
      onPress={onPress}
      style={tw`flex-row items-center py-3 px-4`}
      focusScale={1.03}
      rounded={false}
    >
      <ThemedText
        style={tw`w-10 text-right mr-5 text-base ${
          isActive ? "text-[#1DB954]" : "text-neutral-500"
        }`}
      >
        {song.track}
      </ThemedText>
      <View style={tw`flex-1`}>
        <ThemedText
          style={tw`text-xl font-semibold ${
            isActive ? "text-[#1DB954]" : "text-white"
          }`}
          numberOfLines={1}
        >
          {song.title}
        </ThemedText>
      </View>
      <ThemedText style={tw`text-base text-neutral-500`}>
        {Math.floor(song.duration / 60)}:
        {(song.duration % 60).toString().padStart(2, "0")}
      </ThemedText>
    </Focusable>
  );
}

export default function AlbumDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { play, currentSong } = useAudio();
  const { data: album } = useSuspenseQuery({
    queryKey: ["getAlbum", id],
    queryFn: () => getAlbum(id),
  });

  const handlePlaySong = (song: Song) => {
    play(song);
  };

  const handlePlayAlbum = () => {
    if (album && album.song.length > 0) {
      handlePlaySong(album.song[0]);
    }
  };

  if (!album) {
    return (
      <View style={tw`flex-1 bg-[#121212] items-center justify-center`}>
        <ThemedText style={tw`text-white`}>Album not found</ThemedText>
      </View>
    );
  }

  const coverUrl = getCoverArtUrl(album.coverArt, 600);

  return (
    <View style={tw`flex-1 flex-row bg-[#121212] pt-12`}>
      <View style={tw`w-[380px] px-10 items-center`}>
        <View style={tw`self-start mb-4`}>
          <Focusable onPress={() => router.back()} style={tw`p-2`} focusScale={1.2}>
            <Ionicons name="arrow-back" size={36} color="#B3B3B3" />
          </Focusable>
        </View>

        <Image
          source={{ uri: coverUrl }}
          style={tw`w-[300px] h-[300px] rounded-lg mb-6`}
          resizeMode="cover"
        />

        <ThemedText
          style={tw`text-3xl font-extrabold text-white text-center mb-1`}
          numberOfLines={2}
        >
          {album.name}
        </ThemedText>
        <ThemedText style={tw`text-xl font-semibold text-[#1DB954] mb-1`}>
          {album.artist}
        </ThemedText>
        <ThemedText style={tw`text-base text-neutral-500 mb-6`}>
          {album.year} {album.genre ? `\u2022 ${album.genre}` : ""}
        </ThemedText>

        <View style={tw`flex-row gap-3`}>
          <Focusable
            onPress={handlePlayAlbum}
            style={tw`flex-row bg-[#1DB954] py-3 px-8 items-center gap-2`}
            focusScale={1.1}
          >
            <Ionicons name="play" size={22} color="black" />
            <ThemedText style={tw`text-black text-lg font-bold`}>
              Play
            </ThemedText>
          </Focusable>
          <Focusable
            onPress={() => {}}
            style={tw`flex-row bg-[#282828] py-3 px-8 items-center gap-2`}
            focusScale={1.1}
          >
            <Ionicons name="shuffle" size={22} color="#1DB954" />
            <ThemedText style={tw`text-[#1DB954] text-lg font-bold`}>
              Shuffle
            </ThemedText>
          </Focusable>
        </View>
      </View>

      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`py-16 pr-10`}>
        {album.song.map((song) => (
          <TrackItem
            key={song.id}
            song={song}
            isActive={currentSong?.id === song.id}
            onPress={() => handlePlaySong(song)}
          />
        ))}
      </ScrollView>
    </View>
  );
}
