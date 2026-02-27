import React, { useRef } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  Image, StatusBar, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFavourites } from '../contexts/FavoritesContext';

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

// ─── Fav card ─────────────────────────────────────────────────────────────────
const FavCard = ({ item, onPress, onRemove }) => {
  const slideAnim   = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handleRemove = () => {
    Animated.parallel([
      Animated.timing(slideAnim,   { toValue: 80,  duration: 260, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 0,   duration: 220, useNativeDriver: true }),
    ]).start(() => onRemove(item));
  };

  return (
    <Animated.View style={{
      opacity: opacityAnim,
      transform: [{ translateX: slideAnim }],
      marginBottom: 12,
    }}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        style={{
          flexDirection: 'row',
          backgroundColor: CARD_BG,
          borderRadius: 20,
          borderWidth: 1.5,
          borderColor: BORDER,
          overflow: 'hidden',
          shadowColor: '#1d4ed8',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.12,
          shadowRadius: 16,
          elevation: 8,
        }}
      >
        {/* Product image */}
        <View style={{
          width: 106,
          backgroundColor: SUBTLE,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 14,
          borderRightWidth: 1,
          borderRightColor: BORDER,
        }}>
          <Image
            source={{ uri: item.image }}
            style={{ width: '100%', height: 78 }}
            resizeMode="contain"
          />
        </View>

        {/* Info */}
        <View style={{ flex: 1, padding: 14, justifyContent: 'space-between' }}>
          <View>
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
                fontSize: 13,
                fontWeight: '600',
                lineHeight: 19,
              }}
            >
              {item.title}
            </Text>
          </View>

          {/* Price + rating */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
            <Text style={{ color: BLUE_LT, fontWeight: '900', fontSize: 16, letterSpacing: -0.3 }}>
              ${item.price}
            </Text>
            {item.rating && (
              <View style={{
                flexDirection: 'row', alignItems: 'center',
                backgroundColor: '#1a1200',
                borderRadius: 8, paddingHorizontal: 7, paddingVertical: 3,
                borderWidth: 1, borderColor: '#3b2800',
              }}>
                <Ionicons name="star" size={10} color="#fbbf24" />
                <Text style={{ color: '#fbbf24', fontSize: 11, fontWeight: '700', marginLeft: 3 }}>
                  {item.rating.rate}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Remove button */}
        <TouchableOpacity
          onPress={handleRemove}
          activeOpacity={0.75}
          style={{
            width: 56,
            alignItems: 'center',
            justifyContent: 'center',
            borderLeftWidth: 1,
            borderLeftColor: BORDER,
          }}
        >
          <View style={{
            width: 36, height: 36, borderRadius: 18,
            backgroundColor: '#1a0505',
            borderWidth: 1, borderColor: '#3f0a0a',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Ionicons name="trash-outline" size={15} color="#ef4444" />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Empty state ──────────────────────────────────────────────────────────────
const EmptyState = ({ onBrowse }) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, paddingBottom: 60 }}>
    <View style={{
      width: 96, height: 96, borderRadius: 48,
      backgroundColor: '#1a0505',
      borderWidth: 1.5, borderColor: '#3f0a0a',
      alignItems: 'center', justifyContent: 'center',
      marginBottom: 28,
    }}>
      <Ionicons name="heart-dislike-outline" size={42} color="#7f1d1d" />
    </View>

    <Text style={{
      color: '#f1f5f9',
      fontSize: 22,
      fontWeight: '800',
      letterSpacing: -0.5,
      marginBottom: 10,
      textAlign: 'center',
    }}>
      No Favourites Yet
    </Text>
    <Text style={{
      color: '#334155',
      fontSize: 14,
      textAlign: 'center',
      lineHeight: 23,
      marginBottom: 36,
    }}>
      Browse our catalog and save the{'\n'}products you love.
    </Text>

    <TouchableOpacity
      onPress={onBrowse}
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
      <Ionicons name="grid-outline" size={16} color="#fff" />
      <Text style={{
        color: '#fff', fontWeight: '700', fontSize: 14,
        marginLeft: 10, letterSpacing: 1.5, textTransform: 'uppercase',
      }}>
        Browse Products
      </Text>
    </TouchableOpacity>
  </View>
);

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function FavouritesScreen({ navigation }) {
  const { favourites, toggleFavourite } = useFavourites();

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <StatusBar barStyle="light-content" backgroundColor={BG} />

      {/* Background glows */}
      <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <View style={{ position: 'absolute', top: -100, left: -70,  width: 300, height: 300, borderRadius: 150, backgroundColor: '#7f1d1d', opacity: 0.06 }} />
        <View style={{ position: 'absolute', bottom: -60, right: -50, width: 240, height: 240, borderRadius: 120, backgroundColor: '#1e40af', opacity: 0.06 }} />
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={{
              color: '#3f0a0a',
              fontSize: 9,
              fontWeight: '800',
              letterSpacing: 3.5,
              textTransform: 'uppercase',
              marginBottom: 4,
            }}>
              Saved
            </Text>
            <Text style={{
              color: '#f1f5f9',
              fontSize: 30,
              fontWeight: '900',
              letterSpacing: -1,
              lineHeight: 34,
            }}>
              Favourites
            </Text>
          </View>

          {/* Count badge */}
          {favourites.length > 0 && (
            <View style={{
              paddingHorizontal: 16, paddingVertical: 8,
              borderRadius: 24,
              backgroundColor: '#1a0505',
              borderWidth: 1, borderColor: '#3f0a0a',
            }}>
              <Text style={{ color: '#ef4444', fontWeight: '800', fontSize: 13, letterSpacing: 0.2 }}>
                {favourites.length} item{favourites.length !== 1 ? 's' : ''}
              </Text>
            </View>
          )}
        </View>

        {/* Separator */}
        {favourites.length > 0 && (
          <View style={{ height: 1, backgroundColor: BORDER, marginHorizontal: 24, marginBottom: 16 }} />
        )}

        {favourites.length === 0 ? (
          <EmptyState onBrowse={() => navigation.navigate('Home')} />
        ) : (
          <FlatList
            data={favourites}
            keyExtractor={item => String(item.id)}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 110 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <FavCard
                item={item}
                onPress={() => navigation.navigate('ProductDetail', { product: item })}
                onRemove={toggleFavourite}
              />
            )}
          />
        )}
      </SafeAreaView>
    </View>
  );
}