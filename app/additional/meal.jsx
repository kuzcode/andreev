import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View, Dimensions, Image, PanResponder, StyleSheet, Vibration } from "react-native";

import { useState, useEffect } from "react";

import { useGlobalContext } from "../../context/GlobalProvider";
import useAppwrite from "../../lib/useAppwrite";
import { getMeal, startMeal } from "../../lib/appwrite";
import { types } from "../../constants/types";
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient";
import { colors, meal } from "../../constants/types";
import { FormField } from "../../components";
import { Dropdown } from "react-native-element-dropdown";
import { getUserMeal } from "../../lib/appwrite";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { icons } from "../../constants";


const Meal = () => {
  const { user } = useGlobalContext();
  const [mealForm, setMealForm] = useState({});
  const [adding, setAdding] = useState(false);
  const [advices, setAdvices] = useState([]);
  const [plan, setPlan] = useState(null);
  const [today, setToday] = useState([]);

  const fetchMealData = async () => {
    try {
      const data = await getUserMeal();
      setMealForm(data);
    } catch (err) {
      setError(err.message);
    }
  };


  useEffect(() => {
    fetchMealData();
  }, []);

  useEffect(() => {
    const fetchM = async () => {
      const data = await getMeal();
      setAdvices(data);
    };

    fetchM();
  }, []);

  async function addMeal(name, calories, grams) {
    try {
      const newMeal = { name, calories, grams };

      mealForm.eaten.push(newMeal); // Добавляем новое блюдо в массив eaten

      await AsyncStorage.setItem('mealData', JSON.stringify(mealForm)); // Сохраняем обновленные данные обратно в AsyncStorage

      return mealForm; // Возвращаем сохраненные данные
    } catch (error) {
      throw new Error('Ошибка при сохранении: ' + error.message);
    }
  }

  return (
    <ScrollView className="bg-black w-full h-[100vh]">
      {adding && (
        <View className="bg-black z-[50] absolute top-0 w-full h-full">
          <TouchableOpacity className="absolute right-[16px] top-0 z-20" onPress={() => { setAdding(false) }}>
            <Image
              source={icons.close}
              className="w-8 h-8 top-8 right-0 mr-4 z-10 "
              tintColor={'white'}
            />
          </TouchableOpacity>
        </View>
      )}

      <LinearGradient colors={['#ff0844', '#ffb199']} className="h-[270px] w-full">
        <Text className="font-pbold text-white text-[38px] text-center mt-[100px]">
          {mealForm ? mealForm.goal : '0000'}
        </Text>
      </LinearGradient>
      <LinearGradient colors={['#fff0', '#000']} className="h-[30px] z-10 w-full mt-[-30px]">
      </LinearGradient>

      <TouchableOpacity activeOpacity={0.8} onPress={() => {
        setAdding(true);
      }} className="bg-[#fff] relative top-[0vw] mx-4 py-[18px] rounded-[21px] z-30">
        <View className="flex flex-row items-center justify-center">
          <Text className="text-center font-pregular text-[18px]">добавить еду +</Text>
        </View>
      </TouchableOpacity>

      <View className="flex flex-row justify-between mx-4 mt-3">
        <TouchableOpacity activeOpacity={0.8} onPress={() => {
          setAdding(true);
        }} className="bg-[#111] relative mx-auto w-[48%] pt-[15px] pb-[19px] rounded-[21px] z-30">
          <View className="flex flex-row items-center justify-center">
            <Text className="text-center font-pregular text-[18px] text-white">параметры</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} onPress={() => {
          setAdding(true);
        }} className="bg-[#111] relative mx-auto w-[48%] pt-[15px] pb-[19px] rounded-[21px] z-30">
          <View className="flex flex-row items-center justify-center">
            <Text className="text-center font-pregular text-[18px] text-white">рецепты</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal={true}
        className="mt-4 pl-4"
      >
        {advices.map(advice =>
          <TouchableOpacity className="bg-[#111] rounded-3xl py-3 px-4">
            <Text className="text-white text-[20px] font-pbold">{advice.title}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {plan ? (
        <View></View>
      ) : (
        <TouchableOpacity className="bg-[#111] mx-4 mt-4 px-4 py-3 rounded-3xl">
          <Text className="text-[20px] font-pbold text-white">плана питания нет</Text>
          <Text className="text-[17px] font-pregular text-[#838383]">нажми, чтобы найти или создать свой</Text>
        </TouchableOpacity>
      )}

      <Text className="text-[20px] font-pbold text-white mx-4 mt-4">съедено сегодня</Text>
      {today.length === 0 ? (
        <Text className="text-[20px] font-pbold text-white mx-4 mt-4">пока ничего, <Text className="text-primary" onPress={() => { setAdding(true) }}>добавь</Text></Text>
      ) : (
        <View>
          {today.map(food =>
            <TouchableOpacity>

            </TouchableOpacity>
          )}
        </View>
      )}
    </ScrollView>
  )
}

export default Meal;