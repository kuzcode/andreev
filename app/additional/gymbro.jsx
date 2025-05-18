import { useState, useEffect } from "react";
import { router } from "expo-router";
import { ResizeMode, Video } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    View,
    Text,
    Alert,
    Image,
    TouchableOpacity,
    ScrollView,
    Linking,
} from "react-native";
import { icons } from "../../constants";
import { getAllUsers, getGymbros, getFullUsersByIds } from "../../lib/appwrite";
import { CustomButton, FormField } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import useAppwrite from "../../lib/useAppwrite";
import { set } from "date-fns";

const Create = () => {
    const [users, setUsers] = useState([])
    const [fullUsers, setFullUsers] = useState([])
    const [current, setCurrent] = useState({})
    const [shown, setShown] = useState(false)

    useEffect(() => {
        async function fetchUsers() {
            try {
                // Получаем всех пользователей
                const gymbros = await getGymbros();
                setUsers(gymbros)

                // Извлекаем userId для запроса
                const userIds = gymbros.map(user => user.userId);

                // Получаем полные данные пользователей по их userId
                const gotfullUsers = await getFullUsersByIds(userIds);


                // Устанавливаем полученные данные с добавлением description и gymName
                const usersWithDetails = gotfullUsers.map(user => ({
                    name: user.name,
                    imageUrl: user.imageUrl
                }));

                setFullUsers(usersWithDetails);
            } catch (error) {
                console.error('Error fetching users: ', error);
            }
        }

        fetchUsers();

    }, [])


    return (
        <ScrollView className="bg-[#000] pt-10 px-4">
            {shown && (
                <View className="bg-black w-[100vw] h-[100vh] absolute top-0 left-0 z-10">
                    <TouchableOpacity className="absolute right-[16px] top-0 z-20" onPress={() => { setShown(false) }}>
                        <Image
                            source={icons.close}
                            className="w-8 h-8 top-8 right-0 mr-4 z-10 "
                            tintColor={'white'}
                        />
                    </TouchableOpacity>

                    <Text className="text-[#fff] font-pbold text-center text-[23px] mt-10 left-[-16px]">{current.name}</Text>

                    <Image
                        source={{ uri: current.avatar }}
                        className="w-[40vw] h-[40vw] rounded-full mx-auto mt-6 left-[-16px]"
                    />

                    <Text className="text-[#fff] font-pbold text-[20px] mt-6"><Text className="text-[#838383]">зал: </Text>{current.gym}</Text>
                    <Text className="text-[#fff] font-pbold text-[20px] mt-2"><Text className="text-[#838383]">описание: </Text>{current.description}</Text>
                    <Text className="text-[#fff] font-pbold text-[20px] mt-2"><Text className="text-[#838383]">связаться: </Text>{current.contact}</Text>
                </View>
            )}
            <Text className="text-white font-pbold text-[21px]">найти gymbro</Text>
            <Text className="text-[#838383] font-pregular text-[20px] mb-4">gymbro — друг или подруга, который(-ая) подстрахует на жиме</Text>

            <TouchableOpacity onPress={() => { router.push('/additional/requestGymbro') }} className="bg-[#111] rounded-3xl py-4">
                <Text className="text-white font-pbold text-[21px] text-center">добавить свою заявку</Text>
            </TouchableOpacity>

            {users.map(us => (
                <TouchableOpacity
                    onPress={() => {
                        setCurrent({
                            description: us.description,
                            name: fullUsers[users.indexOf(us)]?.name,
                            avatar: fullUsers[users.indexOf(us)]?.imageUrl,
                            gym: us.gymName,
                            contact: us.contact
                        })
                        setShown(true)
                    }}
                    className="bg-[#111] rounded-3xl flex flex-row mt-4">
                    <Image
                        source={{ uri: fullUsers[users.indexOf(us)]?.imageUrl }}
                        className="w-[110px] h-auto rounded-l-3xl"
                    />
                    <View>
                        <View className="flex flex-row flex-wrap pr-[100px] mt-2">
                            <Text className="text-[20px] ml-4 font-pbold text-white">{fullUsers[users.indexOf(us)]?.name}</Text>
                            <Text className="text-[18px] ml-4 font-pregular text-[#838383] mr-4">описание: {us?.shortDescription}</Text>
                            <Text className="text-[18px] ml-4 font-pregular text-[#838383] mb-2 mr-4">зал: {us?.gymName}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}

            <View
                className="mt-[60vh]"
            >
            </View>
        </ScrollView>
    )
}

export default Create;
