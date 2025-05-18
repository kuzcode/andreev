import { useState } from "react";
import React from 'react';
import { Text, TouchableOpacity, View } from "react-native";
import { useRoute } from '@react-navigation/native';
import { FormField } from "../../components";
import { router } from "expo-router";
import { updateTracker } from "../../lib/appwrite";

const Track = () => {
  const route = useRoute();
  const { track } = route.params;

  const [form, setForm] = useState({
    id: track.$id,
    name: track.name,
    goal: track.goal,
  });

  const contentList = [
    {
      a: `Меньше ${form.name}`,
      b: `${track.done}/${form.goal} дней`
    }
  ]

  return (
    <View className="bg-[#000] w-full h-full">
      {//<LinearGradient colors={colors[track.color]} className="shadow-xl mt-4 mx-auto relative w-[90vw] h-[165px] bg-[#161616] px-4 py-2 rounded-2xl overflow-hidden mb-4">
      }
      <Text className="text-white font-pbold text-[20px]">{contentList[track.type].a}</Text>
      <Text className="text-[#ffffff83] font-pregular text-[20px]">{contentList[track.type].b}</Text>

      {track.type === 1 && (
        <View className="absolute flex flex-row bottom-3 px-4 w-[90vw] justify-between">
          <TouchableOpacity className="w-[38.5%] py-[5px] bg-[#ffffff20] border-[1px] border-[#ffffff25] rounded-lg">
            <Text className="font-pregular text-white text-center text-[15px]">сорвался</Text>
          </TouchableOpacity>
          <TouchableOpacity className="w-[58.5%] py-[5px] bg-[#ffffff20] border-[1px] border-[#ffffff25] rounded-lg">
            <Text className="font-pregular text-white text-center text-[15px]">держусь</Text>
          </TouchableOpacity>
        </View>
      )}
      {
        //</LinearGradient>
      }


      <FormField
        title="название"
        value={form.name}
        handleChangeText={(e) => setForm({ ...form, name: e })}
        otherStyles="mt-7 mx-4"
      />

      <FormField
        title="цель"
        value={form.goal.toString()} // Преобразуем целое число в строку для отображения
        handleChangeText={(e) => setForm({ ...form, goal: parseInt(e) || 0 })} // Преобразуем вводимое значение обратно в целое число 
        keyboardType="numeric" // Устанавливаем тип клавиатуры на числовой
        otherStyles="mt-7 mx-4"
      />


      <View className="absolute bottom-4">
        <TouchableOpacity onPress={() => {
          updateTracker(form);
          router.push('/home')
        }} className="bg-[#2F0F0F] py-3 mx-4 mb-2 w-[90vw] rounded-xl">
          <Text className="text-[#C65656] font-pregular text-[19px] text-center">удалить трекер</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          updateTracker(form);
          router.push('/home')
        }} className="bg-white py-3 mx-4 w-[90vw] rounded-xl">
          <Text className="font-pregular text-[19px] text-center">готово</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Track;
