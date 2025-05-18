import { StatusBar } from "expo-status-bar";
import { Redirect, router } from "expo-router";
import { View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Welcome = () => {
    const { loading, isLogged } = useGlobalContext();
    if (!loading && isLogged) return <Redirect href="/home" />;

    return (
        <SafeAreaView className="bg-[#111] h-full">
            <ScrollView
                contentContainerStyle={{
                    height: "100%",
                }}
            >
                <View className="w-full flex justify-center items-center h-full px-4">
                    <View className="relative mt-5 w-[100vw] px-4">
                        <Text className="text-3xl font-pbold text-left text-[#fff]">
                            нет подключения к интернету
                        </Text>

                        <Text className="text-[18px] font-pregular text-[#838383] mt-4 text-left">
                            к сожалению, атлет пока не работает без интернета. оффлайн функция будет введена позже
                        </Text>
                    </View>
                </View>
            </ScrollView>

            <StatusBar backgroundColor="#161622" style="light" />
        </SafeAreaView>
    );
};

export default Welcome;
