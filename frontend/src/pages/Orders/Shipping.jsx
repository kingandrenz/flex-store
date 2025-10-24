import React, { useEffect, useState } from 'react'
import { saveShippingAddress } from '../../redux/features/cart/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

function Shipping() {
  const cart = useSelector((state)=> state.cart)
  const {ShippingAddress} = cart;
  const [paymentMethod, setPaymentMethod] = useState('payPal');
  const [address, setAdress] = useState(saveShippingAddress.address || '');
  const [city, setCity] = useState(saveShippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(saveShippingAddress.postalCode || "");
  const [country, setCountry] = useState(saveShippingAddress.country || "");

    

  const dispatch = useDispatch();
  const navigate = useNavigate()

  // payment

  useEffect(()=> {
      if (!saveShippingAddress.address) {
          navigate("/shipping");
        }
  }, [navigate, saveShippingAddress])
  return (
    <div className='mx-auto container mt-10'>
      <div className="flex justify-around items-center flex-wrap mt-[10rem]">
        <form className='w-[40rem]'>
          <h1 className="text-2xl font-semibold mb-4">Shipping</h1>
          <div className="mb-4">
            <label htmlFor="" className="block text-white mb-2">Address</label>
            <input type='text' 
            className='w-full p-2 border rounded' 
            placeholder='enter Address'
            value={address} required 
            onChange={(e)=> setAdress(e.target.value)}/>
          </div>
          
          <div className="mb-4">
            <label htmlFor="" className="block text-white mb-2">City</label>
            <input type='text' 
            className='w-full p-2 border rounded' 
            placeholder='enter City'
            value={city} required 
            onChange={(e)=> setCity(e.target.value)}/>
          </div>

          <div className="mb-4">
            <label htmlFor="" className="block text-white mb-2">Postal Code</label>
            <input type='text' 
            className='w-full p-2 border rounded' 
            placeholder='enter Postal Code'
            value={postalCode} required 
            onChange={(e)=> setPostalCode(e.target.value)}/>
          </div>
          
          <div className="mb-4">
            <label htmlFor="" className="block text-white mb-2">Country</label>
            <input type='text' 
            className='w-full p-2 border rounded' 
            placeholder='enter Country'
            value={country} required 
            onChange={(e)=> setCountry(e.target.value)}/>
          </div>

          <div className="mb-4">
            <label htmlFor="" className="block text-gray-400">Select Payment Method</label>
            <div className="mt2">
              <label className="inline-flex items-center">
                <input type='radio'
            className='form-radio text-blue-500' 
            name='PaymentMethod'
            value='payPal'
            checked={paymentMethod === 'payPal'}
            onChange={e => setPaymentMethod(e.target.value)}/>
            <span className="ml-2">payPal or credit Card</span>
              </label>
            </div>
          </div>

          <button className="bg-blue-500 text-white py-2 px-4 rounded-full
           text-lg w-full" type='submit'>Continue</button>
        </form>
      </div>
      
    </div>
  )
}

export default Shipping
