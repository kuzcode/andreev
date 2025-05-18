import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Loader } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";


const AdditionalLayout = () => {
  const { loading, isLogged } = useGlobalContext();
  if (!loading && !isLogged) return <Redirect href="/sign-up" />;

  return (
    <>
      <Stack>
        <Stack.Screen
          name="today"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="sleep"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="live"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="setValues"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="requestCo"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="levels"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="co"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="notifications"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="additional"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="gymbro"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="requestGymbro"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="awards"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="people"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="communities"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="createComm"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="map"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="newTrack"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="music"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="programms"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="calendar"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="contact"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="leaders"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="card"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="profileSettings"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="trackers"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="track"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="mealStart"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="meal"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="typesOfSport"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="otherProfile"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="weight"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="social"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      <Loader isLoading={loading} />
    </>
  );
};

export default AdditionalLayout;
