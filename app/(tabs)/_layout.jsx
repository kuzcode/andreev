import { StatusBar } from "expo-status-bar";
import { Redirect, Tabs } from "expo-router";
import { Image, Text, View } from "react-native";

import { icons } from "../../constants";
import { Loader } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="flex items-center justify-center gap-[4px]">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-7 h-7"
      />
    </View>
  );
};

const TabLayout = () => {
  const { loading, isLogged } = useGlobalContext();
  //if (!loading && !isLogged) return <Redirect href="/sign-up" />;

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#000",  // #30d158 #248a3d
          tabBarInactiveTintColor: "#97a2b0",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#fff",
            borderTopWidth: 1,
            borderTopColor: "#fff",
            height: 70,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="hammer"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.hammer}
                color={color}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="bookmark"
          options={{
            title: "bookmark",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.create}
                color={color}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="map"
          options={{
            title: "map",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.reverse}
                color={color}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="new"
          options={{
            title: "New",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.search}
                color={color}
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>

      <Loader isLoading={loading} />
    </>
  );
};

export default TabLayout;
