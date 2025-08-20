import { Link } from "expo-router"
import { Text, TouchableOpacity, View } from "react-native"
import Fontisto from '@expo/vector-icons/Fontisto';

type ChatOverviewProps = {
  friend: string;
  chatId: string | number;
  lastMessage: string;
};

export const ChatOverView = ({ friend, chatId, lastMessage }: ChatOverviewProps) => {
    return (
      <Link
        href={{
          pathname: `/chatPage/${chatId}`,
          params: { friend }, // <-- pass the name
        }}
        asChild>
        <TouchableOpacity className="h-[72px] w-full flex-1 flex-row items-center gap-5 px-4">
          <Fontisto name="user-secret" size={40} color="black" />
          <View className="flex-1">
            <Text className="text-[14px] font-bold">{friend}</Text>
            <Text className="mt-1 font-normal opacity-70" numberOfLines={2} ellipsizeMode="tail">
              {lastMessage}
            </Text>
          </View>
        </TouchableOpacity>
      </Link>
    );
}