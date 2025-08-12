import { AiOutlineHome, AiOutlineShopping, AiOutlineLogin, AiOutlinePlus, AiOutlineShoppingCart, AiOutlineUser } from 'react-icons/ai';
import {FaHeart} from 'react-icons/fa';
import {Link} from 'react-router-dom';
import "./Navigation.css";
import { useState } from 'react';

function Navigation() {

    const [dropDownOpen, setDropDownOpen] = useState(false);
    const [ShowSideBar, setShowSideBar] = useState(false);

    const toggleDropDown = () => {
        setDropDownOpen(!dropDownOpen);
    };

     const toggleSideBar = () => {
        setShowSideBar(!ShowSideBar);
    };

    const closeSideBar = () => {
        setShowSideBar(false);
    }


  return (
    <div style={{ zIndex: 999}} id='navigation-container' 
    className={`${ShowSideBar ? "flex" : "hidden"} xl:flex lg:flex md:hidden sm:hidden flex-col justify-between p-4 text-white w-[4%] hover:w-[15%] h-[100vh] fixed bg-black`}>
      <div className="flex flex-col justify-center space-y-4">
        <Link to="/" className="flex items-center transition-transform transform hover:translate-x-2">
          <AiOutlineHome size={26} className='mr-2 mt-[3rem]'/>
          <span id='nav-item-name' className='hidden  mt-[3rem] uppercase'>Home</span>
        </Link>
        <Link to="/shop" className="flex items-center transition-transform transform hover:translate-x-2">
          <AiOutlineShopping size={26} className='mr-2 mt-[3rem]'/>
          <span id='nav-item-name' className='hidden  mt-[3rem] uppercase'>shop</span>
        </Link>
        <Link to="/cart" className="flex items-center transition-transform transform hover:translate-x-2">
          <AiOutlineShoppingCart size={26} className='mr-2 mt-[3rem]'/>
          <span id='nav-item-name' className='hidden  mt-[3rem] uppercase'>cart</span>
        </Link>
        <Link to="/favorite" className="flex items-center transition-transform transform hover:translate-x-2">
          <FaHeart size={26} className='mr-2 mt-[3rem]'/>
          <span id='nav-item-name' className='hidden  mt-[3rem] uppercase'>favorite</span>
        </Link>
      </div>

      <ul className='list-none'>
        <li>
          <Link to="/login" className="flex items-center transition-transform transform hover:translate-x-2">
            <AiOutlineLogin size={26} className='mr-2 mt-[3rem]'/>
            <span id='nav-item-name' className='hidden  mt-[3rem] uppercase'>login</span>
          </Link>
        </li>
        <li>
          <Link to="/register" className="flex items-center transition-transform transform hover:translate-x-2">
            <AiOutlineUser size={26} className='mr-2 mt-[3rem]'/>
            <span id='nav-item-name' className='hidden  mt-[3rem] uppercase'>Register</span>
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default Navigation
