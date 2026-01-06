import { View, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, useWindowDimensions, Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useEffect, useState } from 'react';
import { Album, fetchAlbums, getCoverArtUrl } from '@/services/navidrome';
import { useRouter } from 'expo-router';

export default function AlbumsScreen() {
    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { width } = useWindowDimensions();

    const numColumns = width > 1000 ? 5 : width > 600 ? 4 : 2;
    const itemWidth = (width - (numColumns + 1) * 20) / numColumns;


    useEffect(() => {
        const loadAlbums = async () => {
            try {
                // Fetch more albums for the grid
                const fetchedAlbums = await fetchAlbums('newest', 50);
                setAlbums(fetchedAlbums);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        loadAlbums();
    }, []);

    const renderItem = ({ item, index }: { item: Album, index: number }) => {
        const coverUrl = getCoverArtUrl(item.coverArt || item.id, 400);

        return (
            <TouchableOpacity
                style={[styles.itemContainer, { width: itemWidth }]}
                onPress={() => router.push(`/albums/${item.id}` as any)}
                activeOpacity={0.7}
                // TV Focus props
                focusable={true}
            >
                <Image source={{ uri: coverUrl }} style={[styles.cover, { width: itemWidth, height: itemWidth }]} />
                <ThemedText style={styles.albumTitle} numberOfLines={1}>{item.name}</ThemedText>
                <ThemedText style={styles.artistName} numberOfLines={1}>{item.artist}</ThemedText>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ThemedText type="title" style={styles.header}>Recently Added</ThemedText>
            <FlatList
                data={albums}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={numColumns}
                key={numColumns}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={{ gap: 20 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#151515',
        paddingTop: 50,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#151515',
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
        backgroundColor: '#333',
    },
    albumTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
    artistName: {
        fontSize: 14,
        color: '#aaa',
        marginTop: 2,
    }
});
