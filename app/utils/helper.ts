import * as Location from 'expo-location';

export async function getForegroundLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        console.log('Permission to acess location was denied');
        return
    }
    let location = await Location.getCurrentPositionAsync({})
    console.log(location);
    return location
}

export async function startBackgroundTracking(){
    const { status : fgStatus} = await Location.requestForegroundPermissionsAsync();

    if (fgStatus === 'granted') {
        const { status : bgStatus} = await Location.requestBackgroundPermissionsAsync()

        if (bgStatus === 'granted') {
            await Location.startLocationUpdatesAsync("location task name",{
                accuracy: Location.Accuracy.Balanced,
                timeInterval:5000,
                distanceInterval: 1,
                foregroundService:{
                    notificationTitle: "Live Tracking",
                    notificationBody: "Runit is tracking your location in the background",
                }
            })
        }
    }
}

export const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Earth radius in meters
    const p1 = (lat1 * Math.PI) / 180;
    const p2 = (lat2 * Math.PI) / 180;
    const deltaP = ((lat2 - lat1) * Math.PI) / 180;
    const deltaL = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(deltaP / 2) * Math.sin(deltaP / 2) +
              Math.cos(p1) * Math.cos(p2) *
              Math.sin(deltaL / 2) * Math.sin(deltaL / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};