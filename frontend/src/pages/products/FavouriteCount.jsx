import { useSelector } from "react-redux"


function FavouriteCount() {
    const favorites = useSelector(state => state.favorites);
    const favoriteCount = favorites.length;

  return (
    <div className="absolute left-2 top-8">
      {favoriteCount > 0 && (
        <span className="px-1 py-0 text-sm bg-red-500 rounded-full">{favoriteCount}</span>
      )}
    </div>
  )
}

export default FavouriteCount
