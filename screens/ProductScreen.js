import React, { useRef } from 'react';
import {
  View, Text, Image, TouchableOpacity,
  ScrollView, StatusBar, Animated, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFavourites } from '../contexts/FavoritesContext';

const { width } = Dimensions.get('window');

// ─── Design tokens ────────────────────────────────────────────────────────────
const BG      = '#050d1a';
const CARD_BG = '#080f1e';
const BORDER  = '#0f2044';
const BLUE    = '#2563eb';
const BLUE_LT = '#60a5fa';
const SUBTLE  = '#0d1d35';
const MUTED   = '#334155';

const CAT_LABELS = {
  'electronics':      'Electronics',
  "men's clothing":   "Men's",
  "women's clothing": "Women's",
  'jewelery':         'Jewelry',
};

// ─── Star renderer ────────────────────────────────────────────────────────────
const Stars = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => {
        const name = i < full ? 'star' : (i === full && half ? 'star-half' : 'star-outline');
        const color = i < full || (i === full && half) ? '#fbbf24' : '#1e3a5f';
        return <Ionicons key={i} name={name} size={15} color={color} />;
      })}
    </View>
  );
};

// ─── Info row component ───────────────────────────────────────────────────────
const InfoPill = ({ icon, label, value, valueColor }) => (
  <View style={{
    flex: 1,
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: 1.5, borderColor: BORDER,
    padding: 14,
    alignItems: 'center',
  }}>
    <Ionicons name={icon} size={18} color={MUTED} style={{ marginBottom: 6 }} />
    <Text style={{ color: '#1e3a5f', fontSize: 9, fontWeight: '800', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>
      {label}
    </Text>
    <Text style={{ color: valueColor ?? '#e2e8f0', fontSize: 15, fontWeight: '800', letterSpacing: -0.3 }}>
      {value}
    </Text>
  </View>
);

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function ProductScreen({ route, navigation }) {
  const { product } = route.params;
  const { toggleFavourite, isFavourite } = useFavourites();
  const fav = isFavourite(product.id);

  const heartScale = useRef(new Animated.Value(1)).current;

  const handleFavToggle = () => {
    Animated.sequence([
      Animated.spring(heartScale, { toValue: 1.35, tension: 260, friction: 5, useNativeDriver: true }),
      Animated.spring(heartScale, { toValue: 1,    tension: 260, friction: 5, useNativeDriver: true }),
    ]).start();
    toggleFavourite(product);
  };

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <StatusBar barStyle="light-content" backgroundColor={BG} />

      {/* Background glows */}
      <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <View style={{ position: 'absolute', top: -80, right: -80,  width: 300, height: 300, borderRadius: 150, backgroundColor: '#1e3a8a', opacity: 0.08 }} />
        <View style={{ position: 'absolute', bottom: -60, left: -50, width: 240, height: 240, borderRadius: 120, backgroundColor: '#1d4ed8', opacity: 0.07 }} />
      </View>

      <SafeAreaView style={{ flex: 1 }}>

        {/* ── Top nav ── */}
        <View style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          paddingHorizontal: 24, paddingVertical: 12,
        }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
            style={{
              width: 44, height: 44, borderRadius: 22,
              backgroundColor: CARD_BG,
              borderWidth: 1.5, borderColor: BORDER,
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Ionicons name="arrow-back" size={20} color="#94a3b8" />
          </TouchableOpacity>

          <Text style={{
            color: '#1e3a5f',
            fontSize: 10,
            fontWeight: '800',
            letterSpacing: 3,
            textTransform: 'uppercase',
          }}>
            Product Detail
          </Text>

          <Animated.View style={{ transform: [{ scale: heartScale }] }}>
            <TouchableOpacity
              onPress={handleFavToggle}
              activeOpacity={0.8}
              style={{
                width: 44, height: 44, borderRadius: 22,
                backgroundColor: fav ? '#1a0505' : CARD_BG,
                borderWidth: 1.5,
                borderColor: fav ? '#7f1d1d' : BORDER,
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Ionicons
                name={fav ? 'heart' : 'heart-outline'}
                size={20}
                color={fav ? '#ef4444' : MUTED}
              />
            </TouchableOpacity>
          </Animated.View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>

          {/* ── Product image ── */}
          <View style={{
            marginHorizontal: 24,
            marginTop: 8,
            marginBottom: 28,
            borderRadius: 24,
            backgroundColor: SUBTLE,
            borderWidth: 1.5, borderColor: BORDER,
            height: 280,
            alignItems: 'center', justifyContent: 'center',
            padding: 28,
            overflow: 'hidden',
          }}>
            <Image
              source={{ uri: product.image }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
            />
          </View>

          {/* ── Content ── */}
          <View style={{ paddingHorizontal: 24 }}>

            {/* Category badge */}
            <View style={{
              alignSelf: 'flex-start',
              flexDirection: 'row', alignItems: 'center',
              paddingHorizontal: 12, paddingVertical: 6,
              borderRadius: 24,
              backgroundColor: SUBTLE,
              borderWidth: 1, borderColor: BORDER,
              marginBottom: 14,
              gap: 6,
            }}>
              <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: BLUE }} />
              <Text style={{
                color: BLUE_LT,
                fontSize: 9, fontWeight: '800',
                letterSpacing: 2.5, textTransform: 'uppercase',
              }}>
                {CAT_LABELS[product.category] ?? product.category}
              </Text>
            </View>

            {/* Title */}
            <Text style={{
              color: '#f1f5f9',
              fontSize: 22,
              fontWeight: '800',
              lineHeight: 31,
              letterSpacing: -0.5,
              marginBottom: 24,
            }}>
              {product.title}
            </Text>

            {/* Info pills row */}
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 24 }}>
              <InfoPill
                icon="pricetag-outline"
                label="Price"
                value={`$${product.price}`}
                valueColor={BLUE_LT}
              />
              {product.rating && (
                <InfoPill
                  icon="star-outline"
                  label="Rating"
                  value={`${product.rating.rate} / 5`}
                  valueColor="#fbbf24"
                />
              )}
              {product.rating && (
                <InfoPill
                  icon="people-outline"
                  label="Reviews"
                  value={String(product.rating.count)}
                />
              )}
            </View>

            {/* Star row */}
            {product.rating && (
              <View style={{
                flexDirection: 'row', alignItems: 'center',
                marginBottom: 28, gap: 10,
              }}>
                <Stars rating={product.rating.rate} />
                <Text style={{ color: '#1e3a5f', fontSize: 12, fontWeight: '600' }}>
                  Based on {product.rating.count} reviews
                </Text>
              </View>
            )}

            {/* Divider */}
            <View style={{ height: 1, backgroundColor: BORDER, marginBottom: 24 }} />

            {/* Description label */}
            <Text style={{
              color: '#1e3a5f',
              fontSize: 9, fontWeight: '800',
              letterSpacing: 3, textTransform: 'uppercase',
              marginBottom: 12,
            }}>
              Description
            </Text>

            {/* Description text */}
            <Text style={{
              color: '#475569',
              fontSize: 14.5,
              lineHeight: 25,
              fontWeight: '400',
              marginBottom: 28,
            }}>
              {product.description}
            </Text>

            {/* Tags */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {[CAT_LABELS[product.category] ?? product.category, 'In Stock', 'Free Shipping'].map((tag, i) => (
                <View
                  key={i}
                  style={{
                    paddingHorizontal: 12, paddingVertical: 6,
                    borderRadius: 20,
                    backgroundColor: SUBTLE,
                    borderWidth: 1, borderColor: BORDER,
                  }}
                >
                  <Text style={{ color: '#334155', fontSize: 11, fontWeight: '600', letterSpacing: 0.3 }}>
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* ── Bottom CTA ── */}
        <View style={{
          paddingHorizontal: 24, paddingTop: 16, paddingBottom: 28,
          borderTopWidth: 1, borderTopColor: BORDER,
          backgroundColor: BG,
        }}>
          <TouchableOpacity
            onPress={handleFavToggle}
            activeOpacity={0.82}
            style={{
              height: 60,
              borderRadius: 20,
              flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
              backgroundColor: fav ? '#1a0505' : BLUE,
              borderWidth: 1.5,
              borderColor: fav ? '#7f1d1d' : '#3b82f6',
              shadowColor: fav ? '#ef4444' : BLUE,
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.4,
              shadowRadius: 24,
              elevation: 12,
              gap: 12,
            }}
          >
            <Ionicons
              name={fav ? 'heart' : 'heart-outline'}
              size={20}
              color={fav ? '#ef4444' : '#fff'}
            />
            <Text style={{
              fontSize: 14,
              fontWeight: '800',
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              color: fav ? '#ef4444' : '#fff',
            }}>
              {fav ? 'Remove from Favourites' : 'Add to Favourites'}
            </Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </View>
  );
}