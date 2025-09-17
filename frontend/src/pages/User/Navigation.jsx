import { AiOutlineHome, AiOutlineShopping, AiOutlineLogin, AiOutlineShoppingCart, AiOutlineUser } from 'react-icons/ai';
import { FaHeart } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import "./Navigation.css";
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {useLogoutMutation } from '../../redux/api/usersApiSlice'; 

import { logOut } from '../../redux/features/auth/authSlice';
import FavouriteCount from '../products/FavouriteCount';


function Navigation() {
  const { userInfo } = useSelector((state) => state.auth);

  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [ShowSideBar, setShowSideBar] = useState(false);

  const {cartItems} = useSelector((state)=> state.cart);
  

  const toggleDropDown = () => {
    setDropDownOpen(!dropDownOpen);
  };

  const toggleSideBar = () => {
    setShowSideBar(!ShowSideBar);
  };

  const closeSideBar = () => {
    setShowSideBar(false);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logOut());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{ zIndex: 999 }}
      className={`${ShowSideBar ? "flex" : "hidden"} xl:flex lg:flex md:hidden sm:hidden flex-col 
    justify-between p-4 text-white w-[4%] hover:w-[15%] h-[100vh] fixed bg-black`}
      id="navigation-container"
    >
      {/* nav links */}
      <div className="flex flex-col justify-center space-y-4">
        <Link to="/" className="flex items-center transition-transform transform hover:translate-x-2">
          <AiOutlineHome size={26} className="mr-2 mt-[3rem]" />
          <span className="nav-item-name hidden mt-[3rem] uppercase">Home</span>{" "}
        </Link>
        <Link to="/shop" className="flex items-center transition-transform transform hover:translate-x-2">
          <AiOutlineShopping size={26} className="mr-2 mt-[3rem]" />
          <span className="nav-item-name hidden mt-[3rem] uppercase">shop</span>{" "}
        </Link>
        <Link to="/cart" className="flex items-center transition-transform transform hover:translate-x-2 relative">
          <AiOutlineShoppingCart size={26} className="mr-2 mt-[3rem]" />
          <span className="nav-item-name hidden mt-[3rem] uppercase">cart</span>{" "}
          <div className="absolute top-9">
            {cartItems.length > 0 && (
              <span>
                <span className="px-1 py-0 text-xs text-white bg-red-500 rounded-full">
                  {cartItems.reduce((acc, c)=> acc + c.qty, 0)}
                </span>
              </span>
            )}
          </div>
        </Link>
        <Link to="/favorite" className="flex items-center transition-transform transform hover:translate-x-2">
          <FaHeart size={26} className="mr-2 mt-[3rem]" />
          <span className="nav-item-name hidden mt-[3rem] uppercase">favorite</span>{" "}
          <FavouriteCount />
        </Link>
      </div>

      {/* user/profile Icon: visible on login */}
      <div className="relative mt-4">
        <button
          onClick={toggleDropDown}
          className="flex items-center hover:translate-x-2 text-gray-800 focus:outline-none"
        >
          {userInfo ? <span className="text-white">{userInfo.username}</span> : null}

          {/* logout svg */}
          {userInfo && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ml-1 ${dropDownOpen ? "transform rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={dropDownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
              />
            </svg>
          )}
        </button>

        {dropDownOpen && userInfo && (
          <ul
            className={`absolute left-16 mt-2 mr-14 space-y-2 bg-white text-gray-600 ${
              !userInfo.isAdmin ? "-top-20" : "-top-80"
            }`}
          >
            {userInfo.isAdmin && (
              <>
                <li>
                  <Link to="/admin/dashboard" className="block px-4 py-2 hover:bg-gray-100">
                    Dashboard
                  </Link>
               </li>
                <li>
                  <Link to="/admin/productlist" className="block px-4 py-2 hover:bg-gray-100">
                    Products
                  </Link>
               </li>
                <li>
                  <Link to="/admin/categorylist" className="block px-4 py-2 hover:bg-gray-100">
                    Category
                  </Link>
               </li>
                <li>
                  <Link to="/admin/orderlist" className="block px-4 py-2 hover:bg-gray-100">
                    Orders
                  </Link>
               </li>
                <li>
                  <Link to="/admin/userlist" className="block px-4 py-2 hover:bg-gray-100">
                    Users
                  </Link>
               </li>
                
              </>
            )}
             
              <li>
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                  Profile
                </Link>
              </li>
              <li>
                  <button onClick={logoutHandler} className="block px-4 py-2 hover:bg-gray-100">
                    Logout
                  </button>
              </li>
          </ul>
        )}
      </div>

      {!userInfo && (
        <ul className="list-none">
          <li>
            <Link to="/login" className="flex items-center transition-transform transform hover:translate-x-2">
              <AiOutlineLogin size={26} className="mr-2 mt-[3rem]" />
              <span className="nav-item-name hidden mt-[3rem] uppercase">login</span>{" "}
            </Link>
          </li>
          <li>
            <Link to="/register" className="flex items-center transition-transform transform hover:translate-x-2">
              <AiOutlineUser size={26} className="mr-2 mt-[3rem]" />
              <span className="nav-item-name hidden mt-[3rem] uppercase">Register</span>{" "}
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
}

export default Navigation;

