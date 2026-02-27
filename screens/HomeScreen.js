import React, { useEffect, useCallback, useRef } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  TextInput, Image, RefreshControl,
  ActivityIndicator, StatusBar, Animated, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProducts,
  setSearchQuery,
  setSelectedCategory,
} from '../store/ProductsSlice';

const { width } = Dimensions.get('window');

// ─── Design tokens ────────────────────────────────────────────────────────────
const BG      = '#050d1a';
const CARD_BG = '#080f1e';
const BORDER  = '#0f2044';
const BLUE    = '#2563eb';
const BLUE_LT = '#60a5fa';
const MUTED   = '#334155';
const SUBTLE  = '#0d1d35';

const CATEGORIES = ['All', 'electronics', "men's clothing", "women's clothing", 'jewelery'];

const CAT_LABELS = {
  'All':              'All',
  'electronics':      'Electronics',
  "men's clothing":   "Men's",
  "women's clothing": "Women's",
  'jewelery':         'Jewelry',
};

// ─── Category chip ────────────────────────────────────────────────────────────
const CategoryChip = ({ cat, active, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.75}
    style={{
      marginRight: 8,
      paddingHorizontal: 16,
      paddingVertical: 9,
      borderRadius: 24,
      backgroundColor: active ? BLUE : SUBTLE,
      borderWidth: 1,
      borderColor: active ? '#3b82f6' : BORDER,
    }}
  >
    <Text style={{
      color: active ? '#fff' : '#475569',
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 0.4,
    }}>
      {CAT_LABELS[cat]}
    </Text>
  </TouchableOpacity>
);

// ─── Product card ─────────────────────────────────────────────────────────────
const ProductCard = ({ item, onPress, fav }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn  = () => Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true, tension: 200, friction: 10 }).start();
  const onPressOut = () => Animated.spring(scaleAnim, { toValue: 1,    useNativeDriver: true, tension: 200, friction: 10 }).start();

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], width: '48%', marginBottom: 14 }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
        style={{
          backgroundColor: CARD_BG,
          borderRadius: 20,
          borderWidth: 1.5,
          borderColor: BORDER,
          overflow: 'hidden',
          shadowColor: '#1d4ed8',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.15,
          shadowRadius: 16,
          elevation: 8,
        }}
      >
        {/* Image area */}
        <View style={{
          height: 148,
          backgroundColor: SUBTLE,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 18,
          borderBottomWidth: 1,
          borderBottomColor: BORDER,
        }}>
          <Image
            source={{ uri: item.image }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="contain"
          />

          {/* Fav badge */}
          {fav && (
            <View style={{
              position: 'absolute', top: 10, right: 10,
              width: 28, height: 28, borderRadius: 14,
              backgroundColor: '#3f0a0a',
              borderWidth: 1, borderColor: '#7f1d1d',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Ionicons name="heart" size={13} color="#ef4444" />
            </View>
          )}
        </View>

        {/* Info area */}
        <View style={{ padding: 12 }}>
          <Text style={{
            color: '#1e3a5f',
            fontSize: 9,
            fontWeight: '800',
            letterSpacing: 2.2,
            textTransform: 'uppercase',
            marginBottom: 5,
          }}>
            {CAT_LABELS[item.category] ?? item.category}
          </Text>

          <Text
            numberOfLines={2}
            style={{
              color: '#cbd5e1',
              fontSize: 12.5,
              fontWeight: '600',
              lineHeight: 18,
              marginBottom: 10,
            }}
          >
            {item.title}
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ color: BLUE_LT, fontWeight: '900', fontSize: 15, letterSpacing: -0.3 }}>
              ${item.price}
            </Text>
            {item.rating && (
              <View style={{
                flexDirection: 'row', alignItems: 'center',
                backgroundColor: '#1a1200',
                borderRadius: 8,
                paddingHorizontal: 6, paddingVertical: 3,
                borderWidth: 1, borderColor: '#3b2800',
              }}>
                <Ionicons name="star" size={9} color="#fbbf24" />
                <Text style={{ color: '#fbbf24', fontSize: 10, fontWeight: '700', marginLeft: 3 }}>
                  {item.rating.rate}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Loading screen ───────────────────────────────────────────────────────────
const LoadingView = () => {
  const pulse = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1,   duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: BG }}>
      <StatusBar barStyle="light-content" backgroundColor={BG} />
      <Animated.View style={{ opacity: pulse }}>
        <View style={{
          width: 64, height: 64, borderRadius: 32,
          backgroundColor: SUBTLE,
          borderWidth: 1.5, borderColor: BORDER,
          alignItems: 'center', justifyContent: 'center',
          marginBottom: 20,
        }}>
          <ActivityIndicator size="large" color={BLUE_LT} />
        </View>
      </Animated.View>
      <Text style={{ color: MUTED, fontSize: 13, fontWeight: '600', letterSpacing: 1.5, textTransform: 'uppercase' }}>
        Loading products
      </Text>
    </View>
  );
};

// ─── Error screen ─────────────────────────────────────────────────────────────
const ErrorView = ({ onRetry }) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 36, backgroundColor: BG }}>
    <StatusBar barStyle="light-content" backgroundColor={BG} />
    <View style={{
      width: 80, height: 80, borderRadius: 40,
      backgroundColor: '#1a0505',
      borderWidth: 1.5, borderColor: '#3f0a0a',
      alignItems: 'center', justifyContent: 'center',
      marginBottom: 24,
    }}>
      <Ionicons name="cloud-offline-outline" size={36} color="#ef4444" />
    </View>
    <Text style={{ color: '#f1f5f9', fontSize: 20, fontWeight: '800', letterSpacing: -0.5, marginBottom: 10 }}>
      Connection Error
    </Text>
    <Text style={{ color: '#334155', fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 32 }}>
      Unable to load products.{'\n'}Check your internet connection.
    </Text>
    <TouchableOpacity
      onPress={onRetry}
      activeOpacity={0.82}
      style={{
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: BLUE,
        paddingHorizontal: 28, paddingVertical: 16,
        borderRadius: 18,
        borderWidth: 1, borderColor: '#3b82f6',
        shadowColor: BLUE,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.45,
        shadowRadius: 20, elevation: 10,
      }}
    >
      <Ionicons name="refresh-outline" size={18} color="#fff" />
      <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14, marginLeft: 10, letterSpacing: 1.5, textTransform: 'uppercase' }}>
        Retry
      </Text>
    </TouchableOpacity>
  </View>
);

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();

  const {
    filteredItems,
    items,
    loading,
    error,
    searchQuery,
    selectedCategory,
  } = useSelector((state) => state.products);

  const favoriteIds = new Set(
    useSelector((state) => state.favorites.items).map((p) => p.id)
  );

  const headerFade  = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-16)).current;

  // ── Fetch on mount ───────────────────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  // ── Header animation after first load ────────────────────────────────────
  useEffect(() => {
    if (!loading && items.length > 0) {
      Animated.parallel([
        Animated.timing(headerFade,  { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(headerSlide, { toValue: 0, tension: 60, friction: 12, useNativeDriver: true }),
      ]).start();
    }
  }, [loading]);

  const onRefresh = useCallback(() => {
    dispatch(fetchProducts());
  }, []);

  // ── Guards ───────────────────────────────────────────────────────────────
  if (loading && items.length === 0) return <LoadingView />;
  if (error   && items.length === 0) return <ErrorView onRetry={() => dispatch(fetchProducts())} />;

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <StatusBar barStyle="light-content" backgroundColor={BG} />

      {/* Background glows */}
      <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <View style={{ position: 'absolute', top: -100, right: -80,  width: 300, height: 300, borderRadius: 150, backgroundColor: '#1e3a8a', opacity: 0.07 }} />
        <View style={{ position: 'absolute', bottom: -60, left: -50, width: 240, height: 240, borderRadius: 120, backgroundColor: '#1d4ed8', opacity: 0.06 }} />
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        {/* ── Header ── */}
        <Animated.View style={{ opacity: headerFade, transform: [{ translateY: headerSlide }] }}>
          <View style={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 20 }}>

            {/* Title row */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <View>
                <Text style={{
                  color: '#1e3a5f',
                  fontSize: 9, fontWeight: '800',
                  letterSpacing: 3.5, textTransform: 'uppercase',
                  marginBottom: 4,
                }}>
                  Catalog
                </Text>
                <Text style={{
                  color: '#f1f5f9',
                  fontSize: 30, fontWeight: '900',
                  letterSpacing: -1, lineHeight: 34,
                }}>
                  Products
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => navigation.navigate('Favourites')}
                activeOpacity={0.8}
                style={{
                  width: 46, height: 46, borderRadius: 23,
                  backgroundColor: SUBTLE,
                  borderWidth: 1.5, borderColor: BORDER,
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Ionicons name="heart-outline" size={20} color={BLUE_LT} />
              </TouchableOpacity>
            </View>

            {/* Search bar */}
            <View style={{
              flexDirection: 'row', alignItems: 'center',
              backgroundColor: CARD_BG,
              borderRadius: 16,
              borderWidth: 1.5, borderColor: BORDER,
              paddingHorizontal: 16, height: 52,
              marginBottom: 16,
            }}>
              <View style={{
                width: 30, height: 30, borderRadius: 10,
                backgroundColor: SUBTLE,
                alignItems: 'center', justifyContent: 'center',
                marginRight: 12,
              }}>
                <Ionicons name="search-outline" size={15} color={MUTED} />
              </View>
              <TextInput
                style={{ flex: 1, color: '#e2e8f0', fontSize: 14.5, fontWeight: '400' }}
                placeholder="Search products…"
                placeholderTextColor="#1e3a5f"
                value={searchQuery}
                onChangeText={(t) => dispatch(setSearchQuery(t))}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => dispatch(setSearchQuery(''))} style={{ padding: 4 }}>
                  <Ionicons name="close-circle" size={18} color={MUTED} />
                </TouchableOpacity>
              )}
            </View>

            {/* Category chips */}
            <FlatList
              data={CATEGORIES}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={i => i}
              renderItem={({ item }) => (
                <CategoryChip
                  cat={item}
                  active={selectedCategory === item}
                  onPress={() => dispatch(setSelectedCategory(item))}
                />
              )}
              contentContainerStyle={{ paddingRight: 8 }}
            />
          </View>
        </Animated.View>

        {/* Result count row */}
        <View style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          paddingHorizontal: 24, marginBottom: 12,
        }}>
          <Text style={{ color: '#1e3a5f', fontSize: 11, fontWeight: '700', letterSpacing: 1 }}>
            {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''}
          </Text>
          <View style={{
            flexDirection: 'row', alignItems: 'center',
            backgroundColor: SUBTLE,
            borderRadius: 8, padding: 6,
            borderWidth: 1, borderColor: BORDER,
          }}>
            <Ionicons name="grid-outline" size={14} color={BLUE_LT} />
          </View>
        </View>

        {/* Product grid */}
        <FlatList
          data={filteredItems}
          numColumns={2}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 110 }}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading && items.length > 0}
              onRefresh={onRefresh}
              tintColor={BLUE_LT}
              colors={[BLUE_LT]}
            />
          }
          renderItem={({ item }) => (
            <ProductCard
              item={item}
              fav={favoriteIds.has(item.id)}
              onPress={() => navigation.navigate('ProductDetail', { product: item })}
            />
          )}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 80, paddingBottom: 40 }}>
              <View style={{
                width: 72, height: 72, borderRadius: 36,
                backgroundColor: SUBTLE,
                borderWidth: 1.5, borderColor: BORDER,
                alignItems: 'center', justifyContent: 'center',
                marginBottom: 20,
              }}>
                <Ionicons name="search-outline" size={32} color="#1e3a5f" />
              </View>
              <Text style={{ color: '#475569', fontSize: 16, fontWeight: '700', marginBottom: 6 }}>
                No results
              </Text>
              <Text style={{ color: '#1e3a5f', fontSize: 13, textAlign: 'center' }}>
                Try a different search or category
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
}