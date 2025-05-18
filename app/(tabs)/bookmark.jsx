import { ScrollView, Text, TouchableOpacity, View, TextInput, Image, StyleSheet, Linking, ActivityIndicator } from "react-native";
import { icons } from "../../constants";
import { createOrder, getOrders } from "../../lib/appwrite";
import { useEffect, useState } from "react";
import { FormField } from "../../components";
import RNPickerSelect from "react-native-picker-select";

const Create = () => {
  const [form, setForm] = useState({
    title: '',
    adress: '',
    endDate: new Date,
    payments: [],
    customer: {
      name: '',
      phone: ''
    },
    modules: []
  });

  // Функция для получения максимального номера модели
  const getMaxModelNumber = async () => {
    try {
      const orders = await getOrders();
      let maxNumber = 0;

      // Проходим по всем заказам и их модулям
      orders.forEach(order => {
        if (order.modules) {
          order.modules.forEach(module => {
            if (module.number && module.number > maxNumber) {
              maxNumber = module.number;
            }
          });
        }
      });

      return maxNumber;
    } catch (error) {
      console.error('Ошибка при получении максимального номера:', error);
      return 0;
    }
  };

  // Функция для добавления новой позиции
  const addNewModule = async () => {
    const maxNumber = await getMaxModelNumber();
    const lastModuleNumber = form.modules.length > 0
      ? Math.max(...form.modules.map(mod => mod.number))
      : maxNumber;

    setForm({
      ...form,
      modules: [...form.modules, {
        price: 0,
        number: lastModuleNumber + 1,
        bg: 4,
        icons: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        archived: false,
      }]
    });
  };

  return (
    <View className="bg-light w-full h-[100vh]">
      <ScrollView className="py-10 px-4 mb-[120px]">
        <View className="flex flex-row justify-between">
          <Text className="font-pbold text-[22px]">Создать заказ</Text>
        </View>

        <View>
          <FormField
            title='Название'
            max={100}
            value={form.title}
            otherStyles={'mt-4'}
            handleChangeText={(e) => setForm({ ...form, title: e })}
          />

          <View className="flex-row items-center my-4">
            <Text className="font-pregular text-[20px] mr-2">Заказчик</Text>

            <View className="flex-1">
              <TextInput
                className="flex-1 font-pregular text-base border-2 border-[#ccd6dd] py-0 px-4 rounded-xl"
                value={form?.customer?.name}
                placeholder={'Имя'}
                placeholderTextColor="#7B7B8B"
                onChangeText={(e) => setForm(prevForm => ({
                  ...prevForm,
                  customer: { ...prevForm.customer, name: e }
                }))}
              />
              <TextInput
                className="flex-1 font-pregular text-base border-2 border-[#ccd6dd] py-0 px-4 rounded-xl mt-1"
                value={form?.customer?.phone}
                placeholder={'Номер телефона'}
                placeholderTextColor="#7B7B8B"
                onChangeText={(e) => setForm(prevForm => ({
                  ...prevForm,
                  customer: { ...prevForm.customer, phone: e }
                }))}
              />
            </View>

            <TouchableOpacity
              onPress={() => { Linking.openURL(`tel:${form?.customer?.phone}`); }}
            >
              <Image
                source={icons.phone}
                className="w-8 h-8 ml-2"
              />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center" style={{ height: 60 }}>
            <Text className="font-pregular text-[20px] mr-2">Дизайнер</Text>

            <View className="flex-1 border-2 border-[#ccd6dd] rounded-xl">
              <RNPickerSelect
                onValueChange={(value) => setForm({ ...form, designer: value })}
                items={[
                  { label: "Вася", value: "Вася" },
                  { label: "Никита", value: "Никита" },
                ]}
                style={{
                  inputIOS: { paddingVertical: 10, width: '100%' },
                  inputAndroid: { width: '100%' }
                }}
              />
            </View>

            <TouchableOpacity
              onPress={() => { Linking.openURL(`tel:${phoneNumber}`); }}
            >
              <Image
                source={icons.phone}
                className="w-8 h-8 ml-2"
              />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center" style={{ height: 60 }}>
            <Text className="font-pregular text-[20px] mr-2">Прораб</Text>

            <View className="flex-1 border-2 border-[#ccd6dd] rounded-xl">
              <RNPickerSelect
                onValueChange={(value) => setForm({ ...form, prorab: value })}
                items={[
                  { label: "Вася", value: "Вася" },
                  { label: "Никита", value: "Никита" },
                ]}
                style={{
                  inputIOS: { paddingVertical: 10, width: '100%' },
                  inputAndroid: { width: '100%' }
                }}
              />
            </View>

            <TouchableOpacity
              onPress={() => { Linking.openURL(`tel:${phoneNumber}`); }}
            >
              <Image
                source={icons.phone}
                className="w-8 h-8 ml-2"
              />
            </TouchableOpacity>
          </View>

          <FormField
            multiline={true}
            numberOfStrokes={2}
            title='Адрес'
            value={form.adress}
            onChangeText={(e) => { setForm({ ...form, adress: e }) }}
          />

          {form.modules.map((mod, index) =>
            <View className="bg-white p-4 rounded-2xl mt-4">
              <View className="flex-row justify-between items-center" key={index}>
                <FormField
                  title='Название'
                  max={100}
                  otherStyles={'w-[90%]'}
                  value={mod.title}
                  handleChangeText={(e) => {
                    const updatedModules = [...form.modules];
                    updatedModules[index] = { ...updatedModules[index], title: e };
                    setForm({ ...form, modules: updatedModules });
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    const updatedModules = form.modules.filter((_, i) => i !== index);
                    setForm({ ...form, modules: updatedModules });
                  }}
                >
                  <Image
                    source={icons.delet}
                    className="w-5 h-5"
                  />
                </TouchableOpacity>
              </View>

              <FormField
                title='Цена'
                measure={'₽'}
                otherStyles={'mt-4'}
                value={String(mod.price)}
                handleChangeText={(e) => {
                  const updatedModules = [...form.modules];
                  updatedModules[index] = { ...updatedModules[index], price: Number(e) };
                  setForm({ ...form, modules: updatedModules });
                }}
              />
            </View>
          )}

          <TouchableOpacity className="p-4 rounded-2xl bg-white mt-4 mb-[100px]"
            onPress={addNewModule}
          >
            <Text className="font-pregular text-[20px] text-center">+ Добавить позицию</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity className="bg-black mt-4 p-4 rounded-2xl absolute bottom-[60px] left-4 right-4"
        onPress={() => {
          createOrder(form);
        }}
      >
        <Text className="text-white text-center text-[20px] font-pregular">Сохранить</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Create;