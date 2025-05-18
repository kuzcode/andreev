import { View, Text, Image, TouchableOpacity, ScrollView, RefreshControl, TextInput, StyleSheet, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect, useRef } from "react";
import useAppwrite from "../../lib/useAppwrite";
import { getUserCompleted, getWeeklyReport, getUserById, sendNotif, getAwards, getUserAwards, getUserFriends, getAwardsByIds, deleteFriend, getUserPosts } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { rank, types } from "../../constants/types";
import { icons } from "../../constants";
import { LineChart } from 'react-native-chart-kit';
import { exercises } from "../../constants/exercises";
import { FormField } from "../../components";
import { useNavigation, useRoute } from '@react-navigation/native';
import { router } from 'expo-router';

const OtherProfile = () => {
  const [profile, setProfile] = useState({})
  const [sent, setSent] = useState(false)

  const route = useRoute();

  useEffect(() => {
    if (route.params) {
      setProfile(route.params);
    }
  }, [route.params]);


  const global = useGlobalContext();
  const [user, setUser] = useState(global.user);
  const [completed, setCompleted] = useState([]);
  const [tab, setTab] = useState(0);
  const [awards, setAwards] = useState([]);
  const [posts, setPosts] = useState([]);
  const [combinedList, setCombinedList] = useState([]);
  const [friends, setFriends] = useState([]);
  const [userAwards, setUserAwards] = useState([]);
  const [caption, setCaption] = useState('');
  const [tosave, setTosave] = useState(0);
  const [detail, setDetail] = useState({});
  const [detailShown, setDetailShown] = useState(false);
  const [alShown, setAlShown] = useState(false);
  const ref = useRef(null);

  const [weekly, setWeekly] = useState({
    weight: [
      {
        val: 0,
      }
    ]
  })

  useEffect(() => {
    async function fetchWeeklyReport() {
      try {
        const gotWeekly = await getWeeklyReport({
          userId: profile?.$id,
          weight: 0
        });
        setTosave(gotWeekly.weight[gotWeekly.weight.length - 1].val)
        setWeekly(gotWeekly)
      } catch (error) {
        console.error('Error fetching weekly report: ', error);
      }
    }

    setForm({
      weightList: weekly.weight,
      weight: weekly.weight[weekly.weight.length - 1]?.val,
      height: metrics.height,
      changes: {
        weight: (weekly.weight[weekly.weight.length - 1]?.val - weekly.weight[0]?.val).toFixed(1),
        height: (weight[(weight.length - 1)] - weight[0]).toFixed(1),
      }
    })
    fetchWeeklyReport();
  }, [profile])

  useEffect(() => {
    async function fetchAwards() {
      try {
        const got = await getAwards();
        setAwards(got)
      } catch (error) {
        console.error('Error fetching awards: ', error);
      }
    }

    fetchAwards();
  }, [profile])

  useEffect(() => {
    async function fetchUserAwards() {
      try {
        const got = await getUserAwards(profile.$id);
        const awardsIds = got[0].awards; // Предполагаем, что 'awards' это массив ID наград
        // Теперь получаем награды по их ID
        const awardsData = await getAwardsByIds(awardsIds);

        // Объединяем данные наград с полученными данными по ID
        const awardsWithDetails = awardsData.map(award => {
          return {
            ...award, // добавляем поля из award
            name: award.name,
            price: award.imageUrl
          };
        });

        setUserAwards(awardsWithDetails);
      } catch (error) {
        console.error('Error fetching user awards: ', error);
      }
    }

    fetchUserAwards();
  }, [profile]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const got = await getUserPosts(profile.$id);
        setPosts(got);
      } catch (error) {
        console.error('Error fetching user posts: ', error);
      }
    };

    fetchUserPosts();
  }, [profile]);

  useEffect(() => {
    const fetchCompletedDocuments = async () => {
      try {
        const completedData = await getUserCompleted(profile.$id);
        setCompleted(completedData);
      } catch (error) {
        console.error('Error fetching completed documents:', error);
      }
    };

    fetchCompletedDocuments();
  }, [profile]);

  useEffect(() => {
    const combined = [...posts, ...completed];
    combined.sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt));
    setCombinedList(combined);
  }, [posts, completed]);


  useEffect(() => {
    async function fetchFriends() {
      try {
        const got = await getUserFriends(profile.$id);

        setFriends(got[0].friends)
      } catch (error) {
        console.error('Error fetching user friends: ', error);
      }
    }

    fetchFriends();
  }, [profile])

  const [trainings, setTrainings] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDays, setSelectedDays] = useState(null);

  const handleSelectDays = (days) => {
    setSelectedDays(days);
    setModalVisible(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    const reloadedUser = await getUserById(profile.$id);
    setProfile(reloadedUser.documents[0])
    const completedData = await getUserCompleted(profile.$id);
    setCompleted(completedData); // Устанавливаем данные в состояние
    setRefreshing(false);
  };

  const metrics = {
    weight: 74,
    height: 186,
  }

  const calculateTotalTime = () => {
    return completed.reduce((total, item) => {
      return total + item.time;
    }, 0);
  };

  const formatDate = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now - date; // Разница во времени в миллисекундах
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60)); // Разница в минутах
    const diffInHours = Math.floor(diffInMinutes / 60); // Разница в часах
    const diffInDays = Math.floor(diffInMinutes / (60 * 24)); // Разница в днях
    const diffInMonths = Math.floor(diffInDays / 30); // Разница в месяцах

    if (diffInMinutes < 60) {
      return `${diffInMinutes}мин назад`;
    } else if (diffInHours < 24) {
      return `${diffInHours}ч назад`;
    } else if (diffInDays < 7) {
      return `${diffInDays}дн назад`;
    } else {
      const options = { month: 'long', day: 'numeric' };
      const formattedDate = new Intl.DateTimeFormat('ru-RU', options).format(date);
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${formattedDate}, ${hours}:${minutes}`;
    }
  };

  const calculatePace = (time, distance) => {
    if (distance === 0) return "--:--";

    const paceInMinutes = time / 60 / distance;
    const minutes = Math.floor(paceInMinutes);
    const seconds = Math.round((paceInMinutes - minutes) * 60);

    if (time / 60 / distance < 200) {
      return `${minutes}:${String(seconds).padStart(2, '0')}`;
    }
    else {
      return "--:--";
    }
  };

  const styles = StyleSheet.create({
    text: {
      fontSize: 24,
      marginBottom: 10,
    },
    outerBlock: {
      height: 30,
      backgroundColor: '#00000010',
      borderRadius: 10,
      overflow: 'hidden',
    },
    innerBlock: {
      height: '100%',
      backgroundColor: '#fff',
    }
  });

  const getFriendsText = (count) => {
    if (count % 10 === 1 && count % 100 !== 11) {
      return `${count} друг`;
    } else if ((count % 10 >= 2 && count % 10 <= 4) && (count % 100 < 12 || count % 100 > 14)) {
      return `${count} друга`;
    } else {
      return `${count} друзей`;
    }
  };

  const [weight, setWeight] = useState([70]); // Ваш список чисел

  const [form, setForm] = useState({
    weightList: weekly.weight,
    weight: weekly.weight[weekly.weight.length - 1]?.val,
    height: metrics.height,
    changes: {
      weight: (weekly.weight[weekly.weight.length - 1]?.val - weekly.weight[0]?.val).toFixed(1),
      height: (weight[(weight.length - 1)] - weight[0]).toFixed(1),
    }
  })

  useEffect(() => {
    if (completed[0]) {
      setTrainings(completed)
    }
  }, [completed]);

  const formatTime = time => {
    const hours = String(Math.floor(time / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const getRoundedNumbers = (weight) => {
    const min = Math.floor(Math.min(...weight) / 10) * 10;
    const max = Math.ceil(Math.max(...weight) / 10) * 10;
    const numbers = [];

    for (let i = min; i <= max; i += 5) {
      numbers.push(i);
    }

    return numbers;
  };

  const roundedNumbers = getRoundedNumbers(weight);

  const settings = () => {
    router.push("/additional/settings");
  };

  const percentage = (profile?.exp / rank[(profile?.rank - 1)]?.exp) * 100; // Значение от 1 до 100
  const blockWidth = percentage + '%';

  const filteredList = types.filter(item => profile?.sports?.includes(item.key));

  return (
    <ScrollView className="bg-[#000] h-full">
      {alShown && (
        <View className="bg-[#222] absolute z-20 top-[25vh] left-8 right-8 px-4 py-3 rounded-3xl">
          <Text className="text-white text-[20px] font-pbold">ты уверен, что хочешь удалить друга?</Text>
          <Text className="text-[#838383] text-[18px] font-pregular">ты сможешь отправить заявку ещё раз</Text>
          <TouchableOpacity onPress={() => { setAlShown(false) }} className="bg-[#333] py-2 rounded-2xl mt-2">
            <Text className="text-center text-[19px] font-pregular text-white">не удалять</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            deleteFriend(user.$id, profile.$id);
            setAlShown(false);
          }} className="bg-[#fff] py-2 rounded-2xl mt-3">
            <Text className="text-center text-[19px] font-pregular">удалить</Text>
          </TouchableOpacity>
        </View>
      )}

      <View className="w-[100vw] flex justify-center items-center mt-[100px]">
        {profile.imageUrl ? (
          <Image
            source={{ uri: profile?.imageUrl }}
            className="w-[40vw] h-[40vw] rounded-3xl bg-[#111] mb-2"
            resizeMode="cover"
          />
        ) : (
          <Image
            source={icons.avatar}
            className="w-[40vw] h-[40vw] rounded-3xl bg-[#111] mb-2"
          />
        )}

        <View className="flex flex-row">
          <Text className="text-[24px] font-pbold text-white">{profile.name}</Text>
        </View>
        <Text className="text-lg font-psemibold text-[#838383]">@{profile.username}</Text>
        <Text className="text-lg font-pregular text-[#838383] text-center mx-10">{profile.bio}</Text>
      </View>

      {friends.includes(user.$id) ? (
        <TouchableOpacity className="bg-[#111] mx-4 rounded-xl py-2 my-4" onPress={() => { setAlShown(true) }}>
          <Text className="text-[#838383] font-pregular text-center text-[19px]">удалить из друзей</Text>
        </TouchableOpacity>
      ) : (
        <View>
          {sent ? (
            <TouchableOpacity className="bg-[#111] mx-4 rounded-xl py-2 my-4" onPress={() => { alert('ты уже отправил заявку') }}>
              <Text className="text-[#838383] font-pregular text-center text-[19px]">заявка отправлена</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity className="bg-white mx-4 rounded-xl py-2 my-4" onPress={() => {
              sendNotif(
                {
                  sendTo: profile.$id,
                  userId: user.$id,
                }
              )
              setSent(true);
            }}>
              <Text className="text-black font-pregular text-center text-[19px]">заявка в друзья</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <View className="flex flex-row mx-4 mb-4">
        <TouchableOpacity
          className=""
          onPress={() => { setTab(0) }}
        >
          <Text className={`${tab === 0 ? `text-white` : `text-[#838383]`} text-[20px] font-pbold mr-4`}>лента</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className=""
          onPress={() => { setTab(1) }}
        >
          <Text className={`${tab === 1 ? `text-white` : `text-[#838383]`} text-[20px] font-pbold`}>данные</Text>
        </TouchableOpacity>
      </View>

      {tab === 0 && (
        <View>
          {combinedList.length > 0 ? (
            <View>
              {combinedList.map(item => (
                item.caption ? (
                  <TouchableOpacity
                    onPress={() => {
                      setPost(item);
                      setPostShown(true);
                      ref.current.scrollTo({ y: 0, animated: true });
                    }}
                    className="bg-[#111] mx-4 py-3 rounded-3xl px-4 mt-4">
                    <View className="flex flex-row">
                      <Image
                        source={{ uri: profile.imageUrl }}
                        className="w-[52px] h-[52px] rounded-xl mr-3"
                      />
                      <View className="flex flex-col">
                        <Text className="text-white mr-4 text-[19px] font-pbold">{profile.name}</Text>
                        <Text className="text-[#838383] mr-4 text-[17px] font-pregular">{formatDate(item.$createdAt)}</Text>
                      </View>
                    </View>


                    <View className="h-[2px] bg-[#222] rounded-xl my-4"></View>
                    <Text className="text-[18px] font-pregular text-white">{item.caption}</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity key={item.id} onPress={() => {
                    setDetail(item);
                    setDetailShown(true);
                    ref.current.scrollTo({ y: 0, animated: true });
                  }} className="bg-[#111] py-3 rounded-3xl mx-4 mt-4">
                    <View className="flex flex-row mx-4">
                      <Image
                        source={{ uri: profile.imageUrl }}
                        className="w-[52px] h-[52px] rounded-xl mr-3"
                      />
                      <View className="flex flex-col">
                        <Text className="text-white mr-4 text-[19px] font-pbold">{profile.name}</Text>
                        <Text className="text-[#838383] mr-4 text-[17px] font-pregular">{types[item.typ]?.title}, {formatDate(item.$createdAt)}</Text>
                      </View>
                    </View>

                    {item.description?.length > 0 && (
                      <Text className="text-[#838383] mx-4 text-[17px] mt-4 font-pregular">{item.description}</Text>
                    )}

                    <View className="mx-4 h-[2px] bg-[#222] rounded-xl my-4"></View>

                    <View className="flex flex-row justify-between mx-4">
                      <View className="">
                        <Text className="font-pregular text-[#838383] text-[17px]">время</Text>
                        <Text className="font-pregular text-[#fff] text-[17px]">{formatTime(item.time)}</Text>
                      </View>

                      {item.distance > 0 && (
                        <View>
                          <Text className="font-pregular text-[#838383] text-[17px]">темп</Text>
                          <Text className="font-pregular text-[#fff] text-[17px]">{calculatePace(item.time, item.distance)}/км</Text>
                        </View>
                      )}

                      {item.distance > 0 && (
                        <View>
                          <Text className="font-pregular text-[#838383] text-[17px]">дистанция</Text>
                          <Text className="font-pregular text-[#fff] text-[17px]">{item.distance}км</Text>
                        </View>
                      )}

                      {item.exercises.length > 0 && (
                        <View>
                          <Text className="font-pregular text-[#838383] text-[17px]">упражнений</Text>
                          <Text className="font-pregular text-[#fff] text-[17px]">{item.exercises.length}</Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                )
              ))}
            </View>
          ) : (
            <View>
              <Text className="font-pbold text-white text-[20px] text-center mx-4 mt-4">в ленте пока ничего нет</Text>
            </View>
          )}
        </View>
      )}

      {tab === 1 && (
        <View>
          <View className="mb-4 mx-4">
            <TouchableOpacity
              onPress={() => { router.push('/additional/levels') }}
              style={{ backgroundColor: rank[(profile.rank - 1)].color }}
              className="rounded-3xl py-3"
            >
              <Text className={`${rank[(profile.rank - 1)].text === 'white' ? `text-white` : `text-black`} font-pbold mx-4 text-[20px]`}>{profile.rank} уровень</Text>
              <Text className={`${rank[(profile.rank - 1)].text === 'white' ? `text-white` : `text-black`} font-pregular mx-4 text-[18px]`}>{rank[(profile.rank - 1)].name}</Text>

              <View className="mx-4 mt-4" style={styles.outerBlock}>
                <View style={[styles.innerBlock, { width: blockWidth }]} />
                <Text className="left-0 bottom-[3px] text-[18px] w-full text-center absolute font-pregular text-[#000]">{profile?.exp}/{rank[(profile?.rank - 1)]?.exp}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity className="bg-[#111] mx-4 mb-[-16px] px-4 py-3 rounded-t-3xl">
            <Text className="text-[#838383] font-pregular text-[20px]">за 7 дней</Text>

            <TouchableOpacity onPress={() => { router.push('/weight') }} className="flex flex-row justify-between items-center pb-1 border-b-[#222222] border-b-2">
              <View className="flex flex-row items-center">
                <Image
                  source={icons.weight}
                  className="w-5 h-5 mt-1 mr-2"
                />
                <Text className="text-[#ffffff] font-pbold text-[21px]">масса</Text>
              </View>

              {form.changes.weight < 0 ? (
                <Text className="text-[#ff817f] font-pregular text-[19px]">{form.changes.weight}кг<Text className="text-[#838383]"> · {form.weight}кг</Text></Text>
              ) : form.changes.weight > 0 ? (
                <Text className="text-[#89ff9d] font-pregular text-[19px]">+{form.changes.weight}кг<Text className="text-[#838383]"> · {form.weight}кг</Text></Text>
              ) : (
                <Text className="text-[#838383] font-pregular text-[19px]">такая же<Text className="text-[#838383]"> · {form.weight}кг</Text></Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-row justify-between items-center pb-1 border-b-[#222] border-b-2">
              <View className="flex flex-row items-center">
                <Image
                  source={icons.workout}
                  className="w-5 h-5 mt-1 mr-2"
                />
                <Text className="text-[#ffffff] font-pbold text-[21px]">тренировки</Text>
              </View>
              <Text className="text-[#838383] font-pregular text-[19px]">{formatTime(calculateTotalTime())}</Text>
            </TouchableOpacity>
            <Text className="text-[#838383] font-pregular mt-2 text-[19px]">график изменения массы</Text>
          </TouchableOpacity>

          <View className="flex flex-row flex-1">
            <View className="w-full p-4">
              {weekly.weight.length !== 0 && (
                <LineChart
                  data={{
                    datasets: [
                      {
                        data: weekly.weight.map(item => item.val),
                      },
                    ],
                  }}
                  width={Dimensions.get('window').width * 0.85}
                  height={150}
                  yAxisLabel=""
                  yAxisSuffix="кг"
                  yAxisInterval={1}
                  chartConfig={{
                    backgroundColor: '#111',
                    backgroundGradientFrom: '#111',
                    backgroundGradientTo: '#111',
                    decimalPlaces: 1,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                  }}
                  className="bg-[#111] py-5 rounded-b-3xl"
                />)}
            </View>
          </View>

          <View className="bg-[#111] mx-4 pt-2 pb-4 rounded-3xl mt-4">
            <Text className="text-white font-pbold mx-4 text-[19px] mb-2">тренировки</Text>
            {completed.length === 0 && (<>
              <Text className="text-[#838383] font-pregular mx-4 text-[19px] mb-2">пока ни одной :(</Text>
            </>
            )}

            <ScrollView
              horizontal={true}
              className="w-[100%]"
            >
              {completed.map(item =>
                <TouchableOpacity onPress={() => {
                  setDetail(item);
                  setDetailShown(true);
                  ref.current.scrollTo({ y: 0, animated: true });
                }} className="bg-[#222] py-2 rounded-xl mx-4 w-[84vw]">
                  <Text className="text-white font-pbold mx-4 text-[20px]">{types[item.typ].title}{item.distance > 0 && (`, ${item.distance}км`)}</Text>
                  <Text className="text-[#838383] font-pregular mx-4 text-[18px]">{formatTime(item.time)}</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>

          <TouchableOpacity className="bg-[#111] mx-4 py-3 rounded-3xl mt-4"
            onPress={() => { router.push('/additional/awards') }}
          >
            <View className="flex flex-row items-center mx-4">
              <Text className="text-white font-pbold mr-2 text-[19px]">награды</Text>
              <Image
                source={icons.right}
                className="w-6 h-6"
              />
            </View>
            {userAwards.length > 0 ? (
              <ScrollView
                horizontal={true}
                className="flex flex-row mx-4 mt-2">
                {userAwards.map(aw =>
                  <View className="bg-[#222] rounded-xl">
                    <Image
                      source={{ uri: aw.imageUrl }}
                      className="w-[80px] h-[80px]"
                    />
                  </View>
                )}
              </ScrollView>
            ) : (
              <View>
                <Text className="text-[#838383] text-[17px] font-pregular mx-4">наград пока нет</Text>
              </View>
            )}
          </TouchableOpacity>

          <View className="bg-[#111] mx-4 py-3 rounded-3xl mt-4">
            <Text className="text-white font-pbold mx-4 text-[19px]">о себе</Text>
            <View className="z-20 flex w-full flex-row flex-wrap px-4 pr-[12px]">
              <Text className="text-[#838383] mr-1 text-[16px] font-pregular">интересуюсь:</Text>
              {filteredList.map(kind => (
                <View key={kind.id} className="bg-[#252525] border-[1px] border-[#292929] shadow-lg flex relative rounded-3xl mr-[4px] mb-1 pt-[1px] pb-[3px] px-[9px] z-20">
                  <Text className="font-pregular text-[#bdbdbd] text-[16px]">{kind.title}</Text>
                </View>
              ))}
            </View>
            {profile?.bio !== '' && profile?.bio !== null && (
              <Text className="text-[#838383] mx-4 text-[16px] font-pregular">био: {profile?.bio}</Text>
            )}
          </View>
        </View>)}

      <View className="mt-[10vh]"></View>
    </ScrollView>
  );
};

export default OtherProfile;
