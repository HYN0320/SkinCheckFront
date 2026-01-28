import { View, Text } from "react-native";

interface Props {
  label: string;
  value: number;
  color: string;
  icon?: string;
}

export default function ConditionBar({
  label,
  value,
  color,
  icon,
}: Props) {
  const status =
    value < 40 ? "관리 필요" : value < 70 ? "보통" : "양호";

  return (
    <View style={{ marginBottom: 18 }}>
      {/* 상단 라벨 */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <Text style={{ fontWeight: "600", fontSize: 14 }}>
          {icon} {label}
        </Text>
        <Text style={{ fontSize: 13, color: "#666" }}>
          {value}% · {status}
        </Text>
      </View>

      {/* 프로그레스 바 */}
      <View
        style={{
          height: 10,
          backgroundColor: "#EEE",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: `${value}%`,
            height: "100%",
            backgroundColor: color,
          }}
        />
      </View>
    </View>
  );
}
