import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCart from "./ProductCart";
import Filter from "./Filter";
import ProductContext from "../Context/ProductContext";
import { CiFilter } from "react-icons/ci";
import { FaWindowClose } from "react-icons/fa";
import styles from "./HomePageCategoriesProduct.module.css"

const CategoryProduct = ({ catArray }) => {
  useEffect(() => {
    if (catArray) {
      setFilterProducts(catArray); // Update filterProducts
      setAllProducts(catArray); // Update allProducts
    }
  }, [catArray]);
  
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
  const { cat } = useParams();

  const [filterProducts, setFilterProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true); // For loading state
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    setLoading(true); // Start loading when data is being fetched

    // Fetch products based on category
    let products = [];
    if (cat === "ethnic-wear") {
      products = ethnicWear;
    } else if (cat === "sleep-wear") {
      products = sleepWear;
    } else if (cat === "home-decor") {
      products = homeDecor;
    } else if (cat === "work-wear") {
      products = workWear;
    } else if (cat === "kids-wear") {
      products = kidsWear;
    } else if (cat === "sports-shoes") {
      products = sportsShoes;
    } else if (cat === "office-wear") {
      products = officeWear;
    } else if (cat === "men's-wear") {
      products = mensWear;
    } else if (cat === "casual-styles") {
      products = casualStyles;
    } else if (cat === "western-wear") {
      products = westernWear;
    } else if (cat === "wfh-wear") {
      products = wfhWear;
    } else if (cat === "women's-footwear") {
      products = womensFootwear;
    }

    // Set products only if data is not empty
    if (products.length > 0) {
      setAllProducts(products);
      setFilterProducts(products); // Initially set products to filter
    }

    setLoading(false); // Stop loading once products are set
  }, [
    cat,
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
  ]);


  // Conditional rendering: show loading if products are not set yet
  if (loading) {
    return <div>Loading...</div>; // Or any other loading spinner
  }

  return (
    <>
      <div className="mt-[24vh] md:mt-[13vh]">
        {/* Filter Button */}
        <div className="flex justify-end md:hidden">
          <button
            className="flex items-center gap-1 border-2 border-[#d4d5d9] mx-6 mb-2 font-semibold rounded-2xl px-2 py-1"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <CiFilter />
            Filters
          </button>
        </div>

        {/* Filter, Products Section And Close Filter Button */}
        <div className="flex gap-[1%]">
          {/* Filter Section And Close Filter Button */}
          <div
            className={`${styles["no-scrollbar"]} fixed top-0 left-0 w-[70%] bg-white z-50 md:z-0 transform ${
              isFilterOpen ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-300 ease-in-out md:static md:translate-x-0 md:w-[23%] lg:w-[20%] xl:w-[15%] h-screen overflow-y-auto`}
          >
            {/* Close Filter Button */}
            <button
              className="text-2xl mb-6 ml-2 mt-2 md:hidden"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <FaWindowClose />
            </button>

            {/* Filter Section */}
            <Filter
              cat={cat}
              allProducts={allProducts}
              setFilteredProducts={setFilterProducts}
            />
          </div>

          {/* Product Section */}
          <div className="px-2 md:px-0 w-full md:w-[76%] lg:w-[79%] xl:w-[84%]">
            <ProductCart items={filterProducts} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryProduct;
