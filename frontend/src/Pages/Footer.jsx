import React from "react";
import logo from "./Assets/SwiftCartLogo.png";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <>
      <footer className="bg-[rgb(246,243,238)] mt-8 py-12 px-4 md:px-8 lg:px-12 xl:px-20 2xl:px-28">
        <div className="flex flex-col gap-12  lg:gap-0 md:flex-row justify-between">
          <div className="order-2 md:order-1">
            <div className="mb-2 mb:mb-4">
              <Link to="/" aria-label="Go to home">
                <img
                  className="xl:w-32 w-24"
                  src={logo}
                  alt="Swift Cart Logo"
                />
              </Link>
            </div>

            <div>
              <p className="py-1 text-sm md:text-base">
                DESIGNED AND DEVELOPED BY RAMJI GUPTA
              </p>
              <p className="py-1 text-sm md:text-base">
                REACH OUT +91-8382-021-094
              </p>
              <p className="py-1 text-sm md:text-base">
                ramjigupta8310@gmail.com
              </p>
            </div>
          </div>

          <nav className="flex flex-col md:flex-row order-1 md:order-2 gap-6 md:gap-8 lg:gap-16 xl:gap-32 2xl:gap-36">
            <ul>
              <li>
                <h2 className="font-semibold md:text-lg text-base mb-1 md:mb-1.5">
                  BRAND
                </h2>
              </li>
              <li className="md:text-[0.8rem] text-xs font-semibold py-1">
                <Link to="#">ABOUT</Link>
              </li>
              <li className="md:text-[0.8rem] text-xs font-semibold py-1">
                <Link to="#">BLOGS</Link>
              </li>
              <li className="md:text-[0.8rem] text-xs font-semibold py-1">
                <Link to="#">WORK WITH US</Link>
              </li>
              <li className="md:text-[0.8rem] text-xs font-semibold py-1">
                <Link to="#">CONTACT US</Link>
              </li>
            </ul>

            <ul>
              <li>
                <h2 className="font-semibold md:text-lg text-base mb-1 md:mb-1.5">
                  SHOP
                </h2>
              </li>
              <li className="md:text-[0.8rem] text-xs font-semibold py-1">
                <Link to="#">SHIPPING & DELIVERY</Link>
              </li>
              <li className="md:text-[0.8rem] text-xs font-semibold py-1">
                <Link to="#">CANCELLATION POLICY</Link>
              </li>
              <li className="md:text-[0.8rem] text-xs font-semibold py-1">
                <Link to="#">FAQ</Link>
              </li>
            </ul>

            <ul>
              <li>
                <h2 className="font-semibold md:text-lg text-base mb-1 md:mb-1.5">
                  LEGAL
                </h2>
              </li>
              <li className="md:text-[0.8rem] text-xs font-semibold py-1">
                <Link to="#">TERMS & CONDITION</Link>
              </li>
              <li className="md:text-[0.8rem] text-xs font-semibold py-1">
                <Link to="#">PRIVACY POLICY</Link>
              </li>
              <li className="md:text-[0.8rem] text-xs font-semibold py-1">
                <Link to="#">REFUND & EXCHANGE POLICIES</Link>
              </li>
            </ul>
          </nav>
        </div>
      </footer>
    </>
  );
};

export default Footer;
