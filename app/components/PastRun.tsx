import React, { useContext, useEffect, useState } from 'react'
import { FlatList, Text, View } from 'react-native'
import { LocationContext } from '../context/LocationContext'
import { getRuns, Runs } from '../services/db'
import PastRunCard from './PastRunCard'

const PastRun = () => {
    const [runs, setRuns] = useState<Runs[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const { runsUpdated } = useContext(LocationContext);
  
  const loadRuns = async () => {
    try {
      const data = await getRuns()
      setRuns(data)
    } catch (e) {
      console.error('Failed to load runs', e)
    } finally {
      setLoading(false)
    }
  }


    useEffect(() => {
    loadRuns()
  }, [runsUpdated])
  
  
  if (loading) {
    return <Text className="text-center mt-4">Loading runs...</Text>
  }

  if (runs.length === 0) {
    return <Text className="text-center mt-4">No runs yet</Text>
  }


  return (
     <FlatList
      data={runs}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ paddingBottom: 100 }}
      renderItem={({ item }) => (
        <View className="flex-row justify-between px-4 mb-4">
          <PastRunCard 
            distance={`${item.distance_km.toFixed(2)} km`} 
            elapsed_time={`${item.k_calories} kcal`} 
            calories={`${item.elapsed_time_minutes} min`} 
            elevation={`${item.elevation_gain}`} />
        </View>  
      )}
    />
  )
}

export default PastRun