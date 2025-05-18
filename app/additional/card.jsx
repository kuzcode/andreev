import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View, Image } from "react-native";
import { useGlobalContext } from "../../context/GlobalProvider";
import useAppwrite from "../../lib/useAppwrite";
import { getUserTrackers } from "../../lib/appwrite";
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../constants/types";
import { useState } from "react";

const Card = () => {
    const [{ user }, setUser] = useState(useGlobalContext());

    return (
        <View className="bg-[#3c87ff] h-[100vh] w-full">
            <Text className="text-[30px] font-pbold relative mx-4 text-[#fff] mt-[10vh] text-center">{user.name}</Text>
            <Text className="text-[21px] font-pregular relative mx-4 text-[#fff] mt-[-6px] text-center mb-[32px]">в приложении атлет</Text>

            <Text className="text-[20vw] font-pbold text-white text-center">2.0.0</Text>
            <Text className="text-[21px] font-pregular relative mx-10 text-[#fff] mt-[-12px] text-center mb-[32px] leading-[25px]">версия приложения. могут быть ошибки, которые мы скоро исправим</Text>
        </View>
    )
}

export default Card;