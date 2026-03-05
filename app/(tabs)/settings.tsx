import { View, TextInput, ScrollView } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Focusable } from "@/components/Focusable";
import { useState, useEffect } from "react";
import { navidrome } from "@/services/navidrome";
import tw from "twrnc";

export default function SettingsScreen() {
  const [url, setUrl] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    try {
      const config = navidrome.getConfig();
      setUrl(config.url);
      setUsername(config.username);
      setPassword(config.password || "");
    } catch (e) {
      // Not initialized
    }
  }, []);

  const handleSave = () => {
    navidrome.setConfig({ url, username, password });
    alert("Configuration saved!");
  };

  return (
    <ScrollView
      style={tw`flex-1 bg-[#121212]`}
      contentContainerStyle={tw`pt-36 items-center px-12`}
    >
      <ThemedText
        style={tw`text-4xl font-extrabold text-white mb-8 self-start`}
      >
        Settings
      </ThemedText>

      <View style={tw`max-w-[600px] w-full`}>
        <ThemedText style={tw`text-xl text-neutral-400 mb-2`}>
          Navidrome URL
        </ThemedText>
        <TextInput
          style={tw`bg-[#282828] text-white p-4 rounded-lg mb-5 text-lg border border-[#333]`}
          value={url}
          onChangeText={setUrl}
          placeholder="http://192.168.1.10:4533"
          placeholderTextColor="#6A6A6A"
        />

        <ThemedText style={tw`text-xl text-neutral-400 mb-2`}>
          Username
        </ThemedText>
        <TextInput
          style={tw`bg-[#282828] text-white p-4 rounded-lg mb-5 text-lg border border-[#333]`}
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="#6A6A6A"
        />

        <ThemedText style={tw`text-xl text-neutral-400 mb-2`}>
          Password
        </ThemedText>
        <TextInput
          style={tw`bg-[#282828] text-white p-4 rounded-lg mb-5 text-lg border border-[#333]`}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#6A6A6A"
        />

        <Focusable
          onPress={handleSave}
          style={tw`bg-[#1DB954] py-4 items-center mt-4`}
          focusScale={1.05}
        >
          <ThemedText style={tw`text-black text-xl font-bold`}>
            Save Configuration
          </ThemedText>
        </Focusable>
      </View>
    </ScrollView>
  );
}
