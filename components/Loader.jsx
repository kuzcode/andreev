import { View, ActivityIndicator, Dimensions } from "react-native";
import { ResizeMode, Video } from "expo-av";
import Constants from 'expo-constants';

const Loader = ({ isLoading }) => {
  const screenHeight = Dimensions.get("screen").height;

  if (!isLoading) return null;

  return (
    <View
      className="absolute flex justify-center items-center w-full h-full z-10"
      style={{
        height: screenHeight,
      }}
    >
    </View>
  );
};

export default Loader;
