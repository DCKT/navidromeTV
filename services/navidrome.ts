import md5 from 'md5';

export interface NavidromeConfig {
    url: string;
    username: string;
    password?: string;
    token?: string;
    salt?: string;
    version?: string;
    client?: string;
}

export interface Album {
    id: string;
    name: string;
    artist: string;
    artistId: string;
    coverArt: string;
    songCount: number;
    duration: number;
    created: string;
    year: number;
    genre?: string;
}

export interface Song {
    id: string;
    parent: string;
    title: string;
    isDir: boolean;
    album: string;
    artist: string;
    track: number;
    year: number;
    coverArt: string;
    size: number;
    contentType: string;
    suffix: string;
    duration: number;
    bitRate: number;
    path: string;
}

export interface Artist {
    id: string;
    name: string;
    coverArt: string;
    albumCount: number;
    artistImageUrl?: string;
    album?: Album[];
}

export interface AlbumDetails extends Album {
    song: Song[];
}

export interface SubsonicResponse {
    "subsonic-response": {
        status: "ok" | "failed";
        version: string;
        error?: {
            code: number;
            message: string;
        };
        albumList2?: {
            album: Album[];
        };
        album?: AlbumDetails;
        artist?: Artist;
        song?: Song;
        randomSongs?: {
            song: Song[];
        };
    };
}

const DEFAULT_VERSION = '1.16.1';
const DEFAULT_CLIENT = 'NavidromeTV';

class NavidromeClient {
    private static instance: NavidromeClient;
    private config: NavidromeConfig | null = null;

    private constructor() { }

    static getInstance(): NavidromeClient {
        if (!NavidromeClient.instance) {
            NavidromeClient.instance = new NavidromeClient();
        }
        return NavidromeClient.instance;
    }

    setConfig(config: NavidromeConfig) {
        this.config = config;
    }

    getConfig(): NavidromeConfig {
        if (!this.config) {
            throw new Error('Navidrome client not initialized. Call setConfig() first.');
        }
        return this.config;
    }

    private generateAuthParams(): Record<string, string> {
        const config = this.getConfig();
        const salt = Math.random().toString(36).substring(7);
        const token = md5((config.password || '') + salt);
        return {
            u: config.username,
            t: token,
            s: salt,
            v: config.version || DEFAULT_VERSION,
            c: config.client || DEFAULT_CLIENT,
            f: 'json',
        };
    }

    async fetchAlbums(type: string = 'newest', size: number = 10): Promise<Album[]> {
        const config = this.getConfig();
        const authParams = this.generateAuthParams();
        const queryParams = new URLSearchParams({
            ...authParams,
            type,
            size: size.toString(),
        });

        const response = await fetch(`${config.url}/rest/getAlbumList2?${queryParams.toString()}`);
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data: SubsonicResponse = await response.json();
        if (data["subsonic-response"].status === 'failed') {
            throw new Error(data["subsonic-response"].error?.message || 'Unknown Navidrome API error');
        }

        return data["subsonic-response"].albumList2?.album || [];
    }

    getStreamUrl(id: string): string {
        const config = this.getConfig();
        const authParams = this.generateAuthParams();
        const queryParams = new URLSearchParams({
            ...authParams,
            id,
        });
        return `${config.url}/rest/stream?${queryParams.toString()}`;
    }

    getCoverArtUrl(id: string, size: number = 300): string {
        const config = this.getConfig();
        const authParams = this.generateAuthParams();
        const queryParams = new URLSearchParams({
            ...authParams,
            id,
            size: size.toString(),
        });
        return `${config.url}/rest/getCoverArt?${queryParams.toString()}`;
    }

    async getAlbum(id: string): Promise<AlbumDetails> {
        const config = this.getConfig();
        const authParams = this.generateAuthParams();
        const queryParams = new URLSearchParams({
            ...authParams,
            id,
        });

        const response = await fetch(`${config.url}/rest/getAlbum?${queryParams.toString()}`);
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data: SubsonicResponse = await response.json();
        if (data["subsonic-response"].status === 'failed') {
            throw new Error(data["subsonic-response"].error?.message || 'Unknown Navidrome API error');
        }

        if (!data["subsonic-response"].album) {
            throw new Error('Album not found');
        }

        return data["subsonic-response"].album;
    }

    async getArtist(id: string): Promise<Artist> {
        const config = this.getConfig();
        const authParams = this.generateAuthParams();
        const queryParams = new URLSearchParams({
            ...authParams,
            id,
        });

        const response = await fetch(`${config.url}/rest/getArtist?${queryParams.toString()}`);
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data: SubsonicResponse = await response.json();
        if (data["subsonic-response"].status === 'failed') {
            throw new Error(data["subsonic-response"].error?.message || 'Unknown Navidrome API error');
        }

        if (!data["subsonic-response"].artist) {
            throw new Error('Artist not found');
        }

        return data["subsonic-response"].artist;
    }

    async getRandomSongs(size: number = 1): Promise<Song[]> {
        const config = this.getConfig();
        const authParams = this.generateAuthParams();
        const queryParams = new URLSearchParams({
            ...authParams,
            size: size.toString(),
        });

        const response = await fetch(`${config.url}/rest/getRandomSongs?${queryParams.toString()}`);
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data: SubsonicResponse = await response.json();
        if (data["subsonic-response"].status === 'failed') {
            throw new Error(data["subsonic-response"].error?.message || 'Unknown Navidrome API error');
        }

        return data["subsonic-response"].randomSongs?.song || [];
    }

    async getSong(id: string): Promise<Song> {
        const config = this.getConfig();
        const authParams = this.generateAuthParams();
        const queryParams = new URLSearchParams({
            ...authParams,
            id,
        });

        const response = await fetch(`${config.url}/rest/getSong?${queryParams.toString()}`);
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data: SubsonicResponse = await response.json();
        if (data["subsonic-response"].status === 'failed') {
            throw new Error(data["subsonic-response"].error?.message || 'Unknown Navidrome API error');
        }

        if (!data["subsonic-response"].song) {
            throw new Error('Song not found');
        }

        return data["subsonic-response"].song;
    }
}

export const navidrome = NavidromeClient.getInstance();

// Backwards compatibility / Ease of use exports (now methods of singleton)
export const fetchAlbums = (type?: string, size?: number) => navidrome.fetchAlbums(type, size);
export const getStreamUrl = (id: string) => navidrome.getStreamUrl(id);
export const getCoverArtUrl = (id: string, size?: number) => navidrome.getCoverArtUrl(id, size);
export const getAlbum = (id: string) => navidrome.getAlbum(id);
export const getArtist = (id: string) => navidrome.getArtist(id);
export const getRandomSongs = (size?: number) => navidrome.getRandomSongs(size);
export const getSong = (id: string) => navidrome.getSong(id);
