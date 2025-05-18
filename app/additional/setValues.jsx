import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View, Image } from "react-native";
import { useGlobalContext } from "../../context/GlobalProvider";
import useAppwrite from "../../lib/useAppwrite";
import { getUserValues, updateValues } from "../../lib/appwrite";
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../constants/types";
import { useState } from "react";
import { icons } from "../../constants";
import { useEffect } from "react";
import { FormField } from "../../components";

const Card = () => {
    const [{ user }, setUser] = useState(useGlobalContext());
    const [userValues, setUserValues] = useState({});

    useEffect(() => {
        async function fetchAwards() {
            try {
                const got = await getUserValues(user.$id);
                setUserValues(got[0])
            } catch (error) {
                console.error('Error fetching values: ', error);
            }
        }

        fetchAwards();
    }, [user])

    function updateUserValue(value, index) {
        const updatedStats = [...userValues.stats];
        const existingIndex = updatedStats.findIndex(stat => stat.index === index);

        if (value === 0 || value === '') {
            // Удаляем объект, если значение 0
            if (existingIndex !== -1) {
                updatedStats.splice(existingIndex);
            }
        } else {
            if (existingIndex !== -1) {
                // Обновляем существующее значение
                updatedStats[existingIndex].value = parseFloat(value);
            } else {
                // Добавляем новый объект
                updatedStats.push({ index: index, value: parseFloat(value) });
            }
        }

        setUserValues({ ...userValues, stats: updatedStats });
    }


    const values = [
        {
            title: 'жим лёжа',
            measure: 'кг'
        },
        {
            title: 'становая тяга',
            measure: 'кг'
        },
        {
            title: 'присед',
            measure: 'кг'
        },
        {
            title: 'на бицепс',
            measure: 'кг'
        },
        {
            title: '1000м',
            measure: 'сек'
        },
    ]

    return (
        <View className="bg-black h-[100vh] w-full">
            <ScrollView>
                {userValues.stats?.length > 0 && (
                    <View>
                        <Text className="text-[#fff] font-pbold text-[21px] mx-4 mt-10 text-center">личные рекорды</Text>
                        <View className="mb-4 mx-4">
                            {values.map(val =>
                                <View className="bg-[#111] rounded-3xl px-4 pt-3 pb-4 mt-4">
                                    <Text className="text-[#fff] font-pbold text-[20px]">
                                        {val.title}
                                        <Text className="text-[#838383]">
                                            {userValues?.stats?.find(userVal => userVal.index === values.indexOf(val))
                                                ? `, ${userValues?.stats?.find(userVal => userVal.index === values.indexOf(val)).value}${val.measure}`
                                                : ", не указано"}
                                        </Text>
                                    </Text>


                                    <FormField
                                        handleChangeText={(e) => {
                                            updateUserValue(e, values.indexOf(val))
                                            console.log(userValues)
                                        }}
                                        value={userValues?.stats?.find(userVal => userVal.index === values.indexOf(val))
                                            ? `${userValues?.stats?.find(userVal => userVal.index === values.indexOf(val)).value}`
                                            : '0'}
                                        measure={val.measure}
                                    />
                                </View>
                            )}
                        </View>
                    </View>
                )}

                <View className="mt-[15vh]"></View>
            </ScrollView>


            <TouchableOpacity
                onPress={() => {
                    updateValues(userValues);
                }}
                className="bg-white py-3 absolute bottom-[32px] left-4 right-4 rounded-2xl">
                <Text className="font-pregular text-[20px] text-center">сохранить</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Card;