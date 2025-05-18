import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View, Image } from "react-native";
import { useGlobalContext } from "../../context/GlobalProvider";
import useAppwrite from "../../lib/useAppwrite";
import { getLive } from "../../lib/appwrite";
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../constants/types";
import { useState, useEffect } from "react";
import { types } from "../../constants/types";
import { icons } from "../../constants";

const Card = () => {
    const [{ user }, setUser] = useState(useGlobalContext());
    const [tab, setTab] = useState(types[0]);
    const [live, setLive] = useState([]);

    useEffect(() => {
        async function fetchLive() {
            try {
                const got = await getLive();
                console.log(got)
                setLive(got);
            } catch (error) {
                console.error('Error fetching live: ', error);
            }
        }

        fetchLive();

    }, [])


    return (
        <ScrollView className="bg-black h-[100vh] w-full">
            <Text className="text-[23px] font-pbold relative mx-4 text-[#fff] mt-[40px]">профи спорт</Text>

            <ScrollView className="flex flex-row px-4 mt-4"
                horizontal={true}
            >
                {types.map(item =>
                    <TouchableOpacity
                        onPress={() => {
                            setTab(types.indexOf(item))
                            console.log(tab)
                        }}
                        className={`${tab === types.indexOf(item) ? `bg-white` : `bg-[#111]`} px-4 rounded-2xl py-2 mr-2`}>
                        <Text className={`${tab === types.indexOf(item) ? `text-black` : `text-white`} font-pregular text-[18px]`}>{item.title}</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>

            {live.map(a =>
                <>
                    {tab === a.sport && (
                        <TouchableOpacity className="bg-[#111] mx-4 rounded-3xl mt-4">
                            {a.type === 2 && (
                                <View className="flex flex-row justify-between items-center">
                                    <View className="w-[33vw] flex items-center">
                                        <LinearGradient
                                            colors={[`#${a.sides[0].color}`, '#ffffff00']}
                                            className="h-full w-[50vw] absolute left-0 top-0 rounded-l-3xl"
                                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                        />
                                        <Image
                                            source={{ uri: a.sides[0].imageUrl }}
                                            className="w-[25vw] h-[25vw] ml-4 mt-4"
                                        />
                                        <Text className="text-[20px] font-pbold text-white text-center ml-4 mb-4">{a.sides[0].name}</Text>
                                    </View>

                                    <Image
                                        source={icons.close}
                                        tintColor={'#fff'}
                                        className="w-10 h-10"
                                    />

                                    <View className="w-[33vw] flex items-center">
                                        <LinearGradient
                                            colors={[`#${a.sides[1].color}`, '#ffffff00']}
                                            className="h-full w-[50vw] absolute right-0 top-0 rounded-r-3xl"
                                            start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}
                                        />
                                        <Image
                                            source={{ uri: a.sides[1].imageUrl }}
                                            className="w-[25vw] h-[25vw] mr-4 mt-4"
                                        />
                                        <Text className="text-[20px] font-pbold text-white text-center mr-4 mb-4">{a.sides[1].name}</Text>
                                    </View>
                                </View>
                            )}

                            {a.type !== 2 && (
                                <Text className="text-white text-[19px] font-pbold">{a.title}</Text>
                            )}
                        </TouchableOpacity>
                    )}</>
            )}
        </ScrollView >
    )
}

export default Card;