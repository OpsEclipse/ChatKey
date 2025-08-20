// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyDr6hiHfSHAHlSYdjby93mMxqczrDSmwq8',
	authDomain: 'chatter-d2907.firebaseapp.com',
	projectId: 'chatter-d2907',
	storageBucket: 'chatter-d2907.firebasestorage.app',
	messagingSenderId: '42260212266',
	appId: '1:42260212266:web:5afd08a3a70e01efabb153',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
	persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const db = getFirestore(app);
