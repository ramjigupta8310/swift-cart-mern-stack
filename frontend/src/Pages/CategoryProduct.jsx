import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCart from "../Components/ProductCart";
import { CiFilter } from "react-icons/ci";
import { TfiClose } from "react-icons/tfi";
import axios from 'axios';
import Loader from "../Components/Loader";

const CategoryProduct = () => {
  const { cat } = useParams(); // Get Category From URL
  const BASE_URL = import.meta.env.VITE_BASE_URL
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [displayProducts, setDisplayProducts] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // States For Filter Section
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);

  // Price Limits For Price Filter
  const priceLimits = [499, 999, 1499, 1999, 2499, 2999, 3999, 4999, 6999];

  // Colors For Color Filter
  const colors = [
    { color: "white", label: "White", "border": "#979595" },
    { color: "pink", label: "Pink", "bg-color": "pink" },
    { color: "black", label: "Black", "bg-color": "black" },
    { color: "blue", label: "Blue", "bg-color": "blue" },
    { color: "orange", label: "Orange", "bg-color": "rgb(255,165,0)" },
    { color: "yellow", label: "Yellow", "bg-color": "yellow" },
    { color: "red", label: "Red", "bg-color": "rgb(255,3,3)" },
    { color: "purple", label: "Purple", "bg-color": "purple" },
    { color: "green", label: "Green", "bg-color": "green" },
    { color: "navy", label: "Navy Blue", "bg-color": "rgb(0,0,128)" },
    { color: "brown", label: "Brown", "bg-color": "brown" },
    { color: "gray", label: "Gray", "bg-color": "gray" },
    { color: "beige", label: "Beige", "bg-color": "rgb(219,219,168)" },
  ];

  // Call Api To Fetch Products Using cat , And This Is Not For Header Men Women Kids Products
  useEffect(() => {
    const fetchProductsByCategory = async () => {
      if (!cat) return
      setLoading(true);
      setError(null)
      try {
        const response = await axios.get(`${BASE_URL}/product/getproducts/${cat}`);
        setAllProducts(response.data?.products || []);
        setDisplayProducts(response.data?.products || []);
      } catch (error) {
        console.error("Error fetching data:", {
          message: error.response?.data?.message || error.message,
          status: error.response?.status || "unknown error"
        });
        setError('Failed to load products. Please try again later');
      } finally {
        setLoading(false);
      }
    };

    fetchProductsByCategory();
  }, [cat]);

  // Function To Hanle Set Selected Price Filter
  const handlePriceChange = (price) => {
    setSelectedPrices((prevSelectedPrices) => {
      if (prevSelectedPrices.includes(price)) {
        return prevSelectedPrices.filter((p) => p !== price);
      } else {
        return [...prevSelectedPrices, price];
      }
    });
  };

  // Function To Hanle Set Selected Color Filter
  const handleColorChange = (color) => {
    setSelectedColors((prevSelectedColors) => {
      if (prevSelectedColors.includes(color)) {
        return prevSelectedColors.filter((c) => c !== color);
      } else {
        return [...prevSelectedColors, color];
      }
    });
  };

  // Function To Clear All The Filters
  const clearFilters = () => {
    setSelectedPrices([]);
    setSelectedColors([]);
  };

  // Filter Products Function 
  const filterProducts = () => {
    let filteredProducts = allProducts;

    if (selectedPrices.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        selectedPrices.some((price) => product.price <= price)
      );
    }

    if (selectedColors.length > 0) {
      filteredProducts = filteredProducts.filter((item) =>
        selectedColors.includes(item.color)
      );
    }
    return filteredProducts;
  };

  useEffect(() => {
    const filteredItems = filterProducts();
    setDisplayProducts(filteredItems);

  }, [selectedColors, selectedPrices]);

  if (loading) return <div className="text-center"><Loader /></div>
  if (error) return <div className="text-center mt-[24vh]">{error}</div>


  return (
    <>
      <div className="mt-[24vh] md:mt-[13vh]">

        {/* Filter Button For Small Screen */}
        <div className="flex justify-end md:hidden mx-6 mb-2">
          <button
            className="flex items-center gap-1 shadow-md border border-t-[#d4d5d9] font-semibold rounded-2xl px-2 py-1"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <CiFilter />
            Filters
          </button>
        </div>

        <div className="flex gap-[1%]">
          <div
            className={`fixed top-0 left-0 w-[100%] bg-white z-50 ${isFilterOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out md:static md:translate-x-0 md:w-[23%] lg:w-[20%] xl:w-[15%] h-screen overflow-y-auto`}
          >
            {/* Close Filter Button */}
            <button
              className="text-xl mb-6 md:hidden absolute right-2 top-2"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <TfiClose />
            </button>

            {/* Filter Section */}
            <div className="w-full px-4 absolute top-[10vh] md:top-0">

              {/* Clear All Filters */}
              <div className="flex justify-between">
                <h5 className="text-xl font-semibold">Filters</h5>
                <p
                  className="cursor-pointer text-[rgb(132,132,215)]"
                  onClick={clearFilters}
                >
                  Clear All
                </p>
              </div>

              <hr className="mt-2"></hr>

              {/* Price Filters */}
              <div className="my-4">
                <h5 className="font-medium pb-1">PRICE</h5>
                {priceLimits.map((price) => (
                  <div key={price}>
                    <input
                      type="checkbox"
                      id={price}
                      checked={selectedPrices.includes(price)}
                      onChange={() => handlePriceChange(price)}
                      className="mr-2 scale-125 cursor-pointer"
                      aria-label={`Filter items under Rs. ${price}`}
                    />
                    <label htmlFor={price} className="hover:text-[rgb(255,62,108)] cursor-pointer">Under Rs. {price}</label>
                  </div>
                ))}
              </div>

              <hr className="mt-2"></hr>

              {/*Show Color Filter If It Is Not "home-decor Category" */}
              {cat !== "home-decor" ? (
                <div className="my-4">
                  <h5 className="font-medium pb-1">COLOR</h5>
                  {colors.map((col, index) => (
                    <div key={index}>
                      <input
                        type="checkbox"
                        id={col.color}
                        checked={selectedColors.includes(col.color)}
                        onChange={() => handleColorChange(col.color)}
                        className="mr-2 scale-125 cursor-pointer"
                        aria-label={`Filter items color ${col.color}`}
                      />
                      <label htmlFor={col.color} className="hover:text-[rgb(255,62,108)] cursor-pointer">
                        <span className={`w-4 h-4 mr-2 rounded-full inline-block 
                        ${col.border ? `border-[1px] border-[${col.border}]` : ``}`}
                          style={col["bg-color"] ? { backgroundColor: col["bg-color"] } : {}}
                        ></span>
                        {col.label}
                      </label>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          {/* Product Section */}
          <div className="px-2 md:px-0 w-full md:w-[76%] lg:w-[79%] xl:w-[84%]">
            {displayProducts.length > 0 ? <ProductCart items={displayProducts} /> : <div className="text-center h-screen flex items-center justify-center">No Products Found</div>}
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryProduct;
