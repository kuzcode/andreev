import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View, Dimensions, Image, PanResponder, StyleSheet, Vibration } from "react-native";

import { useState } from "react";

import { useGlobalContext } from "../../context/GlobalProvider";
import { images } from "../../constants";
import useAppwrite from "../../lib/useAppwrite";
import { startMeal } from "../../lib/appwrite";
import { types } from "../../constants/types";
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient";
import { colors, meal } from "../../constants/types";
import { FormField } from "../../components";
import { Dropdown } from "react-native-element-dropdown";

const MealStart = () => {
  const { user } = useGlobalContext();
  const [form, setForm] = useState({
    type: 0,
    height: 0,
    weight: 0,
    goal: 0,
    gender: 1,
    userId: user.$id
  });
  const recommendedGoal = useState(0);
  const [isFocus, setIsFocus] = useState(false);
  const data = [
    { label: 'поддержание веса', value: 1 },
    { label: 'накачаться', value: 2 },
    { label: 'похудеть', value: 3 },
    { label: 'набор массы', value: 4 },
  ];

  const calcGoal = () => {
    if (form.gender === 1) {
      var x = 12.5 * form.weight + 6.7 * form.height + 320
      setForm({ ...form, goal: x })
    }
    else {
      var x = 10 * form.weight + 3.5 * form.height + 300
      setForm({ ...form, goal: x })
    }
  }

  return (
    <ScrollView className="h-full w-[100vw] pt-0 bg-[#111]">
      <Image
        source={images.food}
        className="w-[100vw] h-[100vw] hidden"
      />
      <LinearGradient className="h-[20vw] relative top-[-20vw] w-full z-20" colors={['#fff0', '#111']}></LinearGradient>

      <Text className="text-white mt-[-20px] text-[24px] font-pbold mx-4 z-30">начните следить за {`\n`}своим питанием</Text>

      <Text className="text-[19px] mx-4 text-[#838383] font-pbold mt-3">цель</Text>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        className="mx-4"
        data={data}
        search
        maxHeight={500}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'выбери' : '...'}
        searchPlaceholder="поиск"
        value={form.type}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setForm({ ...form, type: item.value });
          setIsFocus(false);
        }}
      />

      <View className="flex flex-row">
        <FormField
          measure='см'
          value={form.height}
          handleChangeText={(e) => setForm({ ...form, height: e })}
          otherStyles="mt-4 ml-4 mr-4 w-[43.5vw]" title="рост"
          keyboardType="numeric"
        />
        <FormField
          measure='кг'
          value={form.weight}
          handleChangeText={(e) => setForm({ ...form, weight: e })}
          otherStyles="mt-4 mr-4 w-[43.5vw]" title="вес"
          keyboardType="numeric"
        />
      </View>

      <Text className="text-[19px] mx-4 text-[#838383] font-pbold mt-3">пол</Text>

      <View className="flex-row justify-left px-2 items-center">
        <TouchableOpacity
          className="flex-row items-center p-2  mr-4"
          onPress={() => setForm({ ...form, gender: 1 })}
        >
          <View className={`w-5 h-5 rounded-full ${form.gender === 1 ? 'bg-primary' : 'bg-[#333]'}`}>
          </View>
          <Text className={`ml-2 font-psemibold text-lg ${form.gender === 1 ? 'text-primary' : 'text-[#838383]'}`}>мужской</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => setForm({ ...form, gender: 2 })}
        >
          <View className={`w-5 h-5 rounded-full ${form.gender === 2 ? 'bg-pink-500' : 'bg-[#333]'}`}>
          </View>
          <Text className={`ml-2 font-psemibold text-lg ${form.gender === 2 ? 'text-pink-500' : 'text-[#838383]'}`}>женский</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => {
        calcGoal();
        startMeal(form);
        router.push('/additional/meal')
      }} className="bg-[#fff] py-3 mt-[220px] mx-4 rounded-2xl">
        <Text className="font-pregular text-black text-[18px] text-center">начать</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}


const styles = StyleSheet.create({
  bottomScrollView: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    zIndex: 10,
  },
  sportButton: {
    backgroundColor: '#111',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 6,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
  },
  disabledButton: {
    backgroundColor: '#181818',
  },

  container: {
    backgroundColor: '#111',
    padding: 16,
  },
  dropdown: {
    height: 56,
    backgroundColor: '#111',
    borderWidth: 2,
    borderColor: '#222',
    borderRadius: 16,
    marginTop: 8,
    paddingHorizontal: 16,
  },
  label: {
    position: 'absolute',
    backgroundColor: '#111',
    left: 22,
    bottom: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Installed-Regular'
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Installed-Regular'
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

export default MealStart;