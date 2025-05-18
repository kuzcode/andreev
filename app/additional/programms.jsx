import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Button, Image, ScrollView } from 'react-native';
import { icons } from '../../constants';
import { exercises, datas } from '../../constants/exercises';
import { createRepeaten, getUserCalendar, deleteOtherProgramms } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';
import { router } from 'expo-router';

const Programms = () => {
    const { user } = useGlobalContext();
    const [filtresShown, setFiltresShown] = useState(false);
    const [infoShown, setInfoShown] = useState(false);
    const [programmShown, setProgrammShown] = useState(false);
    const [alShown, setAlShown] = useState(false);
    const [currentpr, setCurrentpr] = useState({});
    const [calendar, setCalendar] = useState({});
    const [often, setOften] = useState(0);
    const [minOften, setMinOften] = useState(0);
    const [maxOften, setMaxOften] = useState(999);

    useEffect(() => {
        const fetchCalendar = async () => {
            try {
                const res = await getUserCalendar(user.$id);
                setCalendar(res[0]);
            } catch (err) {
            }
        };

        fetchCalendar();
    }, [user]);


    const saveFinally = () => {
        for (var i = 0; i < currentpr.days.length; i++) {
            var form = {
                title: currentpr.days[i].title,
                exercises: currentpr.days[i].ex.map(exercise => exercise.ind),
                description: currentpr.name,
                calendarId: calendar?.$id,
                icon: currentpr.days[i].icon,
                days: [currentpr.days[i].day - 1],
                repeaten: 1,
                type: 10,
            }
            createRepeaten(form);
        }
    }


    const deleteAndSave = async () => {
        var filtered = calendar.repeaten.filter(item => item.type === 10);
        for (var i = 0; i < filtered.length; i++) {
            deleteOtherProgramms(filtered[i])
        }

        for (var i = 0; i < currentpr.days.length; i++) {
            var form = {
                title: currentpr.days[i].title,
                exercises: currentpr.days[i].ex.map(exercise => exercise.ind),
                description: currentpr.name,
                calendarId: calendar?.$id,
                icon: currentpr.days[i].icon,
                days: [currentpr.days[i].day - 1],
                repeaten: 1,
                type: 10,
            }
            createRepeaten(form);
        }
    }

    const setProgramm = () => {
        if (calendar.repeaten?.some(obj => obj.type === 10)) {
            setAlShown(true);
        }
        else {
            saveFinally()
        }
    }

    const handleprog = (item) => {
        setCurrentpr(item)
        setProgrammShown(true)
    }

    return (<>
        {filtresShown && (
            <View className="bg-[#000] w-full h-full absolute top-0 left-0 z-20">
                <View className="flex flex-row items-center mt-10 justify-center">
                    <Text className="text-white font-pbold text-[19px] text-center">фильтры</Text>
                    <TouchableOpacity
                        onPress={() => { setFiltresShown(false) }}
                        className="absolute right-4">
                        <Image
                            source={icons.close}
                            className="w-8 h-8"
                            tintColor={'#fff'}
                        />
                    </TouchableOpacity>
                </View>

                <Text className='text-[#fff] font-pbold text-[19px] text-left mx-4 mt-4 leading-[21px] mb-2'>частота</Text>
                <View className="mx-4 flex flex-row justify-between">
                    <TouchableOpacity onPress={() => { setMinOften(0); setMaxOften(999); setOften(0) }} className={`${often === 0 ? 'bg-white' : 'bg-[#111]'} w-[32%] rounded-2xl py-2`}>
                        <Text className={`${often === 0 ? 'text-black' : 'text-[#fff]'} font-pregular text-[17px] text-center mx-4 leading-[21px]`}>все</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setMinOften(0); setMaxOften(3); setOften(1) }} className={`${often === 1 ? 'bg-white' : 'bg-[#111]'} w-[32%] rounded-2xl py-2`}>
                        <Text className={`${often === 1 ? 'text-black' : 'text-[#fff]'} font-pregular text-[17px] text-center mx-4 leading-[21px]`}>редко</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setMinOften(2); setMaxOften(7); setOften(2) }} className={`${often === 2 ? 'bg-white' : 'bg-[#111]'} w-[32%] rounded-2xl py-2`}>
                        <Text className={`${often === 2 ? 'text-black' : 'text-[#fff]'} font-pregular text-[17px] text-center mx-4 leading-[21px]`}>часто</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )}

        {alShown && (
            <View className="bg-[#222] absolute z-30 top-[30vh] mx-8 px-4 py-3 rounded-3xl">
                <Text className="text-white text-[20px] font-pbold">у тебя уже есть программы тренировок в календаре</Text>
                <TouchableOpacity onPress={() => {
                    saveFinally();
                    setAlShown(false);
                    setProgrammShown(false);
                    router.push('/home')
                }} className="bg-[#fff] py-2 rounded-2xl mt-3">
                    <Text className="text-center text-[19px] font-pregular mx-4">оставить остальные и добавить эту</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    deleteAndSave();
                    setAlShown(false);
                    setProgrammShown(false);
                    router.push('/home')
                }} className="bg-[#333] py-2 rounded-2xl mt-2">
                    <Text className="text-center text-[19px] font-pregular text-white mx-4">удалить остальные и добавить эту</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    setAlShown(false);
                    setProgrammShown(false);
                }} className="bg-[#333] py-2 rounded-2xl mt-2">
                    <Text className="text-center text-[19px] font-pregular text-white">отмена</Text>
                </TouchableOpacity>
            </View>
        )}

        {infoShown && (
            <View className="bg-[#000] w-full h-full absolute top-0 left-0 z-20">
                <View className="flex flex-row items-center mt-10 justify-center">
                    <Text className="text-white font-pbold text-[19px] text-center">информация</Text>
                    <TouchableOpacity
                        onPress={() => { setInfoShown(false) }}
                        className="absolute right-4">
                        <Image
                            source={icons.close}
                            className="w-8 h-8"
                            tintColor={'#fff'}
                        />
                    </TouchableOpacity>
                </View>

                <Text className="text-white font-pbold text-[19px] text-left mt-4 mx-4">сплит — это</Text>
                <Text className="text-[#838383] font-pregular text-[18px] text-left mx-4 mt-2 leading-[21px]">методика тренировок, которая делит тренировки определённых частей тела на разные дни. пока, например, ноги отдыхают, вы тренируете спину</Text>

                <Text className="text-white font-pbold text-[19px] text-left mt-4 mx-4">фуллбоди — это</Text>
                <Text className="text-[#838383] font-pregular text-[18px] text-left mx-4 mt-2 leading-[21px]">методика тренировок, при которой вы тренируете все группы мышц за одну тренировку</Text>

                <Text className="text-white font-pbold text-[19px] text-left mt-4 mx-4">программы тренировок</Text>
                <Text className="text-[#838383] font-pregular text-[18px] text-left mx-4 mt-2 leading-[21px]">составляются профиссианальными атлетами для новичков, это не медицинские указания. при особенностях организма стоит проконсултироваться с врачом</Text>
            </View>
        )}

        {programmShown && (
            <ScrollView className="bg-[#000] w-full h-full absolute top-0 left-0 z-20 px-4">
                <View className="flex flex-row items-center mt-10 justify-center">
                    <Text className="text-white font-pbold text-[19px] text-center mx-[30px]">{currentpr.name}</Text>
                    <TouchableOpacity
                        onPress={() => { setProgrammShown(false) }}
                        className="absolute right-0">
                        <Image
                            source={icons.close}
                            className="w-8 h-8"
                            tintColor={'#fff'}
                        />
                    </TouchableOpacity>
                </View>

                <Text className="text-[#838383] font-pregular text-[18px] mt-4">{currentpr.description}</Text>
                <Text className="text-[#75bff8] font-pregular text-[18px]">{currentpr.type}</Text>
                <Text className="text-[#838383] font-pregular text-[18px] mb-4">первое число — подходы, второе — повторения</Text>

                {currentpr.exType === 0 && (
                    currentpr.days.map(day =>
                        <View className="bg-[#111] rounded-3xl p-4 pt-2 mt-2">
                            <Text className="text-white font-pbold text-[19px] mt-0">{day.title}</Text>

                            {day.ex.map(exe =>
                                <Text className="text-[#838383] font-pregular text-[18px] mt-1">{exercises[exe.ind].title}, {exe.aReps}×{exe.bReps}</Text>
                            )}
                        </View>
                    ))}

                <View className="mt-[13vh]"></View>

                <TouchableOpacity
                    onPress={() => {
                        setProgramm();
                        router.push('/home')
                    }}
                    className="bg-white pb-3 pt-1 rounded-2xl absolute bottom-10 left-4 right-4">
                    <Text className="text-black font-pregular text-[20px] mt-1 text-center">применить</Text>
                </TouchableOpacity>
            </ScrollView>
        )}


        <ScrollView className="bg-[#000] h-full w-full">
            <Text className="text-white font-pbold text-[19px] text-center mt-10">программы тренировок</Text>

            <View className="flex flex-row w-full justify-between px-4 mt-4">
                <TouchableOpacity onPress={() => { setFiltresShown(true) }} className="bg-[#111] rounded-xl py-2 w-[48%]">
                    <Text className="text-[#838383] font-pregular text-[18px] text-center">фильтры</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { setInfoShown(true) }} className="bg-[#111] rounded-xl py-2 w-[48%]">
                    <Text className="text-[#838383] font-pregular text-[18px] text-center">информация</Text>
                </TouchableOpacity>
            </View>

            {datas.map(item =>
                <View>
                    {item.days.length < maxOften && item.days.length > minOften && (
                        <TouchableOpacity className="bg-[#111] mx-4 rounded-3xl px-4 py-4 mt-4"
                            onPress={() => { handleprog(item) }}
                        >
                            <View className="flex flex-row w-[100%] justify-between">
                                <Image
                                    source={{ uri: item.img }}
                                    className="w-[80px] h-[80px] rounded-xl mr-2 absolute"
                                />
                                <Text className="text-white font-pbold text-[20px] leading-[24px] text-right w-full">{item.name}</Text>
                            </View>
                            <Text className="text-[#838383] font-pregular text-[18px] text-right ml-[90px]">{item.desc}, <Text className="text-[#75bff8]">{item.type}</Text></Text>

                        </TouchableOpacity>
                    )}
                </View>
            )}
        </ScrollView></>
    )
}

export default Programms;