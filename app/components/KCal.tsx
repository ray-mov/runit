import React, { useContext } from 'react';
import { Text, View } from 'react-native';
import { LocationContext } from '../context/LocationContext';

const KCal: React.FC = () => {
  
const { kcal, isTracking } = useContext(LocationContext);

  return (
    <View className='absolute bottom-32 left-8 justify-center 
            items-center bg-black/10 rounded-full h-20 w-20'>
                <Text className='text-black text-3xl font-semibold'>
                   {isTracking? kcal : 0}
                </Text>
                <Text className='text-black text-lg'>
                  kcal
                </Text>
    </View>
  )
}

export default KCal