import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View, Image, Linking } from "react-native";
import { useGlobalContext } from "../../context/GlobalProvider";
import useAppwrite from "../../lib/useAppwrite";
import { getUserTrackers } from "../../lib/appwrite";
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../constants/types";
import { useState } from "react";

const Card = () => {
    return (
        <View className="bg-black w-full h-full pt-[56px]">
            <Text className="text-white text-[19px] font-pbold mx-4">наши соц сети</Text>
            <View className="flex flex-row px-4 mt-1 w-[100vw] flex-wrap">
                <TouchableOpacity onPress={() => { Linking.openURL('https://athleteblr.netlify.app') }} className="bg-[#222] px-2 py-2 rounded-full flex flex-row items-center mt-2 mr-2">
                    <Image
                        source={{ uri: 'https://athleteblr.netlify.app/favicon.ico' }}
                        className="w-6 h-6 mr-2 rounded-lg"
                    />
                    <Text className="text-white font-pregular text-[18px]">сайт</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { Linking.openURL('https://instagram.com/athleteblr') }} className="bg-[#222] px-2 py-2 rounded-full flex flex-row items-center mt-2 mr-2">
                    <Image
                        source={{ uri: 'https://athleteblr.netlify.app/insta.png' }}
                        className="w-6 h-6 mr-2"
                    />
                    <Text className="text-white font-pregular text-[18px]">инстаграм</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { Linking.openURL('https://t.me/athleteblr') }} className="bg-[#222] px-2 py-2 rounded-full flex flex-row items-center mt-2 mr-2">
                    <Image
                        source={{ uri: 'https://athleteblr.netlify.app/telegram.png' }}
                        className="w-6 h-6 mr-2"
                    />
                    <Text className="text-white font-pregular text-[18px]">телеграм</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { Linking.openURL('https://youtube.com/@athleteblr') }} className="bg-[#222] px-2 py-2 rounded-full flex flex-row items-center mt-2 mr-2">
                    <Image
                        source={{ uri: 'https://athleteblr.netlify.app/youtube.png' }}
                        className="w-6 h-6 mr-2"
                    />
                    <Text className="text-white font-pregular text-[18px]">ютуб</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { Linking.openURL('https://www.facebook.com/groups/952873739627215') }} className="bg-[#222] px-2 py-2 rounded-full flex flex-row items-center mt-2 mr-2">
                    <Image
                        source={{ uri: 'https://athleteblr.netlify.app/facebook.png' }}
                        className="w-6 h-6 mr-2"
                    />
                    <Text className="text-white font-pregular text-[18px]">фейсбук</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { Linking.openURL('https://vk.com/athleteblr') }} className="bg-[#222] px-2 py-2 rounded-full flex flex-row items-center mt-2 mr-2">
                    <Image
                        source={{ uri: 'https://athleteblr.netlify.app/vk.png' }}
                        className="w-6 h-6 mr-2"
                    />
                    <Text className="text-white font-pregular text-[18px]">вк</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { Linking.openURL('https://tiktok.com/@athleteblr') }} className="bg-[#222] px-2 py-2 rounded-full flex flex-row items-center mt-2 mr-2">
                    <Image
                        source={{ uri: 'https://athleteblr.netlify.app/tiktok.png' }}
                        className="w-6 h-6 mr-2"
                    />
                    <Text className="text-white font-pregular text-[18px]">тикток</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { Linking.openURL('https://ok.ru/group/70000031331294') }} className="bg-[#222] px-2 py-2 rounded-full flex flex-row items-center mt-2 mr-2">
                    <Image
                        source={{ uri: 'https://athleteblr.netlify.app/ok.png' }}
                        className="w-6 h-6 mr-2"
                    />
                    <Text className="text-white font-pregular text-[18px]">ок</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Card;