import { Link, Tabs } from 'expo-router';
import { Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


// Calculate icon size based on screen width (responsive)
const ICON_SIZE = 20; // min 16, max 24

type TabIconProps = {
  focused: boolean;
  link: string;
  title: string;
  icon : string;
};

const TabIcon = ({ focused, link, title, icon }: TabIconProps) => {
  return (
    <Link href={link} asChild>
      <View className="w-[112px] items-center justify-center px-1">
        {icon === 'chatbox' ? (
          <Ionicons name='chatbox' size={ICON_SIZE} color={focused ? 'blue' : 'gray'} />
        ) : icon === 'user' ? (
          <FontAwesome name="user" size={ICON_SIZE} color={focused ? 'blue' : 'gray'} />
        ) : (
          <MaterialIcons name="settings" size={ICON_SIZE} color={focused ? 'blue' : 'gray'} />
        )}

        <Text
          className={`mt-1 text-center text-xs text-[#1E1E1E] ${focused ? 'font-bold' : ''}`}
          numberOfLines={1}
          ellipsizeMode="tail">
          {title}
        </Text>
      </View>
    </Link>
  );
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 8,
        },
        tabBarStyle: {
          backgroundColor: 'white',
          height: 88,
          position: 'absolute',
          bottom: 0,
          flexDirection: 'row',
          overflow: 'hidden',
          borderColor: 'transparent',
          gap: 0,
          margin: 'auto',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: 'Chats',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} title="Chats" link="/" icon='chatbox'/>,
        }}
      />
      <Tabs.Screen
        name="Friends"
        options={{
          headerShown: false,
          title: 'Friends',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} title="Friends" link="/Friends" icon='user'/>
          ),
        }}
      />
      <Tabs.Screen
        name="Settings"
        options={{
          headerShown: false,
          title: 'Settings',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} title="Settings" link="/Settings" icon='settings'/>
          ),
        }}
      />
    </Tabs>
  );
}
