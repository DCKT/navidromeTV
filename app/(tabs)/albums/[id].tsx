import { View, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { AlbumDetails, getAlbum, getCoverArtUrl, Song } from '@/services/navidrome';
import { Ionicons } from '@expo/vector-icons';
import { useAudio } from '@/context/AudioContext';

export default function AlbumDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [album, setAlbum] = useState<AlbumDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const { play, currentSong } = useAudio();

    useEffect(() => {
        if (!id) return;

        const loadAlbum = async () => {
            try {
                const data = await getAlbum(id as string);
                setAlbum(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        loadAlbum();
    }, [id]);

    const handlePlaySong = (song: Song) => {
        play(song);
    };

    const handlePlayAlbum = () => {
        if (album && album.song.length > 0) {
            handlePlaySong(album.song[0]);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!album) {
        return (
            <View style={styles.container}>
                <ThemedText>Album not found</ThemedText>
            </View>
        );
    }

    const coverUrl = getCoverArtUrl(album.coverArt, 600);

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={30} color="white" />
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Image source={{ uri: coverUrl }} style={styles.coverArt} resizeMode="contain" width={300} height={300} />
                    <View style={styles.headerInfo}>
                        <ThemedText style={styles.albumTitle}>{album.name}</ThemedText>
                        <ThemedText style={styles.artistName}>{album.artist}</ThemedText>
                        <ThemedText style={styles.metaInfo}>{album.year} • {album.genre || 'Unknown Genre'}</ThemedText>

                        <View style={styles.actionButtons}>
                            <TouchableOpacity style={styles.playButton} onPress={handlePlayAlbum}>
                                <Ionicons name="play" size={24} color="black" />
                                <ThemedText style={styles.playButtonText}>Play</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.shuffleButton}>
                                <Ionicons name="shuffle" size={24} color="#A1CEDC" />
                                <ThemedText style={styles.shuffleButtonText}>Shuffle</ThemedText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Local player removed, using global player */}

                <View style={styles.trackList}>
                    {album.song.map((song, index) => (
                        <TouchableOpacity
                            key={song.id}
                            style={styles.trackItem}
                            onPress={() => handlePlaySong(song)}
                        >
                            <ThemedText style={styles.trackNum}>{song.track}</ThemedText>
                            <View style={styles.trackInfo}>
                                <ThemedText style={[styles.trackTitle, currentSong?.id === song.id && styles.activeTrack]}>
                                    {song.title}
                                </ThemedText>
                            </View>
                            <ThemedText style={styles.trackDuration}>
                                {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
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
        backgroundColor: '#151515',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#151515',
    },
    backButton: {
        position: 'absolute',
        top: 60,
        left: 20,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
        padding: 5,
    },
    scrollContent: {
        paddingTop: 60,
        paddingBottom: 40,
        gap: 20
    },
    header: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
    },
    coverArt: {
        borderRadius: 12,
        backgroundColor: '#333',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
    },
    headerInfo: {
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    albumTitle: {
        fontSize: 42,
        lineHeight: 42,
        fontWeight: '800',
        color: 'white',
        marginBottom: 8,
    },
    artistName: {
        fontSize: 24,
        color: '#A1CEDC',
        marginBottom: 8,
        fontWeight: '600',
    },
    metaInfo: {
        fontSize: 16,
        color: '#888',
        marginBottom: 10,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 16,
    },
    playButton: {
        flexDirection: 'row',
        backgroundColor: '#A1CEDC',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
        alignItems: 'center',
        gap: 8,
    },
    playButtonText: {
        color: 'black',
        fontSize: 18,
        fontWeight: '600',
    },
    shuffleButton: {
        flexDirection: 'row',
        backgroundColor: '#333',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
        alignItems: 'center',
        gap: 8,
    },
    shuffleButtonText: {
        color: '#A1CEDC',
        fontSize: 18,
        fontWeight: '600',
    },
    trackList: {
        paddingHorizontal: 20,
    },
    trackItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#252525',
    },
    trackNum: {
        width: 40,
        color: '#666',
        fontSize: 16,
        textAlign: 'right',
        marginRight: 20,
    },
    trackInfo: {
        flex: 1,
    },
    trackTitle: {
        color: 'white',
        fontSize: 18,
    },
    activeTrack: {
        color: '#A1CEDC',
        fontWeight: 'bold',
    },
    trackDuration: {
        color: '#666',
        fontSize: 16,
    }
});
