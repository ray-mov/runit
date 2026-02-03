import { Text, View } from "react-native";

export default function NotFound() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold text-red-500 mb-2">404 - Not Found</Text>
      <Text className="text-lg text-gray-600">The page you are looking for does not exist.</Text>
    </View>
  );
}
