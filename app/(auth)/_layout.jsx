import { Redirect, Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { Loader } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useState, useEffect } from "react";

const AuthLayout = () => {
  const { loading, isLogged } = useGlobalContext();
  const [net, setNet] = useState(true);

  if (!loading && isLogged) return <Redirect href="/home" />;

  console.log(isLogged);

  return (
    <>
      <Stack>
        <Stack.Screen
          name="sign-in"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="sign-up"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="help"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="noNet"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      <Loader isLoading={loading} />
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default AuthLayout;
