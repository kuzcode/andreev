import { ScrollView, Text, TouchableOpacity, View, Image, Linking, Alert, TextInput } from "react-native";
import { icons } from "../constants";
import { updateOrder, updateModel } from "../lib/appwrite";
import FormField from "../components/FormField";
import RNPickerSelect from 'react-native-picker-select';
import { useState } from "react";

export const OrderDetails = ({ details, setDetails }) => {
    const [designers, setDesigners] = useState([]);
    const [prorabs, setProrabs] = useState([]);

    const archiveAllModels = async () => {
        try {
            // Create a copy of models with all of them archived
            const archivedModels = details.models.map(model => ({
                ...model,
                archived: true
            }));

            // Update the order with archived models
            await updateOrder({
                ...details,
                models: archivedModels
            });

            // Archive each model individually to trigger master balance updates
            for (const model of details.models) {
                await updateModel({
                    ...model,
                    archived: true
                });
            }

            // Return to main screen
            setDetails({ visible: 0 });
        } catch (error) {
            console.error('Ошибка при архивации моделей:', error);
            Alert.alert('Ошибка', 'Не удалось архивировать модели');
        }
    };

    return (
        <View className="bg-light h-[100vh]">
            <ScrollView className="bg-light h-[90vh] p-4 pt-10">
                <View className="flex flex-row justify-between mb-4">
                    <TextInput
                        className="bg-white border-2 border-[#ccd6dd] py-1 flex-1 mr-4 rounded-xl text-center font-pbold text-[20px]"
                        value={details.title}
                        onChangeText={(e) => { setDetails({ ...details, title: e }) }}
                    />

                    <TextInput
                        className="bg-white border-2 border-[#ccd6dd] py-1 px-4 rounded-xl text-center text-[20px] font-pbold"
                        value={String(details.toEnd)}
                        onChangeText={(e) => {
                            const days = Number(e);
                            const endDate = new Date();
                            endDate.setDate(endDate.getDate() + days);
                            setDetails({
                                ...details,
                                toEnd: days,
                                endDate: endDate.toISOString()
                            })
                        }}
                    />

                    <TouchableOpacity>
                        <Image
                            source={icons.whatsapp}
                            className="w-8 h-8 ml-4"
                        />
                    </TouchableOpacity>
                </View>

                <View className="flex-row items-end mb-4">
                    <Text className="font-pregular text-[20px] mr-2">Заказчик</Text>

                    <View className="flex-1">
                        <TextInput
                            className="flex-1 font-pregular text-base border-2 border-[#ccd6dd] py-0 px-4 rounded-xl"
                            value={details?.customer?.name}
                            placeholder={'Имя'}
                            placeholderTextColor="#7B7B8B"
                            onChangeText={(e) => setDetails(prevDetails => ({
                                ...prevDetails,
                                customer: { ...prevDetails.customer, name: e }
                            }))}
                        />
                        <TextInput
                            className="flex-1 font-pregular text-base border-2 border-[#ccd6dd] py-0 px-4 rounded-xl mt-1"
                            value={details?.customer?.phone}
                            placeholder={'Номер телефона'}
                            placeholderTextColor="#7B7B8B"
                            onChangeText={(e) => setDetails(prevDetails => ({
                                ...prevDetails,
                                customer: { ...prevDetails.customer, phone: e }
                            }))}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={() => { Linking.openURL(`tel:${details?.customer?.phone}`); }}
                    >
                        <Image
                            source={icons.phone}
                            className="w-8 h-8 ml-2"
                        />
                    </TouchableOpacity>
                </View>


                <View className="mb-4">
                    <View className="flex-row items-end mb-2">
                        <Text className="font-pregular text-[20px] mr-2">Дизайнер</Text>

                        <View className="flex-1">
                            <View className="border-2 border-[#ccd6dd] rounded-2xl mb-2">
                                <RNPickerSelect
                                    onValueChange={(value) => {
                                        console.log('Выбран дизайнер:', value);
                                        const selectedDesigner = designers.find(m => m.$id === value);
                                        console.log('Найденный дизайнер:', selectedDesigner);
                                        if (selectedDesigner) {
                                            setDetails(prev => ({
                                                ...prev,
                                                designerName: selectedDesigner.name ? String(selectedDesigner.name) : '',
                                                designerPhone: selectedDesigner.phoneNumber ? String(selectedDesigner.phoneNumber) : ''
                                            }));
                                        } else {
                                            setDetails(prev => ({
                                                ...prev,
                                                designerName: '',
                                                designerPhone: ''
                                            }));
                                        }
                                    }}
                                    value={designers.find(d => d.name === details.designerName)?.$id || null}
                                    items={designers.map(m => ({
                                        value: m.$id,
                                        label: m.name || '',
                                        key: m.$id
                                    }))}
                                    placeholder={{ label: 'Выберите дизайнера', value: null }}
                                    style={{
                                        inputIOS: { paddingVertical: 10, paddingHorizontal: 10 },
                                        inputAndroid: { paddingHorizontal: 10 }
                                    }}
                                    useNativeAndroidPickerStyle={false}
                                />
                            </View>

                            <TextInput
                                className="flex-1 font-pregular text-base border-2 border-[#ccd6dd] py-0 px-4 rounded-xl mt-1"
                                value={details?.designerPhone || ''}
                                placeholder={'Номер телефона'}
                                placeholderTextColor="#7B7B8B"
                                onChangeText={(e) => setDetails(prevDetails => ({
                                    ...prevDetails,
                                    designerPhone: String(e).slice(0, 100)
                                }))}
                            />
                        </View>
                        <TouchableOpacity
                            onPress={() => { Linking.openURL(`tel:${details.designerPhone || phoneNumber}`); }}
                        >
                            <Image
                                source={icons.phone}
                                className="w-8 h-8 ml-2"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="mb-4">
                    <View className="flex-row items-end mb-2">
                        <Text className="font-pregular text-[20px] mr-2">Прораб</Text>

                        <View className="flex-1">
                            <View className="border-2 border-[#ccd6dd] rounded-2xl mb-2">
                                <RNPickerSelect
                                    onValueChange={(value) => {
                                        console.log('Выбран Прораб:', value);
                                        const selectedProrab = prorabs.find(m => m.$id === value);
                                        console.log('Найденный Прораб:', selectedProrab);
                                        if (selectedProrab) {
                                            setDetails(prev => ({
                                                ...prev,
                                                prorabName: selectedProrab.name ? String(selectedProrab.name) : '',
                                                prorabPhone: selectedProrab.phoneNumber ? String(selectedProrab.phoneNumber) : ''
                                            }));
                                        } else {
                                            setDetails(prev => ({
                                                ...prev,
                                                prorabName: '',
                                                prorabPhone: ''
                                            }));
                                        }
                                    }}
                                    value={prorabs.find(p => p.name === details.prorabName)?.$id || null}
                                    items={prorabs.map(m => ({
                                        value: m.$id,
                                        label: m.name || '',
                                        key: m.$id
                                    }))}
                                    placeholder={{ label: 'Выберите прораба', value: null }}
                                    style={{
                                        inputIOS: { paddingVertical: 10, paddingHorizontal: 10 },
                                        inputAndroid: { paddingHorizontal: 10 }
                                    }}
                                    useNativeAndroidPickerStyle={false}
                                />
                            </View>

                            <TextInput
                                className="flex-1 font-pregular text-base border-2 border-[#ccd6dd] py-0 px-4 rounded-xl mt-1"
                                value={details?.prorabPhone || ''}
                                placeholder={'Номер телефона'}
                                placeholderTextColor="#7B7B8B"
                                onChangeText={(e) => setDetails(prevDetails => ({
                                    ...prevDetails,
                                    prorabPhone: String(e).slice(0, 100)
                                }))}
                            />
                        </View>
                        <TouchableOpacity
                            onPress={() => { Linking.openURL(`tel:${details.prorabPhone || phoneNumber}`); }}
                        >
                            <Image
                                source={icons.phone}
                                className="w-8 h-8 ml-2"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <FormField
                    multiline={true}
                    numberOfStrokes={2}
                    title='Адрес:'
                    value={details.adress}
                    onChangeText={(e) => { setDetails({ ...details, adress: e }) }}
                />

                <View className="h-[2px] w-full bg-slate-300 my-4 rounded-xl"></View>

                {details.models && details.models.map((mod, index) =>
                    <View className="my-2" key={index}>
                        <View className="flex flex-row items-center">
                            <TouchableOpacity
                                onPress={async () => {
                                    // Создаем новый массив моделей без удаляемого элемента
                                    const updatedModels = details.models.filter((_, i) => i !== index);

                                    // Обновляем состояние
                                    setDetails({
                                        ...details,
                                        models: updatedModels
                                    });

                                    try {
                                        // Отправляем обновленные данные в базу
                                        await updateOrder({
                                            ...details,
                                            models: updatedModels
                                        });
                                        console.log('Модель успешно удалена');
                                    } catch (error) {
                                        console.error('Ошибка при удалении модели:', error);
                                    }
                                }}
                            >
                                <Image
                                    source={icons.delet}
                                    className="w-6 h-6 mr-2"
                                    tintColor={'#e15042'}
                                />
                            </TouchableOpacity>
                            <Text className="font-pbold text-[20px]">Заказ №{mod.number}</Text>
                        </View>
                        <View className="flex flex-row justify-between bg-white p-2 rounded-lg mt-1">
                            <Text className="font-pregular text-[20px]">{mod.title}</Text>
                            <Text className="font-pregular text-[20px]">{mod.price}₽</Text>
                        </View>
                    </View>
                )}

                <View className="h-[2px] w-full bg-slate-300 my-4 rounded-xl"></View>

                <View className="flex flex-row justify-end">
                    <TouchableOpacity>
                        <Text className="font-pregular text-[20px] mr-4">Итого</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text className="font-pregular text-[20px]">
                            {(details.models || []).reduce((total, mod) => total + (mod.price || 0), 0)}₽
                        </Text>
                    </TouchableOpacity>
                </View>


                {(details.payments || []).map((pay, index) => {
                    const day = pay.date.slice(8, 10);
                    const month = pay.date.slice(5, 7);
                    const year = `20${pay.date.slice(2, 4)}`;
                    const monthNames = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];

                    return (
                        <View className="flex flex-row justify-between my-4 items-center" key={index}>
                            <TouchableOpacity
                                className="mt-5"
                                onPress={() => {
                                    setDetails({
                                        ...details,
                                        payments: (details.payments || []).filter((_, i) => i !== index)
                                    });
                                }}
                            >
                                <Image
                                    source={icons.delet}
                                    className="w-7 h-7"
                                    tintColor={'#e15042'}
                                />
                            </TouchableOpacity>
                            <Text className="text-[20px] font-pregular">{day} {monthNames[parseInt(month) - 1]} {year}</Text>
                            <Text className="text-[20px] font-pregular">{pay.amount}₽</Text>
                        </View>
                    );
                })}

                <View className="flex flex-row justify-end">
                    <TouchableOpacity>
                        <Text className="font-pregular text-[#777] text-[20px] mr-4">Остаток</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text className="font-pregular text-[20px]">
                            {((details.models || []).reduce((total, mod) => total + (mod.price || 0), 0)) -
                                ((details.payments || []).reduce((totalPay, mod) => totalPay + (mod.amount || 0), 0))}₽
                        </Text>
                    </TouchableOpacity>
                </View>

                <View className="mb-[340px] flex flex-row items-center mt-4">
                    <FormField
                        placeholder={'Новый платёж'}
                        otherStyles={'flex-1'}
                        onChangeText={text => setInputValue(text)} // Установим состояние для ввода
                    />
                    <TouchableOpacity
                        onPress={() => {
                            if (inputValue && inputValue.length > 0) {
                                setDetails({
                                    ...details,
                                    payments: [
                                        ...(details.payments || []),
                                        {
                                            amount: Number(inputValue),
                                            date: new Date().toISOString(),
                                        }
                                    ]
                                });
                                setInputValue(''); // Очистим поле ввода после добавления платежа
                            }
                        }}
                        className="bg-white border-2 w-[60px] h-[60px] flex justify-center items-center rounded-full ml-4">
                        <Text className="text-[30px] font-pbold">₽</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <View className="absolute bottom-0 flex flex-row justify-around rounded-2xl left-4 right-4 py-4 bg-white">
                <TouchableOpacity
                    onPress={() => { setDetails({ visible: 0 }) }}
                >
                    <Image
                        className='w-10 h-10'
                        source={icons.home}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => { router.push('/create') }}
                >
                    <Image
                        className='w-10 h-10'
                        source={icons.create}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={async () => {
                        // Создаем копию объекта без лишних полей
                        const { visible, ...rest } = details;

                        const orderData = {
                            ...rest,
                            designerName: typeof details.designerName === 'string' ? details.designerName : '',
                            designerPhone: typeof details.designerPhone === 'string' ? details.designerPhone : '',
                            prorabName: typeof details.prorabName === 'string' ? details.prorabName : '',
                            prorabPhone: typeof details.prorabPhone === 'string' ? details.prorabPhone : ''
                        };

                        // Проверяем типы данных перед отправкой
                        console.log('Типы данных перед отправкой:', {
                            designerName: typeof orderData.designerName,
                            designerPhone: typeof orderData.designerPhone,
                            prorabName: typeof orderData.prorabName,
                            prorabPhone: typeof orderData.prorabPhone
                        });

                        console.log('Значения перед отправкой:', {
                            designerName: orderData.designerName,
                            designerPhone: orderData.designerPhone,
                            prorabName: orderData.prorabName,
                            prorabPhone: orderData.prorabPhone
                        });

                        try {
                            const updatedOrder = await updateOrder(orderData);
                            console.log('Ответ от сервера после обновления:', JSON.stringify(updatedOrder, null, 2));
                            setToRefresh(prev => prev + 1);
                        } catch (error) {
                            console.error('Ошибка при обновлении заказа:', error);
                            Alert.alert('Ошибка', 'Не удалось обновить заказ. Пожалуйста, проверьте данные и попробуйте снова.');
                        }
                    }}
                >
                    <Image
                        className='w-10 h-10'
                        source={icons.tick}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default OrderDetails; 