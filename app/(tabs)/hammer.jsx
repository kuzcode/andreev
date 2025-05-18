import { ScrollView, RefreshControl, View } from "react-native";
import { getOrders } from "../../lib/appwrite";
import { useEffect, useState } from "react";
import OrderBlock from "../../components/OrderBlock";
import OrderDetails from "../../components/OrderDetails";
import { ModelDetails } from "../../components/ModelDetails";

const Hammer = () => {
    const [orders, setOrders] = useState([]);
    const [toRefresh, setToRefresh] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const [details, setDetails] = useState({
        visible: 0
    });

    useEffect(() => {
        async function getOrdersFunc() {
            try {
                const data = await getOrders();
                if (!data || data.length === 0) {
                    console.log('Нет доступных заказов');
                    setOrders([]);
                    return;
                }

                const updatedOrders = data.map(order => {
                    const endDate = new Date(order.endDate);
                    const today = new Date();
                    const timeDiff = endDate - today;
                    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

                    return {
                        ...order,
                        visible: 1,
                        toEnd: daysDiff >= 0 ? daysDiff : 0
                    };
                });
                setOrders(updatedOrders);
            }
            catch (e) {
                console.error('Ошибка при загрузке заказов:', e);
                setOrders([]);
            }
        }

        getOrdersFunc();
    }, [toRefresh]);

    const handleIconUpdate = (orderIndex, modIndex, iconIndex, newStatus, order) => {
        const updatedOrders = [...orders];
        const updatedModels = [...updatedOrders[orderIndex].models];
        const updatedModel = { ...updatedModels[modIndex] };
        const newIcons = [...updatedModel.icons];
        newIcons[iconIndex] = newStatus;
        updatedModel.icons = newIcons;
        updatedModels[modIndex] = updatedModel;
        updatedOrders[orderIndex].models = updatedModels;
        setOrders(updatedOrders);
    };

    const filterModels = (order) => {
        if (!order.models) return [];

        return order.models.filter(model => {
            // Пропускаем архивные
            if (model.archived) return false;

            // Проверяем bg
            if (model.bg !== 4) return false;

            // Проверяем наличие хотя бы одной иконки со статусом 0 среди иконок 5-13
            const hasZeroIcon = model.icons?.slice(4, 13).some(icon => icon === 0);

            return hasZeroIcon;
        });
    };

    if (details.visible === 1) {
        return <OrderDetails details={details} setDetails={setDetails} />;
    } else if (details.visible === 2) {
        return <ModelDetails details={details} setDetails={setDetails} />;
    } else {
        return (
            <ScrollView
                className="bg-light h-full"
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {
                            setToRefresh(toRefresh + 1);
                        }}
                    />
                }
            >
                <View className="py-10 px-4">
                    {orders.map((order, orderIndex) => {
                        const filteredModels = filterModels(order);
                        if (filteredModels.length === 0) return null;

                        const orderWithFilteredModels = {
                            ...order,
                            models: filteredModels
                        };

                        return (
                            <OrderBlock
                                key={orderIndex}
                                order={orderWithFilteredModels}
                                orderIndex={orderIndex}
                                onOrderPress={(order) => {
                                    setDetails({
                                        visible: 1,
                                        ...order,
                                        designerName: order.designerName || '',
                                        designerPhone: order.designerPhone || '',
                                        prorabName: order.prorabName || '',
                                        prorabPhone: order.prorabPhone || ''
                                    });
                                }}
                                onModelPress={(order, model) => {
                                    setDetails({
                                        visible: 2,
                                        order: order,
                                        ...model,
                                        masters: model.masters || [{ name: '', cost: 0 }],
                                        operations: model.icons ? [...model.icons] : Array(13).fill(0),
                                        operationComments: model.comments ? [...model.comments] : Array(13).fill('')
                                    });
                                }}
                                handleIconUpdate={handleIconUpdate}
                            />
                        );
                    })}
                    <View className="mt-[10vh]" />
                </View>
            </ScrollView>
        );
    }
};

export default Hammer;
