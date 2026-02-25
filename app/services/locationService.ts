import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { Alert, Linking, Platform } from 'react-native';

export const LOCATION_TASK = "background-location-task";


let foregroundSub: Location.LocationSubscription | null = null;


TaskManager.defineTask(LOCATION_TASK, async ({ data, error }) => {
    if (error) return;
    const { locations } = data as any;
    const coords = locations[0].coords;

    // You can perform async operations here if needed
    // return;
})

export const startTracking = async (
    onLocation: (coods: Location.LocationObjectCoords) => void
) => {
    const fg = await Location.requestForegroundPermissionsAsync();
    const bg = await Location.requestBackgroundPermissionsAsync();

    if (fg.status !== 'granted' || bg.status !== 'granted') {
        throw new Error('Permission denied');
    }

    // foreground

    foregroundSub = await Location.watchPositionAsync(
        {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 1000,
            distanceInterval: 1
        },
        (loc) => onLocation(loc.coords)
    )

    //background
    await Location.startLocationUpdatesAsync(LOCATION_TASK, {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 5000,
        distanceInterval: 5,
        showsBackgroundLocationIndicator: true,
        foregroundService: {
            notificationTitle: 'Running',
            notificationBody: 'Tracking your run'
        }
    });
}


export const stopTracking = async () => {
    foregroundSub?.remove();
    foregroundSub = null;

    const running =
        await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK);

    if (running) {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK);
    }
};



//ensureLocationReady -- 1


export const ensureLocationReady = async (): Promise<boolean> => {
    
    // 1. Checking/Requesting Foregroud permission

    const fg = await Location.getForegroundPermissionsAsync();

    let fgStatus = fg.status;
    let fgCanAsk = fg.canAskAgain;

    if (fgStatus !== "granted") {
        const req = await Location.requestForegroundPermissionsAsync();
        fgStatus = req.status;
        fgCanAsk = req.canAskAgain;
    }

    if (fgStatus !== "granted") {
        if (!fgCanAsk) {
            Alert.alert(
                "Permission Required",
                "Enable location permission from settings",
                [{ text: "Open Settings", onPress: () => Linking.openSettings() }]
            );
        }
        return false;
    }

    // Background permission

    const bg = await Location.getBackgroundPermissionsAsync();
    let bgStatus = bg.status;

    if (bgStatus !== "granted") {
    const reqBg = await Location.requestBackgroundPermissionsAsync();
    bgStatus = reqBg.status;
    }

    if (bgStatus !== "granted") {
    return false;
    }

    // Check GPS
    const servicesEnabled = await Location.hasServicesEnabledAsync();


  if (!servicesEnabled) {
    Alert.alert(
      "Enable GPS",
      "Turn on location services",
      [
        {
          text: "Open Location Settings",
          onPress: () => {
            if (Platform.OS === "android") {
              Linking.sendIntent(
                "android.settings.LOCATION_SOURCE_SETTINGS"
              );
            }
          },
        },
      ]
    );
    return false;
  }

  return true;


}