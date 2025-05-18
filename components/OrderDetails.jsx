import { ScrollView, Text, TouchableOpacity, View, Image, Linking, Alert } from "react-native";
import { icons } from "../constants";
import { updateOrder, updateModel } from "../lib/appwrite";
import FormField from "../components/FormField";

export const OrderDetails = ({ details, setDetails }) => {
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
        <ScrollView className="bg-white py-10 px-4">
            <View className="flex flex-row justify-between items-center">
                <TouchableOpacity
                    onPress={() => { setDetails({ visible: 0 }) }}
                >
                    <Image
                        className='w-10 h-10'
                        source={icons.home}
                    />
                </TouchableOpacity>
                <View className="flex-1 flex-row justify-center items-center">
                    <Text className="font-pbold text-[22px] mr-2">{details.title}</Text>
                    <Text className="font-pbold text-[22px]">({details.toEnd})</Text>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        Alert.alert(
                            'Архивация',
                            'Вы уверены, что хотите архивировать все модели?',
                            [
                                {
                                    text: 'Отмена',
                                    style: 'cancel',
                                },
                                {
                                    text: 'Архивировать',
                                    onPress: archiveAllModels,
                                    style: 'destructive',
                                },
                            ]
                        );
                    }}
                    className="bg-red-500 px-4 py-2 rounded-lg"
                >
                    <Text className="font-pbold text-white">Архив</Text>
                </TouchableOpacity>
            </View>

            <View className="h-[2px] w-full bg-slate-300 my-4 rounded-xl"></View>

            <FormField
                title='Клиент:'
                value={details.customer?.name}
                onChangeText={(e) => { setDetails({ ...details, customer: { ...details.customer, name: e } }) }}
            />

            <View className="flex-row items-center">
                <View className="flex-1">
                    <FormField
                        title='Телефон:'
                        value={details.customer?.phone}
                        onChangeText={(e) => { setDetails({ ...details, customer: { ...details.customer, phone: e } }) }}
                    />
                </View>
                <TouchableOpacity
                    onPress={() => { Linking.openURL(`tel:${details.customer?.phone}`); }}
                    className="ml-2 mt-6"
                >
                    <Image
                        source={icons.phone}
                        className="w-8 h-8"
                    />
                </TouchableOpacity>
            </View>

            <FormField
                title='Адрес:'
                value={details.adress}
                onChangeText={(e) => { setDetails({ ...details, adress: e }) }}
            />

            <View className="h-[2px] w-full bg-slate-300 my-4 rounded-xl"></View>

            <FormField
                title='Дизайнер:'
                value={details.designerName}
                onChangeText={(e) => { setDetails({ ...details, designerName: e }) }}
            />

            <View className="flex-row items-center">
                <View className="flex-1">
                    <FormField
                        title='Телефон дизайнера:'
                        value={details.designerPhone}
                        onChangeText={(e) => { setDetails({ ...details, designerPhone: e }) }}
                    />
                </View>
                <TouchableOpacity
                    onPress={() => { Linking.openURL(`tel:${details.designerPhone}`); }}
                    className="ml-2 mt-6"
                >
                    <Image
                        source={icons.phone}
                        className="w-8 h-8"
                    />
                </TouchableOpacity>
            </View>

            <FormField
                title='Прораб:'
                value={details.prorabName}
                onChangeText={(e) => { setDetails({ ...details, prorabName: e }) }}
            />

            <View className="flex-row items-center">
                <View className="flex-1">
                    <FormField
                        title='Телефон прораба:'
                        value={details.prorabPhone}
                        onChangeText={(e) => { setDetails({ ...details, prorabPhone: e }) }}
                    />
                </View>
                <TouchableOpacity
                    onPress={() => { Linking.openURL(`tel:${details.prorabPhone}`); }}
                    className="ml-2 mt-6"
                >
                    <Image
                        source={icons.phone}
                        className="w-8 h-8"
                    />
                </TouchableOpacity>
            </View>

            <View className="h-[2px] w-full bg-slate-300 my-4 rounded-xl"></View>

            {details.models.map((mod, index) =>
                <View className="my-2" key={index}>
                    <View className="flex flex-row items-center">
                        <TouchableOpacity
                            onPress={async () => {
                                const updatedModels = details.models.filter((_, i) => i !== index);
                                setDetails({
                                    ...details,
                                    models: updatedModels
                                });

                                try {
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
                    <Text className="font-pregular text-[20px] mr-4 text-[#777]">Итого</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text className="font-pregular text-[20px]">
                        {details.models.reduce((total, mod) => total + mod.price, 0)}₽
                    </Text>
                </TouchableOpacity>
            </View>

            <View className="absolute bottom-[56px] flex flex-row justify-around rounded-2xl left-4 right-4 py-4 bg-white">
                <TouchableOpacity
                    onPress={() => { setDetails({ visible: 0 }) }}
                >
                    <Image
                        className='w-10 h-10'
                        source={icons.home}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => { setDetails({ visible: 0 }) }}
                >
                    <Image
                        className='w-10 h-10'
                        source={icons.create}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={async () => {
                        try {
                            const orderData = {
                                ...details,
                                designerName: String(details.designerName || ''),
                                designerPhone: String(details.designerPhone || ''),
                                prorabName: String(details.prorabName || ''),
                                prorabPhone: String(details.prorabPhone || '')
                            };
                            await updateOrder(orderData);
                            console.log('Заказ успешно обновлен');
                        } catch (error) {
                            console.error('Ошибка при обновлении заказа:', error);
                        }
                    }}
                >
                    <Image
                        className='w-10 h-10'
                        source={icons.tick}
                    />
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default OrderDetails; 