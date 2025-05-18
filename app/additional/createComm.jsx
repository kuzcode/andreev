import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View, Image, Linking } from "react-native";
import { useGlobalContext } from "../../context/GlobalProvider";
import useAppwrite from "../../lib/useAppwrite";
import { getUserTrackers, joinCommunity, leaveCommunity, sendRequest } from "../../lib/appwrite";
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../constants/types";
import { useState, useEffect } from "react";
import { getUserCommunities, getAllCommunities } from "../../lib/appwrite";
import { icons } from "../../constants";
import { FormField } from "../../components";

const Comms = () => {
    const [{ user }, setUser] = useState(useGlobalContext());
    const [shown, setShown] = useState(false);
    const [form, setForm] = useState({
        userId: user.$id,
        type: 'create community',
        name: '',
        caption: '',
    });

    return (
        <ScrollView className="bg-[#000] h-[100vh] w-full pt-10">
            {shown && (
                <View className="bg-black w-[100vw] h-full fixed top-0 z-10">
                    <Text className="text-white font-pbold text-[20px] mx-4 mt-[8vh] text-center">
                        спасибо, нам пришла твоя заявка о создании сообщества. мы рассмотрим её и в течение следующих суток либо мы её отклоним, либо сообщество появится в приложении.
                    </Text>

                    <TouchableOpacity
                        onPress={() => { Linking.openURL('https://athleteblr.netlify.app/contact') }}
                        className="bg-[#111] rounded-2xl py-3 mx-4 mt-4">
                        <Text className="text-white font-pregular text-[19px] text-center">связаться с атлет</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        router.push('/')
                    }} className="bg-[#fff] rounded-2xl py-3 mx-4 mt-4">
                        <Text className="text-black font-pregular text-[19px] text-center">на главную</Text>
                    </TouchableOpacity>
                </View>
            )}

            <Text className="text-white font-pbold text-[20px] mx-4">
                заявка на сообщество
            </Text>
            <Text className="text-[#838383] font-pregular text-[18px] mx-4">
                мы рассматриваем заявки вручную в течение суток, если ты хочешь создать сообщество, заполни форму ниже и мы подумаем
            </Text>

            <FormField
                title="название"
                max={30}
                value={form.name}
                handleChangeText={(e) => setForm({ ...form, name: e })}
                otherStyles="mt-4 mx-4"
            />
            <FormField
                title="описание"
                max={4000}
                value={form.caption}
                handleChangeText={(e) => setForm({ ...form, caption: e })}
                otherStyles="mt-4 mx-4"
                multiline={true}
                numberOfStrokes={7}
            />

            <TouchableOpacity onPress={() => {
                sendRequest(form);
                setShown(true);
            }} className="bg-[#fff] rounded-2xl py-3 mx-4 mt-4">
                <Text className="text-black font-pregular text-[19px] text-center">готово</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

export default Comms;