import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Stack, Tabs, useLocalSearchParams, useRouter } from "expo-router";
import { getAlbum, getCoverArtUrl, Song } from "@/services/navidrome";
import { Ionicons } from "@expo/vector-icons";
import { useAudio } from "@/context/AudioContext";
import { useSuspenseQuery } from "@tanstack/react-query";
import tw from "twrnc";

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
      <View style={styles.container}>
        <ThemedText>Album not found</ThemedText>
      </View>
    );
  }

  const coverUrl = getCoverArtUrl(album.coverArt, 600);

  return (
    <View style={tw`flex-1 flex-row bg-slate-900`}>
      <View style={tw`w-1/3`}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={42} color="white" />
        </TouchableOpacity>
        <View style={styles.header}>
          <Image
            source={{ uri: coverUrl }}
            style={styles.coverArt}
            resizeMode="contain"
            width={300}
            height={300}
          />
          <View style={styles.headerInfo}>
            <ThemedText style={styles.albumTitle}>{album.name}</ThemedText>
            <ThemedText style={styles.artistName}>{album.artist}</ThemedText>
            <ThemedText style={styles.metaInfo}>
              {album.year} • {album.genre || "Unknown Genre"}
            </ThemedText>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.playButton}
                onPress={handlePlayAlbum}
              >
                <Ionicons name="play" size={24} color="black" />
                <ThemedText style={styles.playButtonText}>Play</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shuffleButton}>
                <Ionicons name="shuffle" size={24} color="#A1CEDC" />
                <ThemedText style={styles.shuffleButtonText}>
                  Shuffle
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={tw`gap-20`}>
        <View style={styles.trackList}>
          {album.song.map((song, index) => (
            <TouchableOpacity
              key={song.id}
              style={styles.trackItem}
              onPress={() => handlePlaySong(song)}
            >
              <ThemedText style={styles.trackNum}>{song.track}</ThemedText>
              <View style={styles.trackInfo}>
                <ThemedText
                  style={[
                    tw`text-xl font-semibold text-white`,
                    currentSong?.id === song.id && styles.activeTrack,
                  ]}
                >
                  {song.title}
                </ThemedText>
              </View>
              <ThemedText style={styles.trackDuration}>
                {Math.floor(song.duration / 60)}:
                {(song.duration % 60).toString().padStart(2, "0")}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#151515",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#151515",
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 5,
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 40,
    gap: 20,
  },
  header: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  coverArt: {
    borderRadius: 12,
    backgroundColor: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  headerInfo: {
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  albumTitle: {
    fontSize: 42,
    lineHeight: 42,
    fontWeight: "800",
    color: "white",
    marginBottom: 8,
  },
  artistName: {
    fontSize: 24,
    color: "#A1CEDC",
    marginBottom: 8,
    fontWeight: "600",
  },
  metaInfo: {
    fontSize: 16,
    color: "#888",
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 16,
  },
  playButton: {
    flexDirection: "row",
    backgroundColor: "#A1CEDC",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: "center",
    gap: 8,
  },
  playButtonText: {
    color: "black",
    fontSize: 18,
    fontWeight: "600",
  },
  shuffleButton: {
    flexDirection: "row",
    backgroundColor: "#333",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: "center",
    gap: 8,
  },
  shuffleButtonText: {
    color: "#A1CEDC",
    fontSize: 18,
    fontWeight: "600",
  },
  trackList: {
    paddingHorizontal: 20,
  },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#252525",
  },
  trackNum: {
    width: 40,
    color: "#666",
    fontSize: 16,
    textAlign: "right",
    marginRight: 20,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    color: "white",
    fontSize: 18,
  },
  activeTrack: {
    color: "#A1CEDC",
    fontWeight: "bold",
  },
  trackDuration: {
    color: "#666",
    fontSize: 16,
  },
});
