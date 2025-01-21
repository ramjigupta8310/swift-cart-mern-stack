import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductCart from "./ProductCart";
import ProductContext from "../Context/ProductContext";
import { BsFillHandbagFill } from "react-icons/bs";
import { CiHeart } from "react-icons/ci";
import CartContext from "../Context/CartContext";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { RiCloseLargeFill } from "react-icons/ri";
import styles from "./ProductDetails.module.css";

const ProductDetails = () => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const {
    ethnicWear,
    sleepWear,
    homeDecor,
    workWear,
    kidsWear,
    sportsShoes,
    officeWear,
    mensWear,
    casualStyles,
    westernWear,
    wfhWear,
    womensFootwear,
  } = useContext(ProductContext);
  const { category, id } = useParams();
  const [selectedSize, setSelectedSize] = useState(null);
  const [showSizeError, setShowSizeError] = useState(false);
  const [modalImage, setModalImage] = useState(null); // State for the modal image
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [notifications, setNotifications] = useState([]); // State for notifications image
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleSizeClick = (size) => {
    setSelectedSize(size);
    setShowSizeError(false);
  };

  const addToCartHandler = async (product) => {
    if (category !== "home-decor" && !selectedSize) {
      setShowSizeError(true);
      return;
    }
    setIsButtonDisabled(true);
    try {
      await addToCart({
        productId: product._id,
        category: product.category,
        title: product.title,
        description: product.description,
        imgSrc: product.imgSrc,
        price: product.price,
        quantity: 1,
        realPrice: product.realPrice,
        selectedSize: selectedSize,
      });

      // Notification show karo
      const newNotification = {
        id: Date.now(),
        image: product.imgSrc,
        message: "Added to bag",
      };
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        newNotification,
      ]);
    } catch (error) {
      // console.log(error)
      if (error.response && error.response.status === 401) {
        // Agar 401 Unauthorized error aati hai to login page par navigate kar do
        navigate("/login");
      }
    } finally {
      setIsButtonDisabled(false); // Re-enable the button after receiving the response
    }
  };

  useEffect(() => {
    const timers = notifications.map((notification) => {
      return setTimeout(() => {
        setNotifications((prevNotifications) =>
          prevNotifications.filter((n) => n.id !== notification.id)
        );
      }, 3000);
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer)); // Cleanup timers
    };
  }, [notifications]);

  const categories = {
    "ethnic-wear": ethnicWear,
    "sleep-wear": sleepWear,
    "home-decor": homeDecor,
    "work-wear": workWear,
    "kids-wear": kidsWear,
    "sports-shoes": sportsShoes,
    "office-wear": officeWear,
    "men's-wear": mensWear,
    "casual-styles": casualStyles,
    "western-wear": westernWear,
    "wfh-wear": wfhWear,
    "women's-footwear": womensFootwear,
  };

  const categoryArray = categories[category];

  const product = categoryArray?.find((item) => item._id === id);

  if (!product) {
    return <div>Product not found!</div>; // Handle the case where the product is not found
  }

  const openModal = (imgSrc) => {
    setModalImage(imgSrc);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="mt-[24vh] md:mt-[15vh] lg:px-10">
        {/* Product Location */}
        <p className="text-sm sm:text-base mb-3 flex items-center pl-2.5 sm:pl-4 lg:px-0">
          HOME <MdKeyboardDoubleArrowRight /> {product.category.toUpperCase()}{" "}
          <MdKeyboardDoubleArrowRight /> {product.title.toUpperCase()}
        </p>

        <div className="flex flex-col lg:flex-row lg:gap-x-6 lg:gap-y-0 gap-y-4">
          {/* All Product Images */}
          <div className="flex flex-wrap gap-x-[1%] gap-y-1.5 sm:gap-y-2 2xl:gap-y-4 w-full lg:w-[60%]">
            {[
              product.imgSrc,
              product.imgSrc2,
              product.imgSrc3,
              product.imgSrc4,
              product.imgSrc5,
              product.imgSrc6,
            ].map(
              (src, index) =>
                src && (
                  <div
                    key={index}
                    className={`${styles["custom-cursor"]} w-[49.5%] overflow-hidden`}
                  >
                    <img
                      src={src}
                      alt={`Product Image ${index + 1}`}
                      onClick={() => openModal(src)}
                      className={`transition-transform duration-300 hover:scale-[1.07] w-full`}
                    />
                  </div>
                )
            )}
          </div>

          {/* Product Details Section */}
          <div className="w-full lg:w-[39%] px-2.5 sm:px-4 md:px-8">
            {/* Title And Description Section */}
            <h4 className="text-xl lg:text-2xl font-semibold">
              {product.title}
            </h4>
            <p className="text-[#8d8f9a] text-base lg:text-xl font-medium">
              {product.description}
            </p>

            <hr className="my-4" />

            {/* Price Section */}
            <div className="flex gap-x-3 items-center">
              <h4 className="text-2xl lg:text-3xl font-semibold">
                ₹{product.price}
              </h4>
              <p className="text-lg lg:text-xl text-[#8d8f9a]">
                MRP <span className="line-through">₹{product.realPrice}</span>
              </p>
            </div>

            {/* Tax Section */}
            <span className="text-[#03a685] font-bold">
              inclusive of all taxes
            </span>

            {/* Size Section */}
            {category !== "home-decor" && (
              <div>
                <h5 className="font-bold text-base mt-6">SELECT SIZE</h5>

                {showSizeError && (
                  <p className="text-[#ff3e6c] text-base font-semibold my-1">
                    Please select a size
                  </p>
                )}
                {/* Size Button */}
                {product.sizes?.map((size, index) => (
                  <button
                    key={index}
                    className={`w-14 h-14 rounded-full border-[1px] border-[#8d8f9a] hover:border-[#ff3e6c] font-bold ml-2 mt-3 ${
                      selectedSize === size
                        ? "text-[#fa3d69] border-[2px] border-[#fa3d69]"
                        : ""
                    }`}
                    onClick={() => handleSizeClick(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}

            {/* Add To Cart And WishList Section */}
            <div className="flex mt-8 justify-between">
              <button
                onClick={() => addToCartHandler(product)}
                disabled={isButtonDisabled}
                className={`flex items-center justify-center gap-x-3 text-lg w-[55%] py-2.5 font-semibold hover:bg-[#dc3b60] bg-[#ff3e6c] text-white rounded-lg ${
                  isButtonDisabled
                    ? "pointer-events-none opacity-50"
                    : "pointer-events-auto"
                }`}
              >
                <BsFillHandbagFill className="text-xl" />
                ADD TO BAG
              </button>
              <button className="flex items-center justify-center gap-x-3 text-lg py-2.5 font-semibold w-[40%] border-[1px] border-[#8d8f9a] hover:border-black border-opacity-80 rounded-lg">
                <CiHeart className="text-xl" />
                WISHLIST
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications For Added To Cart */}
      <div className="fixed flex flex-col top-[23vh] md:top-[12vh] right-1 md:right-5 gap-1">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="bg-[rgba(0,0,0,0.8)] px-2.5 py-2 text-white flex items-center rounded-md"
          >
            <img
              src={notification.image}
              alt="Product"
              className="h-[60px] object-cover mr-2"
            />
            <p>{notification.message}</p>
          </div>
        ))}
      </div>

      {/* Modal for displaying the image */}
      {isModalOpen && (
        // <div className="image-modal">
        <div className="fixed top-0 z-50 h-[100vh] w-full bg-white flex flex-col sm:gap-x-2 gap-y-2 sm:gap-y-0 sm:flex-row justify-center items-center">
          <div className="h-[80vh] sm:h-full">
            <img
              src={modalImage}
              alt="Modal View"
              className="object-contain h-full rounded-md"
            />
            <button
              className="flex justify-center items-center absolute top-0 right-0 md:top-4 md:right-6 bg-[rgb(241,232,232)] hover:bg-[rgb(197,192,192)] w-7 h-7 sm:w-8 sm:h-8 bg-[rgb(241,232, 232)] rounded-md cursor-pointer"
              onClick={closeModal}
            >
              <RiCloseLargeFill className="text-xl" />
            </button>
          </div>
          <div className="flex flex-row sm:flex-col gap-y-2 gap-x-2">
            {[
              product.imgSrc,
              product.imgSrc2,
              product.imgSrc3,
              product.imgSrc4,
              product.imgSrc5,
              product.imgSrc6,
            ].map(
              (src, index) =>
                src && (
                  <img
                    key={index}
                    src={src}
                    alt={`Thumbnail ${index + 1}`}
                    onClick={() => openModal(src)}
                    className={`w-10 sm:w-14 rounded-md cursor-pointer hover:opacity-80`}
                  />
                )
            )}
          </div>
        </div>
      )}

      <div className="py-8 px-3 md:px-6 lg:px-10 xl:px-14">
        <h5 className="mb-4 font-semibold">SIMILAR PRODUCTS</h5>
        <ProductCart items={categoryArray} />
      </div>
    </>
  );
};

export default ProductDetails;
