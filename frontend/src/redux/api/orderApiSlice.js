import { apiSlice } from "./apiSlice";
import { ORDER_URL, PAYPAL_URL } from "../constants";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDER_URL,
        method: "POST",
        body: order,
      }),
    }),
    getOrderDetails: builder.query({
      query: (orderId) => ({
        url: `${ORDER_URL}/${orderId}`,
      }),
    }),

    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${ORDER_URL}/${orderId}/pay`,
        method: "PUT",
        body: details,
      }),
    }),

    getPayPalClientId: builder.query({
      query: () => ({
        url: PAYPAL_URL,
      }),
    }),

    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDER_URL}/mine`,
      }),
      keepUnusedDataFor: 5,
    }),

    getOrders: builder.query({
      query: () => ({
        url: ORDER_URL,
      }),
    }),

    deliverOrder: builder.query({
      query: (orderId) => ({
        url: `${ORDER_URL}/${orderId}/deliver`,
        method: "PUT",
      }),
    }),

    getTotatlOrders: builder.query({
      query: () => ({
        url: `${ORDER_URL}/total-orders`,
      }),
    }),

    getTotalSales: builder.query({
      query: () => ({
        url: `${ORDER_URL}/total-sales`,
      }),
    }),

    getTotalSalesByDate: builder.query({
      query: () => ({
        url: `${ORDER_URL}/total-sales-by-date`,
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation, //for dashboard
  useGetOrderDetailsQuery, // for dashboard
  usePayOrderMutation,
  useGetPayPalClientIdQuery,
  useGetMyOrdersQuery,
  useGetOrdersQuery,
  useDeliverOrderQuery,
  //-------------------
  useGetTotatlOrdersQuery,
  useGetTotalSalesQuery,
  useGetTotalSalesByDateQuery,
} = orderApiSlice;
