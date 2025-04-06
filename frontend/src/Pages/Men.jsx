import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Loader from '../Components/Loader';
import FilterAndProductLayout from '../Components/FilterAndProductLayout';

const Men = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_URL = import.meta.env.VITE_BASE_URL
  const [mergedProducts, setMergedProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null)
      try {
        const responseWfhWear = await axios.get(`${BASE_URL}/product/getproducts/wfh-wear`);

        const responseMensWear = await axios.get(`${BASE_URL}/product/getproducts/men's-wear`);

        const mergedProducts = [...responseWfhWear.data?.products || [], 
        ...responseMensWear.data?.products || []];
        setMergedProducts(mergedProducts);
      }
      catch (error) {
        console.error("Error fetching data:", {
          message: error.response?.data?.message || error.message,
          status: error.response?.status || error?.status || "unknown error"
        })
        setError('Failed to load products. Please try again later');
      }
      finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [])

  if (loading) return <div className="text-center"><Loader /></div>
  if (error) return <div className="text-center mt-[24vh]">{error}</div>

  return (
    <>
      <FilterAndProductLayout products={mergedProducts} cat="men"/>
    </>
  )
}

export default Men
