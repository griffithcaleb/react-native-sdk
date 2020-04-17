import React from 'react';
import { View, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons'
import { Iterable, IterableConfig } from 'react-native-iterable'

import HomeTab from './HomeTab'
import SettingsTab from './SettingsTab'
import { Coffee, coffees } from './Data'


// ITERABLE:
const apiKey = "9db32a2d72b9476196cbca44d580a05e"

interface Props { }
export default class App extends React.Component {
  constructor(props: Props) {
    super(props)
    this.homeTabRef = React.createRef()
    // ITERABLE:
    const config = new IterableConfig()
    Iterable.initialize(apiKey, config)

    // :tqm (remove - navigation test)
    setTimeout(() => {
      this.navigate(coffees[2])
    }, 5000);
  }

  render() {
    const Tab = createBottomTabNavigator();

    return (
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              if (route.name == 'Home') {
                return <Icon name="ios-home" size={size} color={color} />
              } else {
                return <Icon name="ios-settings" size={size} color={color} />
              }
            },
          })}
          tabBarOptions={{
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
            showIcon: true,
          }}
        >
          <Tab.Screen name="Home" options={{ title: "Coffees" }}>
            {props => <HomeTab ref={this.homeTabRef} {...props} />}
          </Tab.Screen>
          <Tab.Screen name="Settings" component={SettingsTab} />
        </Tab.Navigator>
      </NavigationContainer>
    )
  }

  private homeTabRef: any

  private navigate(coffee: Coffee) {
    this.homeTabRef.current.navigate(coffee)
  }
}
