import { TextInput, TouchableOpacity, View } from 'react-native';
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useUserProfile } from 'app/user';
import { sendMessage } from 'app/chatPage/[id]';

export const ChatInput = ({ value, onChangeText, chatId }) => {
  const { user } = useUserProfile();
  const handleSend = () => {
    sendMessage(chatId, value, user)
    onChangeText("")
  }
  return (
    <View className="flex-row items-center gap-4 p-4">
      <Fontisto name="plus-a" size={16} color="black" />
      <TextInput
        multiline={true}
        editable={true}
        value={value}
        onChangeText={onChangeText}
        placeholder="Type a message..."
        placeholderTextColor="#8F9098"
        autoCorrect={true}
        returnKeyType="send"
        className="h-10 flex-1 items-center rounded-full bg-gray-200 pl-[16px] text-[14px] leading-[20px] placeholder:text-gray-400"
      />
      {value && (
        <TouchableOpacity onPress={handleSend}>
          <MaterialCommunityIcons name="send" size={24} color="black" />
        </TouchableOpacity>
      )}
    </View>
  );
};
