import React, { ReactNode } from 'react'
import { Text, View } from 'react-native'

type RecordCardProps ={
    title : string
    data : number
    children? : ReactNode
    unit: string
}
const RecordCard : React.FC<RecordCardProps> = ({title, data, children, unit}) => {
  return (
    <View className=' rounded-lg p-3 w-[45%] border items-center gap-3'>
      <View className='flex flex-row gap-4 items-center'>
        {children}
        <Text className=' text-2xl font-semibold'>{title}</Text>
      </View>
      <Text className='text-2xl font-medium'>{data}</Text>
      <Text className='text-lg text-gray-500 font-semibold'>{unit}</Text>
    </View>
  )
}

export default RecordCard