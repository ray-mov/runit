import MapLibreRN from "@maplibre/maplibre-react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LocationProvider } from "./context/LocationContext";
import "./global.css";

MapLibreRN.setConnected(true)

export default function RootLayout() {
  return (
    <>
      <StatusBar hidden={false} style="dark" />
      <LocationProvider>
        <Stack screenOptions={{
          headerShown: false
        }}>
          <Stack.Screen
            name="screen/Run"
      
          />
        </Stack>
      </LocationProvider>
    </>
  )
}
