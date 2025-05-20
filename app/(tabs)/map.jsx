import { ScrollView, Text, TouchableOpacity, View, Linking, Image, StyleSheet, TextInput, RefreshControl, Alert, Dimensions } from "react-native";
import { icons } from "../../constants";
import { getMasters, getOrders, updateModel, updateOrder, updateTracker, updateUser, getPeople, getMasterModels } from "../../lib/appwrite";
import { useEffect, useState, useRef } from "react";
import RNPickerSelect from "react-native-picker-select";
import { FormField } from "../../components";
import OrderBlock from "../../components/OrderBlock";
import OrderDetails from "../../components/OrderDetails";
import ModelDetails from "../../components/ModelDetails";

const Map = () => {
  const [orders, setOrders] = useState([]);
  const [masters, setMasters] = useState([]);
  const [designers, setDesigners] = useState([]);
  const [prorabs, setProrabs] = useState([]);
  const [toRefresh, setToRefresh] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('+7977');
  const [inputValue, setInputValue] = useState('');
  const [details, setDetails] = useState({
    visible: 0
  });
  const [iconUpdateTimer, setIconUpdateTimer] = useState(null);
  const [people, setPeople] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const width = Dimensions.get('window').width;

  const bgs = [
    { title: 'Кр.', bg: '#b61900' },
    { title: 'Син.', bg: '#2362fa' },
    { title: 'Кор.', bg: '#7a3904' },
    { title: 'Зел.', bg: '#039900' },
    { title: 'Сер.', bg: '#484a55' },
  ]

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
        Alert.alert('Ошибка', 'Не удалось загрузить заказы. Пожалуйста, проверьте подключение к интернету и попробуйте снова.');
        setOrders([]);
      }
    }

    getOrdersFunc();
  }, [toRefresh]);

  useEffect(() => {
    async function getMastersFunc() {
      try {
        const [mastersData, designersData, prorabsData] = await Promise.all([
          getMasters(1),
          getMasters(2),
          getMasters(3)
        ]);

        setMasters(mastersData);
        setDesigners(designersData);
        setProrabs(prorabsData);
      }
      catch (e) {
        console.error('Ошибка при загрузке мастеров:', e);
      }
    }

    getMastersFunc();
  }, [toRefresh]);

  useEffect(() => {
    async function getPeopleFunc() {
      try {
        const data = await getPeople();
        const peopleWithModels = await Promise.all(data.map(async (person) => {
          const models = await getMasterModels(person.$id, false);
          return {
            ...person,
            modelsCount: models.length
          };
        }));
        setPeople(peopleWithModels);
      }
      catch (e) {
        console.log(e)
      }
    }

    getPeopleFunc();
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

    if (iconUpdateTimer) {
      clearTimeout(iconUpdateTimer);
    }

    const timer = setTimeout(() => {
      updateOrder(order)
    }, 1000);

    setIconUpdateTimer(timer);
  };

  const handleOperationUpdate = (iconIndex, newStatus) => {
    const updatedOperations = [...(details.operations || Array(13).fill(0))];
    updatedOperations[iconIndex] = newStatus;
    setDetails({ ...details, operations: updatedOperations });

    const orderIndex = orders.findIndex(order => order.$id === details.order.$id);
    if (orderIndex !== -1) {
      const modIndex = orders[orderIndex].models.findIndex(mod => mod.id === details.id);
      if (modIndex !== -1) {
        const newIcons = [...orders[orderIndex].models[modIndex].icons];
        newIcons[iconIndex] = newStatus;
        const updatedModule = { ...orders[orderIndex].models[modIndex], icons: newIcons };
        const updatedModules = [...orders[orderIndex].models];
        updatedModules[modIndex] = updatedModule;
        const updatedOrders = [...orders];
        updatedOrders[orderIndex].models = updatedModules;
        setOrders(updatedOrders);
      }
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setToRefresh(prev => prev + 1);
    setRefreshing(false);
  };

  // Filter people based on search query
  const filteredPeople = people.filter(person =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filterModels = (order) => {
    if (!order.models) return [];

    return order.models.filter(model => {
      // Пропускаем архивные
      if (model.archived) return false;

      // Проверяем условие: bg === 3 ИЛИ (bg === 0 И первые 4 иконки имеют статус 1)
      if (model.bg === 3) return true;

      if (model.bg === 0) {
        // Проверяем, что первые 4 иконки имеют статус 2
        const firstFourIconsAreTwo = model.icons?.slice(0, 4).every(icon => icon === 1);
        return firstFourIconsAreTwo;
      }

      return false;
    });
  };

  if (details.visible === 1) {
    return <OrderDetails details={details} setDetails={setDetails} />;
  } else if (details.visible === 2) {
    return <ModelDetails details={details} setDetails={setDetails} />;
  } else {
    return (
      <View style={styles.container}>
        <ScrollView
          className="bg-light h-full"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
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
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  personCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  personInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  personName: {
    fontSize: 16,
    fontWeight: '500',
  },
  personDetails: {
    color: '#666',
  },
});

export default Map;