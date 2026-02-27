import React, { createContext, useContext, useState } from 'react';

const FavoritesContext = createContext();

export function FavouritesProvider({ children }) {
  const [favourites, setFavourites] = useState([]);

  const toggleFavourite = (product) => {
    setFavourites((prev) =>
      prev.find((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product]
    );
  };

  const isFavourite = (id) => favourites.some((p) => p.id === id);

  return (
    <FavoritesContext.Provider value={{ favourites, toggleFavourite, isFavourite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavourites = () => useContext(FavoritesContext);