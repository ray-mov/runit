import * as Location from 'expo-location'
import * as TaskManager from 'expo-task-manager'

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