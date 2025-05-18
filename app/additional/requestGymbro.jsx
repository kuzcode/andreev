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
import { createGymbro, getAllUsers, getGymbros, getNews } from "../../lib/appwrite";
import { CustomButton, FormField } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import useAppwrite from "../../lib/useAppwrite";

const Create = () => {
    const { user } = useGlobalContext();

    const [form, setForm] = useState({
        userId: user.$id,
        gymName: '',
        shortDescription: '',
        description: '',
        contact: '',
    })

    return (
        <ScrollView className="bg-[#111] pt-10 px-4">
            <Text className="text-white font-pbold text-[21px]">заявка на gymbro</Text>
            <Text className="text-[#838383] font-pregular text-[20px] mb-4">gymbro — друг или подруга, который(-ая) подстрахует на жиме</Text>

            <FormField
                title={'название зала. например: gym express на арена сити'}
                value={form.gymName}
                handleChangeText={(e) => setForm({ ...form, gymName: e })}
                otherStyles=""
                max={100}
            />

            <FormField
                title={'краткое описание чего ты хочешь. например: гонять с другом в зал'}
                value={form.shortDescription}
                handleChangeText={(e) => setForm({ ...form, shortDescription: e })}
                otherStyles="mt-4"
                max={100}
            />

            <FormField
                title={'длинное описание чего ты хочешь'}
                value={form.description}
                handleChangeText={(e) => setForm({ ...form, description: e })}
                otherStyles="mt-4"
                multiline={true}
                numberOfStrokes={4}
                max={1000}
            />

            <FormField
                title={'как с тобой связаться. например: телеграм, инста или номер телефона'}
                value={form.contact}
                handleChangeText={(e) => setForm({ ...form, contact: e })}
                otherStyles="mt-4"
                multiline={true}
                numberOfStrokes={2}
                max={100}
            />


            <TouchableOpacity onPress={() => {
                createGymbro(form);
                router.push('/additional/gymbro')
            }} className="bg-[#fff] mt-4 mb-10 rounded-2xl py-3">
                <Text className="font-pregular text-[20px] text-center">сохранить</Text>
            </TouchableOpacity>

            <View className="mt-[7vh]"></View>
        </ScrollView>
    )
}

export default Create;
