import Header from "./components/Header";
import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "./redux/api/productApiSlice";
import CircleLoader from "./components/CircleLoader";
import Message from "./components/Message";
import Product from "./pages/products/Product";

function Home() {
    const {keyword} = useParams();
    const {data, isLoading, isError} = useGetProductsQuery({keyword});
    console.log("isError",{isError});
    console.log(data);
    
    
    
  return (
    <>
      {
        !keyword ? <Header /> : null
      }

      {isLoading ? (<CircleLoader />) : isError ? (<Message variant="error">
        {isError?.data?.message || isError.error|| "Something went wrong"}
      </Message>) :(
        <>
          <div className="flex justify-between items-center">
              <h1 className="ml-[20rem] mt-[10rem] text-[3rem]">
                Special Products
              </h1>

              <Link
                to="/shop"
                className="bg-blue-600 font-bold rounded-full py-2 px-10 mr-[18rem] mt-[10rem] text-white"
              >
                Shop
              </Link>
            </div>

            <div>
              <div className="flex justify-center flex-wrap mt-[2rem]">
                {data.products.map((product) => (
                  <div key={product._id}>
                    <Product product={product} />
                  </div>
                ))}
              </div>
            </div>
          </>
      ) }
    </>
  )
}

export default Home
