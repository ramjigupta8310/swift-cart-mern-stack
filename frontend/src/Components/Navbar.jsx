import React, { useContext, useEffect, useState } from "react";
import logo from "./Assets/SwiftCartLogo.png";
import { Link, useNavigate } from "react-router-dom";
import { FaCartArrowDown, FaRegUserCircle } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { MdLogout } from "react-icons/md";
import UserContext from "../Context/UserContext";
import CartContext from "../Context/CartContext";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, logoutUser, user } = useContext(UserContext);
  const { cart, getUserCart } = useContext(CartContext);
  const navigate = useNavigate();
  useEffect(() => {
    getUserCart(); // Call function to fetch cart data
  }, []);

  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search/${searchTerm}`);
    setSearchTerm("");
  };

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 flex gap-3 flex-col items-center bg-white pb-3 md:pb-0`}
        style={{boxShadow:'0px 2px 5px #b3acac'}}
      >
        <nav
          className={`relative flex items-center justify-between w-full h-[10vh] 2xl:px-16 lg:px-8 px-2`}
        >
          {/* Hamburger Menu  And Logo*/}
          <div className="flex items-center gap-2">
            <div className="md:hidden">
              <button
                aria-label={menuOpen ? "Close Menu" : "Open Menu"}
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-2xl hover:bg-transparent"
              >
                {menuOpen ? <FiX /> : <FiMenu />}
              </button>
            </div>

            {/* Logo */}
            <Link to="/" aria-label="Go to home">
              <img className="xl:w-32 w-24" src={logo} alt="Swift Cart Logo" />
            </Link>
          </div>

          {/* Nav Links For All Screen, Logout Button For Small Screen*/}
          <div
            className={`absolute z-40 md:static left-0 top-[10vh] w-full md:w-auto md:h-auto px-2 md:px-0 bg-[rgba(234,231,235,0.4)] md:bg-white backdrop-blur-xl overflow-hidden transition-[height] duration-300 ease-in-out ${
              menuOpen ? "h-[90vh]" : "h-[0px]"
            }`}
          >
            {/* Nav Links */}
            <ul
              className={`font-semibold text-sm flex gap:0 md:gap-4 lg:gap-12 flex-col md:flex-row`}
            >
              <li className="py-2 md:py-0">
                <Link to="/" aria-label="Go to Home">
                  HOME
                </Link>
              </li>
              <li className="py-2 md:py-0">
                <Link to="/men" aria-label="Go to Men Section">
                  MEN
                </Link>
              </li>
              <li className="py-2 md:py-0">
                <Link to="/women" aria-label="Go to Women Section">
                  WOMEN
                </Link>
              </li>
              <li className="py-2 md:py-0">
                <Link to="/kids" aria-label="Go to Kids Section">
                  KIDS
                </Link>
              </li>
            </ul>

            {/* Logout Button */}
            {isAuthenticated && (
              <button
                onClick={logoutUser}
                className="flex md:hidden gap-1 items-center hover:bg-transparent text-[1.2rem] absolute bottom-8 border-[1px] border-[rgb(136,132,132)] rounded-[2rem] w-[95%] px-2"
                aria-label="Logout"
              >
                <MdLogout className="text-[1.2rem]" />
                Logout
              </button>
            )}
          </div>

          {/* Search Bar For Large Screen*/}
          <form
            className="2xl:w-[40%] xl:w-1/3 w-1/4 md:flex hidden items-center bg-[#f5f5f6] focus-within:border-[rgb(136,132,132)] focus-within:border-[1px] rounded-lg transition-all duration-200"
            onSubmit={handleSubmit}
          >
            <CiSearch className="pl-2 text-4xl" />
            <input
              className="bg-[#f5f5f6] w-full py-2 px-1.5 text-base focus:outline-none rounded-tr-lg rounded-br-lg"
              type="text"
              placeholder="Search Products"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search for products"
            />
          </form>

          {/* Login , User Name, Cart ===> For All Screen, Logout For Large Screen */}
          <div className="flex gap-4 lg:gap-12 items-center">
            {/* Login, Logout, User Name */}
            <div>
              {isAuthenticated ? (
                <div className="flex gap-4 lg:gap-12">
                  {/* User Name */}
                  <span className="flex gap-1 items-center md:text-xl text-lg">
                    <FaRegUserCircle className="md:text-xl lg:text-2xl text-[1.2rem]" />
                    {user?.name?.split(" ")[0]}
                  </span>

                  {/* Logout */}
                  <button
                    onClick={logoutUser}
                    className="md:flex hidden gap-1 items-center hover:bg-transparent md:text-xl text-lg "
                    aria-label="Logout"
                  >
                    <MdLogout className="md:text-xl lg:text-2xl text-[1.2rem]" />
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login">
                  <button
                    className="flex gap-1 items-center text-xl hover:bg-transparent"
                    aria-label="Login"
                  >
                    <FaRegUserCircle className="text-xl" />
                    Login
                  </button>
                </Link>
              )}
            </div>

            {/* Cart */}
            <div className={`${isAuthenticated ? "block" : "hidden"}`}>
              {isAuthenticated && (
                <Link to="/cart" aria-label="Go to Cart">
                  <button
                    type="button"
                    className="flex gap-1 relative hover:bg-transparent"
                  >
                    <FaCartArrowDown className="md:text-2xl text-[1.4rem]" />
                    {cart?.items?.length > 0 && (
                      <span className="bg-[#FF6161] text-white rounded-full w-[18px] h-[18px] text-sm absolute top-[-12px] left-[-4px] flex items-center justify-center">
                        {cart?.items?.length}
                      </span>
                    )}
                    Cart
                  </button>
                </Link>
              )}
            </div>
          </div>
        </nav>

        {/* Search Bar For Small devices*/}
        <div
          className={`w-[95%] md:hidden focus-within:border-[rgb(136,132,132)] focus-within:border-[1px] rounded-3xl transition-[border] duration-200`}
          style={{boxShadow: '0px 3px 5px #b3acac, 0px -1px 2px #b3acac'}}
        >
          <form className={`flex items-center pl-2`} onSubmit={handleSubmit}>
            <CiSearch className="flex justify-centerpl-2 text-2xl text-black opacity-80" />
            <input
              className="w-full py-1.5 pl-2 text-base focus:outline-none
               placeholder-black rounded-tr-3xl rounded-br-3xl"
              type="text"
              placeholder="Search Products"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search for products"
            />
          </form>
        </div>
      </header>
    </>
  );
};

export default Navbar;
