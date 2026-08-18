import { InventoryProvider } from "@/components/InventoryProvider";
import { Stack } from "expo-router";

import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <InventoryProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="dark" hidden={false} />
      </InventoryProvider>
    </SafeAreaProvider>
  );
}
