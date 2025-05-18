import React from 'react';
import { Widget } from 'react-native-widgetkit';

const MyWidget = () => {
  return (
    <Widget
      title="Мой Виджет"
      style={{ backgroundColor: '#ffffff' }}
    >
      <Text>Привет, это мой виджет!</Text>
    </Widget>
  );
};

export default MyWidget;
