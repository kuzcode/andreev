import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View  } from "react-native";
import { useGlobalContext } from "../../context/GlobalProvider";
import useAppwrite from "../../lib/useAppwrite";
import { getUserTrackers } from "../../lib/appwrite";
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../constants/types";

const Weight = () => {
  const { user } = useGlobalContext();
  const { data: trackers } = useAppwrite(() => getUserTrackers(user?.$id));
  const navigation = useNavigation();

    return (
        <ScrollView className="bg-black h-full w-full">
           <Text className="font-pbold text-white text-center text-[21px] mt-10">ваш вес</Text>
        </ScrollView>
    )
}

export default Weight;