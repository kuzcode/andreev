import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View, Image, Linking } from "react-native";
import { useGlobalContext } from "../../context/GlobalProvider";
import useAppwrite from "../../lib/useAppwrite";
import { sendRequest } from "../../lib/appwrite";
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../constants/types";
import { useState } from "react";
import { FormField } from "../../components";

const Card = () => {
    const { user } = useGlobalContext();
    const [req, setReq] = useState('')

    return (
        <View className="bg-black w-full h-full pt-[56px]">
            <Text className="text-white text-[24px] font-pbold mx-4">связь с атлетом</Text>
            <Text className="text-[#838383] text-[18px] font-pregular mx-4">можешь писать по любому вопросу, но ответим не всем</Text>
            <Text className="text-white text-[24px] font-pbold mx-4 mt-6">напиши сюда</Text>

            <FormField
                max={4000}
                value={req}
                handleChangeText={(e) => setReq(e)}
                otherStyles="mt-[-16] mx-4"
                multiline={true}
                numberOfStrokes={10}
            />

            <TouchableOpacity onPress={() => {
                let form = {
                    name: 'сообщение',
                    caption: req,
                    userId: user.$id,
                    type: 'жалоба или предложение из приложения'
                }
                sendRequest(form)
                router.push('/home')
            }} className="bg-white rounded-2xl py-3 mt-4 mx-4">
                <Text className="text-[#000] text-[20px] font-pregular text-center">отправить</Text>
            </TouchableOpacity>

            <Text className="text-white text-[24px] font-pbold mx-4 mt-6">или зайди на <Text className="text-primary" onPress={() => { Linking.openURL('https://athleteblr.netlify.app/contact') }}>сайт</Text></Text>
        </View>
    )
}

export default Card;