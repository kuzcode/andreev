import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import Svg, { Polyline } from 'react-native-svg';
import { exercises } from "../constants/exercises";
import { types } from "../constants/types";
import { useState } from "react";
import { icons } from "../constants";

const TrBox = (tr) => {
    console.log('tr: ', tr)
    const [moreShown, setMoreShown] = useState(false);
    const [shareShown, setShareShown] = useState(false);
    const [more, setMore] = useState({});
    const [friends, setFriends] = useState([])

    const formatTime = time => {
        const hours = String(Math.floor(time / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
        const seconds = String(time % 60).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    const formatPace = time => {
        const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
        const seconds = String((time % 60).toFixed());
        return `${minutes}:${seconds}`;
    };

    const formatDate = (dateString) => {
        const now = new Date();
        const date = new Date(dateString);

        // Check if the date is valid
        if (isNaN(date.getTime())) {
            return 'Недопустимая дата'; // Return a message for invalid dates
        }

        const diffInMs = now - date; // Разница во времени в миллисекундах
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60)); // Разница в минутах
        const diffInHours = Math.floor(diffInMinutes / 60); // Разница в часах
        const diffInDays = Math.floor(diffInMinutes / (60 * 24)); // Разница в днях

        if (diffInMinutes < 60) {
            return diffInMinutes === 1 ? '1 минуту назад' : `${diffInMinutes} минут${diffInMinutes % 10 === 1 && diffInMinutes % 100 !== 11 ? 'у' : ''} назад`;
        } else if (diffInHours < 24) {
            return diffInHours === 1 ? '1 час назад' : `${diffInHours} час${diffInHours % 10 === 1 && diffInHours % 100 !== 11 ? 'ов' : 'а'} назад`;
        } else if (diffInDays < 7) {
            return `${diffInDays} д${diffInDays % 10 === 1 && diffInDays % 100 !== 11 ? 'ень' : 'ня'} назад`;
        } else {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Intl.DateTimeFormat('ru-RU', options).format(date);
        }
    };

    const Graph = ({ coordinates }) => {
        const width = 90;
        const height = 90;

        // Извлечение координат x и y
        const xs = coordinates.map(coord => coord.x);
        const ys = coordinates.map(coord => coord.y);

        // Определение максимальных и минимальных значений
        const xMin = Math.min(...xs);
        const xMax = Math.max(...xs);
        const yMin = Math.min(...ys);
        const yMax = Math.max(...ys);

        // Преобразуем координаты в относительные по размеру квадрата
        const points = coordinates.map(coord => {
            const x = ((coord.x - xMin) / (xMax - xMin)) * width; // Масштабируем x
            const y = height - ((coord.y - yMin) / (yMax - yMin)) * height; // Инвертируем и масштабируем y
            return `${x},${y}`;
        }).join(' ');

        return (
            <Svg height={height} width={width}>
                <Polyline
                    points={points}
                    stroke="#3c87ff"
                    strokeWidth="2"
                    fill="none"
                />
            </Svg>
        );
    };

    return (
        <TouchableOpacity
            className="bg-[#111] py-3 rounded-3xl mx-4 mt-4">
            <TouchableOpacity
                className="bg-[#ffffff0f] w-8 h-8 absolute right-4 top-4 flex justify-center items-center rounded-xl z-[1]"
                onPress={() => {
                    setMore(tr);
                    setMoreShown(true);
                }}
            >
                <Image
                    source={icons.dots}
                    className="w-6 h-6"
                    tintColor={'#838383'}
                />
            </TouchableOpacity>

            {moreShown && more === tr && (
                <View className="w-[50vw] bg-[#222] absolute right-4 top-[20px] z-20 py-3 px-4 rounded-2xl">
                    <TouchableOpacity
                        onPress={() => {
                            setMoreShown(false);
                        }}
                    >
                        <Image
                            source={icons.close}
                            tintColor={'#838383'}
                            className="w-6 h-6 absolute right-0"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            setMoreShown(false);
                            setShareShown(true);
                        }}
                        className="mt-6">
                        <Text className="text-white text-[18px] font-pregular">поделиться</Text>
                    </TouchableOpacity>
                    {more.typ === 1 && (<>
                        <View className="h-[2px] w-full bg-[#333] rounded-xl my-2"></View>

                        <TouchableOpacity
                            onPress={() => navigation.navigate('bookmark', { items: tr?.exercises })}
                        >
                            <Text className="text-white text-[18px] font-pregular leading-[21px]">добавить эти упражнения в трекер</Text>
                        </TouchableOpacity></>
                    )}
                </View>
            )}

            {shareShown && more === tr && (
                <View className="w-[70vw] bg-[#222] absolute right-4 top-[20px] z-20 py-3 px-4 rounded-2xl">
                    <TouchableOpacity
                        onPress={() => {
                            setMoreShown(false);
                            setShareShown(false);
                        }}
                    >
                        <Image
                            source={icons.close}
                            tintColor={'#838383'}
                            className="w-6 h-6 absolute right-0"
                        />
                    </TouchableOpacity>

                    <Text className="text-white text-[18px] font-pregular">отправь другу</Text>
                    {friends.length > 0 ? (
                        <View>
                            <ScrollView
                                horizontal={true}
                            >
                                {friends?.map(friend =>
                                    <TouchableOpacity
                                        onPress={() => {
                                            const updatedFriends = friends.map(fr => {
                                                if (fr.userId === friend.userId) { // Замените конкретныйID на идентификатор конкретного друга
                                                    return {
                                                        ...fr,
                                                        added: true, // Обновляем поле added
                                                    };
                                                }
                                                return friend; // Возвращаем объект без изменений
                                            });

                                            const remove = friends.map(fr => {
                                                if (fr.userId === friend.userId) { // Замените конкретныйID на идентификатор конкретного друга
                                                    return {
                                                        ...fr,
                                                        added: false, // Обновляем поле added
                                                    };
                                                }
                                                return friend; // Возвращаем объект без изменений
                                            });

                                            if (friend.added === true) {
                                                setFriends(remove);
                                            }
                                            else {
                                                setFriends(updatedFriends);
                                            }
                                        }}
                                    >
                                        <View className={`${friend.added && 'bg-white'} h-[53px] w-[53px] rounded-full mt-3 flex justify-center items-center`}>
                                            <Image
                                                source={{ uri: friend.imageUrl }}
                                                className={`h-[48px] w-[48px] rounded-full`}
                                            />
                                        </View>
                                        <Text className={`${friend.added ? 'text-[#fff]' : 'text-[#838383]'} text-[13px] font-pregular text-center`}>{friend.name}</Text>
                                    </TouchableOpacity>
                                )}
                            </ScrollView>

                            <TouchableOpacity
                                onPress={() => {
                                    const nfs = friends.filter(item => item.added).map(f => {
                                        return {
                                            sentTo: f.userId,
                                            sentBy: 0,
                                            sentById: user.$id,
                                            title: `${types[tr.typ].title} - тренировка`,
                                            contentId: tr.$id,
                                            type: 5,
                                        };
                                    });

                                    nfs.forEach(form => {
                                        console.log(form);
                                        sendNotification(form);
                                    });
                                }}

                                className={`${friends.some(item => item.added) ? 'bg-white' : 'bg-[#333]'} py-2 rounded-2xl mt-4`}>
                                <Text className={`${friends.some(item => item.added) ? 'text-black' : 'text-[#838383]'} text-center text-[18px] font-pregular`}>отправить</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <Text className="text-[#838383] text-[18px] font-pregular">ты пока никого не добавил :(</Text>
                    )}
                </View>
            )}

            <View className="flex flex-row mx-4">
                <Image
                    source={{ uri: tr.imageUrl }}
                    className="w-[52px] h-[52px] rounded-xl mr-3"
                />
                <View className="flex flex-col">
                    <Text className="text-white mr-4 text-[19px] font-pbold">{tr.name}</Text>
                    <Text className="text-[#838383] mr-4 text-[17px] font-pregular">{types[tr.typ]?.title}, {formatDate(tr.$createdAt)}</Text>
                </View>
            </View>

            {tr.description?.length > 0 && (
                <Text className="text-[#838383] mx-4 text-[17px] mt-4 font-pregular">{tr.description}</Text>
            )}

            <View className="mx-4 h-[2px] bg-[#222] rounded-xl my-4"></View>

            <View className="flex flex-row justify-between mx-4">
                <View className="">
                    <Text className="font-pregular text-[#838383] text-[17px]">время</Text>
                    <Text className="font-pregular text-[#fff] text-[17px]">{formatTime(tr.time)}</Text>
                </View>

                {tr.distance > 0 && (
                    <View>
                        <Text className="font-pregular text-[#838383] text-[17px]">темп</Text>
                        <Text className="font-pregular text-[#fff] text-[17px]">{formatPace(tr.time / tr.distance)}/км</Text>
                    </View>
                )}

                {tr.distance > 0 && (
                    <View>
                        <Text className="font-pregular text-[#838383] text-[17px]">дистанция</Text>
                        <Text className="font-pregular text-[#fff] text-[17px]">{tr.distance}км</Text>
                    </View>
                )}

                {tr.exercises.length > 0 && (
                    <View>
                        <Text className="font-pregular text-[#838383] text-[17px]">упражнений</Text>
                        <Text className="font-pregular text-[#fff] text-[17px]">{tr.exercises.length}</Text>
                    </View>
                )}
            </View>

            {//<View className="mx-4 h-[2px] bg-[#222] rounded-xl mt-4 mb-3"></View>
            }

            {tr.typ === 0 && (
                <View className="mt-4">
                    {tr.coordinates.length > 1 && (
                        <><View className="flex flex-row justify-between">
                            <View>
                                <Text className="font-pregular text-[#838383] text-[17px] mx-4">скорость</Text>
                                <Text className="text-white mx-4 text-[17px] font-pregular">{(tr.distance * 1000 / tr.time).toFixed(1)}км/ч</Text>
                                <Text className="font-pregular text-[#838383] text-[17px] mx-4 mt-4">сложность</Text>
                                <Text className="text-white mx-4 text-[17px] font-pregular">{tr.effort ? tr.effort : '--'}/10</Text>
                            </View>
                            <View>
                                <Text className="font-pregular text-[#838383] text-[17px] mx-4">скорость</Text>
                                <Text className="text-white mx-4 text-[17px] font-pregular">{(tr.distance * 1000 / tr.time).toFixed(1)}км/ч</Text>
                                <Text className="font-pregular text-[#838383] text-[17px] mx-4 mt-4">скорость</Text>
                                <Text className="text-white mx-4 text-[17px] font-pregular">{(tr.distance * 1000 / tr.time).toFixed(1)}км/ч</Text>
                            </View>

                            <View style={{ width: 90, height: 90 }}
                                className="mt-4 mx-4 mb-2 "
                            >
                                <Graph coordinates={tr.coordinates} />
                            </View>
                        </View>
                            {//<View className="w-full h-[200px]">
                                // <WebView
                                // ref={webRef}
                                //style={{ marginTop: -8, marginLeft: -8 }}
                                //  originWhitelist={['*']}
                                //source={{ html: mapTemplate }} />
                                //</View>
                            }
                        </>
                    )}
                </View>
            )}


            {tr.exercises.length > 0 && (
                <>

                    <Text className="text-[#838383] font-pregular mx-4 text-[17px]">упражнения</Text>

                    {tr.exercises.length > 5 ? (
                        <>
                            {tr.exercises.slice(0, 5).map((exe, index) => (
                                <Text className="text-white font-pregular mx-4 mt-1 text-[17px]" key={exe}><Text className="text-[#838383]">{index + 1}.</Text> {exercises[exe].title}</Text>
                            ))}
                            <Text className="text-[#838383] font-pregular mx-4 mt-1 text-[17px]">показать все...</Text>
                        </>
                    ) : (<>
                        {tr.exercises.map((exe, index) => (
                            <Text className="text-white font-pregular mx-4 mt-1 text-[17px]" key={exe}><Text className="text-[#838383]">{index + 1}.</Text> {exercises[exe].title}</Text>
                        ))}</>
                    )}
                </>
            )}

        </TouchableOpacity>
    );
};

export default TrBox;
