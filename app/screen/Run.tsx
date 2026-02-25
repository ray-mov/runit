import { Camera, CircleLayer, LineLayer, MapView, ShapeSource } from '@maplibre/maplibre-react-native';
import React, { useContext, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ElevationGain from '../components/ElevationGain';
import KCal from '../components/KCal';
import Km from '../components/Km';
import SessionTimer from '../components/SessionTimer';
import { LocationContext } from '../context/LocationContext';
import { MAP_STYLE_URL } from '../utils/Constants';

const Run = () => {

  const { location, isTracking, start, stop, path } =
    useContext(LocationContext);

  const route = useMemo(() => ({
    type: 'Feature'as const,
    geometry: {
      type: 'LineString' as const,
      coordinates: path.map(p => [p.longitude, p.latitude]), // MapLib [Lon, Lat]
    },
    properties: {}
  }), [path]);
  

  return (
    <SafeAreaView className='flex-1 items-center relative pt-10'>
      
      <MapView
      style={StyleSheet.absoluteFillObject}
      mapStyle={MAP_STYLE_URL}     
      >
      <Camera
        zoomLevel={14}
        centerCoordinate={
          isTracking && location ? [location.longitude, location.latitude] : 
          undefined}
           animationDuration={1000}
          //  allowUserLocation={isTracking}
          //  followUserMode="normal"
      />
      {path.length > 1 && (
          <ShapeSource id="routeSource" shape={route}>
             <LineLayer
              id="routeLine"
              style={{
                lineColor: '#ff0000',
                lineWidth: 6,
                lineCap: 'round',
                lineJoin: 'round',
                lineOpacity: 0.8,
                lineBlur: 0.5,
              }}
            />   
          </ShapeSource>         
        )}
        
        {location && (
          <ShapeSource
            id="user"
            shape={{
              type: 'Feature' as const,
              geometry: {
                type: 'Point',
                coordinates: [
                  location.longitude,
                  location.latitude,
                ],
              },
              properties :{}
            }}
          >
            <CircleLayer
              id="userDot"
              style={{
                circleRadius: 6,
                circleColor: '#007aff',
                circleStrokeWidth: 2,
                circleStrokeColor: '#fff',
              }}
            />
          </ShapeSource>
        )}
      </MapView>
  
     <View className='absolute top-60 self-center'>

     {location?(
        <Text className='mb-20'>
          Lat: {location.latitude}{"\n"}
          Lon: {location.longitude}
        </Text>
      ):  (
      <View className='flex-1 justify-center items-center mx-auto px-5 w-full'>
        <Text className='text-6xl font-semibold text-gray-400' >Press Run to start your activity</Text>
      </View>
    )}
     </View>
     <SessionTimer />
     <KCal />
     <ElevationGain />
     <Km />
      <View className='absolute bottom-14 self-center'>
         {!isTracking ? (
          <TouchableOpacity onPress={start} 
          className='border rounded-md px-10 py-2 bg-black' >
            <Text className='text-4xl text-white'>Run</Text>
          </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={stop}
         className='border rounded-md px-10 py-2 bg-black'>
            <Text className='text-3xl text-white'>Finish</Text>
          </TouchableOpacity>
      )}
      </View>
     
    </SafeAreaView>
  )
}

export default Run