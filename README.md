<div align="center">
  <br />
    <a href="https://youtu.be/ZBCUegTZF7M?si=ubt0vk70lSjt6DCs" target="_blank">
      <img src="https://i.postimg.cc/5NR9bxFM/Sora-README.png" alt="Project Banner">
    </a>
  <br />

  <div>
    <img src="https://img.shields.io/badge/-React_Native-black?style=for-the-badge&logoColor=white&logo=react&color=61DAFB" alt="react.js" />
    <img src="https://img.shields.io/badge/-Appwrite-black?style=for-the-badge&logoColor=white&logo=appwrite&color=FD366E" alt="appwrite" />
    <img src="https://img.shields.io/badge/NativeWind-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="nativewind" />
  </div>

  <h3 align="center">Video Sharing App</h3>

   <div align="center">
     Build this project step by step with our detailed tutorial on <a href="https://www.youtube.com/@javascriptmastery/videos" target="_blank"><b>JavaScript Mastery</b></a> YouTube. Join the JSM family!
    </div>
</div>

## 📋 <a name="table">Table of Contents</a>

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)
5. 🕸️ [Snippets](#snippets)
6. 🔗 [Links](#links)
7. 🚀 [More](#more)

## 🚨 Tutorial

This repository contains the code corresponding to an in-depth tutorial available on our YouTube channel, <a href="https://www.youtube.com/@javascriptmastery/videos" target="_blank"><b>JavaScript Mastery</b></a>. 

If you prefer visual learning, this is the perfect resource for you. Follow our tutorial to learn how to build projects like these step-by-step in a beginner-friendly manner!

<a href="https://youtu.be/ZBCUegTZF7M?si=ubt0vk70lSjt6DCs" target="_blank"><img src="https://github.com/sujatagunale/EasyRead/assets/151519281/1736fca5-a031-4854-8c09-bc110e3bc16d" /></a>

## <a name="introduction">🤖 Introduction</a>

Built with React Native for seamless user experiences, Animatable for captivating animations, and integrated with the dependable backend systems of Appwrite, 
this app showcases impressive design and functionality, enabling seamless sharing of AI videos within the community.

If you're getting started and need assistance or face any bugs, join our active Discord community with over 27k+ members. It's a place where people help each other out.

<a href="https://discord.com/invite/n6EdbFJ" target="_blank"><img src="https://github.com/sujatagunale/EasyRead/assets/151519281/618f4872-1e10-42da-8213-1d69e486d02e" /></a>

## <a name="tech-stack">⚙️ Tech Stack</a>

- React Native
- Expo
- Nativewind
- Animatable
- Appwrite

## <a name="features">🔋 Features</a>

👉 **Onboarding Screen**: Engaging graphics and clear instructions welcome users to the app.

👉 **Robust Authentication & Authorization System**: Secure email login safeguards user accounts.

👉 **Dynamic Home Screen with Animated Flat List**: Smoothly animated flat list showcases the latest videos for seamless browsing.

👉 **Pull-to-Refresh Functionality**: Users can refresh content with a simple pull gesture for up-to-date information.

👉 **Full-Text Search Capability**: Efficiently search through videos with real-time suggestions and instant results.

👉 **Tab Navigation**: Navigate between sections like Home, Search, and Profile with ease using tab navigation.

👉 **Post Creation Screen for Uploading Media**: Upload video and image posts directly from the app with integrated media selection.

👉 **Profile Screen with Detailed Insights**: View account details and activity, including uploaded videos and follower count, for a personalized experience.

👉 **Responsiveness**: Smooth performance and adaptability across various devices and screen sizes for a consistent user experience.

👉 **Animations**: Dynamic animations using the Animatable library to enhance user interaction and engagement throughout the app's UI.

and many more, including code architecture and reusability 

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Cloning the Repository**

```bash
git clone https://github.com/adrianhajdin/aora.git
cd aora
```
**Installation**

Install the project dependencies using npm:

```bash
npm install
```

**Running the Project**

```bash
npm start
```

**Expo Go**

Download the [Expo Go](https://expo.dev/go) app onto your device, then use it to scan the QR code from Terminal and run.

## <a name="snippets">🕸️ Snippets</a>

<details>
<summary><code>tailwind.config.js</code></summary>

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#161622",
        secondary: {
          DEFAULT: "#FF9C01",
          100: "#FF9001",
          200: "#FF8E01",
        },
        black: {
          DEFAULT: "#000",
          100: "#1E1E2D",
          200: "#232533",
        },
        gray: {
          100: "#CDCDE0",
        },
      },
      fontFamily: {
        pthin: ["Poppins-Thin", "sans-serif"],
        pextralight: ["Poppins-ExtraLight", "sans-serif"],
        plight: ["Poppins-Light", "sans-serif"],
        pregular: ["Poppins-Regular", "sans-serif"],
        pmedium: ["Poppins-Medium", "sans-serif"],
        psemibold: ["Poppins-SemiBold", "sans-serif"],
        pbold: ["Poppins-Bold", "sans-serif"],
        pextrabold: ["Poppins-ExtraBold", "sans-serif"],
        pblack: ["Poppins-Black", "sans-serif"],
      },
    },
  },
  plugins: [],
};
```

</details>

<details>
<summary><code>Font Loaded</code></summary>

```javascript
const [fontsLoaded, error] = useFonts({
  "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
  "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
  "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
  "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
  "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
  "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
  "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
  "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
});

useEffect(() => {
  if (error) throw error;

  if (fontsLoaded) {
    SplashScreen.hideAsync();
  }
}, [fontsLoaded, error]);

if (!fontsLoaded && !error) {
  return null;
}
```

</details>

<details>
<summary><code>Dummy Videos for Appwrite</code></summary>

```javascript
const videos = [
  {
    title: "Get inspired to code",
    thumbnail:
      "https://i.ibb.co/tJBcX20/Appwrite-video.png",
    video:
      "https://player.vimeo.com/video/949579770?h=897cd5e781",
    prompt:
      "Create a motivating AI driven video aimed at inspiring coding enthusiasts with simple language",
  },
  {
    title: "How AI Shapes Coding Future",
    thumbnail:
      "https://i.ibb.co/Xkgk7DY/Video.png",
    video:
      "https://player.vimeo.com/video/949581999?h=4672125b31",
    prompt: "Picture the future of coding with AI. Show AR VR",
  },
  {
    title: "Dalmatian's journey through Italy",
    thumbnail:
      "https://i.ibb.co/CBYzyKh/Video-1.png",
    video:
      "https://player.vimeo.com/video/949582778?h=d60220d68d",
    prompt:
      "Create a heartwarming video following the travels of dalmatian dog exploring beautiful Italy",
  },
  {
    title: "Meet small AI friends",
    thumbnail:
      "https://i.ibb.co/7XqVPVT/Photo-1677756119517.png",
    video:
      "https://player.vimeo.com/video/949616422?h=d60220d68d",
    prompt:
      "Make a video about a small blue AI robot blinking its eyes and looking at the screen",
  },
  {
    title: "Find inspiration in Every Line",
    thumbnail:
      "https://i.ibb.co/mGfCYJY/Video-2.png",
    video:
      "https://player.vimeo.com/video/949617485?h=d60220d68d",
    prompt:
      "A buy working on his laptop that sparks excitement for coding, emphasizing the endless possibilities and personal growth it offers",
  },
  {
    title: "Japan's Blossoming temple",
    thumbnail:
      "https://i.ibb.co/3Y2Nk7q/Bucket-215.png",
    video:
      "https://player.vimeo.com/video/949618057?h=d60220d68d",
    prompt: "Create a captivating video journey through Japan's Sakura Temple",
  },
  {
    title: "A Glimpse into Tomorrow's VR World",
    thumbnail:
      "https://i.ibb.co/C5wXXf9/Video-3.png",
    video:
      "https://player.vimeo.com/video/949620017?h=d60220d68d",
    prompt: "An imaginative video envisioning the future of Virtual Reality",
  },
  {
    title: "A World where Ideas Grow Big",
    thumbnail:
      "https://i.ibb.co/DzXRfyr/Bucket-59038.png",
    video:
      "https://player.vimeo.com/video/949620200?h=d60220d68d",
    prompt:
      "Make a fun video about hackers and all the cool stuff they do with computers",
  },
];
```

</details>

## <a name="links">🔗 Links</a>

Assets and constants used in the project can be found [here](https://drive.google.com/drive/folders/1pckq7VAoqZlmsEfYaSsDltmQSESKm8h7?usp=sharing)

## <a name="more">🚀 More</a>

**Advance your skills with Next.js 14 Pro Course**

Enjoyed creating this project? Dive deeper into our PRO courses for a richer learning adventure. They're packed with detailed explanations, cool features, and exercises to boost your skills. Give it a go!

<a href="https://jsmastery.pro/next14" target="_blank">
<img src="https://github.com/sujatagunale/EasyRead/assets/151519281/557837ce-f612-4530-ab24-189e75133c71" alt="Project Banner">
</a>

<br />
<br />

**Accelerate your professional journey with the Expert Training program**

And if you're hungry for more than just a course and want to understand how we learn and tackle tech challenges, hop into our personalized masterclass. We cover best practices, different web skills, and offer mentorship to boost your confidence. Let's learn and grow together!

<a href="https://www.jsmastery.pro/masterclass" target="_blank">
<img src="https://github.com/sujatagunale/EasyRead/assets/151519281/fed352ad-f27b-400d-9b8f-c7fe628acb84" alt="Project Banner">
</a>

#
















    <script>
        const texts = [
            "спортивное приложение",
            "релиз 1 марта",
            "скажи физкультпривет"
        ];

        let index = 0;

        setInterval(() => {
            const txt = document.getElementById('text');
            txt.style.opacity = 0;
            txt.style.filter = "blur(5px)";

            setTimeout(() => {
                index = (index + 1) % texts.length;
                txt.innerHTML = texts[index];
                txt.style.opacity = 1;
                txt.style.filter = "blur(0)";
            }, 250);
        }, 2000);
    </script>















  const today = {
    trainings: 1,
  }

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 6) {
        return "доброй ночи";
    } else if (hour < 12) {
        return "доброе утро";
    } else if (hour < 18) {
        return "добрый день";
    } else {
        return "добрый вечер";
    }
};

const firstName = user?.name.split(" ")[0];


<View className="bg-[#f3f7f8] h-[300px] w-full">
      <Text className="text-[#00000068] font-pregular text-[23px] mx-6 leading-[26px] pt-[48px]">
      {`${getGreeting()}`},
      <Text className="text-[#000000d0] font-pbold"> {`${firstName}`}</Text>
  , сегодня ещё
  {today.trainings === 0 ? (
    <Text> нет тренировок</Text>
  ) : (
    <Text className="text-[#000000d0] font-pbold"> {today.trainings} { 
      today.trainings % 10 === 1 && today.trainings % 100 !== 11 
        ? 'тренировка' 
        : (today.trainings % 10 >= 2 && today.trainings % 10 <= 4 && (today.trainings % 100 < 10 || today.trainings % 100 >= 20) 
          ? 'тренировки' 
          : 'тренировок')} 

          
    </Text>
  )}
</Text>
      </View>












































      <?xml version="1.0" encoding="utf-8"?>
<fragment xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:map="http://schemas.android.com/apk/res-auto"
    android:name="com.google.android.gms.maps.SupportMapFragment"
    android:id="@+id/map"
    android:layout_width="match_parent"
    android:layout_height="match_parent"/>

<receiver android:name=".MyWidgetProvider" android:exported="true">
    <intent-filter>
        <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
    </intent-filter>

    <meta-data
        android:name="android.appwidget.provider"
        android:resource="@xml/widget_provider" />
</receiver>

<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
<uses-permission android:name="android.permission.VIBRATE" />







































































import React, { useState } from 'react';
import { ScrollView, View, Text } from 'react-native';

const Calendar = () => {

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedDay, setSelectedDay] = useState(0); // добавляем состояние для выделенного дня

    const getStartAndEndDateOfWeek = (index) => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + (index * 7));
        const startDate = new Date(currentDate);
        startDate.setDate(startDate.getDate() - startDate.getDay() + 1); // Пн
        const endDate = new Date(currentDate);
        endDate.setDate(endDate.getDate() - endDate.getDay() + 7); // Вс
        return { startDate, endDate };
    };

    const months = [
        'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
        'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
    ];

    const { startDate } = getStartAndEndDateOfWeek(currentIndex);

    const handleScroll = (event) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / 300);
        setCurrentIndex(index);

        // Обновление выделенного дня по текущей неделе
        const currentDay = new Date().getDay(); // Получаем текущий день
        setSelectedDay(currentDay === 0 ? 6 : currentDay - 1); // Для корректного индекса: Пн = 0, Вт = 1, ..., Вс = 6
    };

    return (
        <View className="bg-[#111] w-full h-[100vh]">
            <ScrollView
                horizontal={true}
                pagingEnabled={true}
                onScroll={handleScroll}
                className="w-full bg-[#000] h-[50px] snap-x snap-mandatory">

                {[...Array(10)].map((_, index) => (
                    <View key={index} className="w-[100vw] flex items-center justify-center">
                        <Text className="text-white font-pbold text-[20px]">
                            {`${getStartAndEndDateOfWeek(index).startDate.getDate()} ${months[getStartAndEndDateOfWeek(index).startDate.getMonth()]} - ${getStartAndEndDateOfWeek(index).endDate.getDate()} ${months[getStartAndEndDateOfWeek(index).endDate.getMonth()]}`}
                        </Text>
                    </View>
                ))}
            </ScrollView>

            <View className="w-full bg-[#000] flex-row justify-around p-4">
                {['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'].map((day, index) => (
                    <Text
                        key={index}
                        className={`text-white font-pbold text-[18px] text-center w-[40px] ${selectedDay === index ? 'bg-white text-[#111]' : ''}`}>
                        {day}
                    </Text>
                ))}
            </View>

            <ScrollView className="flex-1 bg-[#111]">
                <Text className="text-white font-pbold text-[18px] mx-4 mt-2">планы на пн</Text>
            </ScrollView>
        </View>
    );
};

export default Calendar;






































<TouchableOpacity className="mb-0 flex flex-row justify-center items-center">
            <Text className="text-xl font-pbold relative text-[#fff] mt-[16px] text-center mb-4">блогеры</Text>
            <Image
              className="w-[25px] h-[25px] ml-2"
              source={icons.right}
            />
          </TouchableOpacity>

          <ScrollView horizontal={true}
            snapToInterval={(width * 0.9225)} // Устанавливаем величину для "щелчка" на следующий элемент
            decelerationRate="fast" // Быстрая инерция прокрутки
            showsHorizontalScrollIndicator={false} // Отключаем горизонтальную полосу прокрутки
            className="relative w-[100vw] h-[135px] rounded-3xl pl-4 mb-[8px]">

            {users.map(user => {
              var newList = user?.sports.map(str => {
                const matchedObject = types.find(type => type.key === str);
                return matchedObject ? matchedObject.title : null;
              }).filter(title => title !== null); // Удаляем значения null из нового списка

              return (
                <TouchableOpacity activeOpacity={1} key={user} onPress={() => navigation.navigate('otherProfile', { user })} className="w-[90vw] rounded-3xl h-full mr-[3vw] bg-[#0b0b0b]">
                  <Image
                    source={{ uri: user.imageUrl }}
                    className="w-[45vw] h-[135px] rounded-3xl absolute bg-[#252525]"
                  />
                  <LinearGradient start={{ x: 0.6, y: 0 }} end={{ x: 0.73, y: 0 }} className="h-full absolute left-0 top-0 w-[50vw] z-10" colors={['#fff0', '#0b0b0b']}></LinearGradient>
                  <Text className="text-[#fff] text-[18px] font-pbold text-right mr-4 mt-2 z-20 mb-[6px]">{user.name}</Text>
                  <View className="ml-[38vw] max-w-[52vw] z-20 flex w-full flex-row flex-wrap justify-end pr-[12px]">
                    {newList.map(kind =>
                      <View className="bg-[#121212] border-[1px] border-[#191919] shadow-lg flex relative rounded-3xl m-[2px] pt-[1px] pb-[3px] px-[9px] z-20"><Text className="font-pregular text-[#bdbdbd]">{kind}</Text></View>
                    )}
                  </View>
                </TouchableOpacity>
              )
            })}
          </ScrollView>








           <LinearGradient colors={['#111', '#222']} className="h-[190px] mx-4 px-4 rounded-3xl">
                <View className="flex-row flex-wrap justify-start pt-4">
                  {rows.map((row, rowIndex) => (
                    <View key={rowIndex} className="flex-row w-full justify-start">
                      {row.map(({ day, isCurrentMonth }, dayIndex) => {
                        const isToday = today.date() === day && today.month() === currentMonth.month() && today.year() === currentMonth.year();
                        const isWeekend = dayIndex === 5 || dayIndex === 6; // Суббота и воскресенье

                        let textColor = isCurrentMonth ? 'text-white' : 'text-[#838383]';
                        if (isToday && isCurrentMonth) {
                          textColor = 'text-black bg-white rounded-full'; // Выделение сегодняшнего дня
                        } else if (isWeekend) {
                          textColor = isCurrentMonth ? 'text-red-500' : textColor; // Красный цвет выходных текущего месяца
                        }

                        return (
                          <View key={dayIndex} className="flex-1 py-0">
                            <Text className={`text-left text-[16px] font-pregular ${textColor} ${isToday && isCurrentMonth ? 'font-pbold' : ''}`}>
                              {day}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  ))}
                </View>
              </LinearGradient>












              
      <MapView
        style={{ flex: 1 }}
        initialRegion={initialRegion}
        showsUserLocation={true}
        followUserLocation={true}
        onPress={creatingRoute ? handleMapPress : () => { setShowingDetails(false) }}
      >
        {routes.length !== 0 && (
          routes.map((route, index) => (
            route.coord && route.coord.length >= 2 && (
              <Polyline
                key={index}
                coordinates={route.coord}
                strokeColor='black'
                strokeWidth={3}
                tappable
                onPress={() => showRouteDetails(route)}
              />
            )))
        )}

        {newRouteCoords.length > 0 && (
          <Polyline
            coordinates={newRouteCoords}
            strokeColor='blue'
            strokeWidth={3}
          />
        )}
      </MapView>
