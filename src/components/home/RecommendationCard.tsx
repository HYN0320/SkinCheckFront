import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { CosmeticDto } from "@/types/home";
import * as Linking from "expo-linking";

export default function RecommendationCard({ item }: { item: CosmeticDto }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => Linking.openURL(item.link)}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
      {item.brand && <Text style={styles.brand}>{item.brand}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { width: 130, marginRight: 12 },
  image: {
    width: 130,
    height: 130,
    borderRadius: 10,
    backgroundColor: "#eee",
  },
  name: { fontSize: 12, marginTop: 6 },
  brand: { fontSize: 11, color: "#666" },
});
