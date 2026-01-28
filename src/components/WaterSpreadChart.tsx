import { View, Text, TouchableOpacity, Animated } from "react-native";
import { useEffect, useRef, useState } from "react";
import Svg, { Line, Circle, Text as SvgText, Defs, LinearGradient, Stop, G } from "react-native-svg";

/* =====================
   타입
===================== */

export type RegionKey =
  | "forehead"
  | "leftEye"
  | "rightEye"
  | "leftCheek"
  | "rightCheek"
  | "lip";

export type ConditionType =
  | "MOISTURE"
  | "ELASTICITY"
  | "PORE"
  | "PIGMENTATION";

interface DataItem {
  region: RegionKey;
  value: number;
}

interface Props {
  data: DataItem[];
  type: ConditionType;
  size?: number;
}

/* =====================
   상수
===================== */

const REGION_LABEL: Record<RegionKey, string> = {
  forehead: "이마",
  leftEye: "왼쪽 눈가",
  rightEye: "오른쪽 눈가",
  leftCheek: "왼쪽 볼",
  rightCheek: "오른쪽 볼",
  lip: "입술",
};

const REGION_ORDER: RegionKey[] = [
  "forehead",
  "rightEye",
  "rightCheek",
  "lip",
  "leftCheek",
  "leftEye",
];

const COLOR_MAP: Record<ConditionType, string> = {
  MOISTURE: "#3498DB",
  ELASTICITY: "#9B59B6",
  PORE: "#E67E22",
  PIGMENTATION: "#E74C3C",
};

const COLOR_MAP_LIGHT: Record<ConditionType, string> = {
  MOISTURE: "#5DADE2",
  ELASTICITY: "#BB8FCE",
  PORE: "#F39C12",
  PIGMENTATION: "#EC7063",
};

/* =====================
   컴포넌트
===================== */

export default function WaterSpreadChart({
  data,
  type,
  size = 300,
}: Props) {
  const center = size / 2;
  const maxRadius = size / 2 - 35; // 더 길게
  const angleStep = (Math.PI * 2) / REGION_ORDER.length;

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const [selected, setSelected] = useState<RegionKey | null>(null);

  useEffect(() => {
    scaleAnim.setValue(0);
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 6,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, [data, type]);

  const getValue = (region: RegionKey) =>
    data.find((d) => d.region === region)?.value ?? 0;

  const avgValue = Math.round(
    data.reduce((sum, d) => sum + d.value, 0) / data.length
  );

  return (
    <View style={{ alignItems: "center", marginTop: 8 }}>
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
        }}
      >
        <Svg width={size} height={size}>
          <Defs>
            <LinearGradient id={`gradient-${type}`} x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={COLOR_MAP[type]} stopOpacity="1" />
              <Stop offset="1" stopColor={COLOR_MAP_LIGHT[type]} stopOpacity="0.8" />
            </LinearGradient>
          </Defs>

          {/* 배경 동심원 */}
          {[0.25, 0.5, 0.75, 1].map((ratio, idx) => (
            <Circle
              key={idx}
              cx={center}
              cy={center}
              r={maxRadius * ratio}
              fill="none"
              stroke="#757575"
              strokeWidth={1}
              strokeDasharray="4 4"
              opacity={0.5}
            />
          ))}

          {REGION_ORDER.map((region, i) => {
            const angle = angleStep * i - Math.PI / 2;
            const value = getValue(region);
            const length = (value / 100) * maxRadius;

            const x2 = center + length * Math.cos(angle);
            const y2 = center + length * Math.sin(angle);

            const labelX = center + (maxRadius + 25) * Math.cos(angle);
            const labelY = center + (maxRadius + 25) * Math.sin(angle);

            const isSelected = selected === region;

            return (
              <G key={region}>
                {/* 가이드 라인 */}
                <Line
                  x1={center}
                  y1={center}
                  x2={center + maxRadius * Math.cos(angle)}
                  y2={center + maxRadius * Math.sin(angle)}
                  stroke="#757575"
                  strokeWidth={2}
                  strokeLinecap="round"
                  opacity={0.3}
                />

                {/* 데이터 막대 */}
                <Line
                  x1={center}
                  y1={center}
                  x2={x2}
                  y2={y2}
                  stroke={`url(#gradient-${type})`}
                  strokeWidth={isSelected ? 7 : 5}
                  strokeLinecap="round"
                  onPress={() => setSelected(region)}
                />

                {/* 끝점 원 */}
                <Circle
                  cx={x2}
                  cy={y2}
                  r={isSelected ? 16 : 14}
                  fill={COLOR_MAP[type]}
                  onPress={() => setSelected(region)}
                />

                {isSelected && (
                  <Circle
                    cx={x2}
                    cy={y2}
                    r={20}
                    fill="none"
                    stroke={COLOR_MAP[type]}
                    strokeWidth={2}
                    opacity={0.3}
                  />
                )}

                {/* 수치 */}
                <SvgText
                  x={x2}
                  y={y2 + 4}
                  fontSize={11}
                  fill="#ffffff"
                  textAnchor="middle"
                  fontWeight="700"
                  onPress={() => setSelected(region)}
                >
                  {value}
                </SvgText>

                {/* 라벨 */}
                <SvgText
                  x={labelX}
                  y={labelY + 4}
                  fontSize={13}
                  fill={isSelected ? COLOR_MAP[type] : "#666"}
                  fontWeight={isSelected ? "700" : "500"}
                  textAnchor="middle"
                  onPress={() => setSelected(region)}
                >
                  {REGION_LABEL[region]}
                </SvgText>
              </G>
            );
          })}

          {/* 중앙 평균 점수 */}
          <Circle
            cx={center}
            cy={center}
            r={24}
            fill="#FFFFFF"
            stroke={COLOR_MAP[type]}
            strokeWidth={2}
          />
          <Circle
            cx={center}
            cy={center}
            r={21}
            fill={COLOR_MAP[type]}
            opacity={0.1}
          />

          <SvgText
            x={center}
            y={center - 3}
            fontSize={14}
            fill={COLOR_MAP[type]}
            textAnchor="middle"
            fontWeight="800"
          >
            {avgValue}
          </SvgText>
          <SvgText
            x={center}
            y={center + 9}
            fontSize={8}
            fill="#999"
            textAnchor="middle"
            fontWeight="600"
          >
            평균
          </SvgText>
        </Svg>
      </Animated.View>

      {/* 선택된 부위 표시 */}
      {selected && (
        <View
          style={{
            marginTop: 16,
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 24,
            backgroundColor: COLOR_MAP[type],
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>
            {REGION_LABEL[selected]} · {getValue(selected)}점
          </Text>
        </View>
      )}

      {selected && (
        <TouchableOpacity
          onPress={() => setSelected(null)}
          style={{
            marginTop: 8,
            paddingHorizontal: 16,
            paddingVertical: 6,
          }}
        >
          <Text style={{ color: "#999", fontSize: 12 }}>
            선택 해제
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}