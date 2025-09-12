// Add a product to local Storage
export const addFavoritesToLocalStorage = (product) => {
  const favorites = getFavoritesFromLocalStorage();
  if (!favorites.some((p) => p._id === product._id)) {
    favorites.push(product);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
};

// Remove a product from localStorage
export const removeFavoritesFromLocalStorage = (productId) => {
  const favorites = getFavoritesFromLocalStorage();
  const updateFavorites = favorites.filter(
    (product) => product._id !== productId
  );

  localStorage.setItem("favorites", JSON.stringify(updateFavorites));
};

// Retrieve favorites from a localStorage
export const getFavoritesFromLocalStorage = () => {
  const favoritesJson = localStorage.getItem("favorites");
  return favoritesJson ? JSON.parse(favoritesJson) : [];
};
