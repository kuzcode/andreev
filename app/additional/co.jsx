import { useState, useEffect } from "react";
import { router } from "expo-router";
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
import { getAllUsers, getCo, getFullUsersByIds } from "../../lib/appwrite";
import { CustomButton, FormField } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import useAppwrite from "../../lib/useAppwrite";
import { set } from "date-fns";
import { format } from 'date-fns';

const Create = () => {
    const [co, setCo] = useState([])
    const [current, setCurrent] = useState({})
    const [shown, setShown] = useState(false)

    useEffect(() => {
        async function fetchUsers() {
            try {
                // Получаем всех пользователей
                const gymbros = await getCo();
                setCo(gymbros)

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

                    <Text className="text-[#fff] font-pbold text-[20px] mt-6 ">{current.title}</Text>
                    <Text className="text-[#fff] font-pbold text-[20px] mt-6 lowercase"><Text className="text-[#838383]">дата: </Text>{current.date}</Text>
                    <Text className="text-[#fff] font-pbold text-[20px] mt-6 lowercase"><Text className="text-[#838383]">место: </Text>{current.place}</Text>
                    <Text className="text-[#fff] font-pbold text-[20px] mt-6 lowercase"><Text className="text-[#838383]">описание: </Text>{current.description}</Text>
                    <Text className="text-[#fff] font-pbold text-[20px] mt-6 lowercase"><Text className="text-[#838383]">связь: </Text>{current.contact}</Text>
                </View>
            )}
            <Text className="text-white font-pbold text-[21px]">совместные тренировки</Text>
            <Text className="text-[#838383] font-pregular text-[20px] mb-4">тренируйтесь вместе</Text>

            <TouchableOpacity onPress={() => { router.push('/additional/requestCo') }} className="bg-[#111] rounded-3xl py-4">
                <Text className="text-white font-pbold text-[21px] text-center">создай свою +</Text>
            </TouchableOpacity>

            {co.map(us => {
                // Предположим, что us.date - это объект Date или строка, которую можно преобразовать в объект Date
                const date = new Date(us.date); // Создаем новый объект Date
                const formattedDate = format(date, 'd MMMMMMMMMM в HH:mm'); // Форматируем дату
                return (
                    <TouchableOpacity
                        onPress={() => {
                            setCurrent({
                                title: us.title,
                                date: formattedDate,
                                place: us.place,
                                creator: us.creator,
                                description: us.description,
                                contact: us.contact,
                            });
                            setShown(true);
                        }}
                        className="bg-[#111] rounded-3xl flex flex-row mt-4">
                        <View>
                            <View className="flex flex-row flex-wrap pr-[100px] py-3">
                                <Text className="text-[20px] mx-4 font-pbold text-white">{us.title}</Text>
                                <Text className="text-[20px] mx-4 font-pregular text-[#838383] lowercase">⌚ {formattedDate}</Text>
                                <Text className="text-[20px] mx-4 font-pregular text-[#838383] lowercase">📍 {us.place}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                );
            })}

            <View
                className="mt-[60vh]"
            >
            </View>
        </ScrollView>
    )
}

export default Create;
