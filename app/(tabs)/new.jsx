import { ScrollView, Text, TouchableOpacity, View, TextInput, RefreshControl, Alert } from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { getOrders, getModels } from "../../lib/appwrite";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [models, setModels] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [toRefresh, setToRefresh] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, modelsData] = await Promise.all([
          getOrders(),
          getModels()
        ]);
        setOrders(ordersData);
        setModels(modelsData);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        Alert.alert('Ошибка', 'Не удалось загрузить данные. Пожалуйста, проверьте подключение к интернету и попробуйте снова.');
      }
    };

    fetchData();
  }, [toRefresh]);

  const onRefresh = () => {
    setRefreshing(true);
    setToRefresh(prev => prev + 1);
    setRefreshing(false);
  };

  const filteredOrders = orders.filter(order =>
    order.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredModels = models.filter(model =>
    model.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView
      className="bg-white py-10 flex-1 px-4"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#3c87ff"
        />
      }
    >
      <View className="mb-6 mt-4">
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Введите запрос..."
          placeholderTextColor="#666"
          className="w-full p-4 bg-light rounded-xl text-black mb-2 font-pregular text-[16px]"
        />
        <TouchableOpacity
          onPress={() => setSearchQuery(searchQuery)}
          className="bg-[#3c87ff] p-4 rounded-xl"
        >
          <Text className="text-white text-center font-pregular text-[18px]">Найти</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row gap-4 mb-4">
        <TouchableOpacity
          onPress={() => setActiveTab('orders')}
          className={`flex-1 p-4 rounded-xl ${activeTab === 'orders' ? 'bg-[#3c87ff]' : 'bg-light'
            }`}
        >
          <Text className={`text-center font-pregular text-[18px] ${activeTab === 'orders' ? 'text-white' : 'text-[#666]'
            }`}>Заказы</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('models')}
          className={`flex-1 p-4 rounded-xl ${activeTab === 'models' ? 'bg-[#3c87ff]' : 'bg-light'
            }`}
        >
          <Text className={`text-center font-pregular text-[18px] ${activeTab === 'models' ? 'text-white' : 'text-[#666]'
            }`}>Модели</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'orders' ? (
        <View>
          {filteredOrders.length > 0 ? (
            <View className="gap-4">
              {filteredOrders.map((order) => (
                <TouchableOpacity
                  key={order.$id}
                  onPress={() => router.push(`/orders/${order.$id}`)}
                  className="bg-light p-4 rounded-xl"
                >
                  <Text className="font-pbold text-[20px]">{order.title}</Text>
                  <Text className="text-[#666] font-pregular text-[16px]">{order.adress}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text className="text-center text-[#666] font-pregular text-[18px]">Заказов не найдено</Text>
          )}
          <View className="my-8"></View>
        </View>
      ) : (
        <View>
          {filteredModels.length > 0 ? (
            <View className="gap-4">
              {filteredModels.map((model) => (
                <TouchableOpacity
                  key={model.$id}
                  onPress={() => router.push(`/models/${model.$id}`)}
                  className="bg-light p-4 rounded-xl"
                >
                  <Text className="font-pbold text-[20px]">{model.title}</Text>
                  <Text className="text-[#666] font-pregular text-[16px]">{model.price} ₽</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text className="text-center text-[#666] font-pregular text-[18px]">Моделей не найдено</Text>
          )}

          <View className="my-8"></View>
        </View>
      )}
    </ScrollView>
  );
};

export default SearchPage;
