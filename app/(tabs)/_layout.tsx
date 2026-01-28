import { Tabs } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItem icon="home-outline" label="홈" focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="upload"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItem
              icon="cloud-upload-outline"
              label="업로드"
              focused={focused}
            />
          ),
        }}
      />

      {/* ✅ history는 폴더여도 name="history" 그대로 */}
      <Tabs.Screen
        name="history"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItem icon="time-outline" label="기록" focused={focused} />
          ),
        }}
      />

      {/* analysis는 플로우 전용 */}
      <Tabs.Screen
        name="analysis"
        options={{ href: null }}
      />
    </Tabs>
  );
}

function TabItem({ icon, label, focused }: any) {
  return (
    <View style={styles.tabItem}>
      <Ionicons
        name={icon}
        size={22}
        color={focused ? "#FF6F91" : "#999"}
      />
      <Text
        style={{
          fontSize: 11,
          color: focused ? "#FF6F91" : "#999",
        }}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 82,
    backgroundColor: "#fff",
    elevation: 10,
  },
  tabItem: {
    alignItems: "center",
  },
});
