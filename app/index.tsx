import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  SafeAreaView,
  Image,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { auth } from '../FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useUserProfile } from './user';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const passwordRef = useRef<TextInput>(null);
  const Router = useRouter();
  const { setUser } = useUserProfile();
  const signIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setUser({
        id: user.uid,
        name: user.displayName ?? '', // safe fallback
      });
      Router.push('/(tabs)/');
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
      <Image source={require('./splash.png')} className="h-1/2 w-full" />
      <SafeAreaView className="flex-1 bg-white">
        {/* Scrollable content */}

        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled">
          <View className="mt-6 px-8">
            <Text className="mb-6 text-[24px] font-extrabold">Welcome!</Text>

            {/* Email Input */}
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              className="mb-4 h-12 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 text-[15px]"
              textAlignVertical="center"
            />

            {/* Password Input */}
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              secureTextEntry
              ref={passwordRef}
              returnKeyType="done"
              onSubmitEditing={signIn}
              className="mb-4 h-12 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 text-[15px]"
              textAlignVertical="center"
            />

            <Link href={'/forgot-password'} asChild>
              <Text className="mt-2 font-medium text-[#006FFD]">Forgot Password?</Text>
            </Link>
          </View>
        </ScrollView>

        {/* Login Button fixed above keyboard */}
        <View className="px-8 pb-6">
          <TouchableOpacity
            className="h-12 w-full items-center justify-center rounded-lg bg-blue-600"
            onPressOut={signIn}>
            <Text className="text-base font-bold text-white">Login</Text>
          </TouchableOpacity>
          <View className="mt-4 flex-row items-center justify-center gap-1">
            <Text className=" self-center text-base opacity-70">Not a member?</Text>
            <Link href={'/signUp'} asChild>
              <Text className=" font-medium text-[#006FFD]">Register now</Text>
            </Link>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
