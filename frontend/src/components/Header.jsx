import ProductCarousel from "../pages/products/ProductCarousel";
import SmallProduct from "../pages/products/SmallProduct";
import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";

function Header() {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <h1 className="text-red-500 text-center">
        {error?.data?.message || error.error || "Something went wrong"}
      </h1>
    );
  }

  return (
    <>
        <div className="flex justify-around gap-x-[4rem]">
        <div className="xl:block lg:hidden md:hidden sm:hidden">
            <div className="grid grid-cols-2">
            {data?.map((product) => (
                <div key={product._id}>
                <SmallProduct product={product} />
                </div>
            ))}
            </div>
        </div>
        <ProductCarousel />
        </div>
    </>
  );
}

export default Header;
