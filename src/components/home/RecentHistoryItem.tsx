import { View, Text, StyleSheet } from "react-native";
import { RecentHistoryDto } from "@/types/home";

export default function RecentHistoryItem({ item }: { item: RecentHistoryDto }) {
  return (
    <View style={styles.item}>
      <Text style={styles.date}>{item.date}</Text>
      <Text style={styles.skinType}>{item.skinType}</Text>
      <Text style={styles.summary} numberOfLines={1}>
        {item.summary}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  date: { fontSize: 12, color: "#666" },
  skinType: { fontSize: 14, fontWeight: "600" },
  summary: { fontSize: 13, color: "#555" },
});
