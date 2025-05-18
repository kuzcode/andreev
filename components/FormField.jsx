import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";

import { icons } from "../constants";

const FormField = ({
  title,
  value,
  max,
  measure,
  placeholder,
  handleChangeText,
  otherStyles,
  multiline,
  numberOfStrokes,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`${otherStyles}`}>
      {title && <Text className="text-[18px] text-[#838383] font-pregular mb-1">{title}</Text>}

      <View
        style={{
          height: multiline ? numberOfStrokes * 38 + 12 : 56,
        }}
        className='w-full px-4 bg-light rounded-2xl border-2 border-[#ccd6dd] focus:border-[#3c87ff] flex flex-row items-center'>
        <TextInput
          className="flex-1 font-pregular text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7B7B8B"
          onChangeText={handleChangeText}
          multiline={multiline}
          numberOfLines={numberOfStrokes}
          secureTextEntry={title === "пароль" && !showPassword}
          {...props}
        />

        <Text className="text-[19px] text-[#838383] font-pbold mb-1">{measure}</Text>
        {max && (<Text className="text-[15px] absolute top-[16px] right-[16px] text-right text-[#838383] font-pregular mb-1">{value?.length}/{max}</Text>
        )}
        {title === "пароль" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
