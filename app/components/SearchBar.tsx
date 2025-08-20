import { TextInput, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

type props = {
  value: string;
  onChangeText: (text: string) => void;
};

export const SearchBar = ({ value, onChangeText }: props) => {
  return (
    <View className="h-[44px] flex-row items-center gap-4 rounded-[24px] bg-[#F8F9FE] px-4 py-3">
      <FontAwesome name="search" size={16} color="black" />
      <TextInput
        multiline={false}
        editable={true}
        value={value}
        onChangeText={onChangeText}
        placeholder="Search"
        placeholderTextColor="#8F9098"
        autoCorrect={false}
        returnKeyType="done"
        className="h-10 flex-1 text-[14px] leading-[20px] placeholder:text-gray-400"
      />
    </View>
  );
};
