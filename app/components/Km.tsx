import React, { useContext } from 'react';
import { Text, View } from 'react-native';
import { LocationContext } from '../context/LocationContext';

const Km : React.FC = () => {
     const { distance, isTracking } = useContext(LocationContext);

      const km = (distance / 1000).toFixed(1);
  return (
    <View
      className="absolute bottom-32 justify-center  right-8
      items-center bg-black/10 rounded-full  h-20 w-20"
    >
      <Text className="text-black text-3xl font-semibold">
        {km}
      </Text>
      <Text className="text-black text-lg">
        km
      </Text>
    </View>
  )
}

export default Km