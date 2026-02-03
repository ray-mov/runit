import * as Location from 'expo-location';
import { Barometer } from 'expo-sensors';

import React, { createContext, useEffect, useRef, useState } from 'react';
import { saveRun } from '../services/db';
import { startTracking, stopTracking } from '../services/locationService';
import { PRESSURE_TO_METER, USER_WEIGHT_KG } from '../utils/Constants';
import { getDistance } from '../utils/helper';

type LocationCtx = {
    location: Location.LocationObjectCoords | null;
    path: Location.LocationObjectCoords[];
    isTracking: boolean;
    start: () => void;
    stop: () => void;
    distance: number;
    elapsedMinutes: number;
    kcal: number;
    elevationGain : number | 0;
    runsUpdated : number
};

export const LocationContext = createContext<LocationCtx>(null as any);

export const LocationProvider = ({ children }: any) => {
    const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
    const [path, setPath] =
        useState<Location.LocationObjectCoords[]>([]);

    const [isTracking, setIsTracking] = useState(false);
    const [distance, setDistance] = useState<number>(0);
    const [elapsedMinutes, setElapsedMinutes] = useState<number>(0);
    const [kcal, setKcal] = useState<number>(0);
    const [elevationGain, setElevationGain] = useState(0)
    const [runsUpdated, setRunsUpdated] = useState<number>(0);

    const startTimeRef = useRef<number | null>(null);
    const lastPointRef = useRef<Location.LocationObjectCoords | null>(null);
    const lastPressureRef = useRef<number | null>(null)


    const start = async () => {
        setIsTracking(true);
        
         // reset
            setPath([]);
            setDistance(0);
            setElapsedMinutes(0);
            setKcal(0);
            setElevationGain(0);

            startTimeRef.current = null;
            lastPointRef.current = null;
            lastPressureRef.current= null;

        await startTracking((coords) => {
            setLocation(coords);
            setPath((prev) => {
                if (prev.length === 0) {
                    lastPointRef.current = coords;
                    return [coords];
                }
              
                if (coords.accuracy && coords.accuracy > 20) return prev;
                
                const last = lastPointRef.current!;

                const d = getDistance(
                    last.latitude,
                    last.longitude,
                    coords.latitude,
                    coords.longitude
                )
                if (d > 2) {
                    setDistance((prevDist) => prevDist + d);
                    lastPointRef.current = coords;
                    return [...prev, coords];
                }

                return prev;

            });
        });
    };

    const stop = async ():Promise<void> => {
        setIsTracking(false);

        //values 
        const finalDistanceKm = distance / 1000;
        const finalMinutes = elapsedMinutes;
        const finalKcal = kcal;
        const finalElevation = elevationGain ?? 0;

        console.log(finalDistanceKm);
        console.log(finalMinutes);
        console.log("stop function");
        
        try {
            await saveRun(
            finalDistanceKm,
            finalMinutes,
            finalKcal,
            finalElevation
        );
        setRunsUpdated(prev => prev + 1);
         } catch (e) {
            console.error('Failed to save run', e);
         }

        //reset
        setLocation(null);
        // setPath([]);
        setDistance(0);
        setElapsedMinutes(0);
        setKcal(0);
        setElevationGain(0);
        
        startTimeRef.current = null;
        lastPointRef.current = null;
        lastPressureRef.current = null;

        await stopTracking();
    };

    //timer
    useEffect(() => {
        let timer: number | undefined;

        if (isTracking) {
            if (startTimeRef.current === null) {
                startTimeRef.current = Date.now();
            }

            timer = setInterval(() => {
                if (startTimeRef.current !== null) {
                    const diffMs = Date.now() - startTimeRef.current;
                    setElapsedMinutes(Math.floor(diffMs / 60000));
                }
            }, 1000);
        }

        return () => {
            if (timer !== undefined) clearInterval(timer);
        };
    }, [isTracking]);

    //kcal

    useEffect(() => {
        const km = distance / 1000;
        setKcal(Math.round(km * USER_WEIGHT_KG * 1.036));
    }, [distance]);

    //Eleation Gain
    useEffect( () =>{
        if (!isTracking) return

        Barometer.setUpdateInterval(1000)

        const subscibe = Barometer.addListener(({pressure}) =>{
            if (lastPressureRef.current === null) {
                lastPressureRef.current = pressure
                return
            }

            const deltaPressure = lastPressureRef.current - pressure
            const deltaMeters = deltaPressure * PRESSURE_TO_METER

            if (deltaMeters > 0) {
                setElevationGain(prev => (prev ?? 0) + deltaMeters)
            }
            lastPressureRef.current = pressure
        })
 return () => subscibe.remove()
    },[isTracking])

    return (
        <LocationContext.Provider
            value={{ 
                location, 
                path, 
                isTracking, 
                start, 
                stop,
                distance,
                elapsedMinutes,
                kcal, 
                elevationGain : elevationGain ? Math.round(elevationGain) : 0,
                runsUpdated
            }}
        >
            {children}
        </LocationContext.Provider>
    );

}