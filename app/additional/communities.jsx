import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View, Image } from "react-native";
import { useGlobalContext } from "../../context/GlobalProvider";
import useAppwrite from "../../lib/useAppwrite";
import { getUserCommunities, getAllCommunities, joinCommunity, leaveCommunity } from "../../lib/appwrite";
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../constants/types";
import { useState, useEffect } from "react";
import { icons } from "../../constants";

const Comms = () => {
    const [{ user }, setUser] = useState(useGlobalContext());
    const [communities, setCommunities] = useState([]);
    const [created, setCreated] = useState([]);
    const [recs, setRecs] = useState([])
    const [recsShown, setRecsShown] = useState(false);
    const [alShown, setAlShown] = useState(false);
    const [current, setCurrent] = useState(false);
    const [curCompet, setCurCompet] = useState();
    const [showCompet, setShowCompet] = useState(false);


    const toggleUser = (communityId) => {
        const userId = user.$id;

        setRecs(prevRecs => {
            const community = prevRecs.find(rec => rec.$id === communityId);

            if (community) {
                if (community.users?.includes(userId)) {
                    // Если пользователь есть, удалить его
                    return prevRecs.map(rec =>
                        rec.$id === communityId
                            ? { ...rec, users: rec.users.filter(id => id !== userId) }
                            : rec
                    );
                } else {
                    // Если пользователя нет, добавить его

                    return prevRecs.map(rec =>
                        rec.$id === communityId
                            ? { ...rec, users: [...(rec.users || []), userId] }
                            : rec
                    );

                }
            }

            return prevRecs; // Возвращаем без изменений, если сообщество не найдено
        });
    };

    const getParticipantWord = (count) => {
        const lastDigit = count % 10;
        const lastTwoDigits = count % 100;

        if (lastDigit === 1 && lastTwoDigits !== 11) {
            return "участник";
        } else if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14)) {
            return "участника";
        } else {
            return "участников";
        }
    };


    useEffect(() => {
        const fetchRecs = async () => {
            const data = await getAllCommunities();
            const filteredCommunities = data.filter(com =>
                com.users.includes(user.$id)
            );
            const filteredCreated = data.filter(com =>
                com.creator === user.$id
            );

            setRecs(data);
            setCreated(filteredCreated);
            setCommunities(filteredCommunities);
        };

        fetchRecs();
    }, []);

    return (
        <ScrollView className="bg-[#000] h-[100vh] w-full">

            {showCompet && (
                <View className="bg-black w-[100vw] h-full fixed top-0 z-30">
                    <TouchableOpacity className="absolute right-[16px] top-0" onPress={() => { setShowCompet(false) }}>
                        <Image
                            source={icons.close}
                            className="w-8 h-8 top-8 right-0 mr-4 z-10 "
                            tintColor={'white'}
                        />
                    </TouchableOpacity>

                    <Text className="text-white font-pbold text-[23px] mt-10 ml-4 mr-[80]">{curCompet.title}<Text className="text-[#838383]">, событие сообщества</Text></Text>
                    <Text className="text-[#838383] font-pregular text-[19px] mx-4">{curCompet.content}</Text>
                </View>
            )}

            {recsShown && (
                <View className="bg-black w-[100vw] h-full fixed top-0 z-10">
                    <TouchableOpacity className="absolute right-[16px] top-0" onPress={() => { setRecsShown(false) }}>
                        <Image
                            source={icons.close}
                            className="w-8 h-8 top-8 right-0 mr-4 z-10 "
                            tintColor={'white'}
                        />
                    </TouchableOpacity>
                    <Image
                        source={{ uri: current.imageUrl }}
                        className="w-[150] h-[150] rounded-full mx-auto mt-[8vh]"
                    />
                    <View className="flex flex-row justify-center mt-2">
                        <Text className="text-white font-pbold text-[25px] ml-4 mr-2">{current.name}</Text>
                        {current.isVerif && (
                            <Image
                                source={icons.verify}
                                className="w-7 h-7 mt-[6]"
                            />
                        )}
                    </View>

                    <View className="flex flex-row justify-center">
                        <Text className="text-[#838383] font-pregular text-[20px] mt-0 mr-1">сообщество, {recs.find(rec => rec.$id === current.$id).users.length}</Text>
                        <Image
                            source={icons.profile}
                            className="h-5 w-5 mt-1"
                            tintColor={'#838383'}
                        />
                    </View>

                    {recs.find(rec => rec.$id === current.$id).users.includes(user.$id) ? (
                        <TouchableOpacity onPress={() => { setAlShown(true) }} className="bg-[#111] py-3 rounded-2xl mx-4 mt-4">
                            <Text className="text-[18px] text-white font-pregular text-center">покинуть</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => {
                            joinCommunity(current.$id, user.$id)
                            toggleUser(current.$id);
                        }} className="bg-white py-3 rounded-2xl mt-4 mx-4">
                            <Text className="text-[20px] text-black font-pregular text-center">вступить</Text>
                        </TouchableOpacity>
                    )}

                    <Text className="text-white font-pbold text-[25px] mx-4 mt-4">лента</Text>
                    {
                        current.content.map(a => {
                            if (a.type === 0) {
                                return (
                                    <View
                                        key={a}
                                        onPress={() => { }}
                                        className="relative mt-4 mr-[3vw] mx-4 bg-[#111] rounded-3xl overflow-hidden"
                                    >
                                        <Text className="text-white text-[20px] font-pbold mx-4 mt-2">{a.title}</Text>
                                        <Text className="text-[#838383] text-[18px] font-pregular mx-4 mb-3">{a.content}</Text>
                                    </View>
                                )
                            }
                            else if (a.type === 1) {
                                return (
                                    <TouchableOpacity
                                        key={a}
                                        onPress={() => {
                                            setCurCompet(a);
                                            setShowCompet(true);
                                        }}
                                        className="relative mt-4 mr-[3vw] mx-4 bg-primary rounded-3xl overflow-hidden"
                                    >

                                        <Text className="text-white text-[20px] font-pbold mx-4 mt-2">{a.title}</Text>
                                        <Text className="text-[#ffffff9f] text-[18px] font-pregular mx-4">{a.content}</Text>
                                        <Text className="text-[#ffffff9f] text-[18px] font-pregular mx-4 mb-3">1346 участников</Text>
                                    </TouchableOpacity>
                                )
                            }
                        })
                    }
                </View>
            )}

            {alShown && (
                <View className="bg-[#222] absolute top-[20vh] z-20 rounded-3xl mx-[10vw] pb-4">
                    <Text className="text-white font-pbold text-[25px] mx-4 mt-4">покинуть сообщество?</Text>
                    <Text className="text-[#838383] font-pregular text-[20px] mt-0 mx-4">потом ты сможешь зайти сюда ещё раз</Text>
                    <TouchableOpacity
                        onPress={() => {
                            leaveCommunity(current.$id, user.$id)
                            setAlShown(false)
                            setRecsShown(false);
                            toggleUser(current.$id);
                        }}
                        className="bg-[#333] py-3 rounded-xl mx-4 mt-4">
                        <Text className="text-[18px] text-white font-pregular text-center">да, покинуть :(</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setAlShown(false) }} className="bg-white py-3 rounded-xl mx-4 mt-2">
                        <Text className="text-[20px] text-black font-pregular text-center">остаться</Text>
                    </TouchableOpacity>
                </View>
            )}

            <Text className="text-[21px] font-pbold relative mx-4 text-[#fff] mt-[32px]">сообщества</Text>

            <TouchableOpacity
                onPress={() => { router.push('/additional/createComm') }}
                className="bg-[#111] rounded-3xl mt-4 h-[100px] mx-4 flex items-center justify-center">
                <Text className="text-[20px] font-pbold relative mx-4 text-[#fff] text-center">+ создай сообщество</Text>
            </TouchableOpacity>

            {communities.map(com =>
                <TouchableOpacity onPress={() => {
                    setCurrent(com);
                    setRecsShown(true);
                }} className="bg-[#111] rounded-3xl flex flex-row mx-4 mt-4">
                    {com.imageUrl && (
                        <Image
                            source={{ uri: com.imageUrl }}
                            className="w-[100] h-[100] rounded-l-3xl"
                        />
                    )}

                    <View className="flex flex-col">
                        <View className="flex flex-row">
                            <Text className="text-white font-pbold text-[21px] ml-4 mr-1">{com.name}</Text>
                            {com.isVerif && (
                                <Image
                                    source={icons.verify}
                                    className="w-6 h-6 mt-[5]"
                                />
                            )}
                        </View>
                        <Text className="text-[#838383] font-pregular text-[17px] ml-4 mt-[-3] mr-1">{com.users.length} {getParticipantWord(com.users.length)}</Text>
                    </View>
                </TouchableOpacity>
            )}

            {created.length > 0 && (
                <View>
                    {created.map(com =>
                        <TouchableOpacity onPress={() => {
                            setCurrent(com);
                            setRecsShown(true);
                        }} className="bg-[#111] rounded-3xl flex flex-row mx-4 mt-4">
                            {com.imageUrl && (
                                <Image
                                    source={{ uri: com.imageUrl }}
                                    className="w-[100] h-[100] rounded-l-3xl"
                                />
                            )}

                            <View className="flex flex-col">
                                <View className="flex flex-row">
                                    <Text className="text-white font-pbold text-[21px] ml-4 mr-1">{com.name}</Text>
                                    {com.isVerif && (
                                        <Image
                                            source={icons.verify}
                                            className="w-6 h-6 mt-[5]"
                                        />
                                    )}
                                </View>
                                <Text className="text-[#838383] font-pregular text-[17px] ml-4 mt-[-3] mr-1">{com.users.length} {getParticipantWord(com.users.length)}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    <Text className="text-[21px] font-pbold relative mx-4 text-[#fff] mt-[32px]">создано</Text>
                </View>
            )}

            <Text className="text-[21px] font-pbold relative mx-4 text-[#fff] mt-[32px]">рекомендуем</Text>
            {recs.map(item =>
                <TouchableOpacity onPress={() => {
                    setCurrent(item);
                    setRecsShown(true);
                }} className="bg-[#111] rounded-3xl flex flex-row mx-4 mt-4">
                    {item.imageUrl && (
                        <Image
                            source={{ uri: item.imageUrl }}
                            className="w-[100] h-[100] rounded-l-3xl"
                        />
                    )}

                    <View className="flex flex-col">
                        <View className="flex flex-row">
                            <Text className="text-white font-pbold text-[21px] ml-4 mr-1">{item.name}</Text>
                            {item.isVerif && (
                                <Image
                                    source={icons.verify}
                                    className="w-6 h-6 mt-[5]"
                                />
                            )}
                        </View>
                        <Text className="text-[#838383] font-pregular text-[17px] ml-4 mt-[-3] mr-1">{item.users.length} {getParticipantWord(item.users.length)}</Text>
                    </View>

                </TouchableOpacity>
            )}
        </ScrollView>
    )
}

export default Comms;