import { createUserWithEmailAndPassword, updateProfile } from '@firebase/auth';
import { Link, useRouter } from 'expo-router';
import { auth, db } from 'FirebaseConfig';
import { useRef, useState } from 'react';
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useUserProfile } from './user';
import { addDoc, collection } from 'firebase/firestore';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const userRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const Router = useRouter();
  const { setUser } = useUserProfile();
  async function addUserToDb(userId: string) {
    const messagesRef = collection(db, 'users');
    await addDoc(messagesRef, {});
  }
  const signUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, {
        displayName: displayName,
      });
      setUser({
        id: user.uid,
        name: user.displayName ?? '', // safe fallback
      });
      await addUserToDb(user.uid);
      console.log(user);
      Router.push('/(tabs)/');
    } catch (err: any) {
      console.log(err);
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Scrollable content */}

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled">
        <View className="mt-6 px-8">
          <Text className="mb-2 text-[24px] font-extrabold">Sign up</Text>
          <Text className="font-regular mb-6 text-[12px] color-[#71727A]">
            Create an account to get started
          </Text>
          <TextInput
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Name"
            autoCorrect={false}
            keyboardType="default"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            className="mb-4 h-12 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 text-[15px]"
            textAlignVertical="center"
          />
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
            ref={userRef}
          />

          {/* Password Input */}
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
            ref={passwordRef}
            returnKeyType="done"
            onSubmitEditing={signUp}
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
          onPress={() => console.log('Login', email, password)}
          className="h-12 w-full items-center justify-center rounded-lg bg-blue-600"
          onPressOut={signUp}>
          <Text className="text-base font-bold text-white">Sign up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default SignupPage;
