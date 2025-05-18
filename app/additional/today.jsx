import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View, Image } from "react-native";
import { useGlobalContext } from "../../context/GlobalProvider";
import useAppwrite from "../../lib/useAppwrite";
import { getUserTrackers } from "../../lib/appwrite";
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient";
import { colors, meal } from "../../constants/types";
import { useState } from "react";
import { icons } from "../../constants";

const Card = () => {
    const [{ user }, setUser] = useState(useGlobalContext());
    const [today, setToday] = useState({
        meal: {
            goal: 2000
        },
        trainings: [
            {
                type: 1
            }
        ],
        sleep: {
            when: "2025-03-28T17:18:44.072+00:00"
        }
    })

    const getTrainingText = (count) => {
        if (count % 10 === 1 && count % 100 !== 11) {
            return 'тренировка';
        } else if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) {
            return 'тренировки';
        } else {
            return 'тренировок';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return ` ${hours}:${minutes}`;
    };

    return (
        <ScrollView className="bg-[#000] h-[100vh] w-full">
            <Text className="text-[20px] font-pbold relative mx-4 text-[#fff] mt-10">сегодня</Text>
            <Text className="text-[35px] font-pbold relative text-[#fff] mx-4 mt-4">{today.meal.goal}<Text className="text-[#838383] text-[20px]">ккал</Text></Text>

            <View className="h-[3px] mx-4 bg-[#1e1e1e] mt-4 rounded-xl"></View>

            <TouchableOpacity className="flex flex-row mx-4 mt-4 items-center">
                <Text className="text-[35px] font-pbold relative text-[#fff]">{today.trainings.length} <Text className="text-[#838383] text-[20px]">{getTrainingText(today.trainings.length)}</Text></Text>
                <Image
                    source={icons.right}
                    className="ml-2 w-6 h-6"
                />
            </TouchableOpacity>

            <View className="h-[3px] mx-4 bg-[#1e1e1e] mt-4 rounded-xl"></View>
            <Text className="text-[35px] font-pbold relative text-[#fff] mx-4 mt-4"><Text className="text-[#838383] text-[20px]">лечь спать в </Text>{formatDate(today.sleep.when)}</Text>
        </ScrollView>
    )
}

export default Card;