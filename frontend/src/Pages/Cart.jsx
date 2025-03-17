import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CartContext from "../Context/CartContext";
import UserContext from "../Context/UserContext";
import logo from "./Assets/SwiftCartLogo.png";

const Cart = () => {
  const {
    cart,
    getUserCart,
    clearCart,
    removeProduct,
    decreaseQuantity,
    increaseQuantity,
  } = useContext(CartContext);

  const { user } = useContext(UserContext);

  const [loadingProductId, setLoadingProductId] = useState(null); // Track which product is being updated

  // Call function to fetch cart data
  useEffect(() => {
    getUserCart();
  }, []);

  // Handle Payment Processing
  const handleProceedToPay = async () => {
    const options = {
      key: "rzp_test_Z4iwtgCrFQTxQP", // Replace with your Razorpay Test Key
      amount: cart?.totalCartValue * 100, // Amount in paise (e.g., 50000 = ₹500)
      currency: "INR",
      name: "Swift - Cart",
      description: "Order Payment",
      image: logo, // Optional: Add your logo URL
      handler: function (response) {
        alert("Payment Successful!");
        console.log("Payment ID: ", response.razorpay_payment_id);
        console.log("Order ID: ", response.razorpay_order_id);
        console.log("Signature: ", response.razorpay_signature);

        // Handle payment success - e.g., save payment data to the database
      },
      prefill: {
        name: user.name, // Replace with actual user's name
        email: user.email, // Replace with actual user's email
        contact: user.phone || "", // Replace with actual user's contact
      },
      notes: {
        address: "Customer Address",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const paymentObject = new window.Razorpay(options);

    // Payment failure handler
    paymentObject.on("payment.failed", function (response) {
      alert("Payment Failed. Please try again.");
      console.error(response.error);
    });

    paymentObject.open();
  };

  // Clear The Entire Cart
  const handleClearCart = async () => {
    try {
      await clearCart();
    }
    catch (error) {
      console.error("Failed to clear cart:", {
        message: error.response?.data?.message || error.message,
        status: error.response?.status || error?.status || "unknown error"
      });
      if (error.response?.status === 401) {
        navigate("/login"); // 401 pe redirect
      }
    }
  };

  // Remove A Specific Product
  const handleRemoveProduct = async (productId, selectedSize) => {
    setLoadingProductId(`${productId}-${selectedSize}`);
    try {
      await removeProduct(productId, selectedSize);
    } catch (error) {
      console.error("Failed to remove product:", {
        message: error.response?.data?.message || error.message,
        status: error.response?.status || error?.status || "unknown error"
      });
      if (error.response?.status === 401) {
        navigate("/login"); // 401 pe redirect
      }
    } finally {
      setLoadingProductId(null); // Har haal mein loading reset
    }
  };

  // Handle Increase Quantity
  const handleIncreaseQuantity = async (productId, selectedSize) => {
    setLoadingProductId(`${productId}-${selectedSize}`);
    try {
      await increaseQuantity(productId, selectedSize); // Increase Quantity Of A Product
    } catch (error) {
      console.error("Failed to increase quantity:", {
        message: error.response?.data?.message || error.message,
        status: error.response?.status || error?.status || "unknown error"
      });
      if (error.response?.status === 401) {
        navigate("/login"); // 401 pe redirect
      }
    } finally {
      setLoadingProductId(null); // Har haal mein loading reset
    }
  };

  // Handle Decrease Quantity
  const handleDecreaseQuantity = async (productId, selectedSize, currentQuantity) => {
    if (currentQuantity === 1) return;
    setLoadingProductId(`${productId}-${selectedSize}`);
    try {
      await decreaseQuantity(productId, selectedSize); // Decrease Quantity Of A Product
    } catch (error) {
      console.error("Failed to decrease quantity:", {
        message: error.response?.data?.message || error.message,
        status: error.response?.status || error?.status || "unknown error"
      });
      if (error.response?.status === 401) {
        navigate("/login"); // 401 pe redirect
      }
    } finally {
      setLoadingProductId(null); // Har haal mein loading reset
    }
  };

  // Calculate Price Details
  const calculatePriceDetails = () => {
    const totalRealPrice = cart?.items?.reduce(
      (acc, product) => acc + product.totalProductRealValue,
      0
    );
    const totalDiscount = cart?.items?.reduce(
      (acc, product) =>
        acc + (product.totalProductRealValue - product.totalProductValue),
      0
    );
    const totalAmount = totalRealPrice - totalDiscount;

    return { totalRealPrice, totalDiscount, totalAmount };
  };

  const { totalRealPrice, totalDiscount, totalAmount } =
    calculatePriceDetails();

  return (
    <>
      <section className="mt-[24vh] md:mt-[13vh]">
        {/* If Cart Is Empty  Show Message "Cart Empty" And "Continue Shopping Button" */}
        {cart?.length === 0 ? (
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl">Your Cart is Empty</h1>
            <Link
              to="/"
              className="my-4 inline-block bg-[rgb(255,63,108)] hover:bg-[rgb(245,109,141)] text-white font-semibold px-3 py-1 rounded-md text-lg"
            >
              Continue Shopping...
            </Link>
          </div>
        ) : (
          <>
            {/* If Cart Is Not Empty Show Cart Items And Price Details */}
            <div className="flex flex-col md:flex-row gap-8 md:gap-0 justify-between mx-[4%] lg:mx-[6%] xl:mx-[10%]">
              {/* Cart Items Section */}
              <div className="w-full md:w-[65%]">
                {cart?.items?.map((product) => (
                  <div
                    className={`border-2 border-[#eaeaec] px-2 pt-2 pb-3 my-4 md:pb-4 rounded-[4px] ${loadingProductId ===
                      `${product.productId}-${product.selectedSize}`
                      ? "opacity-50"
                      : ""
                      }`}
                    key={`${product.productId}-${product.selectedSize}`}
                  >
                    {/* Product Image, Title, Description, Size, Price */}
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-28 flex-none">
                        <img src={product.imgSrc} alt="product" className="w-full object-cover" />
                      </div>

                      <div className="flex flex-col justify-around">
                        {/* Product Title And Description */}
                        <div>
                          <h4 className="text-lg font-bold">{product.title}</h4>
                          <p className="text-[#8d8f9a]">
                            {product.description}
                          </p>
                        </div>

                        {/* Product Size */}
                        {product.selectedSize && (
                          <div className="flex gap-2 my-0.5 sm:my-0">
                            <p className="text-lg font-semibold">Size: </p>
                            <button className="w-8 bg-[#F0F0F0] rounded-lg">
                              {product.selectedSize}
                            </button>
                          </div>
                        )}

                        {/* Product Price */}
                        <div className="flex items-center gap-2 sm:gap-3">
                          <h5 className="text-xl md:text-2xl font-semibold">
                            ₹ {product.totalProductValue}
                          </h5>
                          <p className="text-lg sm:text-xl md:text-2xl font-medium text-[#8d8f9a] line-through">
                            ₹{product.totalProductRealValue}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Product Increase, Decrease, Remove Section */}
                    <div className="flex gap-8 md:gap-12 mt-2">
                      {/* Product Increase And Decrease Quantity Button */}
                      <div className="flex items-center justify-center gap-2">
                        {/* Decrease Quantity Button */}
                        <button
                          className={`w-8 h-8 border-[#c2c2c2] border-[1.5px] text-2xl font-semibold cursor-pointer rounded-full text-[#333] flex items-center justify-center hover:bg-[#e0e0e0] ${product.quantity === 1
                            ? "pointer-events-none"
                            : "pointer-events-auto"
                            }`}
                          onClick={() =>
                            handleDecreaseQuantity(
                              product.productId,
                              product.selectedSize,
                              product.quantity
                            )
                          }
                          disabled={
                            loadingProductId ===
                            `${product.productId}-${product.selectedSize}`
                          }
                        >
                          -
                        </button>

                        {/* Product Quantity */}
                        <span className="w-12 h-8 text-base font-bold flex items-center justify-center border-[#c2c2c2] border-[1.5px]">
                          {product.quantity}
                        </span>

                        {/* Increase Quantity Button */}
                        <button
                          className={`w-8 h-8 border-[#c2c2c2] border-[1.5px] text-2xl font-semibold cursor-pointer rounded-full text-[#333] flex items-center justify-center hover:bg-[#e0e0e0]`}
                          onClick={() =>
                            handleIncreaseQuantity(
                              product.productId,
                              product.selectedSize
                            )
                          }
                          disabled={
                            loadingProductId ===
                            `${product.productId}-${product.selectedSize}`
                          }
                        >
                          +
                        </button>
                      </div>

                      {/* Product Remove */}
                      <button
                        className={`text-lg font-semibold cursor-pointer`}
                        onClick={() =>
                          handleRemoveProduct(
                            product.productId,
                            product.selectedSize
                          )
                        }
                        disabled={
                          loadingProductId ===
                          `${product.productId}-${product.selectedSize}`
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Details Section */}
              <div className="w-full md:w-[30%] rounded-[4px] border-2 border-[#eaeaec] px-2 pt-6 pb-4 h-fit">
                <h3 className="font-semibold text-xl">Price Details</h3>
                <hr />
                <div className="flex justify-between items-center my-2">
                  <p>Price ({cart?.items?.length} items)</p>
                  <p>₹{totalRealPrice}</p>
                </div>
                <div className="flex justify-between items-center my-2">
                  <p>Discount</p>
                  <p className="text-[red]">− ₹{totalDiscount}</p>
                </div>
                <hr />
                <div className="flex justify-between items-center my-2 text-lg font-bold">
                  <p>Total Amount</p>
                  <p>₹{totalAmount}</p>
                </div>
                <p className="text-[green] my-2 text-lg font-bold">
                  You will save ₹{totalDiscount} on this order
                </p>
              </div>
            </div>

            {/* Payment And Clear Cart Section */}
            <div className="flex justify-center items-center gap-4 sm:gap-6">
              <button
                className="my-4 inline-block bg-[rgb(255,63,108)] 
                hover:bg-[rgb(245,109,141)] text-white font-semibold px-3 py-1 rounded-md text-lg"
                onClick={handleProceedToPay}
              >
                Proceed to Pay
              </button>
              <button
                className="my-4 inline-block bg-[rgb(255,63,108)] hover:bg-[rgb(245,109,141)] text-white font-semibold px-3 py-1 rounded-md text-lg"
                onClick={handleClearCart}
              >
                Clear Cart
              </button>
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default Cart;
