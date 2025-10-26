import { AiOutlineHome, AiOutlineShopping, AiOutlineLogin, AiOutlineShoppingCart, AiOutlineUser } from 'react-icons/ai';
import { FaHeart, FaBars } from 'react-icons/fa'; // Added FaBars for a generic menu icon
import { Link, useNavigate } from 'react-router-dom';
import "./Navigation.css"; // Assuming this handles the .nav-item-name display on hover
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../../redux/api/usersApiSlice';
import { logOut } from '../../redux/features/auth/authSlice';
import FavouriteCount from '../products/FavouriteCount';

function Navigation() {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Renamed for clarity: controls mobile sidebar visibility
  const [isHovered, setIsHovered] = useState(false); // New state to track hover for desktop expansion

  const toggleDropDown = () => {
    setDropDownOpen(!dropDownOpen);
  };

  const toggleMobileMenu = () => { // Renamed toggleSideBar
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Logout handler remains the same
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

  // Determine if the sidebar should be "expanded" for text visibility
  // This happens either if the mobile menu is open, or if it's hovered on desktop
  const isSidebarExpanded = isMobileMenuOpen || isHovered;

  return (
    <div className="relative z-[999]">
      {/* Mobile/Tablet Menu Button (Hamburger) */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-black text-white md:hidden lg:hidden xl:hidden" // Only visible on small screens
        onClick={toggleMobileMenu}
      >
        {isMobileMenuOpen ? (
          <FaTimesCircle size={24} /> // Close icon
        ) : (
          <FaBars size={24} /> // Hamburger menu icon
        )}
      </button>

      {/* Main Navigation Sidebar */}
      <div
        // Conditional classes for mobile menu open/close
        className={`
          flex flex-col justify-between p-4 text-white bg-black fixed top-0 left-0 h-full transition-all duration-300 ease-in-out
          z-40 /* Below the toggle button */
          ${isMobileMenuOpen ? "w-[250px]" : "w-0 overflow-hidden"} /* Mobile width */
          md:w-[4%] md:min-w-[60px] /* Default desktop narrow width */
          md:hover:w-[15%] md:hover:min-w-[150px] /* Desktop hover expansion */
          ${isMobileMenuOpen ? "flex" : "hidden"} /* Mobile display based on state */
          md:flex /* Always flex on medium and larger screens */
        `}
        id="navigation-container"
        onMouseEnter={() => setIsHovered(true)} // Track hover state for desktop
        onMouseLeave={() => setIsHovered(false)} // Track hover state for desktop
      >
        {/* Nav Links */}
        <div className="flex flex-col justify-center space-y-4 pt-12 md:pt-4"> {/* Adjusted padding */}
          <Link to="/" className="flex items-center py-2 transition-transform transform hover:translate-x-2">
            <AiOutlineHome size={26} className="mr-2" />
            <span className={`nav-item-name transition-opacity duration-300 ${isSidebarExpanded ? "opacity-100" : "opacity-0 md:opacity-0"}`}>Home</span>
          </Link>
          <Link to="/shop" className="flex items-center py-2 transition-transform transform hover:translate-x-2">
            <AiOutlineShopping size={26} className="mr-2" />
            <span className={`nav-item-name transition-opacity duration-300 ${isSidebarExpanded ? "opacity-100" : "opacity-0 md:opacity-0"}`}>Shop</span>
          </Link>
          <Link to="/cart" className="flex items-center py-2 transition-transform transform hover:translate-x-2 relative">
            <AiOutlineShoppingCart size={26} className="mr-2" />
            <span className={`nav-item-name transition-opacity duration-300 ${isSidebarExpanded ? "opacity-100" : "opacity-0 md:opacity-0"}`}>Cart</span>
            {cartItems.length > 0 && (
              <span className="absolute -top-1 left-7 px-2 py-0.5 text-xs text-white bg-red-500 rounded-full font-bold">
                {cartItems.reduce((acc, c) => acc + c.qty, 0)}
              </span>
            )}
          </Link>
          <Link to="/favorite" className="flex items-center py-2 transition-transform transform hover:translate-x-2">
            <FaHeart size={26} className="mr-2" />
            <span className={`nav-item-name transition-opacity duration-300 ${isSidebarExpanded ? "opacity-100" : "opacity-0 md:opacity-0"}`}>Favorite</span>
            <FavouriteCount />
          </Link>
        </div>

        {/* User/Profile Icon & Dropdown */}
        <div className="relative mt-auto mb-4">
          <button
            onClick={toggleDropDown}
            className="flex items-center w-full py-2 hover:translate-x-2 text-white focus:outline-none"
          >
            {userInfo ? (
                <>
                    <AiOutlineUser size={26} className="mr-2"/>
                    <span className={`nav-item-name transition-opacity duration-300 ${isSidebarExpanded ? "opacity-100" : "opacity-0 md:opacity-0"}`}>{userInfo.username}</span>
                </>
            ) : (
                <AiOutlineLogin size={26} className="mr-2" />
            )}

            {userInfo && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 ml-auto transition-transform duration-300 ${dropDownOpen ? "rotate-180" : ""}`}
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
              className={`absolute bottom-full mb-2 left-0 w-full bg-gray-800 text-white rounded-md shadow-lg space-y-1 py-1 
              ${isSidebarExpanded ? "opacity-100 visible" : "opacity-0 invisible"} transition-all duration-300 ease-in-out`}
            >
              {userInfo.isAdmin && (
                <>
                  <li><Link to="/admin/dashboard" className="block px-4 py-2 hover:bg-gray-700">Dashboard</Link></li>
                  <li><Link to="/admin/productlist" className="block px-4 py-2 hover:bg-gray-700">Products</Link></li>
                  <li><Link to="/admin/categorylist" className="block px-4 py-2 hover:bg-gray-700">Category</Link></li>
                  <li><Link to="/admin/orderlist" className="block px-4 py-2 hover:bg-gray-700">Orders</Link></li>
                  <li><Link to="/admin/userlist" className="block px-4 py-2 hover:bg-gray-700">Users</Link></li>
                </>
              )}
              <li><Link to="/profile" className="block px-4 py-2 hover:bg-gray-700">Profile</Link></li>
              <li><button onClick={logoutHandler} className="block w-full text-left px-4 py-2 hover:bg-gray-700">Logout</button></li>
            </ul>
          )}
        </div>

        {/* Login/Register Links (if not logged in) */}
        {!userInfo && (
          <ul className="list-none mt-auto mb-4">
            <li>
              <Link to="/login" className="flex items-center py-2 transition-transform transform hover:translate-x-2">
                <AiOutlineLogin size={26} className="mr-2" />
                <span className={`nav-item-name transition-opacity duration-300 ${isSidebarExpanded ? "opacity-100" : "opacity-0 md:opacity-0"}`}>Login</span>
              </Link>
            </li>
            <li>
              <Link to="/register" className="flex items-center py-2 transition-transform transform hover:translate-x-2">
                <AiOutlineUser size={26} className="mr-2" />
                <span className={`nav-item-name transition-opacity duration-300 ${isSidebarExpanded ? "opacity-100" : "opacity-0 md:opacity-0"}`}>Register</span>
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}

export default Navigation;