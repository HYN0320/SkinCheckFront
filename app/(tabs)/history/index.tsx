import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import { useState, useCallback } from "react";
import { router, useFocusEffect } from "expo-router";
import { api } from "@/api/client";

interface HistoryItem {
  analysisId: number;
  date: string; // YYYY-MM-DD
  skinType: string;
  summary: string;
}

export default function History() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  /** 🔥 History 화면 들어올 때마다 최신 히스토리 갱신 */
  useFocusEffect(
    useCallback(() => {
      setSelectedDate(null);

      api.get("/analysis/history").then((res) => {
        setItems(res.data.data);
      });
    }, [])
  );

  /** 날짜별 그룹 */
  const groupedByDate = items.reduce((acc, cur) => {
    if (!acc[cur.date]) acc[cur.date] = [];
    acc[cur.date].push(cur);
    return acc;
  }, {} as Record<string, HistoryItem[]>);

  /** 캘린더 마킹 */
  const markedDates = Object.keys(groupedByDate).reduce((acc, date) => {
    acc[date] = {
      marked: true,
      dotColor: "#000000",
      ...(selectedDate === date && {
        selected: true,
        selectedColor: "#000000",
      }),
    };
    return acc;
  }, {} as Record<string, any>);

  const onDayPress = (day: any) => {
    setSelectedDate((prev) =>
      prev === day.dateString ? null : day.dateString
    );
  };

  const listToShow = selectedDate
    ? groupedByDate[selectedDate] ?? []
    : Array.from(new Map(items.map((i) => [i.date, i])).values());

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>나의 피부 기록</Text>

      <View style={styles.calendarContainer}>
        <Calendar
          markedDates={markedDates}
          onDayPress={onDayPress}
          theme={{
            backgroundColor: '#F5F1ED',
            calendarBackground: '#F5F1ED',
            textSectionTitleColor: '#666666',
            selectedDayBackgroundColor: '#000000',
            selectedDayTextColor: '#FFFFFF',
            todayTextColor: '#000000',
            dayTextColor: '#333333',
            textDisabledColor: '#CCCCCC',
            dotColor: '#000000',
            selectedDotColor: '#FFFFFF',
            arrowColor: '#000000',
            monthTextColor: '#000000',
            textDayFontWeight: '600',
            textMonthFontWeight: '800',
            textDayHeaderFontWeight: '700',
            textDayFontSize: 14,
            textMonthFontSize: 17,
            textDayHeaderFontSize: 12,
          }}
          style={styles.calendar}
        />
      </View>

      <View style={styles.listContainer}>
        <View style={styles.sectionHeader}>
          <View style={styles.titleDot} />
          <Text style={styles.sectionTitle}>
            {selectedDate ? `${selectedDate} 기록` : '최근 분석 내역'}
          </Text>
        </View>
        {listToShow.map((i) => (
          <TouchableOpacity
            key={i.analysisId}
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/analysis",
                params: { analysisId: String(i.analysisId) },
              })
            }
            activeOpacity={0.7}
          >
            <View style={styles.cardAccent} />
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={styles.dateContainer}>
                  <Text style={styles.date}>{i.date}</Text>
                </View>
                <View style={styles.badge}>
                  <Text style={styles.skinType}>{i.skinType}</Text>
                </View>
              </View>
              <Text style={styles.summary} numberOfLines={2}>
                {i.summary}
              </Text>
              <View style={styles.arrowIcon}>
                <Text style={styles.arrowText}>→</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 8,
    marginTop: 70,
    color: "#000000",
    textAlign: "center",
    letterSpacing: -0.5,
    paddingHorizontal: 20,
  },
  calendarContainer: {
    marginHorizontal: 20,
    marginBottom: 28,
    marginTop: 12,
    borderRadius: 0,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    backgroundColor: "#F5F1ED",
    borderWidth: 1,
    borderColor: "#E8E4DF",
  },
  calendar: {
    borderRadius: 0,
    paddingVertical: 16,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
  },
  titleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#000000",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#000000",
    letterSpacing: -0.3,
  },
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
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  date: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  badge: {
    backgroundColor: "#000000",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    position:"absolute",
    left:100,
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
    fontWeight: "400",
    marginBottom: 12,
  },
  arrowIcon: {
    position: "absolute",
    left: 180,
    bottom: 61,
    width: 23,
    height: 23,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  arrowText: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "800",
  },
});
