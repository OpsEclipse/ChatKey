import { Text, View } from 'react-native';
type chatProp = {
  message: string;
  sentByUser: boolean;
  friend: string;
  me: string;
  first?: boolean;
  last?: boolean;
};
export const ChatItem = ({
  message,
  sentByUser,
  friend,
  me,
  first = false,
  last = false,
}: chatProp) => {
  return (
    <View
      className="mx-[15px] max-w-[241px] rounded-[12px] bg-[#F8F9FE] px-3 py-2 mt-2"
      style={{
        alignSelf: sentByUser ? 'flex-end' : 'flex-start',
        backgroundColor: sentByUser ? '#006FFD' : '#F8F9FE',
        borderBottomLeftRadius: last ? (sentByUser ? 12 : 0) : 12,
        borderBottomRightRadius: last ? (sentByUser ? 0 : 12) : 12,
      }}>
      {first ? (
        !sentByUser ? (
          <Text className="color-[#71727A]">{friend}</Text>
        ) : (
          <Text className="color-[#B3DAFF]">{me}</Text>
        )
      ) : null}
      <Text
        style={{
          color: sentByUser ? 'white' : 'black',
        }}
        className="text-base">
        {message}
      </Text>
    </View>
  );
};
