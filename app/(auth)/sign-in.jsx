import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert } from "react-native";

import { CustomButton, FormField } from "../../components";
import { getCurrentUser, signIn } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const SignIn = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }

    setSubmitting(true);

    try {
      await signIn(form.email, form.password);
      const result = await getCurrentUser();
      setUser(result);
      setIsLogged(true);
      router.replace("/home");
    } catch (error) {
      Alert.alert("ошибка", `напишите в поддержку, \n\nтекст ошибки: ${error.message}`);
      router.push('/help')
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-[#111] h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >

          <Text className="text-2xl font-semibold mt-[0px] text-white font-psemibold">
            войдите в аккаунт
          </Text>

          <FormField
            title="почта"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            max={100}
            keyboardType="email-address"
          />

          <FormField
            title="пароль"
            max={100}
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="войти"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-500 font-pregular">
              вы впервые?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg font-psemibold text-[#3c87ff]"
            >
              регистрация
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
