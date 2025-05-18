import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View, Image, StyleSheet } from "react-native";
import { useGlobalContext } from "../../context/GlobalProvider";
import useAppwrite from "../../lib/useAppwrite";
import { getAwards, getUserAwards, getAwardsByIds } from "../../lib/appwrite";
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../constants/types";
import { useState, useEffect } from "react";
import { icons } from "../../constants";
import { rank } from "../../constants/types";

const Awards = () => {
    const [{ user }, setUser] = useState(useGlobalContext());

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


    return (
        <ScrollView className="bg-[#000] h-[100vh] w-full pt-10 px-4">
            {rank.map(r => {
                const percentage = (user.exp / r.exp) * 100; // Значение от 1 до 100
                const blockWidth = percentage + '%';
                return (
                    <View
                        style={{ backgroundColor: r.color }}
                        className="rounded-3xl py-3 px-4 mt-4">
                        <Text className={`${r.text === 'white' ? `text-white` : `text-black`} font-pbold text-[20px]`}>{rank.indexOf(r) + 1} уровень</Text>
                        <Text className={`${r.text === 'white' ? `text-white` : `text-black`} font-pregular text-[19px]`}>{r.name}</Text>

                        <View className="mt-4" style={styles.outerBlock}>
                            <View style={[styles.innerBlock, { width: blockWidth }]} />
                            <Text className="left-0 bottom-[3px] text-[18px] w-full text-center absolute font-pregular text-[#000]">{user.exp}/{r.exp}</Text>
                        </View>
                    </View>
                )
            })}

            <View className="mt-[12vh]"></View>
        </ScrollView>
    )
}

export default Awards;