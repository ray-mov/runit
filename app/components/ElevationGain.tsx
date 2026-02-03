import React, { useContext } from 'react';
import { Text, View } from 'react-native';
import { LocationContext } from '../context/LocationContext';

const ElevationGain = () => {
  const {  elevationGain, isTracking } = useContext(LocationContext);
    
  return (
    <View className='absolute bottom-32 left-32 justify-center 
                items-center bg-black/10 rounded-full h-20 w-20'>
                    <Text className='text-black text-3xl font-semibold'>
                       {isTracking? elevationGain : 0}
                    </Text>
                    <Text className='text-black text-lg'>
                    elv.gain
                    </Text>
        </View>
  )
}

export default ElevationGain