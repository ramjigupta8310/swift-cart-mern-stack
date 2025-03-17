import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Components/Loader";
import FilterAndProductLayout from "../Components/FilterAndProductLayout";

const Women = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const categories = [
          'ethnic-wear',
          'sleep-wear',
          'work-wear',
          'office-wear',
          'casual-styles',
          'western-wear',
        ];

        const responses = await Promise.all(
          categories.map(category =>
            axios.get(`${BASE_URL}/product/getproducts/${category}`)
          )
        );

        const mergedProducts = responses.flatMap(res => res.data?.products || []);
        setProducts(mergedProducts);
      } catch (error) {
        console.error("Error fetching data:", {
          message: error.response?.data?.message || error.message,
          status: error.response?.status || "unknown error",
        });
        setError('Failed to load products. Please try again later');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);


  if (loading) return <div className="text-center"><Loader /></div>
  if (error) return <div className="text-center mt-[24vh]">{error}</div>

  return (
    <>
      <FilterAndProductLayout products={products} cat="women-wear" />
    </>
  );
};

export default Women;
