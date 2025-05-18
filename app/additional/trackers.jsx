import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View, Image } from "react-native";
import { useGlobalContext } from "../../context/GlobalProvider";
import useAppwrite from "../../lib/useAppwrite";
import { deleteTrack, getUserTrackers } from "../../lib/appwrite";
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient";
import { colors, trackTypes } from "../../constants/types";
import { icons } from "../../constants";
import { useState } from "react";

const Trackers = () => {
  const { user } = useGlobalContext();
  const { data: trackers } = useAppwrite(() => getUserTrackers(user?.$id));
  const navigation = useNavigation();
  const [shown, setShown] = useState(false);
  const [shownA, setShownA] = useState(false);
  const [current, setCurrent] = useState({});


  return (
    <ScrollView className="bg-black h-full w-full">
      {shownA && (
        <View className="bg-[#222] absolute z-20 top-[25vh] left-8 right-8 px-4 py-3 rounded-3xl">
          <Text className="text-white text-[20px] font-pbold">удалить трекер?</Text>
          <Text className="text-[#838383] text-[18px] font-pregular">весь прогресс будет утерян</Text>
          <TouchableOpacity onPress={() => { setShownA(false) }} className="bg-[#333] py-2 rounded-2xl mt-2">
            <Text className="text-center text-[19px] font-pregular text-white">оставить</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            deleteTrack(current.$id);
            router.push('/home');
          }} className="bg-[#fff] py-2 rounded-2xl mt-3">
            <Text className="text-center text-[19px] font-pregular">удалить</Text>
          </TouchableOpacity>
        </View>
      )}

      {shown && (
        <View className="bg-black w-[100vw] h-full absolute top-0 z-10">
          <View className="flex flex-row justify-between items-center w-full absolute right-0 top-8 z-20">
            <Text className="text-white font-pbold text-[20px] text-center w-full absolute top-1">трекер</Text>
            <TouchableOpacity className="absolute right-4 top-1" onPress={() => { setShown(false); }}>
              <Image
                source={icons.close}
                className="w-8 h-8"
                tintColor={'white'}
              />
            </TouchableOpacity>
          </View>

          <LinearGradient colors={colors[current.color]}
            className="relative mx-4 h-[165px] mt-[100px] px-4 py-2 rounded-3xl overflow-hidden mb-4"
          >
            <Text className="text-white font-pbold text-[20px]">{trackTypes[current.type].title} {current.name}</Text>
            <Text className="text-[#ffffff83] font-pregular text-[20px]">{current.done} из {current.goal}</Text>

            {current.type === 1 && (
              <View className="absolute flex flex-row bottom-3 px-4 w-[90vw] justify-between">
                <TouchableOpacity className="w-[38.5%] py-[5px] bg-[#ffffff20] border-[1px] border-[#ffffff25] rounded-xl">
                  <Text className="font-pregular text-white text-center text-[15px]">сорвался</Text>
                </TouchableOpacity>
                <TouchableOpacity className="w-[58.5%] py-[5px] bg-[#ffffff20] border-[1px] border-[#ffffff25] rounded-xl">
                  <Text className="font-pregular text-white text-center text-[15px]">держусь</Text>
                </TouchableOpacity>
              </View>
            )}
          </LinearGradient>

          <TouchableOpacity
            onPress={() => { setShownA(true) }}
            className="py-3 rounded-2xl bg-[#1d0a0a] mx-4">
            <Text className="text-[18px] font-pregular relative text-[#ffb0b0] text-center">удалить трекер</Text>
          </TouchableOpacity>
        </View>
      )}


      <TouchableOpacity onPress={() => {

      }}>
        <Text className="text-[21px] font-pbold relative text-[#fff] text-center mb-4 mt-10">привычки</Text>
      </TouchableOpacity>
      <View className="">
        {trackers.map(track =>
          <TouchableOpacity
            key={track.$id}
            onPress={() => {
              setCurrent(track)
              setShown(true)
            }} // Removed / from the route
            className="relative mx-4 h-[165px] bg-[#161616] rounded-3xl overflow-hidden mb-4"
          >
            <LinearGradient
              colors={colors[track.color]}
              className="h-[165px] bg-[#161616] px-4 py-2 rounded-3xl overflow-hidden mb-4"
            >
              <Text className="text-white font-pbold text-[20px]">{trackTypes[track.type].title} {track.name}</Text>
              <Text className="text-[#ffffff83] font-pregular text-[20px]">{track.done} из {track.goal}</Text>

              {track.type === 1 && (
                <View className="absolute flex flex-row bottom-3 px-4 w-[90vw] justify-between">
                  <TouchableOpacity className="w-[38.5%] py-[5px] bg-[#ffffff20] border-[1px] border-[#ffffff25] rounded-xl">
                    <Text className="font-pregular text-white text-center text-[15px]">сорвался</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="w-[58.5%] py-[5px] bg-[#ffffff20] border-[1px] border-[#ffffff25] rounded-xl">
                    <Text className="font-pregular text-white text-center text-[15px]">держусь</Text>
                  </TouchableOpacity>
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity onPress={() => { router.push('/additional/newTrack') }}>
        <View className="h-[165px] mx-4 bg-[#111] px-4 py-2 rounded-3xl overflow-hidden mb-4">
          <Text className="text-[#838383] text-center font-pbold m-0 bg-[#222] rounded-full mx-auto w-[64px] mt-[24px] h-[64px] text-[40px]">+</Text>
          <Text className="text-[#838383] text-center font-pregular text-[15px] mt-[8px]">создать трекер привычки</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  )
}

export default Trackers;