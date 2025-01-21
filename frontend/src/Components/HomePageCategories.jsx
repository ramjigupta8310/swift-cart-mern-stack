import React, { useContext } from "react";
import { Link } from "react-router-dom";
import ProductContext from "../Context/ProductContext";

const HomePageCategories = () => {
  const { allCategories } = useContext(ProductContext);
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
