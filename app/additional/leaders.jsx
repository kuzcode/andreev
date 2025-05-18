import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { useGlobalContext } from "../../context/GlobalProvider";
import useAppwrite from "../../lib/useAppwrite";
import { getTopUsersByTime, getUsersByIds, getTopUsersByDis } from "../../lib/appwrite";
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../constants/types";
import { useEffect, useState } from "react";

const Card = () => {
    const [{ user }, setUser] = useState(useGlobalContext());
    const [leaders, setLeaders] = useState([]);
    const [disLeaders, setDisLeaders] = useState([]);
    const [tab, setTab] = useState(0);
    const navigation = useNavigation();

    const formatTime = time => {
        const hours = String(Math.floor(time / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
        const seconds = String(time % 60).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Получаем лидеров
                const leadersByTime = await getTopUsersByTime();
                setLeaders(leadersByTime);

                // Извлекаем уникальные userId
                const userIdsList = getUserIds(leadersByTime);
                if (userIdsList.length === 0) return; // Защита от пустого массива

                // Получаем пользователей по ID
                const users = await getUsersByIds(userIdsList);

                // Объединяем лидеров с именами и обновляем state
                const updatedLeaders = addNamesToObjects(leadersByTime, users);
                setLeaders(updatedLeaders);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };

        fetchData();
    }, [user]); // Пустой массив зависимостей означает, что useEffect выполнится только один раз при монтировании компонента


    useEffect(() => {
        const fetchData = async () => {
            try {
                // Получаем лидеров
                const leadersByDis = await getTopUsersByDis();
                setDisLeaders(leadersByDis);

                // Извлекаем уникальные userId
                const userIdsList = getUserIds(leadersByDis);
                if (userIdsList.length === 0) return; // Защита от пустого массива

                // Получаем пользователей по ID
                const users = await getUsersByIds(userIdsList);

                // Объединяем лидеров с именами и обновляем state
                const updatedLeaders = addNamesToObjects(leadersByDis, users);
                setDisLeaders(updatedLeaders);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };

        fetchData();
    }, [user]); // Пустой массив зависимостей означает, что useEffect выполнится только один раз при монтировании компонента


    const getUserIds = (data) => {
        const userIds = data.map(item => item.userId);
        return Array.from(new Set(userIds));
    };

    const addNamesToObjects = (objects, names) => {
        return objects.map((obj, index) => ({
            ...obj,
            name: names[index].name || 'имя неизвестно',
            imageUrl: names[index].imageUrl || '',
            username: names[index].username || 'unknown',
            rank: names[index].rank || 1,
            exp: names[index].exp || 0,
            bio: names[index].bio || '',
        }));
    };


    return (
        <ScrollView className="bg-black h-[100vh] w-full">
            <Text className="text-[23px] font-pbold relative mx-4 text-[#fff] mt-[32px] text-center">доска лидеров</Text>
            <Text className="text-[20px] font-pregular relative mx-4 text-[#838383] text-center">за месяц</Text>

            <View
                className="flex flex-row justify-between mx-4"
            >
                <TouchableOpacity onPress={() => { setTab(0) }} className={`${tab === 0 ? 'bg-white' : 'bg-[#111]'} w-[49%] py-2 px-4 rounded-2xl mt-4`}>
                    <Text className={`${tab === 0 ? 'text-black' : 'text-white'} text-[20px] font-pregular relative text-center`}>по времени</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setTab(1) }} className={`${tab === 1 ? 'bg-white' : 'bg-[#111]'} w-[49%] py-2 px-4 rounded-2xl mt-4`}>
                    <Text className={`${tab === 1 ? 'text-black' : 'text-white'} text-[20px] font-pregular relative text-center`}>дистанция</Text>
                </TouchableOpacity>
            </View>

            {tab === 0 && (
                <View>
                    {leaders.length === 0 && (
                        <ActivityIndicator
                            animating={true}
                            color="#fff"
                            size={50}
                            className="mt-10"
                        />
                    )}

                    {leaders.map((leader, index) => {
                        if (index === 0) {
                            return (
                                <TouchableOpacity onPress={() => {
                                    navigation.navigate('otherProfile', leader) // переходим на экран Bookmark
                                }} key={leader} className="bg-[#ffb61832] py-4 mx-4 mt-4 rounded-3xl flex flex-row items-center">
                                    <Text className="text-[30px] font-pbold relative ml-4 text-[#ffdc6a]">1</Text>
                                    <View>
                                        <Text className="text-[21px] font-pbold relative mx-4 text-[#fff]">{leader.name}</Text>
                                        <Text className="text-[19px] font-pregular relative mx-4 text-[#fff2c0a0]">{formatTime(leader.totalTime)}</Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        }
                        else if (index === 1) {
                            return (
                                <TouchableOpacity onPress={() => {
                                    navigation.navigate('otherProfile', leader) // переходим на экран Bookmark
                                }} key={leader} className="bg-[#f3f9ff32] py-4 mx-4 mt-4 rounded-3xl flex flex-row items-center">
                                    <Text className="text-[30px] font-pbold relative ml-4 text-[#fafcffd3]">2</Text>
                                    <View>
                                        <Text className="text-[21px] font-pbold relative mx-4 text-[#fff]">{leader.name}</Text>
                                        <Text className="text-[19px] font-pregular relative mx-4 text-[#e2f4ffa0]">{formatTime(leader.totalTime)}</Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        }
                        else if (index === 2) {
                            return (
                                <TouchableOpacity onPress={() => {
                                    navigation.navigate('otherProfile', leader) // переходим на экран Bookmark
                                }} key={leader} className="bg-[#ff875e32] py-4 mx-4 mt-4 rounded-3xl flex flex-row items-center">
                                    <Text className="text-[30px] font-pbold relative ml-4 text-[#ffaba8ce]">3</Text>
                                    <View>
                                        <Text className="text-[21px] font-pbold relative mx-4 text-[#fff]">{leader.name}</Text>
                                        <Text className="text-[19px] font-pregular relative mx-4 text-[#f9cec9a0]">{formatTime(leader.totalTime)}</Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        }
                        else {
                            return (
                                <TouchableOpacity onPress={() => {
                                    navigation.navigate('otherProfile', leader) // переходим на экран Bookmark
                                }} key={leader} className="bg-[#111] py-4 mx-4 mt-4 rounded-3xl flex flex-row items-center">
                                    <Text className="text-[30px] font-pbold relative ml-4 text-[#838383]">{index + 1}</Text>
                                    <View>
                                        <Text className="text-[21px] font-pbold relative mx-4 text-[#fff]">{leader.name}</Text>
                                        <Text className="text-[19px] font-pregular relative mx-4 text-[#838383]">{formatTime(leader.totalTime)}</Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        }
                    })}
                </View>
            )}

            {tab === 1 && (
                < View >
                    {
                        disLeaders.length === 0 && (
                            <ActivityIndicator
                                animating={true}
                                color="#fff"
                                size={50}
                                className="mt-10"
                            />
                        )
                    }

                    {
                        disLeaders.map((leader, index) => {
                            if (index === 0) {
                                return (
                                    <TouchableOpacity onPress={() => {
                                        navigation.navigate('otherProfile', leader) // переходим на экран Bookmark
                                    }} key={leader} className="bg-[#ffb61832] py-4 mx-4 mt-4 rounded-3xl flex flex-row items-center">
                                        <Text className="text-[30px] font-pbold relative ml-4 text-[#ffdc6a]">1</Text>
                                        <View>
                                            <Text className="text-[21px] font-pbold relative mx-4 text-[#fff]">{leader.name}</Text>
                                            <Text className="text-[19px] font-pregular relative mx-4 text-[#fff2c0a0]">{(leader.totalDis).toFixed(2)}км</Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            }
                            else if (index === 1) {
                                return (
                                    <TouchableOpacity onPress={() => {
                                        navigation.navigate('otherProfile', leader) // переходим на экран Bookmark
                                    }} key={leader} className="bg-[#f3f9ff32] py-4 mx-4 mt-4 rounded-3xl flex flex-row items-center">
                                        <Text className="text-[30px] font-pbold relative ml-4 text-[#fafcffd3]">2</Text>
                                        <View>
                                            <Text className="text-[21px] font-pbold relative mx-4 text-[#fff]">{leader.name}</Text>
                                            <Text className="text-[19px] font-pregular relative mx-4 text-[#e2f4ffa0]">{(leader.totalDis).toFixed(2)}км</Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            }
                            else if (index === 2) {
                                return (
                                    <TouchableOpacity onPress={() => {
                                        navigation.navigate('otherProfile', leader) // переходим на экран Bookmark
                                    }} key={leader} className="bg-[#ff875e32] py-4 mx-4 mt-4 rounded-3xl flex flex-row items-center">
                                        <Text className="text-[30px] font-pbold relative ml-4 text-[#ffaba8ce]">3</Text>
                                        <View>
                                            <Text className="text-[21px] font-pbold relative mx-4 text-[#fff]">{leader.name}</Text>
                                            <Text className="text-[19px] font-pregular relative mx-4 text-[#f9cec9a0]">{(leader.totalDis).toFixed(2)}км</Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            }
                            else {
                                return (
                                    <TouchableOpacity onPress={() => {
                                        navigation.navigate('otherProfile', leader) // переходим на экран Bookmark
                                    }} key={leader} className="bg-[#111] py-4 mx-4 mt-4 rounded-3xl flex flex-row items-center">
                                        <Text className="text-[30px] font-pbold relative ml-4 text-[#838383]">{index + 1}</Text>
                                        <View>
                                            <Text className="text-[21px] font-pbold relative mx-4 text-[#fff]">{leader.name}</Text>
                                            <Text className="text-[19px] font-pregular relative mx-4 text-[#838383]">{(leader.totalDis).toFixed(2)}км</Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            }
                        })
                    }
                </View>
            )
            }
        </ScrollView >
    )
}

export default Card;