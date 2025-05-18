import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { signOut } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useState } from "react";

const Settings = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);
    router.push("/sign-up");
  };

  const [confShown, setConfShown] = useState(false);

  const links = [
    {
      title: 'профиль',
      des: 'публичность · аватар',
      link: 'additional/profileSettings'
    },
    {
      title: 'виды спорта',
      des: 'список видов спорта',
      link: 'additional/typesOfSport'
    },
    {
      title: 'наши соц сети',
      des: 'подписаться · связь',
      link: 'additional/social'
    },
    {
      title: 'связь',
      des: 'жалоба · предложение',
      link: 'additional/contact'
    }
  ]
  return (
    <View className="px-4 pt-10 bg-[#000] h-full">
      <Text className="text-2xl text-white font-psemibold">настройки</Text>

      {confShown && (
        <View className="bg-[#222] absolute z-20 top-[30vh] w-full mx-4 px-4 py-3 rounded-3xl">
          <Text className="text-white text-[20px] font-pbold">ты уверен, что хочешь выйти из аккаунта?</Text>
          <Text className="text-[#838383] text-[18px] font-pregular">ты сможешь войти заново или создать новый</Text>
          <TouchableOpacity onPress={() => { setConfShown(false) }} className="bg-[#333] py-2 rounded-2xl mt-2">
            <Text className="text-center text-[19px] font-pregular text-white">остаться в аккаунте</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { logout() }} className="bg-[#fff] py-2 rounded-2xl mt-3">
            <Text className="text-center text-[19px] font-pregular">выйти</Text>
          </TouchableOpacity>
        </View>
      )}

      {links.map(link =>
        <TouchableOpacity key={link.title} className="bg-[#111] pt-2 pb-3 px-4 rounded-3xl mt-2"
          onPress={() => { router.push(`/${link.link}`) }}
        >
          <Text className="text-[#fff] font-pregular text-[19px]">{link.title}</Text>
          <Text className="text-[#838383] font-pregular text-[15px]">{link.des}</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity className="bg-[#240a0a] absolute bottom-[56px] w-full left-4 right-4 pt-2 pb-3 px-4 rounded-2xl mt-2"
        onPress={() => { setConfShown(true) }}
      >
        <Text className="text-[#FF7E7E] font-pregular text-[18px] text-center">выйти из аккаунта</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Settings;


