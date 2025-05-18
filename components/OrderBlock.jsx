import { View, Text, TouchableOpacity, Image, Linking } from "react-native";
import { icons } from "../constants";
import { updateOrder } from "../lib/appwrite";

const bgs = [
    { title: 'Кр.', bg: '#b61900' },
    { title: 'Син.', bg: '#2362fa' },
    { title: 'Кор.', bg: '#7a3904' },
    { title: 'Зел.', bg: '#039900' },
    { title: 'Сер.', bg: '#484a55' },
];

export const OrderBlock = ({ order, onOrderPress, onModelPress, handleIconUpdate, orderIndex }) => {
    return (
        <TouchableOpacity
            onPress={() => onOrderPress(order)}
            className="p-4 bg-white mt-4 rounded-2xl"
        >
            <View className="flex flex-row justify-between mb-2">
                <Text className="font-pbold text-[22px]">{order.title}</Text>
                <View className="flex flex-row items-center">
                    <TouchableOpacity onPress={() => { Linking.openURL(`https://wa.me/0${order.customer?.phone}`) }}>
                        <Image
                            source={icons.whatsapp}
                            className="w-7 h-7 mx-2"
                        />
                    </TouchableOpacity>
                    <Image
                        source={icons.eye}
                        className="w-8 h-8 mx-2"
                    />
                    <Text className="font-pbold text-[22px] ml-2">{order.toEnd}</Text>
                </View>
            </View>

            {order.models?.map((mod, modIndex) =>
                <View className="mt-0" key={modIndex}>
                    <View className="w-full h-[2px] bg-light mb-4"></View>
                    <View className="flex flex-row items-center justify-between">
                        <TouchableOpacity
                            onPress={() => onModelPress(order, mod)}
                            style={{ backgroundColor: bgs[mod.bg].bg }}
                            className="px-2 py-1 rounded-lg border-2 border-[#d6e0f0] flex-1 mr-2">
                            <Text className="font-pbold text-[18px] text-white">{mod.title}</Text>
                        </TouchableOpacity>

                        <View className="flex flex-row">
                            {mod?.icons?.slice(0, 4).map((iconStatus, iconIndex) => {
                                if (iconStatus === 3) return null;

                                const iconStyles = `
                                    ${iconStatus === 0 ? 'bg-light' :
                                        iconStatus === 1 ? 'bg-green-300' :
                                            'opacity-50'} 
                                `;
                                const IconComponent = () => {
                                    switch (iconIndex) {
                                        case 0: return icons.alert;
                                        case 1: return icons.measure;
                                        case 2: return icons.triangular;
                                        case 3: return icons.warranty;
                                        default: return null;
                                    }
                                };

                                return (
                                    <TouchableOpacity
                                        key={iconIndex}
                                        className={`${iconStyles} m-[2px] rounded-lg`}
                                        onPress={() => {
                                            if (iconStatus !== 3) {
                                                handleIconUpdate(orderIndex, modIndex, iconIndex, (iconStatus + 1) % 3, order);
                                            }
                                        }}
                                    >
                                        <Image
                                            source={IconComponent()}
                                            className="w-[25px] h-[25px] m-[3px]"
                                        />
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    <View className="flex flex-row justify-between mt-[2px]">
                        {mod?.icons?.slice(4).map((iconStatus, iconIndex) => {
                            if (iconStatus === 3) return null;

                            const iconStyles = `
                                ${iconStatus === 0 ? 'bg-light' :
                                    iconStatus === 1 ? 'bg-green-300' :
                                        'opacity-50'} 
                            `;
                            const IconComponent = () => {
                                switch (iconIndex + 4) {
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
                            };

                            return (
                                <TouchableOpacity
                                    key={iconIndex + 4}
                                    className={`${iconStyles} m-[2px] rounded-lg`}
                                    onPress={() => {
                                        if (iconStatus !== 3) {
                                            handleIconUpdate(orderIndex, modIndex, iconIndex + 4, (iconStatus + 1) % 3, order);
                                        }
                                    }}
                                >
                                    <Image
                                        source={IconComponent()}
                                        className="w-[25px] h-[25px] m-[3px]"
                                    />
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            )}
        </TouchableOpacity>
    );
};

export default OrderBlock; 