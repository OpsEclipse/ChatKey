import { Link } from 'expo-router';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { SearchBar } from 'app/components/SearchBar';
import { StatusBar } from 'expo-status-bar';
import { ChatOverView } from 'app/components/ChatOverview';
import { useUserProfile } from 'app/user';
import { collection, doc, getDoc, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from 'FirebaseConfig';
import { useCallback, useEffect, useState } from 'react';

function subscribeToLatestMessage(chatId: string, callback: (msg: any) => void) {
  const messagesRef = collection(db, 'chatLogs', chatId, 'messages');
  const q = query(messagesRef, orderBy('createdAt', 'desc'), limit(1));

  return onSnapshot(q, (snapshot) => {
    if (!snapshot.empty) {
      callback(snapshot.docs[0].data());
    } else {
      callback(null);
    }
  });
}
export default function Chats() {
  const { user } = useUserProfile();
  const [chats, setChats] = useState<string[]>([]);
  const [query, setQuery] = useState<string>('');
  const [filteredChats, setFilteredChats] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchChats = async () => {
    if (!user?.id) return;

    // 1. Get user document
    const userRef = doc(db, 'users', user.id);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return;

    const data = userSnap.data();
    const chatIds: string[] = data.chatsIn || [];

    // 2. Fetch each chat document
    const chatDocs = await Promise.all(
      chatIds.map(async (chatId) => {
        const chatRef = doc(db, 'chatLogs', chatId);
        const chatSnap = await getDoc(chatRef);
        if (chatSnap.exists()) return { id: chatId, ...chatSnap.data() };
        return null;
      })
    );

    // Filter out nulls
    setChats(chatDocs.filter((doc) => doc !== null && doc !== undefined)); // ✅);
  };
  useEffect(() => {
    fetchChats();
  }, [user]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchChats();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        setFilteredChats(
          chats.filter(
            (chat) => {
              const title = chat.participants
                .filter((party: any) => party !== user?.name)
                .toString();
              return title.toLowerCase().includes(query.toLowerCase());
            } // case-insensitive search
          )
        );
      } else {
        setFilteredChats(chats);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [query, chats]);

  const [latestMessages, setLatestMessages] = useState<Record<string, any>>({});

  useEffect(() => {
    const unsubscribes: (() => void)[] = [];

    chats.forEach((chat) => {
      const unsubscribe = subscribeToLatestMessage(chat.id, (msg) => {
        setLatestMessages((prev) => ({ ...prev, [chat.id]: msg }));
      });
      unsubscribes.push(unsubscribe);
    });

    // Cleanup all subscriptions
    return () => unsubscribes.forEach((unsub) => unsub());
  }, [chats]);
  return (
    <SafeAreaView className="flex-1 flex-col bg-white">
      <StatusBar style="dark" />
      {/* Top bar */}
      <View className="flex-column w-full px-6 ">
        <View className="h-[56px] flex-row items-center justify-between">
          <Link href="/" asChild>
            <Text className="text-[15px] font-semibold text-[#006FFD]">Edit</Text>
          </Link>
          <Text className="text-[17px] font-bold color-black">Chats</Text>
          <FontAwesome5 name="edit" size={20} color="#006FFD" />
        </View>
        <SearchBar
          value={query}
          onChangeText={(val) => {
            setQuery(val);
          }}
        />
      </View>
      <ScrollView
        className="px-2 py-4"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {filteredChats.map((chat, i) => {
          const lastMsg = latestMessages[chat.id]?.text || 'No messages yet';
          const title = chat.participants.filter((party: any) => party !== user?.name).toString();
          return (
            <ChatOverView
              key={i}
              friend={title || 'No people in chat yet'}
              lastMessage={lastMsg}
              chatId={chat.id}
            />
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
