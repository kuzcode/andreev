import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Link, router } from "expo-router";
const Help = () => {
  return(
    <View className="w-full h-full bg-[#111]">
        <Text className="text-white text-[21px] mx-6 mt-[80px] font-pbold">напишите нам</Text>
        <Text className="text-[#838383] text-[19px] mx-6 mt-0 font-pregular">если возникла проблема</Text>

        <TouchableOpacity className="bg-[#222] py-3 rounded-2xl mx-6 mt-[80px]">
            <Text className="font-pregular text-[19px] text-center text-white">электронная почта</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="bg-[#222] py-3 rounded-2xl mx-6 mt-[12px]">
            <Text className="font-pregular text-[19px] text-center text-white">инстаграм</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {router.push('/home')}}>
            <Text className="text-primary text-[21px] mx-6 mt-[80px] font-pbold">на главную</Text>
        </TouchableOpacity>
    </View>
  )
};

export default Help;
