import { ClipboardClock, FlagTriangleRight, TrendingUp, WeightTilde } from 'lucide-react-native'
import React from 'react'
import { Text, View } from 'react-native'
// k_calories
//elevation_gain

type PastRunCardProps = {
    distance :string
    elapsed_time : string
    calories : string
    elevation? : string
}

const PastRunCard: React.FC<PastRunCardProps> = ({distance, elapsed_time, calories, elevation}) => {
  return (
    <View className='bg-gray-200 py-5 px-4 rounded-xl w-full flex flex-row justify-between'>
        <View>
            <FlagTriangleRight size={20}/>
            <Text>{distance}</Text>
        </View>
        <View>
            <ClipboardClock size={20}/>
            <Text>{elapsed_time}</Text>
        </View>
        <View>
            <WeightTilde size={20} />
            <Text>{calories}</Text>
        </View>
        <View>
            <TrendingUp size={20} />
            <Text>{elevation}</Text>
        </View>
    </View>
  )
}

export default PastRunCard