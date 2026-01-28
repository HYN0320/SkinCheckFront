import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";

interface HistoryCardProps {
  analysisId: number;
  date: string;
  skinType: string;
  summary: string;
}

export function HistoryCard({
  analysisId,
  date,
  skinType,
  summary,
}: HistoryCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() =>
        router.push(`/(tabs)/analysis/result/${analysisId}`)
      }
    >
      <View style={styles.cardAccent} />

      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.date}>{date}</Text>

          <View style={styles.badge}>
            <Text style={styles.skinType}>{skinType}</Text>
          </View>
        </View>

        <Text style={styles.summary} numberOfLines={2}>
          {summary}
        </Text>


      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    overflow: "hidden",
    position: "relative",
  },
  cardAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: "#000000",
  },
  cardContent: {
    padding: 20,
    paddingLeft: 24,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  date: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  badge: {
    backgroundColor: "#000000",
    paddingHorizontal: 11,
    paddingVertical: 3,
    borderRadius: 12,
    position:"absolute",
    right:5,
  },
  skinType: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 1.2,
  },
  summary: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 22,
    marginBottom: 12,
  },

  arrowText: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "800",
  },
});
