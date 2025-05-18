import { useState } from "react";
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { FormField } from "../../components";
import { router } from "expo-router";
import { createTracker } from "../../lib/appwrite";
import { colors, trackTypes } from "../../constants/types";
import { useGlobalContext } from "../../context/GlobalProvider";
import { LinearGradient } from "expo-linear-gradient";
import { Dropdown } from 'react-native-element-dropdown';

const NewTrack = () => {
  const [isFocus, setIsFocus] = useState(false);
  const [val, setVal] = useState('');

  const data = [
    { label: 'воздержание', value: 1 },
    { label: 'пить воду', value: 2 },
    { label: 'каждый день', value: 3 },
  ];

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
      height: 50,
      backgroundColor: '#252525',
      borderRadius: 8,
      marginTop: 8,
      paddingHorizontal: 8,
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

  const { user } = useGlobalContext();
  const [form, setForm] = useState({
    name: '',
    type: 0,
    goal: 0,
    color: 0,
    userId: user?.$id
  })

  return (
    <ScrollView className="bg-[#000] h-full w-full">
      <LinearGradient colors={colors[form.color]} className="w-[90vw] h-[200px] mb-4 mx-auto mt-10 rounded-2xl">

        {form.name === '' ? (
          <Text className="text-[#ffffff79] font-pbold text-[20px] mx-4 mt-2">{trackTypes[form.type].title} {'название'}</Text>
        ) : (
          <Text className="text-white font-pbold text-[20px] mx-4 mt-2">{trackTypes[form.type].title} {form.name}</Text>
        )}

        {form.goal === 0 ? (
          <Text className="text-[#ffffff79] font-pbold text-[20px] mx-4 mt-2">цель</Text>
        ) : (
          <Text className="text-white font-pbold text-[20px] mx-4 mt-2">0/{form.goal}</Text>
        )}
      </LinearGradient>
      <Dropdown
        className="mx-4"
        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search
        maxHeight={500}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'вид трекера' : '...'}
        searchPlaceholder="поиск"
        value={form.type}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setForm({ ...form, type: item.value });
          if (item.value === 1) {
            setVal('дней');
          }
          else if (item.value === 2) {
            setVal('милилитров')
          }
          else if (item.value === 3) {
            setVal('дней')
          }
          else {
            setVal('')
          }
          setIsFocus(false);
        }}
      />


      <FormField
        title="название"
        value={form.name}
        handleChangeText={(e) => setForm({ ...form, name: e })}
        otherStyles="mt-4 mx-4"
      />
      <FormField
        title="цель"
        value={form.goal.toString()} // Преобразуем целое число в строку для отображения
        handleChangeText={(e) => setForm({ ...form, goal: parseInt(e) || 0 })} // Преобразуем вводимое значение обратно в целое число 
        keyboardType="numeric" // Устанавливаем тип клавиатуры на числовой
        otherStyles="mt-4 mx-4 mb-4"
        measure={val}
      />

      <Text className="text-white text-[18px] font-pbold mx-4 mb-2">выбери цвет</Text>
      <View className="flex flex-row flex-wrap justify-around mx-4">
        {colors.map((color, index) =>
          <TouchableOpacity key={index} className="mb-4" onPress={() => { setForm({ ...form, color: index }) }}>
            <LinearGradient
              className={`w-[18.5vw] h-[18.5vw] rounded-2xl ${form.color === index ? 'border-2 border-white' : ''}`}
              colors={color}
            >
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity onPress={() => { createTracker(form); router.push('/home') }} className="bg-white mx-4 py-[18px] rounded-2xl mb-10">
        <Text className="text-black text-[19px] font-pregular text-center">готово</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

export default NewTrack;