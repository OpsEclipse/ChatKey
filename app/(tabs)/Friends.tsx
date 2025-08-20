import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { db } from 'FirebaseConfig';
import { arrayUnion, collection, doc, setDoc } from 'firebase/firestore';
import { useUserProfile } from 'app/user';

export default function Friends() {
  const [chatId, setChatId] = useState('');
  const { user } = useUserProfile();
  const Router = useRouter();
  async function updateUser() {
    const userRef = doc(db, 'users', user?.id);
    const chatRef = doc(db, 'chatLogs', chatId);
    await setDoc(
      userRef,
      {
        chatsIn: arrayUnion(chatId),
      },
      { merge: true } // merge with existing fields instead of overwriting
    );
    await setDoc(chatRef, { participants: arrayUnion(user?.name) }, { merge: true });
  }
  const handleSubmit = async () => {
    await updateUser();
    Router.push('/(tabs)');
  };
  return (
    <SafeAreaView>
      <View className="mt-6 px-8">
        <Text className="mb-1 text-[24px] font-extrabold">Add some chats!</Text>
        <Text className="mb-6 text-[14px] font-medium opacity-80 pr-1">Enter an existing ID to join a chat, or enter a new ID to create a chat!</Text>

        {/* Email Input */}
        <View className="flex-row items-center gap-2 rounded-lg border border-gray-300 bg-gray-100 px-4 pr-5 text-[15px]">
          <TextInput
            value={chatId}
            onChangeText={setChatId}
            placeholder="Enter Chat Id..."
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="default"
            returnKeyType="next"
            onSubmitEditing={() => {}}
            className=" h-12 flex-1 "
            textAlignVertical="center"
          />
          {chatId && (
            <TouchableOpacity onPress={handleSubmit}>
              <MaterialIcons name="group-add" size={24} color="blue" className=" ml-3" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
