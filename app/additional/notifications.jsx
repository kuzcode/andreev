import { useState, useEffect, useRef } from "react";
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
import { getUserNotifications, readAllNotifs, getCommunityById, getUserById, addToFriends, deleteNotification, getCompleted, getRoute } from "../../lib/appwrite";
import { CustomButton, FormField } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import useAppwrite from "../../lib/useAppwrite";
import { useNavigation } from '@react-navigation/native';
import { exercises } from "../../constants/exercises";
import { WebView } from 'react-native-webview';

const Create = () => {
    const { user } = useGlobalContext();
    const [notifications, setNotifications] = useState([])
    const [loaded, setLoaded] = useState(false)
    const webRef = useRef(null);


    const formatDate = (dateString) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffInMs = now - date; // Разница во времени в миллисекундах
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60)); // Разница в минутах
        const diffInHours = Math.floor(diffInMinutes / 60); // Разница в часах
        const diffInDays = Math.floor(diffInMinutes / (60 * 24)); // Разница в днях
        const diffInMonths = Math.floor(diffInDays / 30); // Разница в месяцах

        if (diffInMinutes < 60) {
            return diffInMinutes === 1 ? '1 мин назад' : `${diffInMinutes} мин${diffInMinutes % 10 === 1 && diffInMinutes % 100 !== 11 ? '' : ''} назад`;
        } else if (diffInHours < 24) {
            return diffInHours === 1 ? '1ч назад' : `${diffInHours}ч${diffInHours % 10 === 1 && diffInHours % 100 !== 11 ? '' : ''} назад`;
        } else if (diffInDays < 7) {
            return `${diffInDays}д${diffInDays % 10 === 1 && diffInDays % 100 !== 11 ? '' : ''} назад`;
        } else {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Intl.DateTimeFormat('ru-RU', options).format(date);
        }
    };

    const getName = async (id, sentBy) => {
        if (sentBy === 0) {
            const recieved = await getUserById(id)
            var res = recieved.documents[0]
            return res
        }
        else if (sentBy === 1) {
            var res = await getCommunityById(id)
            return res
        }
    }

    useEffect(() => {
        async function fetchNotifs() {
            try {
                const got = await getUserNotifications(user.$id);
                setNotifications(got);

                // Получаем уведомления с именами
                const notificationsWithNames = await Promise.all(got.map(async (notification) => {
                    const res = await getName(notification.sentById, notification.sentBy); // Получаем имя по sentById
                    return {
                        ...notification, // Копируем остальные поля уведомления
                        name: res.name, // Добавляем поле name
                        imageUrl: res.imageUrl // Добавляем поле name
                    };
                }));

                console.log('with names: ', notificationsWithNames)

                setNotifications(notificationsWithNames);

                const notificationWithType5 = notificationsWithNames.find(notification => notification.type === 5);
                if (notificationWithType5) {
                    const contentId = notificationWithType5.contentId; // Получаем contentId
                    const completedData = await getCompleted(contentId); // Получаем данные через getCompleted

                    //console.log(completedData.documents[0]?.exercises)

                    // Обновляем соответствующий объект уведомления
                    setNotifications(prevNotifications =>
                        prevNotifications.map(notification =>
                            notification.$id === notificationWithType5.$id
                                ? { ...notification, exercises: completedData.documents[0]?.exercises, description: completedData.documents[0].description }
                                : notification
                        )
                    );
                }

                const notificationWithType7 = notificationsWithNames.find(notification => notification.type === 7);
                if (notificationWithType7) {
                    const contentId = notificationWithType7.contentId; // Получаем contentId
                    const completedData = await getRoute(contentId); // Получаем данные через getCompleted

                    //console.log(completedData.documents[0]?.exercises)

                    // Обновляем соответствующий объект уведомления
                    setNotifications(prevNotifications =>
                        prevNotifications.map(notification =>
                            notification.$id === notificationWithType7.$id
                                ? { ...notification, description: completedData.documents[0]?.description }
                                : notification
                        )
                    );
                }

                // Помечаем все уведомления как прочитанные
                readAllNotifs(user.$id);
            } catch (error) {
                console.error('Error fetching notifications: ', error);
            }
        }

        fetchNotifs();
    }, []);

    console.log(notifications)

    useEffect(() => {
        async function fetchWeb() {
            try {
                notifications.forEach(async n => {
                    if (n.type === 7) {
                        const r = await getRoute(n.contentId);
                        webRef.current.injectJavaScript(`flyToUserLocation({"latitude": ${r.documents[0].coord[0].x}, "longitude": ${r.documents[0].coord[0].y}});`);

                        var routesToDraw = [];  // Создаем массив для маршрутов, которые будут отрисованы
                        r.documents[0].coord.map(c => {
                            routesToDraw.push([c.x, c.y])
                        });
                        webRef.current.injectJavaScript(`drawRoutes(${JSON.stringify([routesToDraw])});`);
                    }
                });
            } catch (error) {
                console.error('Error fetching notifications: ', error);
            }
        }

        fetchWeb(); // вызывем асинхронную функцию
    }, [notifications, loaded]);

    const Notif = (item) => {
        return (
            <View className="bg-[#111] px-4 py-3 rounded-3xl mt-4">
                <View className="flex flex-row">
                    <Image
                        source={{ uri: item?.imageUrl }}
                        className="w-[52px] h-[52px] rounded-xl mr-3"
                    />
                    <View className="flex flex-col">
                        <Text className="text-white mr-4 text-[19px] font-pbold">{item?.name}</Text>
                        <Text className="text-[#838383] mr-4 text-[17px] font-pregular">отправил тебе</Text>
                    </View>
                </View>

                <View className="h-[2px] bg-[#222] rounded-xl my-4"></View>

                <Text className="text-white text-[20px] font-pbold">{item.title}</Text>
                {item.type === 0 && (
                    <Text className="text-[#838383] text-[18px] font-pregular">{item.content}</Text>
                )}

                {item.type === 1 && (
                    <TouchableOpacity>
                        <Text className="text-[#838383] text-[18px] font-pregular mt-4">пользователь <Text className="text-primary">{item.name}</Text> отправил заявку в друзья</Text>

                        <View className="flex flex-row justify-between mt-4 mb-2">
                            <TouchableOpacity
                                onPress={() => {
                                    deleteNotification(item.$id);
                                    router.push('/home')
                                }}
                                className="bg-[#222] py-2 rounded-xl w-[48%]">
                                <Text className="text-[18px] text-white font-pregular text-center">отклонить</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    addToFriends(user.$id, item.sentById);
                                    deleteNotification(item.$id)
                                    router.push('/home')
                                }}
                                className="bg-white  py-2 rounded-xl w-[48%]">
                                <Text className="text-[18px] font-pregular text-center">принять</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                )}


                {item.type === 5 && (
                    <View>
                        <Text className="text-[#838383] mt-4 text-[17px] font-pregular">{item?.description}</Text>

                        {item?.exercises?.length > 0 && (
                            <>
                                <Text className="text-[#838383] font-pregular text-[17px]">упражнения</Text>

                                {item?.exercises?.length > 5 ? (
                                    <>
                                        {item?.exercises?.slice(0, 5).map((exe, index) => (
                                            <Text className="text-white font-pregular mr-4 mt-1 text-[17px]" key={exe}><Text className="text-[#838383]">{index + 1}.</Text> {exercises[exe]?.title}</Text>
                                        ))}
                                        <Text className="text-[#838383] font-pregular mt-1 text-[17px]">показать все...</Text>
                                    </>
                                ) : (<>
                                    {item?.exercises?.map((exe, index) => (
                                        <Text className="text-white font-pregular mt-1 text-[17px]" key={exe}><Text className="text-[#838383]">{index + 1}.</Text> {exercises[exe]?.title}</Text>
                                    ))}</>
                                )}
                            </>
                        )}
                    </View>
                )}

                {item.type === 7 && (
                    <View className="mt-4">
                        <WebView
                            ref={webRef}
                            style={{ marginTop: -8, marginLeft: -8 }}
                            originWhitelist={['*']}
                            source={{ html: mapTemplate }}
                            className="h-[200px]"
                            onLoadEnd={() => {
                                setLoaded(true);
                            }}
                        />

                        <Text className="text-[#838383] font-pregular mt-4 text-[17px]">{item.description}</Text>
                    </View>
                )}

                {item.sentBy === 1 && (
                    <TouchableOpacity className="border-t-2 border-t-[#222] mt-2">
                        <Text className="text-[#838383] text-[18px] font-pregular">от сообщества <Text className="text-primary">{item.name}</Text></Text>
                    </TouchableOpacity>
                )}
            </View>
        )
    }

    return (
        <ScrollView className="bg-[#000] pt-10 px-4">
            <Text className="text-white font-pbold text-[21px]">уведомления</Text>

            {notifications.length === 0 && (
                <Text className="text-[#838383] text-[18px] font-pregular mt-4 text-center">пока ничего нет</Text>
            )}

            {notifications.filter(item => !item.isRead).length > 0 && (
                <View>
                    <Text className="text-[#838383] text-[18px] font-pregular mt-4">непрочитанные</Text>
                    {notifications.filter(item => item.isRead).map(item =>
                        Notif(item)
                    )}
                </View>
            )}


            {notifications.filter(item => item.isRead).length > 0 && (
                <View>
                    <Text className="text-[#838383] text-[18px] font-pregular mt-4">старые</Text>
                    {notifications.filter(item => item.isRead).map(item =>
                        Notif(item)
                    )}
                </View>
            )}

            <View className="mt-[50vh]"></View>
        </ScrollView>
    )
}

export default Create;
