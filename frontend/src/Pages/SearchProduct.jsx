import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import FilterAndProductLayout from "../Components/FilterAndProductLayout";
import Loader from "../Components/Loader";

const SearchProduct = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL
  const { productName } = useParams();
  const lowerCaseProductName = productName.toLowerCase();
  const [filterData, setFilterData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categoryMap = {
    "kids wear": "kids-wear",
    "kid wear": "kids-wear",
    kidswear: "kids-wear",
    kidwear: "kids-wear",
    kids: "kids-wear",
    kid: "kids-wear",
    "ethnic wear": "ethnic-wear",
    ethnicwear: "ethnic-wear",
    "ethnic wear women": "ethnic-wear",
    "ethnic wear for women": "ethnic-wear",
    "traditional wear": "ethnic-wear",
    "indian wear": "ethnic-wear",
    "sleep wear": "sleep-wear",
    sleepwear: "sleep-wear",
    "sleep wear for women": "sleep-wear",
    "sleeping wear for women": "sleep-wear",
    nightwear: "sleep-wear",
    "night wear": "sleep-wear",
    pajamas: "sleep-wear",
    "sleepin wear": "sleep-wear",
    "home decor": "home-decor",
    "home decoration": "home-decor",
    homedecoration: "home-decor",
    home: "home-decor",
    "interior decor": "home-decor",
    decor: "home-decor",
    "work wear": "work-wear",
    workwear: "work-wear",
    "work wear for women": "work-wear",
    "women work wear": "work-wear",
    "office wear for women": "work-wear",
    "professional wear": "work-wear",
    "sports shoes": "sports-shoes",
    "athletic shoes": "sports-shoes",
    "training shoes": "sports-shoes",
    "running shoes": "sports-shoes",
    "sports shoes for men": "sports-shoes",
    "office wear": "office-wear",
    "formal wear": "office-wear",
    "business casual": "office-wear",
    "professional attire": "office-wear",
    "mens wear": "men's-wear",
    "men's clothing": "men's-wear",
    "men fashion": "men's-wear",
    "men's fashion": "men's-wear",
    "casual styles": "casual-styles",
    "casual wear": "casual-styles",
    "relaxed clothing": "casual-styles",
    "everyday wear": "casual-styles",
    "western wear": "western-wear",
    "western wear for women": "western-wear",
    "western clothing": "western-wear",
    "western outfits": "western-wear",
    "western fashion": "western-wear",
    "wfh wear": "wfh-wear",
    "work from home wear": "wfh-wear",
    "comfortable wear": "wfh-wear",
    loungewear: "wfh-wear",
    "womens footwear": "women's-footwear",
    "women shoes": "women's-footwear",
    "female shoes": "women's-footwear",
    "ladies footwear": "women's-footwear",
  };

  const allCategories = [
    "ethnic-wear",
    "sleep-wear",
    "home-decor",
    "work-wear",
    "kids-wear",
    "sports-shoes",
    "office-wear",
    "men's-wear",
    "casual-styles",
    "western-wear",
    "wfh-wear",
    "women's-footwear",
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const mappedCategory = categoryMap[lowerCaseProductName];

        if (mappedCategory) {
          // Case 1: If ProductName Matches A Category In CategoryMap
          const response = await axios.get(
            `${BASE_URL}/product/getproducts/${mappedCategory}`
          );
          setFilterData(response.data?.products || []);
        } else {
          // Case 2: If No Match In CategoryMap, Search Across All Categories
          const responses = await Promise.all(
            allCategories.map((category) =>
              axios.get(`${BASE_URL}/product/getproducts/${category}`)
            )
          );

          const mergedProducts = responses.flatMap(
            (res) => res.data?.products || []
          );
          const filteredProducts = mergedProducts.filter((product) =>
            product.title.toLowerCase().includes(lowerCaseProductName)
          );
          setFilterData(filteredProducts);
        }
      } catch (error) {
        console.error("Error fetching data:", {
          message: error.response?.data?.message || error.message,
          status: error.response?.status || error?.status || "unknown error",
        });
        setError("Failed to load products. Please try again later");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [lowerCaseProductName]);

  if (loading) return <Loader />
  if (error) return <div className="text-center mt-[24vh]">{error}</div>

  return (
    <>
      {
        filterData.length > 0 ? <FilterAndProductLayout
          products={filterData}
          cat={categoryMap[lowerCaseProductName] || lowerCaseProductName}
        /> : <div className="text-center h-screen flex items-center justify-center">No Products Found</div>
      }

    </>
  );
};

export default SearchProduct;