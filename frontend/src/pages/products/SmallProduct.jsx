import { Link } from "react-router-dom"
import HeartIcon from "./HeartIcon"

function SmallProduct({product}) {
  return (
    <div className="w-[12rem] ml-[5rem] p-3">
      <div className="relative">
        <img src={product.image} alt={product.name} className="h-auto rounded" />
        <HeartIcon product={product} />

        <div className="p-54">
            <Link to={`/product/${product._id}`}>
                <h2 className="flex justify-between items-center">
                    <div className="truncate max-w-[8rem]">{product.name}</div>
                    <span
                      className="flex-shrink-0 bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 
                      rounded-full dark:bg-blue-900 dark:text-blue-300 min-w-[3.5rem] text-center"
                    >
                      ${product.price}
                    </span>
                </h2>
            </Link>
        </div>
      </div>
    </div>
  )
}

export default SmallProduct
