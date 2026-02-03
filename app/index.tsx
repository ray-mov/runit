import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PastRun from "./components/PastRun";
import Stats from "./components/Stats";

export default function Index() {

  const handleStartRun = () => {
    router.push({
      pathname: "/screen/Run"
    })
  }

  return (
    <SafeAreaView className="bg-gray-50 flex-1 relative items-center px-4">
      <Text className="font-bold text-3xl text-gray-800 pt-2 ">Performance</Text>
    <Stats />

    <View className="mt-5 w-full">
      <Text className="text-gray-600 text-lg font-semibold self-start">Past Runs</Text>
    </View>
    <PastRun />

    <TouchableOpacity className="bg-black py-4 px-8 absolute bottom-20 rounded-md" onPress={handleStartRun}>
        <Text className="text-white text-4xl">START RUN</Text>
    </TouchableOpacity>
    </SafeAreaView>
  )
}


// router.push({
//       pathname: "/screens/scanned_details",
//       params: {
//         data,
//         photoUri,
//       },
//     });