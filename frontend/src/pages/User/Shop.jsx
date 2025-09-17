import { useGetFilteredProductsQuery } from "../../redux/api/productApiSlice";

import { setCategories, setProducts, setChecked } from "../../redux/features/shop/shopSlice";
import { useDispatch, useSelector } from "react-redux";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { useEffect, useState } from "react";
import ProductCard from "../products/ProductCard";
import CircleLoader from '../../components/CircleLoader';

function Shop() {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector((state)=> state.shop);
  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");

  const filteredProductsQuery = useGetFilteredProductsQuery({checked, radio});

  useEffect(()=> {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch])

  useEffect(()=> {
    if (!checked.length || !radio.length) {
      if (!filteredProductsQuery.isLoading) {
        // Filter products based on both checked categories and price filter
        const filteredProducts = filteredProductsQuery.data?.filter((product)=> {
          return (
            product.price.toString().includes(priceFilter) || product.price === parseInt(priceFilter, 10)
          )
        });
        dispatch(setProducts(filteredProducts));
      }
    }
  },[checked, radio, filteredProductsQuery.data, dispatch, priceFilter])
  
const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
  };

const handleCheck = (value, id) => {
  const updatedChecked = value ? [...checked, id] :checked.filter((c)=> c!== id);
  dispatch(setChecked(updatedChecked));
}

//  Add *All Brands* option to uniqueBrands

const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

const handlePriceChange = (e) => {
  //  update the price filter when the user types in the input field
  setPriceFilter(e.target.value)
}

  return (
    <>
      <div className="container mx-auto md:ml-[4rem]">
        <div className="flex md:flex-row">
          <div className="bg-[#151515] p-3 mt-2 mb-2">
            <h2 className="h4 text-center py-2 bg-black rounded-full mb-2 text-white">
              Filter By Caategories
            </h2>

            <div className="p-5 w-[15rem]">
              {categories?.map((c)=> (
                <div className="mb-2" key={c._id}>
                  <div className="flex items-center mr-4">
                    <input type="checkbox" 
                    id="blue-checkbox"
                    onChange={(e)=> handleCheck(e.target.checked, c._id)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 
                    dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                     />

                     <label htmlFor="blue-checkbox" 
                     className="ml-2 text-sm font-medium text-white dark:text-gray-300">
                      {c.name}
                     </label>
                  </div>
                </div>
              ))}
            </div>
            {/* Brand */}
            <h2 className="h4 text-center py-2 bg-black rounded-full mb-2 text-white">Filter By Brand </h2>

            <div className="p-5">
              {
                uniqueBrands?.map((brand, index)=> (
                  <>
                  <div key={index} className="flex items-center mr-4 mb-5">
                    <input type="radio"
                    id={brand}
                    onChange={()=> handleBrandClick(brand)}
                    className="w-4 h-4 text-pink-400 bg-gray-100 border-gray-300 focus:ring-pink-500
                     dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700
                      dark:border-gray-600"
                     />

                     <label
                      htmlFor="blue-radio"
                      className="ml-2 text-sm font-medium text-white dark:text-gray-300"
                    >
                      {brand}
                    </label>
                  </div>
                  </>
                ))
              }
            </div>

            <h2 className="px-4 text-center py-2 bg-black rounded-full mb-2 text-white">
              Filter By Price
            </h2>
             <div className="p-5 w-[15rem]">
              <input
                type="text"
                placeholder="Enter Price"
                value={priceFilter}
                onChange={handlePriceChange}
                className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none 
                focus:ring focus:border-blue-400"
              />
            </div>

            <div className="p-5 pt-0">
              <button
                className="w-full border my-4 text-white"
                onClick={() => window.location.reload()}
              >
                Reset
              </button>
            </div>
          </div>

              <div className="p-3">
            <h2 className="h4 text-center mb-2">{products?.length} Products</h2>
            <div className="flex flex-wrap">
              {products.length === 0 ? (
                <CircleLoader />
              ) : (
                products?.map((p) => (
                  <div className="p-3" key={p._id}>
                    <ProductCard p={p} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Shop
