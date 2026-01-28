import { View, Text, StyleSheet } from "react-native";

export default function SkinGraph({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.barBg}>
        <View style={[styles.bar, { width: `${value}%` }]} />
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 14 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 6 },
  barBg: {
    height: 8,
    backgroundColor: "#eee",
    borderRadius: 4,
  },
  bar: {
    height: 8,
    backgroundColor: "#FF6F91",
    borderRadius: 4,
  },
  value: { marginTop: 4, fontSize: 12, color: "#666" },
});
