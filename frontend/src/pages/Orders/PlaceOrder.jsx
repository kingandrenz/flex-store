import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import CircleLoader from "../../components/CircleLoader";
import {useCreateOrderMutation} from "../../redux/api/orderApiSlice";
import { clearCart } from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";

export default function PlaceOrder() {
    const navigate = useNavigate();

    const cart = useSelector(state => state.cart);

    const [createOrder, {isLoading, error}] =useCreateOrderMutation();

    useEffect(()=> {
        if (!cart.shippingAddress.address) {
            navigate('/shipping');
        }
    }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

    const dispatch = useDispatch();
    console.log("Cart items being sent to backend:", cart.cartItems);

    const placeOrderHandler = async () => {
        try {
            const res = await createOrder({
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice
            }).unwrap();
            dispatch(clearCart());
            navigate(`/order/${res._id}`);
        } catch (error) {
            console.error(error);
            toast.error(error?.data?.message || error?.message || "An unknown error occurred");
            
        }
    }
    
  return (
    <>
    <ProgressSteps step1 step2 step3 />

    <div className="container mx-auto mt-8 ml-12">
        {cart.cartItems.length === 0 ? (
            <Message>Your cart is empty. <Link to="/shop" className="text-blue-500 hover:underline">Go to Shop</Link></Message>
        ): (
        <div className="flex flex-wrap lg:flex-nowrap justify-between gap-8"> 
            {/* Left side: Order Items Table */}
            <div className="overflow-x-auto w-full lg:w-2/3"> 
                <h2 className="text-2xl font-semibold mb-4">Order Items</h2>
                <table className="w-full border-collapse bg-white rounded-lg shadow-md overflow-hidden"> 
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-4 py-3 text-left">Image</th> 
                            <th className="px-4 py-3 text-left">Product</th>
                            <th className="px-4 py-3 text-left">Quantity</th>
                            <th className="px-4 py-3 text-left">Price</th>
                            <th className="px-4 py-3 text-left">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.cartItems.map((item, index) => (
                            <tr key={index} className="border-b border-gray-200 last:border-b-0">
                                <td className="p-4">
                                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                </td>

                                <td className="p-4">
                                    <Link to={`/product/${item.product}`} className="text-blue-600 hover:underline">{item.name}</Link>
                                </td>
                                <td className="p-4">{item.qty}</td>
                                <td className="p-4">${item.price.toFixed(2)}</td>
                                <td className="p-4">${(item.qty * item.price).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Right side: Order Summary, Shipping, Payment, Place Order Button */}
            <div className="w-full lg:w-1/3 p-6 bg-white rounded-lg shadow-md"> 
                <h2 className="text-2xl font-semibold mb-5">Order Summary</h2>
                <div className="space-y-4">
                    <div>
                        <ul className="text-lg space-y-2">
                            <li>
                                <span className="font-semibold">Items:</span> $
                                {cart.itemsPrice}
                            </li>
                            <li>
                                <span className="font-semibold">Shipping:</span> $
                                {cart.shippingPrice}
                            </li>
                            <li>
                                <span className="font-semibold">Tax:</span> $
                                {cart.taxPrice}
                            </li>
                            <li className="font-bold text-xl mt-2 pt-2 border-t border-gray-200">
                                <span className="font-semibold">Total:</span> $
                                {cart.totalPrice}
                            </li>
                        </ul>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                        <h2 className="text-xl font-semibold mb-2">Shipping To</h2>
                        <p className="text-gray-700">
                            <strong>Address:</strong> {" "}
                            {cart.shippingAddress.address}, {" "}
                            {cart.shippingAddress.city},{" "}
                            {cart.shippingAddress.postalCode}, {" "}
                            {cart.shippingAddress.country}
                        </p>
                    </div>

                    <div className="border-t border-gray-200 pt-4"> 
                        <h2 className="text-xl font-semibold mb-2">Payment Method</h2>
                        <p className="text-gray-700">
                            <strong>Method:</strong> {" "}
                            {cart.paymentMethod}
                        </p>
                    </div>
                </div>

                {error && <Message variant='error' className="mt-4">{error.data?.message || error.message}</Message>} 

                <button 
                    type="button" 
                    className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 
                    rounded-full text-xl w-full mt-6 transition-colors duration-200" 
                    disabled={cart.cartItems.length === 0 || isLoading} 
                    onClick={placeOrderHandler}
                >
                    {isLoading ? "Placing Order..." : "Place Order"}
                </button>

                {isLoading && (<CircleLoader className="mt-4"/>)} 
            </div>
        </div>
        )}
    </div>
      
    </>
  )
}
