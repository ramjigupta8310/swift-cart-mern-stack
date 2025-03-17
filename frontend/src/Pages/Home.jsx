import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios"
import Loader from "../Components/Loader";
const HomePageCategories = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllCategories = async () => {
      setLoading(true);
      setError(null)
      try {
        const response = await axios.get(`${BASE_URL}/product/getallcategories`);
        setAllCategories(response.data?.categories || []);
      }
      catch (error) {
        console.error('Error fetching data:', {
          message: error.response?.data?.message || error.message,
          status: error.response?.status || "unknown error"
        });
        setError('Failed to load categories. Please try again later');
      }
      finally {
        setLoading(false)
      }
    }
    fetchAllCategories();
  }, [])

  if (loading) return <div className="text-center"><Loader /></div>
  if (error) return <div className="text-center mt-[24vh]">{error}</div>


  return (
    <>
      <div className="w-full mt-[24vh] md:mt-[13vh] px-4 sm:px-8 lg:px-12 xl:px-20 py-4 flex flex-wrap gap-x-[5%] sm:gap-x-[4%] xl:gap-x-[2.5%] gap-y-[4vh]">
        {allCategories.map((cat) => {
          return (
            <div
              className={`w-[47.5%] sm:w-[30.6%] lg:w-[22%] xl:w-[18%] px-1 py-1 rounded-sm`}
              style={{
                boxShadow:
                  '1px 1px 2px 2px rgba(60, 64, 67, 0.2), -1px -2px 6px 2px rgba(60, 64, 67, 0.15)'
              }}
              key={cat._id}
            >
              <Link to={`/category/${cat.category}`}>
                <div className="text-center">
                  <img
                    className="rounded-tl-sm rounded-tr-sm"
                    src={cat.imgSrc}
                    alt={cat.title}
                  />
                  <div className="bg-[rgb(174,28,93)] text-white py-3 rounded-br-sm rounded-bl-sm">
                    <h5 className="sm:text-lg text-base font-medium">
                      {cat.title}
                    </h5>
                    <p className="sm:text-2xl text-xl font-bold">{cat.offer}</p>
                    <button className="">Shop Now</button>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default HomePageCategories;
