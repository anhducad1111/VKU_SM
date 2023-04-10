/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import app from './firebase.config';
import AuthStackNavigation from './views/MainNavigator';

AppRegistry.registerComponent(appName, () => AuthStackNavigation);
