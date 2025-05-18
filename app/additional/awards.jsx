import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View, Image } from "react-native";
import { useGlobalContext } from "../../context/GlobalProvider";
import useAppwrite from "../../lib/useAppwrite";
import { getAwards, getUserAwards, getAwardsByIds } from "../../lib/appwrite";
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../constants/types";
import { useState, useEffect } from "react";
import { icons } from "../../constants";

const Awards = () => {
    const [{ user }, setUser] = useState(useGlobalContext());
    const [awards, setAwards] = useState([]);
    const [userAwards, setUserAwards] = useState([]);
    const [current, setCurrent] = useState({});
    const [shown, setShown] = useState(false);
    const [bought, setBought] = useState(false);
    const [notEnough, setNotEnough] = useState(false);

    useEffect(() => {
        async function fetchAwards() {
            try {
                const got = await getAwards();
                // Фильтруем awards, исключая те, что имеют такое же name, как у userAwards
                const filteredAwards = got.filter(award =>
                    !userAwards.some(userAward => userAward.name === award.name)
                );
                setAwards(filteredAwards);
            } catch (error) {
                console.error('Error fetching awards: ', error);
            }
        }

        fetchAwards();
    }, [user, userAwards]);


    useEffect(() => {
        async function fetchUserAwards() {
            try {
                const got = await getUserAwards(user.$id);
                const awardsIds = got[0].awards; // Предполагаем, что 'awards' это массив ID наград
                // Теперь получаем награды по их ID
                const awardsData = await getAwardsByIds(awardsIds);

                // Объединяем данные наград с полученными данными по ID
                const awardsWithDetails = awardsData.map(award => {
                    return {
                        ...award, // добавляем поля из award
                        name: award.name,
                        price: award.imageUrl
                    };
                });

                setUserAwards(awardsWithDetails);
            } catch (error) {
                console.error('Error fetching user awards: ', error);
            }
        }

        fetchUserAwards();
    }, [user]);


    const buyAward = () => {
        if (user.balance > current.price) {

        }
        else {
            setShown(false);
            setNotEnough(true);
        }
    }

    return (
        <ScrollView className="bg-[#000] h-[100vh] w-full">
            {shown && (
                <View className="bg-black w-[100vw] h-full fixed top-0 z-10">
                    <TouchableOpacity className="absolute right-[16px] top-0" onPress={() => { setShown(false) }}>
                        <Image
                            source={icons.close}
                            className="w-8 h-8 top-8 right-0 mr-4 z-10 "
                            tintColor={'white'}
                        />
                    </TouchableOpacity>
                    <Text className="text-[20px] font-pregular text-center relative mx-4 text-[#838383] mt-[64px]">награда</Text>
                    <Text className="text-[25px] font-pbold text-center relative mx-4 text-[#fff]">{current.name}</Text>

                    <Image
                        source={{ uri: current.imageUrl }}
                        className="w-[50vw] h-[50vw] mx-auto mt-4 rounded-xl"
                    />

                    <Text className="text-[20px] font-pregular text-center relative mx-4 mt-4 text-[#838383]">{current.description}</Text>

                    {current.price !== null && current.price > 0 && (
                        <View className="absolute w-full top-[70vh]">
                            {user.balance > 0 ? (
                                <Text className="text-[21px] font-pregular text-center relative mx-2 text-[#838383] mb-4">твой баланс: {user.bal}</Text>
                            ) : (
                                <Text className="text-[21px] font-pregular text-center relative mx-2 text-[#838383] mb-4">твой баланс: 0</Text>
                            )}
                            <TouchableOpacity onPress={() => {
                                buyAward()
                            }} className="bg-primary py-2 rounded-2xl mx-4">
                                <Text className="text-[21px] font-pregular text-center relative mx-2 text-[#fff]">купить за {current.price}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            )}

            {notEnough && (
                <View className="bg-[#111] rounded-3xl w-[80vw] pb-4 absolute top-[30vh] left-[10vw] right-[10vw] z-20">
                    <TouchableOpacity className="absolute right-0 top-0" onPress={() => { setNotEnough(false) }}>
                        <Image
                            source={icons.close}
                            className="w-8 h-8 top-4 right-0 mr-4 z-10 "
                            tintColor={'white'}
                        />
                    </TouchableOpacity>
                    <Text className="text-[20px] font-pbold relative mx-4 text-[#fff] mt-[64px]">у тебя недостаточно монет на балансе</Text>
                    <Text className="text-[20px] font-pregular relative mx-4 text-[#838383]">монеты можно получить за актиновсть: тренировки, ведение трекеров и тп</Text>
                </View>
            )}

            <Text className="text-[23px] font-pbold relative mx-4 text-[#fff] mt-[32px]">твои награды</Text>

            <View className="mx-4 mt-4">
                {userAwards.map(award =>
                    <TouchableOpacity
                        onPress={() => {
                            setCurrent(award);
                            setShown(true);
                        }}
                        className="bg-[#111] rounded-2xl pb-2 w-[45vw]">
                        <Image
                            source={{ uri: award.imageUrl }}
                            className="w-[45vw] h-[45vw] rounded-t-2xl"
                        />
                        <Text className="text-[19px] leading-[24px] font-pbold text-center relative mx-4 text-[#fff]">{award.name}</Text>
                        <Text className="text-[17px] mt-2 leading-[20px] font-pregular text-center relative mx-4 text-[#838383]">{award.description}</Text>

                        {award.price !== null && award.price > 0 && (
                            <TouchableOpacity className="bg-primary mx-2 py-1 rounded-xl mt-1">
                                <Text className="text-[18px] font-pregular text-center relative mx-2 text-[#fff]">{award.price}</Text>
                            </TouchableOpacity>
                        )}
                    </TouchableOpacity>
                )}
            </View>

            <Text className="text-[23px] font-pbold relative mx-4 text-[#fff] mt-[32px] mb-4">можно получить</Text>
            <View className="flex flex-row flex-wrap mx-4">
                {awards.map(award =>
                    <TouchableOpacity
                        onPress={() => {
                            setCurrent(award);
                            setShown(true);
                        }}
                        className="bg-[#111] rounded-2xl pb-2 w-[45vw]">
                        <Image
                            source={{ uri: award.imageUrl }}
                            className="w-[45vw] h-[45vw] rounded-t-2xl"
                        />
                        <Text className="text-[19px] leading-[24px] font-pbold text-center relative mx-4 text-[#fff]">{award.name}</Text>
                        <Text className="text-[17px] mt-2 leading-[20px] font-pregular text-center relative mx-4 text-[#838383]">{award.description}</Text>

                        {award.price !== null && award.price > 0 && (
                            <TouchableOpacity className="bg-primary mx-2 py-1 rounded-xl mt-1">
                                <Text className="text-[18px] font-pregular text-center relative mx-2 text-[#fff]">{award.price}</Text>
                            </TouchableOpacity>
                        )}
                    </TouchableOpacity>
                )}
            </View>

            <View className="mt-[50vh]"></View>
        </ScrollView>
    )
}

export default Awards;