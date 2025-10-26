import React, { useEffect } from "react"; // Explicitly import React
import { Link, useParams } from 'react-router-dom';
import { useSelector } from "react-redux";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import CircleLoader from "../../components/CircleLoader";
import {
    useDeliverOrderMutation,
    useGetOrderDetailsQuery,
    useGetPayPalClientIdQuery,
    usePayOrderMutation // Correctly import payOrderMutation
} from "../../redux/api/orderApiSlice";

function Orders() {
    const { id: orderid } = useParams();

    const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderid);

    // Correctly separate payment and delivery mutations
    const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
    const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();

    // Correctly destructure userInfo
    const { userInfo } = useSelector((state) => state.auth);

    const [{ isPending }, payPalDispatch] = usePayPalScriptReducer();

    const { data: paypal, isLoading: paypalLoading, error: errorPaypal } = useGetPayPalClientIdQuery();

    useEffect(() => {
        // Only proceed if order details are loaded and not paid, AND PayPal client ID is available
        if (!errorPaypal && !paypalLoading && paypal?.clientId && order && !order.isPaid) {
            const loadPayPalScript = async () => { // Renamed for clarity
                payPalDispatch({
                    type: 'resetOptions',
                    value: {
                        "client-id": paypal.clientId,
                        currency: "USD",
                    }
                });
                payPalDispatch({ type: "setLoadingStatus", value: 'pending' });
            };

            // Check if PayPal script is not already loaded
            if (!window.paypal) {
                loadPayPalScript();
            }
        }
    }, [errorPaypal, paypalLoading, paypal, payPalDispatch, order]); // Corrected dependency: paypalLoading, added order

    function onApprove(data, actions) {
        return actions.order.capture().then(async (details) => {
            try {
                // Call the payOrder mutation
                await payOrder({ orderId: orderid, details });
                refetch(); // Refetch order details to update UI
                toast.success("Order is paid");
            } catch (err) {
                toast.error(err?.data?.message || err.message);
            }
        });
    }

    function createOrder(data, actions) {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: order.totalPrice, // Use total price from the fetched order
                    },
                },
            ],
        }).then((orderID) => {
            return orderID;
        });
    }

    function onError(err) {
        toast.error(err.message);
    }

    const deliverHandler = async () => {
        try {
            await deliverOrder(orderid);
            refetch();
            toast.success("Order delivered");
        } catch (err) {
            toast.error(err?.data?.message || err.message);
        }
    };



    return isLoading ? (
        <CircleLoader />
    ) : error ? (
        <Message variant="error">{error.data?.message || error.message}</Message>
    ) : (
        <div className="container mx-auto p-4"> 
            <div className="flex flex-col md:flex-row gap-8">
                {/* Left Side: Order Details */}
                <div className="md:w-2/3">
                    <div className="border border-gray-300 rounded-lg p-4 mt-5 mb-5 bg-white shadow-md"> 
                        <h2 className="text-3xl font-bold mb-4">Order {order._id}</h2>
                        
                        <div className="mb-4">
                            <h3 className="text-xl font-semibold mb-2">Shipping</h3>
                            <p>
                                <strong>Name:</strong> {order.user.username}
                            </p>
                            <p>
                                <strong>Email:</strong> {order.user.email}
                            </p>
                            <p>
                                <strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                            </p>
                            {order.isDelivered ? (
                                <Message variant="success">Delivered on {order.deliveredAt.substring(0, 10)}</Message>
                            ) : (
                                <Message variant="error">Not Delivered</Message>
                            )}
                        </div>

                        <div className="mb-4">
                            <h3 className="text-xl font-semibold mb-2">Payment Method</h3>
                            <p>
                                <strong>Method:</strong> {order.paymentMethod}
                            </p>
                            {order.isPaid ? (
                                <Message variant="success">Paid on {order.paidAt.substring(0, 10)}</Message>
                            ) : (
                                <Message variant="error">Not Paid</Message>
                            )}
                        </div>

                        <div className="mb-4">
                            <h3 className="text-xl font-semibold mb-2">Order Items</h3>
                            {order.orderItems.length === 0 ? (
                                <Message>Order is empty</Message>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-gray-100 rounded-md">
                                        <thead>
                                            <tr>
                                                <th className="py-2 px-4 text-left">Image</th>
                                                <th className="py-2 px-4 text-left">Product</th>
                                                <th className="py-2 px-4 text-left">Quantity</th>
                                                <th className="py-2 px-4 text-left">Price</th>
                                                <th className="py-2 px-4 text-left">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.orderItems.map((item, index) => (

                                                <tr key={index} className="border-t border-gray-200">
                                                    <td className="py-2 px-4">
                                                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                                    </td>
                                                    <td className="py-2 px-4">
                                                        <Link to={`/product/${item.product}`} className="text-blue-600 hover:underline">{item.name}</Link>
                                                    </td>
                                                    <td className="py-2 px-4">{item.qty}</td>
                                                    <td className="py-2 px-4">${item.price.toFixed(2)}</td>
                                                    <td className="py-2 px-4">${(item.qty * item.price).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Side: Order Summary & Actions */}
                <div className="md:w-1/3 mt-5">
                    <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-md">
                        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                        <ul className="text-lg space-y-2">
                            <li>
                                <span className="font-semibold">Items:</span> ${order.itemsPrice}
                                {console.log("Order: ", order)}
                            </li>
                            <li>
                                <span className="font-semibold">Shipping:</span> ${order.shippingPrice}
                            </li>
                            <li>
                                <span className="font-semibold">Tax:</span> ${order.taxPrice}
                            </li>
                            <li className="font-bold text-xl border-t border-gray-200 pt-2 mt-2">
                                <span className="font-semibold">Total:</span> ${order.totalPrice}
                            </li>
                        </ul>

                        {!order.isPaid && (
                            <div className="mt-4">
                                {loadingPay && <CircleLoader />}
                                {isPending ? (
                                    <CircleLoader />
                                ) : (
                                    <div className="mt-4">
                                        <PayPalButtons
                                            createOrder={createOrder}
                                            onApprove={onApprove}
                                            onError={onError}
                                        ></PayPalButtons>
                                    </div>
                                )}
                            </div>
                        )}

                        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                            <button
                                type="button"
                                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full w-full mt-4 transition-colors duration-200"
                                onClick={deliverHandler}
                                disabled={loadingDeliver}
                            >
                                {loadingDeliver ? "Marking as Delivered..." : "Mark As Delivered"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Orders;