import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { createRepeaten, getUserCalendar, deleteOtherProgramms, createPlan, getCalendarPlan } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider';
import { icons } from '../../constants';
import { FormField } from '../../components';
import { exercises } from '../../constants/exercises';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment'; // Для работы с датами
import { router } from 'expo-router';


const Calendar = () => {
    const { user } = useGlobalContext();
    const [calendar, setCalendar] = useState({});
    const [plan, setPlan] = useState([]);
    const [form, setForm] = useState({
        type: 0,
        repeat: 0,
        days: [],
        calendarId: calendar.$id,
        icon: 'contest',
        date: null,
        title: '',
        description: ''
    });
    const [ren, setRen] = useState(calendar.repeaten)
    const [addShown, setAddShown] = useState(false);
    const [planningShown, setPlanningShown] = useState(false);
    const [planShown, setPlanShown] = useState(false);
    const [current, setCurrent] = useState({});
    const navigation = useNavigation();
    const iconsList = [
        'contest',
        'kettlebell',
        'heartbeat',
        'muscles',
        'pullup',
        'run',
        'bike',
        'swim',
    ]

    const getCurrentWeekday = () => {
        const newDate = new Date();
        const day = newDate.getDay(); // 0 (воскресенье) - 6 (суббота)
        return (day === 0) ? 6 : day - 1;
    };

    const week = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
    const fullWeek = ['понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье'];

    const today = moment(); // Текущая дата
    const days = []; // Массив для хранения следующих 100 дней

    // Заполняем массив следующими 100 днями
    for (let i = 0; i < 100; i++) {
        days.push(today.clone().add(i, 'days'));
    }


    const styles = StyleSheet.create({
        dayContainer: {
            alignItems: 'center',
            marginHorizontal: 10,
        },
        monthName: {
            fontSize: 14,
            color: '#838383',
        },
        dayNumber: {
            fontSize: 24,
            fontWeight: 'bold',
        },
    });


    useEffect(() => {
        const fetchCalendar = async () => {
            try {
                const res = await getUserCalendar(user.$id);
                setCalendar(res[0]);
                setForm({ ...form, calendarId: calendar.$id })
                setRen(calendar.repeaten)
            } catch (err) {
            }
        };

        if (user) {
            fetchCalendar();
        }
    }, []);

    useEffect(() => {
        const fetchPlan = async () => {
            try {
                const res = await getCalendarPlan(calendar?.$id);
                setPlan(res)
            } catch (err) {
            }
        };

        if (user) {
            fetchPlan();
        }
    }, [calendar]);

    return (
        <ScrollView className="bg-[#000] w-full h-[100vh]">
            <Text className="text-[22px] font-pbold relative text-[#fff] text-center mt-10 mb-4">календарь</Text>
            {planningShown && (
                <View className="bg-black w-[100vw] h-full absolute top-0 z-10">
                    <TouchableOpacity className="absolute right-[16px] top-0" onPress={() => { setPlanningShown(false) }}>
                        <Image
                            source={icons.close}
                            className="w-8 h-8 top-8 right-0 mr-4 z-10 "
                            tintColor={'white'}
                        />
                    </TouchableOpacity>

                    <Text className="text-[22px] font-pbold relative text-[#fff] text-center mt-[60px] mb-4">добавь план</Text>

                    <FormField
                        title={'название'}
                        value={form.title}
                        handleChangeText={(e) => setForm({ ...form, title: e })}
                        otherStyles={'mx-4'}
                        max={100}
                    />

                    <FormField
                        title={'описание'}
                        value={form.description}
                        handleChangeText={(e) => setForm({ ...form, description: e })}
                        otherStyles={'mx-4 mt-4'}
                        multiline={true}
                        numberOfStrokes={4}
                        max={1000}
                    />

                    <Text className="text-[19px] text-[#838383] font-pbold mt-4 mx-4 mb-1">тип</Text>
                    <View className="mx-4 flex flex-row justify-between">
                        <TouchableOpacity onPress={() => {
                            setForm({ ...form, release: 0 });
                            setForm({ ...form, type: 0 });
                        }} className={`${form.type === 0 ? 'bg-white' : 'bg-[#111]'} py-2 rounded-xl w-[49%]`}>
                            <Text className={`${form.type === 0 ? 'text-black' : 'text-white'} text-center text-[18px] font-pregular`}>разовый план</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { setForm({ ...form, type: 1 }) }} className={`${form.type === 1 ? 'bg-white' : 'bg-[#111]'} py-2 rounded-xl w-[49%]`}>
                            <Text className={`${form.type === 1 ? 'text-black' : 'text-white'} text-center text-[18px] font-pregular`}>повторяющийся</Text>
                        </TouchableOpacity>
                    </View>

                    {form.type === 0 ? (
                        <View>
                            <Text className="text-[19px] text-[#838383] font-pbold mt-4 mx-4 mb-1">выбери дату</Text>

                            <ScrollView
                                className="pl-4"
                                horizontal
                                showsHorizontalScrollIndicator={false}>
                                {days.map((day, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => {
                                            setForm({ ...form, date: day });
                                        }}>
                                        <View className="flex mr-3">
                                            {(day.isSame(today, 'day') || day.date() === 1) && (
                                                <Text className="text-[#838383] font-pregular absolute w-[200px] text-[15px]">
                                                    {day.locale('ru').format('MMMM')}
                                                </Text>
                                            )}
                                            <Text className={`font-pbold mt-6 text-[18px] ${form.date?.format('DD.MM.YYYY') === day?.format('DD.MM.YYYY') ? 'text-primary' : 'text-white'}`}>
                                                {day?.format('D')}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    ) : (
                        <View>
                            <Text className="text-[19px] text-[#838383] font-pbold mt-4 mx-4 mb-1">как часто повторять</Text>

                            <View className="mx-4 flex flex-row flex-wrap">
                                <TouchableOpacity onPress={() => { setForm({ ...form, repeat: 1, days: [0, 1, 2, 3, 4, 5, 6] }) }} className={`${form.repeat === 0 ? 'bg-white' : 'bg-[#111]'} py-2 rounded-xl px-4 mr-2`}>
                                    <Text className={`${form.repeat === 0 ? 'text-black' : 'text-white'} text-center text-[18px] font-pregular`}>каждый день</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { setForm({ ...form, repeat: 1 }) }} className={`${form.repeat === 1 ? 'bg-white' : 'bg-[#111]'} py-2 rounded-xl px-4`}>
                                    <Text className={`${form.repeat === 1 ? 'text-black' : 'text-white'} text-center text-[18px] font-pregular`}>по дням недели</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}


                    {form.repeat === 1 && form.type === 1 && (
                        <View>
                            <Text className="text-[19px] text-[#838383] font-pbold mt-4 mx-4 mb-1">выбери дни</Text>

                            <View className="flex flex-row justify-between mx-4 px-5 bg-[#111] py-3 rounded-3xl mt-2">
                                {week.map((day, index) =>
                                    <TouchableOpacity
                                        key={index} // Не забудьте добавить уникальный ключ для каждой итерации
                                        onPress={() => {
                                            // Проверяем, содержит ли массив days текущий индекс
                                            const newDays = form.days.includes(index)
                                                ? form.days.filter(e => e !== index) // Удаляем индекс
                                                : [...form.days, index]; // Добавляем индекс

                                            setForm({
                                                ...form,
                                                days: newDays
                                            });
                                        }}
                                    >
                                        <Text className={`${form.days.includes(index) ? 'text-primary' : 'text-white'} text-[20px] font-pbold`}>
                                            {day}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    )}


                    <Text className="text-[19px] text-[#838383] font-pbold mt-4 mx-4 mb-1">выбери иконку</Text>
                    <View className="flex flex-row mx-4 flex-wrap">
                        {iconsList.map(icon =>
                            <TouchableOpacity className="mt-2" onPress={() => { setForm({ ...form, icon: icon }) }}>
                                {form.icon === icon ? (
                                    <Image
                                        source={icons[icon]}
                                        tintColor={'#fff'}
                                        className="w-8 h-8 mr-4"
                                    />
                                ) : (
                                    <Image
                                        source={icons[icon]}
                                        tintColor={'#838383'}
                                        className="w-8 h-8 mr-4"
                                    />
                                )}
                            </TouchableOpacity>
                        )}
                    </View>

                    <TouchableOpacity
                        onPress={() => {
                            if (form.type === 0) {
                                createPlan(form)
                            }
                            //createRepeaten(form);
                            setPlanningShown(false);
                        }}
                        className="bg-white py-2 rounded-2xl absolute top-[92vh] right-4 left-4">
                        <Text className="text-center text-[19px] font-pregular">сохранить</Text>
                    </TouchableOpacity>
                </View>
            )}

            {planShown && (
                <View className="bg-black w-[100vw] h-full absolute top-0 z-10">
                    <TouchableOpacity className="absolute right-[16px] top-0" onPress={() => { setPlanShown(false) }}>
                        <Image
                            source={icons.close}
                            className="w-8 h-8 top-8 right-0 mr-4 z-10 "
                            tintColor={'white'}
                        />
                    </TouchableOpacity>

                    <Text className="text-[22px] font-pbold relative text-[#fff] text-center mt-[60px] mb-4">план</Text>

                    {current?.plan?.exercises.length > 0 && (
                        <>
                            <View className="bg-[#111] rounded-3xl mx-4 py-2">
                                <Text className="text-[#838383] font-pregular text-[18px] mx-4">упражнения</Text>
                                {current?.plan?.exercises.map((ex, index) =>
                                    <View className="px-4 my-[2] flex flex-row">
                                        <Text className="text-[#838383] font-pbold text-[18px] mr-2">{index + 1}.</Text>
                                        <Text className="text-white font-pbold text-[18px]">{exercises[ex].title}</Text>
                                    </View>
                                )}
                            </View>

                            <TouchableOpacity
                                onPress={() => navigation.navigate('bookmark', { items: current?.plan?.exercises })} // переходим на экран Bookmark
                                className="bg-white py-3 rounded-2xl mx-4 mt-4">
                                <Text className="font-pregular text-[18px] text-center">добавить упражнения в трекер</Text>
                            </TouchableOpacity>
                        </>
                    )}

                    <TouchableOpacity
                        onPress={() => {
                            deleteOtherProgramms(current);
                            setPlanShown(false);
                        }}
                        className="bg-[#1b0a0a] py-2 mx-4 rounded-2xl absolute top-[90vh] left-0 right-0">
                        <Text className="text-[20px] font-pregular relative text-[#d49393] text-center">удалить план с этого дня</Text>
                    </TouchableOpacity>
                </View>
            )}

            <TouchableOpacity className="bg-[#111] mx-4 px-4 py-3 rounded-3xl">
                <View className="flex flex-row justify-between">
                    {week.map((day, index) =>
                        <View className="flex flex-row">
                            <View className="flex items-center">
                                <Text className={`font-pbold text-[19px] ${index === getCurrentWeekday() ? 'text-primary' : 'text-white'}`}>{day}</Text>

                                {calendar?.days?.length > 0 && Array.isArray(calendar.days[index]) && (
                                    <>
                                        {calendar.days[index].map((plan, planIndex) => (
                                            <View key={planIndex}> {/* It's important to add a key for each element in a list */}
                                                <Image
                                                    source={icons[plan.icon]}
                                                    className="w-6 h-6 mt-2"
                                                    tintColor={'#838383'}
                                                />
                                            </View>
                                        ))}
                                    </>
                                )}
                            </View>
                            {index !== 6 && (
                                <View className="bg-[#222] w-[2] rounded-xl ml-[13]"></View>
                            )}
                        </View>
                    )}
                </View>
            </TouchableOpacity>

            <View>
                {fullWeek.map((a, index) => {
                    const today = new Date();
                    const dayOfWeek = today.getDay();
                    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Если сегодня воскресенье (0), смещаем на -6 дней
                    const mondayDate = new Date(today);
                    mondayDate.setDate(today.getDate() + mondayOffset);

                    const currentDate = mondayDate.getDate() + index;
                    return (
                        <View key={index} className="bg-[#111] mx-4 rounded-3xl py-3 mt-4">
                            <Text className="text-[#838383] text-[19px] font-pbold mx-4">{a}</Text>
                            {calendar?.repeaten?.map((item, i) => (
                                item.weekDays.includes(index) && (
                                    <TouchableOpacity
                                        key={`repeated-${i}`}
                                        onPress={() => {
                                            setCurrent(item);
                                            setPlanShown(true);
                                        }}
                                        className="bg-[#222] mx-4 rounded-xl py-2 mt-2">
                                        <Text className="text-white text-[19px] font-pbold mx-4">{item.plan.title}</Text>
                                        <Text className="text-[#838383] text-[19px] font-pregular mx-4">{item.plan.description}</Text>
                                    </TouchableOpacity>
                                )
                            ))}

                            {plan.map((singlePlan, j) => (
                                (currentDate && singlePlan.date && new Date(singlePlan.date).getDate() === currentDate) && (
                                    <TouchableOpacity
                                        key={`single-${j}`}
                                        onPress={() => {
                                            setCurrent(singlePlan); // устанавливаем текущий план
                                            setPlanShown(true);
                                        }}
                                        className="bg-[#222] mx-4 rounded-xl py-2 mt-2"
                                    >
                                        <Text className="text-white text-[19px] font-pbold mx-4">{singlePlan.title}</Text>
                                        <Text className="text-[#838383] text-[19px] font-pregular mx-4">{singlePlan.description}</Text>
                                    </TouchableOpacity>
                                )
                            ))}
                        </View>
                    );
                })}

            </View>

            {addShown && (
                <View className="bg-[#111] absolute top-[72vh] right-10 px-4 py-3 rounded-3xl">
                    <View className="flex flex-row justify-between">
                        <Text className="text-[#838383] text-[19px] font-pregular text-left">добавить...</Text>
                        <TouchableOpacity onPress={() => { setAddShown(false); }}>
                            <Image
                                className="w-6 h-6"
                                source={icons.close}
                                tintColor={'#838383'}
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={() => { setPlanningShown(true) }} className="border-b-2 border-b-[#333] pb-2 mb-1">
                        <Text className="text-white text-[19px] font-pregular text-right">запланировать</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            router.push('/additional/programms')
                        }}
                        className="mb-1">
                        <Text className="text-white text-[19px] font-pregular text-right">программы тренировок</Text>
                    </TouchableOpacity>
                </View>
            )}

            <TouchableOpacity
                onPress={() => { setAddShown(true) }}
                className="bg-[#fff] absolute top-[90vh] right-8 w-[60px] h-[60px] rounded-full flex justify-center items-center p-0">
                <Text className="font-pbold text-[30px] m-0">+</Text>
            </TouchableOpacity>

            <View className="mt-[40vh]">
            </View>
        </ScrollView>
    );
};

export default Calendar;
