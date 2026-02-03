import { LandPlot, PersonStanding, Timer, TrendingUp } from 'lucide-react-native';
import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import { LocationContext } from '../context/LocationContext';
import { getRunStats, RunStats } from '../services/db';
import RecordCard from './RecordCard';

const Stats = () => {

    const [stats, setStats] = useState<RunStats | null>(null)
    const { runsUpdated } = useContext(LocationContext);

    useEffect(() => {
        getRunStats().then(setStats)
    }, [runsUpdated])

  return (
    <View className="flex flex-row flex-wrap gap-5 justify-center mt-5">
      <RecordCard title="Activity" data={stats?.totalRuns ?? 0} unit='runs'>
        <PersonStanding  size={30} />
      </RecordCard>
      <RecordCard title="Time" data={stats?.totalTime ?? 0} unit='mins'>
        <Timer size={30} />
      </RecordCard>
      <RecordCard title="Distance" data={stats?.totalTime ?? 0} unit='km' >
        <LandPlot size={30} />
      </RecordCard>
      <RecordCard title="Avg Pace" data={stats?.totalElevation ?? 0} unit='min/km' >
        <TrendingUp size={30} />
      </RecordCard>
    </View>
  )
}

export default Stats