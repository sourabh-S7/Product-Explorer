import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useFavourites } from '../contexts/FavoritesContext';

export default function ProductCard({ product }) {
  const { toggleFavourite, isFavourite } = useFavourites();
  const fav = isFavourite(product.id);

  return (
    <View className="bg-white rounded-3xl p-4 mb-4 shadow-sm border border-gray-100">
      {/* Emoji Banner */}
      <View className="bg-gray-50 rounded-2xl h-36 items-center justify-center mb-3">
        <Text style={{ fontSize: 60 }}>{product.emoji}</Text>
        <View className={`absolute top-3 left-3 ${product.tagColor} px-2.5 py-0.5 rounded-full`}>
          <Text className="text-white text-xs font-bold">{product.tag}</Text>
        </View>
      </View>

      {/* Info Row */}
      <View className="flex-row justify-between items-start">
        <View className="flex-1 pr-2">
          <Text className="text-xs text-gray-400 font-medium uppercase tracking-widest">
            {product.category}
          </Text>
          <Text className="text-gray-800 font-bold text-base mt-0.5">{product.name}</Text>
          <Text className="text-gray-400 text-xs mt-1" numberOfLines={1}>
            {product.description}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => toggleFavourite(product)}
          className="mt-1"
        >
          <Text style={{ fontSize: 24 }}>{fav ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      {/* Price + Rating */}
      <View className="flex-row justify-between items-center mt-3">
        <Text className="text-indigo-600 font-extrabold text-lg">${product.price}</Text>
        <View className="flex-row items-center bg-amber-50 px-2.5 py-1 rounded-full">
          <Text className="text-amber-500 text-xs">⭐</Text>
          <Text className="text-amber-600 font-bold text-xs ml-1">{product.rating}</Text>
        </View>
      </View>
    </View>
  );
}