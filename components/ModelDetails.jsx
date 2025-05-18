import { ScrollView, Text, TouchableOpacity, View, Image } from "react-native";
import { icons } from "../constants";
import { updateModel } from "../lib/appwrite";
import FormField from "./FormField";
import RNPickerSelect from "react-native-picker-select";

const bgs = [
    { title: 'Кр.', bg: '#b61900' },
    { title: 'Син.', bg: '#2362fa' },
    { title: 'Кор.', bg: '#7a3904' },
    { title: 'Зел.', bg: '#039900' },
    { title: 'Сер.', bg: '#484a55' },
];

export const ModelDetails = ({ details, setDetails }) => {
    return (
        <ScrollView className="bg-white py-10 px-4">
            <View className="flex flex-row justify-between items-center">
                <TouchableOpacity>
                    <Text className="text-[20px] font-pbold">PDF</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ backgroundColor: bgs[details.bg].bg }}
                    className="px-2 py-1 rounded-lg border-2 border-[#d6e0f0] flex-1 mx-4">
                    <Text className="font-pbold text-[18px] text-white">{details.title}</Text>
                </TouchableOpacity>
                <Text className="text-[22px] font-pbold">{details.order.title}</Text>
            </View>

            <View className="flex flex-row justify-between mt-4">
                {bgs.map((color, index) =>
                    <TouchableOpacity
                        key={index}
                        onPress={() => {
                            setDetails({
                                ...details,
                                bg: index
                            });
                        }}
                        style={{ backgroundColor: color.bg }}
                        className="rounded-full border-2 border-[#d6e0f0] w-[16vw] h-[16vw] flex justify-center items-center">
                        <Text className="font-pregular text-[16px] text-white text-center">{color.title}</Text>
                    </TouchableOpacity>
                )}
            </View>

            <FormField
                title='Стоимость'
                value={String(details.price)}
                measure={'₽'}
                otherStyles={'mt-2'}
                onChangeText={(e) => { setDetails({ ...details, price: Number(e) }) }}
            />

            <View className="w-full h-[2px] bg-light mt-4"></View>

            <Text className="font-pbold text-[20px] mt-4">Операции</Text>

            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((iconIndex) => (
                <View key={iconIndex} className="flex flex-row items-center my-2">
                    <TouchableOpacity
                        className={`m-[2px] rounded-lg ${details.operations?.[iconIndex] === 0 ? 'bg-light' :
                            details.operations?.[iconIndex] === 1 ? 'bg-green-300' :
                                details.operations?.[iconIndex] === 2 ? 'opacity-50' :
                                    'bg-red-600'
                            }`}
                        onPress={() => {
                            const currentStatus = details.operations?.[iconIndex] || 0;
                            const newStatus = (currentStatus + 1) % 4;
                            const updatedOperations = [...(details.operations || Array(13).fill(0))];
                            updatedOperations[iconIndex] = newStatus;
                            setDetails({ ...details, operations: updatedOperations });
                        }}
                    >
                        <Image
                            source={(() => {
                                switch (iconIndex) {
                                    case 0: return icons.alert;
                                    case 1: return icons.measure;
                                    case 2: return icons.triangular;
                                    case 3: return icons.warranty;
                                    case 4: return icons.blade;
                                    case 5: return icons.edge;
                                    case 6: return icons.drill;
                                    case 7: return icons.tool;
                                    case 8: return icons.spray;
                                    case 9: return icons.tape;
                                    case 10: return icons.container;
                                    case 11: return icons.screwdriver;
                                    case 12: return icons.shuffle;
                                    default: return null;
                                }
                            })()}
                            className="w-[25px] h-[25px] m-[3px]"
                        />
                    </TouchableOpacity>
                </View>
            ))}

            <View className="absolute bottom-[56px] flex flex-row justify-around rounded-2xl left-4 right-4 py-4 bg-white">
                <TouchableOpacity
                    onPress={() => { setDetails({ visible: 0 }) }}
                >
                    <Image
                        className='w-10 h-10 mx-2'
                        source={icons.home}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={async () => {
                        const fullOperations = Array(13).fill(0).map((_, index) =>
                            details.operations?.[index] ?? 0
                        );

                        try {
                            await updateModel({
                                ...details,
                                charges: details.charges || [],
                                icons: fullOperations
                            });
                            console.log('Данные успешно сохранены');
                        } catch (error) {
                            console.error('Ошибка при сохранении:', error);
                        }
                    }}
                >
                    <Image
                        className='w-10 h-10 mx-2'
                        source={icons.tick}
                    />
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}; 