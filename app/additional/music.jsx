import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View, Image, Linking } from "react-native";
import { useGlobalContext } from "../../context/GlobalProvider";
import useAppwrite from "../../lib/useAppwrite";
import { getUserTrackers } from "../../lib/appwrite";
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../constants/types";
import { useState } from "react";
import { icons } from "../../constants";

const Music = () => {
    const [showed, setShowed] = useState(false);
    const [current, setCurrent] = useState({});

    const showPlatforms = () => {
        setShowed(true);
    }

    const open = (platform) => {
        if (platform === 0) {
            Linking.openURL(current.spotify);
        }
        else if (platform === 1) {
            Linking.openURL(current.soundcloud);
        }
    }

    return (
        <ScrollView className="bg-black h-[100vh] w-full">
            {showed && (
                <View className="bg-[#111] absolute bottom-0 w-full h-[350px] px-4 left-0">
                    <TouchableOpacity className="absolute right-4 top-4" onPress={() => { setShowed(false) }}>
                        <Image
                            source={icons.close}
                            className="w-8 h-8"
                            tintColor={'white'}
                        />
                    </TouchableOpacity>
                    <Text className="text-white font-pbold text-[19px] mt-2">площадки:</Text>

                    <View className="flex flex-row">
                        <TouchableOpacity onPress={() => { open(0) }} className="bg-[#222] px-2 py-2 rounded-full flex flex-row items-center mt-2 mr-2">
                            <Image
                                source={{ uri: 'https://lastfm.freetls.fastly.net/i/u/ar0/ba8f64d564d9bbaf9c278e62d5b5af61.jpg' }}
                                className="w-6 h-6 mr-2"
                            />
                            <Text className="text-white font-pregular text-[18px]">спотифай</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-[#222] px-2 py-2 rounded-full flex flex-row items-center mt-2 mr-2">
                            <Image
                                source={{ uri: 'https://lastfm.freetls.fastly.net/i/u/ar0/ba8f64d564d9bbaf9c278e62d5b5af61.jpg' }}
                                className="w-6 h-6 mr-2"
                            />
                            <Text className="text-white font-pregular text-[18px]">саундклауд</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <Text className="text-[20px] font-pbold relative mx-[20%] text-[#fff] mt-[32px] text-center mb-[32px]">наши плейлисты для твоих тренировок</Text>

            <View className="h-[100vh]">
                <TouchableOpacity className="bg-[#0b0b0b] rounded-3xl mx-4 px-4 mb-6 h-[200px] z-0">
                    <Image
                        source={{ uri: 'https://hips.hearstapps.com/hmg-prod/images/mike-tyson-stands-in-the-ring-during-the-fight-with-carl-news-photo-1622559259.jpg?crop=1.00xw:0.735xh;0,0.0525xh&amp;resize=1200:*' }}
                        className="h-[200px] w-[200px] absolute top-0 z-10 left-0 rounded-3xl"
                    />
                    <LinearGradient className="w-[90px] h-full absolute left-[110px] z-10" start={{ x: 0, y: 0 }} end={{ x: 0.9, y: 0 }} colors={['#fff0', '#0b0b0b']} />

                    <Text className="text-[22px] font-pbold relative text-[#fff] mt-[12px] z-20 text-right">для бокса</Text>
                    <Text className="text-[17px] font-pregular relative text-[#ffffffa0] mt-[8px] mb-4 ml-[150px] z-20 text-right">50 cent, eminem, 2pac, snoop dogg</Text>

                    <TouchableOpacity onPress={() => {
                        setCurrent({
                            spotify: 'https://open.spotify.com/playlist/6WH3udh83SW6wbS28jk3t7?si=GF5EYJM1Q3Ogx5SlOn82Uw&pi=t8AV1JZVTpurE',
                            soundcloud: 'https://soundcloud.com',
                        })
                        showPlatforms();
                    }} className="absolute z-20 right-4 bottom-4 bg-[#151515] rounded-2xl px-5 py-1">
                        <Text className="font-pregular text-[17px] text-white">открыть</Text>
                    </TouchableOpacity>
                </TouchableOpacity>

                <TouchableOpacity className="bg-[#0b0b0b] rounded-3xl mx-4 px-4 mb-10 h-[200px] z-0">
                    <Image
                        source={{ uri: 'https://blog.mann-ivanov-ferber.ru/wp-content/uploads/2019/03/image1-1.jpg' }}
                        className="h-[200px] w-[200px] absolute top-0 z-10 left-0 rounded-3xl"
                    />
                    <LinearGradient className="w-[90px] h-full absolute left-[110px] z-10" start={{ x: 0, y: 0 }} end={{ x: 0.9, y: 0 }} colors={['#fff0', '#0b0b0b']} />

                    <Text className="text-[22px] font-pbold relative text-[#fff] mt-[12px] z-20 text-right">пробежки</Text>
                    <Text className="text-[17px] font-pregular relative text-[#ffffffa0] mt-[8px] mb-4 ml-[150px] z-20 text-right">макс корж</Text>

                    <TouchableOpacity onPress={() => {
                        setCurrent({
                            spotify: 'https://open.spotify.com/playlist/2juJ9KQ5cYoTf3BHY7vfDM?si=SifJcsOyTFqHqGgevjW2Pg&pi=ZU1TUGp0QpGZS',
                            soundcloud: 'https://soundcloud.com',
                        })
                        showPlatforms();
                    }} className="absolute z-20 right-4 bottom-4 bg-[#151515] rounded-2xl px-5 py-1">
                        <Text className="font-pregular text-[17px] text-white">открыть</Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

export default Music;