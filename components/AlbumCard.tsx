import { Image, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { Focusable } from "./Focusable";
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

  return (
    <Focusable
      onPress={() =>
        router.push({ pathname: "/album/[id]", params: { id: album.id } })
      }
      style={[tw`mr-4`, { width }]}
      focusScale={1.08}
      rounded={false}
    >
      <Image
        source={{ uri: coverUrl }}
        style={[
          tw`rounded-lg mb-2`,
          { width, height: width, backgroundColor: "#282828" },
        ]}
      />
      <View style={tw`w-full`}>
        <ThemedText
          style={tw`text-lg text-white font-semibold`}
          numberOfLines={1}
        >
          {album.name}
        </ThemedText>
        <ThemedText style={tw`text-base text-neutral-400`} numberOfLines={1}>
          {album.artist}
        </ThemedText>
      </View>
    </Focusable>
  );
}
