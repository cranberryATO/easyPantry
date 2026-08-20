import { InventoryProvider } from "@/components/InventoryProvider";
import { Stack } from "expo-router";

import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <InventoryProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="dark" hidden={false} />
        </InventoryProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
