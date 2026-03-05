import {
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import { fetchAlbums, Album, getAlbum, navidrome } from "@/services/navidrome";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useScale } from "@/hooks/useScale";
import { useAudio } from "@/context/AudioContext";

const NAVIDROME_URL = process.env.EXPO_PUBLIC_NAVIDROME_URL!;
const USERNAME = process.env.EXPO_PUBLIC_USERNAME!;
const PASSWORD = process.env.EXPO_PUBLIC_PASSWORD!;

navidrome.setConfig({
  url: NAVIDROME_URL,
  username: USERNAME,
  password: PASSWORD,
});

export default function HomeScreen() {
  const styles = useHomeScreenStyles();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { play } = useAudio();

  useEffect(() => {
    const loadAlbums = async () => {
      try {
        const fetchedAlbums = await fetchAlbums();
        setAlbums(fetchedAlbums);
      } catch (e) {
        setError("Erreur: " + (e instanceof Error ? e.message : String(e)));
      } finally {
        setLoading(false);
      }
    };

    loadAlbums();
  }, []);

  const handlePlayAlbum = async (albumId: string) => {
    try {
      // Pour l'exemple, on charge l'album et on joue la première chanson
      const albumDetails = await getAlbum(albumId);
      if (albumDetails.song && albumDetails.song.length > 0) {
        play(albumDetails.song[0]);
      } else {
        alert("Aucune chanson dans cet album");
      }
    } catch (e) {
      alert("Erreur lors du chargement de l'album:" + e);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Navidrome API Demo</ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Albums Récents</ThemedText>

        {loading && <ActivityIndicator size="large" />}

        {error && (
          <ThemedText style={{ color: "red" }}>
            {error}
            {"\n"}
            (Vérifiez NAVIDROME_URL, USERNAME, et PASSWORD dans index.tsx)
          </ThemedText>
        )}

        {!loading &&
          !error &&
          albums.map((album) => (
            <TouchableOpacity
              key={album.id}
              onPress={() => handlePlayAlbum(album.id)}
            >
              <ThemedView
                style={{
                  marginBottom: 10,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <ThemedText type="defaultSemiBold">{album.name}</ThemedText>
                <ThemedText> - {album.artist}</ThemedText>
              </ThemedView>
            </TouchableOpacity>
          ))}

        {!loading && !error && albums.length === 0 && (
          <ThemedText>Aucun album trouvé.</ThemedText>
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const useHomeScreenStyles = function () {
  const scale = useScale();
  return StyleSheet.create({
    titleContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8 * scale,
    },
    stepContainer: {
      gap: 8 * scale,
      marginBottom: 8 * scale,
    },
    reactLogo: {
      height: 178 * scale,
      width: 290 * scale,
      bottom: 0,
      left: 0,
      position: "absolute",
    },
  });
};
