import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './home/HomeScreen';
import ForgotPassWordScreen from './login/ForgotPasswordScreen';
import LoginScreen from './login/LoginScreen';
import { BottomFabBar } from 'rn-wave-bottom-bar';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FriendScreen from './friends/FriendScreen';
import ChatScreen from './chat/ChatScreen';
import NotificationScreen from './notifications/NotificationScreen';
import PersonalProfile from './profile/PersonalProfile';
import AddPostScreen from './posts/AddPostScreen';
import PrivacyPostScreen from './posts/PrivacyPostScreen';
import SearchScreen from './SearchScreen';
import PrivateChatScreen from './chat/PrivateChatScreen';
import EditProfile from './profile/EditProfile';
import NotificationDetail from './notifications/NotificationDetail';

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
                        color: '#FFFFFF', 
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
                        color: '#FFFFFF', 
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
                name="NotificationStackNavigation"
                options={{
                    // tabBarLabel: 'Home',
                    tabBarIcon: ({ color = '#FFFFFF', size = 15 }) => (
                        <Icon name="bell" color={color} size={size} />
                    ),
                    tabBarLabelStyle: {
                        color: '#FFFFFF', // Thay đổi màu chữ thành màu trắng tại đây
                    },
                }}
                component={NotificationStackNavigation}

            />
            <BottomRNStackUI.Screen
                name="PersonalStackNavigation"
                options={{
                    // tabBarLabel: 'Home',
                    tabBarIcon: ({ color = '#FFFFFF', size = 15 }) => (
                        <Icon name="bars" color={color} size={size} />
                    ),
                    tabBarLabelStyle: {
                        color: '#FFFFFF', // Thay đổi màu chữ thành màu trắng tại đây
                    },
                }}
                component={PersonalStackNavigation}

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

const PersonalStack = createStackNavigator();
function PersonalStackNavigation() {
    return (
        <PersonalStack.Navigator
            screenOptions={{
                headerShown: false,
            }}>
            <PersonalStack.Screen name="PersonalProfile" component={PersonalProfile} />
            <PersonalStack.Screen name="EditProfile" component={EditProfile} />
        </PersonalStack.Navigator>
    );
}

const NotificationStack = createStackNavigator();
function NotificationStackNavigation() {
    return (
        <NotificationStack.Navigator
            screenOptions={{
                headerShown: false,
            }}>
            <NotificationStack.Screen name="NotificationScreen" component={NotificationScreen} />
            <NotificationStack.Screen name="NotificationDetail" component={NotificationDetail} />
        </NotificationStack.Navigator>
    );
}


export default AuthStackNavigation;
