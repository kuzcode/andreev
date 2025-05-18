import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View, Dimensions, Image, PanResponder, StyleSheet, Vibration } from "react-native";

import { useState, useEffect } from "react";

import { useGlobalContext } from "../../context/GlobalProvider";
import useAppwrite from "../../lib/useAppwrite";
import { getMeal, startMeal } from "../../lib/appwrite";
import { types } from "../../constants/types";
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient";
import { colors, meal } from "../../constants/types";
import { FormField } from "../../components";
import { Dropdown } from "react-native-element-dropdown";
import { getUserMeal } from "../../lib/appwrite";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { icons } from "../../constants";


const Sleep = () => {
    const { user } = useGlobalContext();
    const [mealForm, setMealForm] = useState({});
    const [adding, setAdding] = useState(false);
    const [advices, setAdvices] = useState([]);
    const [plan, setPlan] = useState(null);
    const [today, setToday] = useState(30000);

    const calculateSleepDuration = (sleep) => {
        const startTime = new Date(sleep.start);
        const endTime = new Date(sleep.end);

        const durationInMilliseconds = endTime - startTime;
        const durationInSeconds = Math.floor((durationInMilliseconds / 1000) % 60);
        const durationInMinutes = Math.floor((durationInMilliseconds / 1000 / 60) % 60);

        return `${durationInMinutes} минут ${durationInSeconds} секунд`;
    };


    const formatTime = time => {
        const hours = String(Math.floor(time / 3600));
        const minutes = String(Math.floor((time % 3600) / 60));
        return `${hours}ч ${minutes}мин`;
    };

    return (
        <ScrollView className="bg-black w-full h-[100vh]">
            <LinearGradient colors={['#0a0816', '#22244b']}
                className="h-full w-full"
            >
                <Text className="text-white text-[25px] font-pbold mt-10 mx-4">сон<Text className="text-[#ffffff89]">, {formatTime(today)}</Text></Text>

                <View className="mt-[100vh]"></View>
            </LinearGradient>
        </ScrollView>
    )
}

export default Sleep;