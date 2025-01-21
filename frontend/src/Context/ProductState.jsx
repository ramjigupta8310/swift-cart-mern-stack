import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductContext from './ProductContext';

// Base API URL
const BASE_URL = 'https://swift-cart-mern-stack-backend.onrender.com/api';

const ProductState = (props) => {
  
  const [allCategories, setAllCategories] = useState([]);
  const [ethnicWear, setEthnicWear] = useState([]);
  const [sleepWear, setSleepWear] = useState([]);
  const [homeDecor, setHomeDecor] = useState([]);
  const [workWear, setWorkWear] = useState([]);
  const [kidsWear, setKidsWear] = useState([]);
  const [sportsShoes, setSportsShoes] = useState([]);
  const [officeWear, setOfficeWear] = useState([]);
  const [mensWear, setMensWear] = useState([]);
  const [casualStyles, setCasualStyles] = useState([]);
  const [westernWear, setWesternWear] = useState([]);
  const [wfhWear, setWfhWear] = useState([]);
  const [womensFootwear, setWomensFootwear] = useState([]);
  
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Fetch all categories
  const fetchAllCategories = async () => {
    try {
      setLoadingCategories(true);
      const res = await axios.get(`${BASE_URL}/product/getallcategories`);
      setAllCategories(res.data.categories); // Store static categories
      setLoadingCategories(false);
      // console.log(res,"allCategories")
    } catch (error) {
      console.error("Error fetching categories:", error.message);
      setLoadingCategories(false);
    }
  };

  // Fetch products by category (dynamic)
  const fetchProductsByCategory = async (category, setCategoryState) => {
    try {
      setLoadingProducts(true);
      const res = await axios.get(`${BASE_URL}/product/getproducts/${category}`);
      setCategoryState(res.data.products);
      setLoadingProducts(false);
      // console.log(res)
    } catch (error) {
      console.error(`Error fetching products for ${category}:`, error.message);
      setLoadingProducts(false);
    }

  };

  // Fetch data for static categories and dynamic products on mount
  useEffect(() => {
    fetchAllCategories(); // Static categories
    fetchProductsByCategory('ethnic-wear', setEthnicWear);
    fetchProductsByCategory('sleep-wear', setSleepWear);
    fetchProductsByCategory('home-decor', setHomeDecor);
    fetchProductsByCategory('work-wear', setWorkWear);
    fetchProductsByCategory('kids-wear', setKidsWear);
    fetchProductsByCategory('sports-shoes', setSportsShoes);
    fetchProductsByCategory('office-wear', setOfficeWear);
    fetchProductsByCategory('mens-wear', setMensWear);
    fetchProductsByCategory('casual-styles', setCasualStyles);
    fetchProductsByCategory('western-wear', setWesternWear);
    fetchProductsByCategory('wfh-wear', setWfhWear);
    fetchProductsByCategory('womens-footwear', setWomensFootwear);
  }, []);


  return (
    <ProductContext.Provider
      value={{
        allCategories, // Static categories
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
        loadingCategories,
        loadingProducts,
      }}
    >
      {props.children}
    </ProductContext.Provider>
  );
};

export default ProductState;
