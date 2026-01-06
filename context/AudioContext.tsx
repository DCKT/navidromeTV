import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Song } from '@/services/navidrome';

export type AudioState = 'stopped' | 'playing' | 'paused' | 'loading';

interface AudioContextType {
    currentSong: Song | null;
    playerState: AudioState;
    play: (song: Song) => void;
    pause: () => void;
    resume: () => void;
    stop: () => void;
    setPlayerState: (state: AudioState) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [playerState, setPlayerState] = useState<AudioState>('stopped');

    // Play a new song
    const play = (song: Song) => {
        setCurrentSong(song);
        setPlayerState('playing');
    };

    const pause = () => {
        if (playerState === 'playing') {
            setPlayerState('paused');
        }
    };

    const resume = () => {
        if (currentSong && playerState === 'paused') {
            setPlayerState('playing');
        }
    };

    const stop = () => {
        setPlayerState('stopped');
        setCurrentSong(null);
    }

    return (
        <AudioContext.Provider value={{
            currentSong,
            playerState,
            play,
            pause,
            resume,
            stop,
            setPlayerState
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
