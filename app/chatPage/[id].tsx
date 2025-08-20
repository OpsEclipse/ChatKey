import {
  View,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ChatItem } from 'app/components/ChatItem';
import { ChatInput } from 'app/components/ChatInput';
import { useEffect, useState } from 'react';
import { useUserProfile } from '../user';

import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from 'FirebaseConfig';

export async function createChat(currentUser: { id: string; name: string }) {
  if (!currentUser) return;

  // 1. Create chat document in "chatLog" collection (auto-ID)
  const chatRef = await addDoc(collection(db, 'chatLogs'), {
    createdAt: serverTimestamp(),
    createdBy: currentUser.id, // who started the chat
  });

  return chatRef.id; // return the new chat ID
}

export async function sendMessage(chatId: string, text: string, user: any) {
  // 1. Build a reference to the "messages" subcollection of this chat
  const messagesRef = collection(db, 'chatLogs', chatId, 'messages');

  // 2. Add a new document inside "messages"
  await addDoc(messagesRef, {
    text: text, // the actual message text
    senderId: user.id, // unique ID of the sender
    senderName: user.name, // display name of the sender
    createdAt: serverTimestamp(), // server-generated timestamp (avoids client clock issues)
  });
}

function subscribeToMessages(chatId: string, callback: (msgs: any[]) => void) {
  const q = query(
    collection(db, 'chatLogs', chatId, 'messages'),
    orderBy('createdAt', 'asc') // ensure order by time
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(messages);
  });
}

export default function ChatPage() {
  const { user } = useUserProfile();
  const [text, setText] = useState('');

  const router = useRouter();

  const [messages, setMessages] = useState([]);
  const [showId, setShowId] = useState(false)

  const parseMessages = (msgs) => {
    let prev: boolean | undefined;
    let lastIndexes : any = [];
    let neww = msgs.map((chat: any, i: number) => {
      const sentByUser = chat.senderId === user?.id;
      let first = false;
      let last = false;

      if (prev !== undefined) {
        if (prev !== chat.senderId) {
          first = true;
          // optionally mark last on previous message
          lastIndexes.push(i - 1);
        }
      } else {
        first = true;
      }
      prev = chat.senderId;

      return { ...chat, sentByUser, first, last };
    });
    lastIndexes.map((i:number) => {
      neww[i].last = true;
    });
    if (neww.length > 0) {
      neww[neww.length - 1].last = true;
    }
    return neww;
  };

  // this grabs the route param
  const { id, friend } = useLocalSearchParams<{ id: string; friend: string }>();

  useEffect(() => {
    // Subscribe to messages for a specific chat
    const unsubscribe = subscribeToMessages(id, (msgs) => {
      const parsed = parseMessages(msgs); // parse messages if needed
      setMessages(parsed); // update React state
      console.log('Received messages:', parsed); // logs whenever messages update
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // iOS vs Android
      keyboardVerticalOffset={Platform.OS === 'ios' ? -40 : 0}
    >
      <SafeAreaView className="flex-1 flex-col gap-[9px]">
        <View className="h-[56px] flex-row items-center justify-between px-6">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowId(prev => !prev)}>
            <Text className="text-[16px] font-bold">{showId ? `Chat ID: ${id}` : friend}</Text>
          </TouchableOpacity>
          <Image
            source={{
              uri: 'https://westwood.fmpsdschools.ca/uploads/7688/untitleddesign43/1711644250-350w_untitleddesign43.png',
            }}
            className="h-12 w-12 rounded-[16px]"
          />
        </View>
        <FlatList
          data={[...messages].reverse()}
          renderItem={({ item }) => (
            <ChatItem
              message={item.text}
              sentByUser={item.sentByUser}
              last={item.last || false}
              first={item.first || false}
              friend={item.senderName}
              me={user?.name}
            />
          )}
          keyExtractor={(item, index) => item.id || index.toString()}
          inverted={true}
          className="h-[420px]"
        />
        <View className="h-[72px] w-full">
          <ChatInput
            value={text}
            onChangeText={(val: string) => {
              setText(val);
            }}
            chatId = {id}
          />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
