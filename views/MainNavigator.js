import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import ForgotPassWordScreen from './ForgotPasswordScreen';
import LoginScreen from './LoginScreen';
import { BottomFabBar } from 'rn-wave-bottom-bar';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FriendScreen from './FriendScreen';
import ChatScreen from './ChatScreen';
import NotificationScreen from './NotificationScreen';
import SettingScreen from './SettingScreen';
import AddPostScreen from './AddPostScreen';
import PrivacyPostScreen from './PrivacyPostScreen';
import SearchScreen from './SearchScreen';
import PrivateChatScreen from './PrivateChatScreen';

const AuthStack = createStackNavigator();
function AuthStackNavigation() {
    return (
        <NavigationContainer>
            <AuthStack.Navigator
                screenOptions={{
                    headerShown: false,
                }}>
                <AuthStack.Screen name="LoginScreen" component={LoginScreen} />
                <AuthStack.Screen name="ForgotPasswordScreen" component={ForgotPassWordScreen} />
                <AuthStack.Screen name="BottomStackNavigationUI" component={BottomStackNavigationUI} />
            </AuthStack.Navigator>
        </NavigationContainer>
    );
}


const BottomRNStackUI = createBottomTabNavigator();
function BottomStackNavigationUI() {
    return (
        <BottomRNStackUI.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#262626',
                tabBarActiveBackgroundColor: '#262626',
                tabBarInactiveBackgroundColor: 'red',
                headerShown: false,
            }}
            tabBar={(props) => (
                <BottomFabBar
                    mode={'circle' | 'default'}
                    isRtl={false}
                    // Add Shadow for active tab bar button
                    focusedButtonStyle={{
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: 7,
                        },
                        shadowOpacity: 0.41,
                        shadowRadius: 9.11,
                        elevation: 14,
                    }}
                    // - You can add the style below to show screen content under the tab-bar
                    // - It will makes the "transparent tab bar" effect.
                    bottomBarContainerStyle={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                    }}
                    {...props}
                />
            )}
        >
            <BottomRNStackUI.Screen
                name="HomeScreen"
                options={{
                    // tabBarLabel: 'Home',
                    tabBarIcon: ({ color = '#FFFFFF', size = 15 }) => (
                        <Icon name="home" color={color} size={size} />
                    ),
                    tabBarLabelStyle: {
                        color: '#FFFFFF', // Thay đổi màu chữ thành màu trắng tại đây
                    },
                }}
                component={HomeStackNavigation}

            />
            <BottomRNStackUI.Screen
                name="FriendScreen"
                options={{
                    // tabBarLabel: 'Home',
                    tabBarIcon: ({ color = '#FFFFFF', size = 15 }) => (
                        <Icon name="users" color={color} size={size} />
                    ),
                    tabBarLabelStyle: {
                        color: '#FFFFFF', // Thay đổi màu chữ thành màu trắng tại đây
                    },
                }}
                component={FriendScreen}

            />
            <BottomRNStackUI.Screen
                name="ChatStack"
                options={{
                    // tabBarLabel: 'Home',
                    tabBarIcon: ({ color = '#FFFFFF', size = 15 }) => (
                        <Icon name="comments" color={color} size={size} />
                    ),
                    tabBarLabelStyle: {
                        color: '#FFFFFF', // Thay đổi màu chữ thành màu trắng tại đây
                    },
                }}
                component={ChatStackNavigation}

            />
            <BottomRNStackUI.Screen
                name="NotificationScreen"
                options={{
                    // tabBarLabel: 'Home',
                    tabBarIcon: ({ color = '#FFFFFF', size = 15 }) => (
                        <Icon name="bell" color={color} size={size} />
                    ),
                    tabBarLabelStyle: {
                        color: '#FFFFFF', // Thay đổi màu chữ thành màu trắng tại đây
                    },
                }}
                component={NotificationScreen}

            />
            <BottomRNStackUI.Screen
                name="SettingScreen"
                options={{
                    // tabBarLabel: 'Home',
                    tabBarIcon: ({ color = '#FFFFFF', size = 15 }) => (
                        <Icon name="bars" color={color} size={size} />
                    ),
                    tabBarLabelStyle: {
                        color: '#FFFFFF', // Thay đổi màu chữ thành màu trắng tại đây
                    },
                }}
                component={SettingScreen}

            />
        </BottomRNStackUI.Navigator>
    )
}

const HomeStack = createStackNavigator();
function HomeStackNavigation() {
    return (
        <HomeStack.Navigator
            screenOptions={{
                headerShown: false,
            }}>
            <HomeStack.Screen name="LoginScreen" component={HomeScreen} />
            <HomeStack.Screen name="SearchScreen" component={SearchScreen} />
            <HomeStack.Screen name="AddPostScreen" component={AddPostScreen} />
            <HomeStack.Screen name="PrivacyPostScreen" component={PrivacyPostScreen} />
            <HomeStack.Screen name="BottomStackNavigationUI" component={BottomStackNavigationUI} />
        </HomeStack.Navigator>
    );
}

const ChatStack = createStackNavigator();
function ChatStackNavigation() {
    return (
        <ChatStack.Navigator
            screenOptions={{
                headerShown: false,
            }}>
            <ChatStack.Screen name="ChatScreen" component={ChatScreen} />
            <ChatStack.Screen name="PrivateChatScreen" component={PrivateChatScreen} />
        </ChatStack.Navigator>
    );
}


export default AuthStackNavigation;
