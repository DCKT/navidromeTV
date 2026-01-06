import { View, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useState, useEffect } from 'react';
import { navidrome } from '@/services/navidrome';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
    const [url, setUrl] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    useEffect(() => {
        try {
            const config = navidrome.getConfig();
            setUrl(config.url);
            setUsername(config.username);
            setPassword(config.password || '');
        } catch (e) {
            // Not initialized or no config
        }
    }, []);

    const handleSave = () => {
        navidrome.setConfig({
            url,
            username,
            password
        });
        alert('Configuration saved!');
        // Ideally we would persist this to Async Storage
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <ThemedText type="title" style={styles.header}>Settings</ThemedText>

            <View style={styles.form}>
                <ThemedText style={styles.label}>Navidrome URL</ThemedText>
                <TextInput
                    style={styles.input}
                    value={url}
                    onChangeText={setUrl}
                    placeholder="http://192.168.1.10:4533"
                    placeholderTextColor="#666"
                />

                <ThemedText style={styles.label}>Username</ThemedText>
                <TextInput
                    style={styles.input}
                    value={username}
                    onChangeText={setUsername}
                    placeholderTextColor="#666"
                />

                <ThemedText style={styles.label}>Password</ThemedText>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor="#666"
                />

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <ThemedText style={styles.saveButtonText}>Save Configuration</ThemedText>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#151515',
        padding: 40,
    },
    header: {
        marginBottom: 40,
    },
    form: {
        maxWidth: 600,
        width: '100%',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#ccc',
    },
    input: {
        backgroundColor: '#252525',
        color: 'white',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#333',
    },
    saveButton: {
        backgroundColor: '#A1CEDC',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
    }
});
