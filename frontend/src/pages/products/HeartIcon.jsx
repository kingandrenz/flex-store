import { useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToFavorites, removeFromFavorites, setFavorites } from "../../redux/features/favorites/favoriteSlice";

import { getFavoritesFromLocalStorage,
     addFavoritesToLocalStorage, 
     removeFavoritesFromLocalStorage 
    } from "../../Utils/localStorage";



function HeartIcon({product}) {
    const dispatch = useDispatch();
    const favorites = useSelector(state => state.favorites) || [];
    const isFavorite = favorites.some((p) => p._id === product._id)

    useEffect(() => {
        const favoritesFromLocalStorage = getFavoritesFromLocalStorage();
        dispatch(setFavorites(favoritesFromLocalStorage));
    }, [])

    const toggleFavorites = ()=> {
        if (isFavorite) {
            dispatch(removeFromFavorites(product));
            // remove from local storage as well
            removeFavoritesFromLocalStorage(product._id)
        } else {
            dispatch(addToFavorites(product));
            // add to local storage as well
            addFavoritesToLocalStorage(product)
        }
    }

  return (
    <div onClick={toggleFavorites} className="absolute top-2 right-5 cursor-pointer">
      {isFavorite ? (<FaHeart className="text-red-500" />) : (<FaRegHeart className="text-white" />)}
    </div>
  )
}

export default HeartIcon
