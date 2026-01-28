import { useFocusEffect, router } from 'expo-router';
import { useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Linking,
  Image,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuthStore } from '../../src/store/authStore';
import { useHomeStore } from '../../src/store/homeStore';
import { HistoryCard } from '../../src/components/HistoryCard';

import type {
  SkinStatus,
  HomeRecommendationSection,
  CosmeticDto,
  RecentHistoryDto,
} from '../../src/types/home';

export default function Home() {
  const { logout,user } = useAuthStore();
  const { data, loading, load } = useHomeStore();

  // 애니메이션 값들
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  useEffect(() => {
    if (!loading && data) {
      // 페이드인 & 슬라이드업 애니메이션
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();

      // Hero 화살표 펄스 애니메이션 (무한 반복)
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [loading, data]);

  if (loading || !data) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const skinStatus: SkinStatus = data.skinStatus ?? {
    moisture: 0,
    elasticity: 0,
    pore: 0,
    pigmentation: 0,
  };

  const recentHistories: RecentHistoryDto[] = data.recentHistories ?? [];
  const recommendations: HomeRecommendationSection[] =
    data.recommendations ?? [];

  return (
    <View style={styles.container}>
      {/* Fixed Header - 개선된 디자인 */}
      <View style={styles.fixedHeader}>
        <LinearGradient
          colors={['#ffffff', '#fafafa']}
          style={styles.headerGradient}
        >
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Text style={styles.brandName}>SKINCHECK</Text>
              <View style={styles.userBadge}>
                <View style={styles.userDot} />
             <Text style={styles.userName}>
              {user?.name ?? "사용자"}님
            </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={() =>
                Alert.alert('로그아웃', '로그아웃 하시겠어요?', [
                  { text: '취소' },
                  {
                    text: '로그아웃',
                    style: 'destructive',
                    onPress: async () => {
                      await logout();
                      router.replace('/(auth)/login');
                    },
                  },
                ])
              }
            >
              <Text style={styles.logoutText}>Log out</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingTop: 130, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Hero CTA - 애니메이션 추가 */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push('/(tabs)/analysis/guide')}
            style={styles.heroCTA}
          >
            <LinearGradient
              colors={['#1a1a1a', '#2d2d2d', '#1a1a1a']}
              style={styles.heroGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.heroContent}>
                <View>
                  <Text style={styles.heroTitle}>피부 분석 시작하기</Text>
                  <View style={styles.heroMeta}>
                    <View style={styles.heroBadge}>
                      <Text style={styles.heroBadgeText}>30초</Text>
                    </View>
                    <View style={styles.heroBadge}>
                      <Text style={styles.heroBadgeText}>무료</Text>
                    </View>
                  </View>
                </View>
                <Animated.View
                  style={[
                    styles.heroArrow,
                    {
                      transform: [{ scale: pulseAnim }],
                    },
                  ]}
                >
                  <Text style={styles.heroArrowText}>→</Text>
                </Animated.View>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Skin Metrics - 애니메이션 추가 */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/(tabs)/analysis/guide')}
          >
            <View style={styles.metricsSection}>
              <View style={styles.metricsHeader}>
                <Text style={styles.sectionLabel}>SKIN METRICS</Text>
                <Text style={styles.metricsHint}>최근 분석 기준</Text>
              </View>

              <View style={styles.metricsGrid}>
                <MetricCard
                  label="수분"
                  value={skinStatus.moisture}
                  icon="💧"
                  color="#3498db"
                  delay={0}
                />
                <MetricCard
                  label="탄력"
                  value={skinStatus.elasticity}
                  icon="✨"
                  color="#9b59b6"
                  delay={100}
                />
                <MetricCard
                  label="모공"
                  value={skinStatus.pore}
                  icon="⭕"
                  color="#e67e22"
                  delay={200}
                />
                <MetricCard
                  label="색소"
                  value={skinStatus.pigmentation}
                  icon="🎨"
                  color="#27ae60"
                  delay={300}
                />
              </View>
            </View>
          </TouchableOpacity>

          {/* Recent History */}
          <View style={styles.historySection}>
            <Text style={styles.sectionLabel}>RECENT ANALYSIS</Text>

            {recentHistories.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>📊</Text>
                <Text style={styles.emptyText}>아직 분석 기록이 없어요</Text>
                <Text style={styles.emptySubText}>
                  지금 피부 사진을 찍어보세요!
                </Text>
              </View>
            ) : (
              <View style={styles.historyList}>
                {recentHistories.map((item) => (
                  <HistoryCard
                    key={item.analysisId}
                    analysisId={item.analysisId}
                    date={item.date}
                    skinType={item.skinType}
                    summary={item.summary}
                  />
                ))}
              </View>
            )}
          </View>

          {/* Product Recommendations */}
          <View style={styles.productsSection}>
            <Text style={styles.sectionLabel}>RECOMMENDED FOR YOU</Text>

            {recommendations.map((section, sectionIdx) => (
              <View
                key={section.category || `section-${sectionIdx}`}
                style={styles.productCategory}
              >
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryTitle}>{section.title}</Text>
                  <Text style={styles.categoryGuide}>{section.guide}</Text>
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.productScroll}
                >
                  {(section.products ?? []).map((product, idx) => (
                    <TouchableOpacity
                      key={`${section.category}-${idx}`}
                      style={styles.productItem}
                      onPress={() => {
                        if (product.link) {
                          Linking.openURL(product.link).catch(() =>
                            Alert.alert(
                              '링크 열기 실패',
                              '잘못된 링크입니다.'
                            )
                          );
                        }
                      }}
                    >
                      <View style={styles.productImageContainer}>
                        {product.imageUrl ? (
                          <Image
                            source={{ uri: product.imageUrl }}
                            style={styles.productImg}
                          />
                        ) : (
                          <View style={styles.productPlaceholder}>
                            <Text style={styles.productPlaceholderEmoji}>🧴</Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.productInfo}>
                        <Text style={styles.productName} numberOfLines={2}>
                          {product.name}
                        </Text>
                        {product.brand && (
                          <Text style={styles.productBrand}>
                            {product.brand}
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

/* Metric Card - 애니메이션 추가 */
function MetricCard({
  label,
  value,
  icon,
  color,
  delay = 0,
}: {
  label: string;
  value: number;
  icon: string;
  color: string;
  delay?: number;
}) {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const barAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 카드 스케일 애니메이션
    Animated.spring(scaleAnim, {
      toValue: 1,
      delay,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();

    // 바 애니메이션
    if (value > 0) {
      Animated.timing(barAnim, {
        toValue: Math.min(value, 100),
        delay: delay + 200,
        duration: 800,
        useNativeDriver: false,
      }).start();
    }
  }, [value, delay]);

  const barWidth = barAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View
      style={[
        styles.metricCard,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.metricCardInner}>
        <View style={styles.metricTop}>
          <Text style={styles.metricIcon}>{icon}</Text>
          <Text style={styles.metricValue}>{value}</Text>
        </View>
        <Text style={styles.metricLabel}>{label}</Text>

        {value > 0 ? (
          <View style={styles.metricBar}>
            <Animated.View
              style={[
                styles.metricBarFill,
                {
                  width: barWidth,
                  backgroundColor: color,
                },
              ]}
            />
          </View>
        ) : (
          <Text style={styles.metricEmptyText}>분석 필요</Text>
        )}
      </View>
    </Animated.View>
  );
}

/* Styles */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: { marginTop: 12, fontSize: 14, color: '#999' },

  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },

  headerGradient: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerLeft: {
    gap: 8,
  },

  brandName: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },

  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },

  userDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#27ae60',
  },

  userName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },

  logoutBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  logoutText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },

  scrollView: { paddingHorizontal: 24 },

  // Hero 새로운 스타일
  heroCTA: {
    marginTop: 20,
    marginBottom: 32,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },

  heroGradient: {
    padding: 20,
    position: 'relative',
  },

  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  heroTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: -0.3,
  },

  heroMeta: {
    flexDirection: 'row',
    gap: 6,
  },

  heroBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  heroBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },

  heroArrow: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },

  heroArrowText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '600',
  },

  // 장식 요소
  heroDecor1: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    top: -40,
    right: -30,
  },

  heroDecor2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    bottom: -20,
    left: -20,
  },

  metricsSection: { marginBottom: 48 },

  metricsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    alignItems: 'center',
  },

  metricsHint: { fontSize: 12, color: '#999' },

  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 20,
  },

  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },

  metricCard: { width: '50%', paddingHorizontal: 6, marginBottom: 12 },

  metricCardInner: {
    backgroundColor: '#fafafa',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },

  metricTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  metricIcon: { fontSize: 24 },

  metricValue: { fontSize: 28, fontWeight: '700' },

  metricLabel: {
    fontSize: 13,
    color: '#666',
    marginTop: 8,
    marginBottom: 12,
  },

  metricBar: {
    height: 5,
    backgroundColor: '#e8e8e8',
    borderRadius: 2.5,
    overflow: 'hidden',
  },

  metricBarFill: {
    height: '100%',
    borderRadius: 2.5,
  },

  metricEmptyText: {
    fontSize: 12,
    color: '#bbb',
    marginTop: 8,
  },

  historySection: { marginBottom: 48 },
  historyList: { gap: 10 },

  productsSection: { marginBottom: 40 },
  productCategory: {
    marginBottom: 32,
    backgroundColor: '#fafafa',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },

  categoryHeader: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },

  categoryTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
    color: '#1a1a1a',
  },

  categoryGuide: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },

  productScroll: { paddingRight: 20, paddingVertical: 4 },

  productItem: {
    width: 140,
    marginRight: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e8e8e8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  productImageContainer: {
    width: '100%',
    height: 140,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  productImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  productPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },

  productPlaceholderEmoji: { fontSize: 40 },

  productInfo: {
    padding: 12,
    gap: 4,
  },

  productName: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    color: '#1a1a1a',
  },

  productBrand: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
  },

  emptyState: {
    backgroundColor: '#fafafa',
    borderRadius: 16,
    padding: 48,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyText: { fontSize: 14, color: '#999' },
  emptySubText: { fontSize: 13, color: '#aaa', marginTop: 8 },
});