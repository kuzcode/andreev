import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View, Image } from "react-native";
import { useGlobalContext } from "../../context/GlobalProvider";
import useAppwrite from "../../lib/useAppwrite";
import { getUserTrackers } from "../../lib/appwrite";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../constants/types";
import { useState } from "react";
import { useNavigation, useRoute } from '@react-navigation/native';

const Completed = () => {
    const [{ user }, setUser] = useState(useGlobalContext());
    const [training, setTraining] = useState({})

    const route = useRoute();

    useEffect(() => {
        if (route.params && route.params.items) {
            setTraining(route.params.items);
        }
    }, [route.params]);

    return (
        <View className="bg-[#000] h-[100vh] w-full">
            <Text className="text-white">{training.userId}</Text>
        </View>
    )
}

export default Completed;