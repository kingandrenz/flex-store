import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCreateProductMutation, useGetProductDetailsQuery } from "../../redux/api/productApiSlice";
import { useSelector } from "react-redux";
import CircleLoader from "../../components/CircleLoader";
import Message from "../../components/Message";
import HeartIcon from "./HeartIcon";
import { FaClock, FaStar, FaStore } from "react-icons/fa";
import moment from 'moment';
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { toast } from "react-toastify";

function ProductDetails() {
    const {id:productId} = useParams();
    const navigate = useNavigate();
    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState('');
    const[comment, setComment] = useState('');

    const {data: product, isLoading, refetch, isError: error} =useGetProductDetailsQuery(productId);

    const {userInfo} = useSelector(state => state.auth);

    const [createReview, {isLoading: loadingProductReveiw}] = useCreateProductMutation();

    const submitHandler = async (e) => {
      e.preventDefault();

      try {
        await createReview({
          productId,
          rating,
          comment,
        }).unwrap();
        refetch();
        toast.success("Review created successfully");
      } catch (error) {
        console.log(error)
         toast.error(error?.data || error.error || error.message)
      }
    }

  return (
    <>
      <div>
        <Link to='/' className="text-black font-semibold hover:underline ml-[10rem]" >
            Go Back
        </Link>
      </div>

      {isLoading ? (<CircleLoader />) : error ? (
        <Message variant="error">{error?.data?.message || error?.message || "Something went wrong!"}</Message>):(
            <>
                <div className="flex flex-wrap relative items-between mt-[2rem] ml-[10rem]">
                    <div>
                        <img src={product.image}
                     alt={product.name}
                     className="w-full xl:w-[50rem] lg:w-[45-rem] md:[30rem] sm:w[20rem] mr-[2rem]"
                      />
                      <HeartIcon product={product} />
                    </div>
                    <div className="flex flex-col justify-between">
                        <h2 className="text-2xl font-semibold">{product.name}</h2>
                        <p className="my-4 xl:w-[35-rem] lg:w-[35rem] md:w-[30rem] text-[#B0B0B0]">
                            {product.description}
                        </p>

                        <p className="text-5xl my-4 font-extrabold w-[20rem]">$ {product.price}</p>

                        <div className="flex items-center judtify-between">
                          <div className="one">
                            <h1 className="flex items-center mb-6">
                              <FaStore className="mr-2 texr-black" /> Brand: {" "}
                              {product.brand}
                            </h1>
                            <h1 className="flex items-center mb-6 w-[20rem]">
                              <FaClock className="mr-2 texr-black" /> Added: {" "}
                              {moment(product.createdAt).fromNow()}
                            </h1>
                            <h1 className="flex items-center mb-6">
                              <FaStar className="mr-2 texr-black" /> Reviews: {" "}
                              {product.numReviews}
                            </h1>
                          </div>

                          <div className="two">
                            <h1 className="flex items-center mb-6">
                              <FaStar className="mr-2 texr-black" />Category : {" "}
                              {product.category}
                            </h1>
                            <h1 className="flex items-center mb-6">
                              <FaClock className="mr-2 texr-black" /> Quantity: {" "}
                              {product.quantity}
                            </h1>
                            <h1 className="flex items-center mb-6">
                              <FaStar className="mr-2 texr-black" /> In stock: {" "}
                              {product.countInstock}
                            </h1>
                          </div>
                        </div>

                        <div className="flex justify-between flex-wrap">
                          {/* Ratings */}
                          <Ratings value={product.rating} text={`${product.numReviews} reviews`} />

                          {product.countInstock > 0 && (
                            <div>
                              <select
                              value={qty} 
                              onChange={(e)=> e.target.value}
                              className="p-2 w-[6rem] rounded-lg text-black" >
                                {[...Array(product.countInstock).keys()].map((x)=> (
                                  <option key={x + 1} value={x + 1}>
                                    {x + 1}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>

                        <div className="btn-container">
                          <button /*onClick={addToCartHandler}*/ disabled={product.countInstock == 0}
                          className="bg-blue-600 text-white py-2 px-4 rounded-lg mt-4 md:mt-2">
                            Add To Cart
                          </button>
                        </div>
                    </div>

                    <div className="mt-[5rem] container flex flex-wrap items-start justify-between ml-[10rem]">
                      {/* productTabs */}
                      <ProductTabs
                      loadingProductReveiw={loadingProductReveiw}
                      submitHandler={submitHandler}
                      userInfo={userInfo}
                      rating={rating}
                      setRating={setRating}
                      comment={comment}
                      setComment={setComment}
                      product={product}
                      productId={productId}
                       />
                    </div>
                </div>
            </>
        )}
    </>
  )
}

export default ProductDetails
