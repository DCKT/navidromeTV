import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Song } from '@/services/navidrome';

export type AudioState = 'stopped' | 'playing' | 'paused' | 'loading';

interface AudioContextType {
    currentSong: Song | null;
    queue: Song[];
    currentIndex: number;
    playerState: AudioState;
    hasPrevious: boolean;
    hasNext: boolean;
    play: (song: Song) => void;
    playQueue: (songs: Song[], startIndex?: number) => void;
    pause: () => void;
    resume: () => void;
    stop: () => void;
    next: () => void;
    previous: () => void;
    setPlayerState: (state: AudioState) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
    const [queue, setQueue] = useState<Song[]>([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [playerState, setPlayerState] = useState<AudioState>('stopped');

    const currentSong = currentIndex >= 0 && currentIndex < queue.length
        ? queue[currentIndex]
        : null;

    const hasPrevious = currentIndex > 0;
    const hasNext = currentIndex < queue.length - 1;

    const play = useCallback((song: Song) => {
        setQueue([song]);
        setCurrentIndex(0);
        setPlayerState('playing');
    }, []);

    const playQueue = useCallback((songs: Song[], startIndex = 0) => {
        setQueue(songs);
        setCurrentIndex(startIndex);
        setPlayerState('playing');
    }, []);

    const pause = useCallback(() => {
        if (playerState === 'playing') {
            setPlayerState('paused');
        }
    }, [playerState]);

    const resume = useCallback(() => {
        if (currentSong && playerState === 'paused') {
            setPlayerState('playing');
        }
    }, [currentSong, playerState]);

    const stop = useCallback(() => {
        setPlayerState('stopped');
        setQueue([]);
        setCurrentIndex(-1);
    }, []);

    const next = useCallback(() => {
        if (hasNext) {
            setCurrentIndex(i => i + 1);
            setPlayerState('playing');
        }
    }, [hasNext]);

    const previous = useCallback(() => {
        if (hasPrevious) {
            setCurrentIndex(i => i - 1);
            setPlayerState('playing');
        }
    }, [hasPrevious]);

    return (
        <AudioContext.Provider value={{
            currentSong,
            queue,
            currentIndex,
            playerState,
            hasPrevious,
            hasNext,
            play,
            playQueue,
            pause,
            resume,
            stop,
            next,
            previous,
            setPlayerState,
        }}>
            {children}
        </AudioContext.Provider>
    );
}

export function useAudio() {
    const context = useContext(AudioContext);
    if (context === undefined) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
}
